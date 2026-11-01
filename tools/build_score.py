"""Original ambient score + SFX, synthesised from scratch (royalty-free by construction).

Usage:  tools/tts/venv/bin/python tools/build_score.py
Reads   src/data/timeline.json  (section boundaries follow the narration)
Writes  public/audio/score.wav and public/audio/sfx/*.wav
"""
import json
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
SR = 48000
rng = np.random.default_rng(7)


def note(n: str) -> float:
    names = {"C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11}
    return 440.0 * 2 ** ((names[n[:-1]] + 12 * (int(n[-1]) + 1) - 69) / 12)


def lowpass(x, cutoff):
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):  # small signals only; fast enough at this length
        acc = (1 - a) * x[i] + a * acc
        y[i] = acc
    return y


def env_ar(n, attack, release):
    a, r = int(attack * SR), int(release * SR)
    e = np.ones(n)
    e[:a] = np.linspace(0, 1, a) ** 2
    e[n - r:] = np.linspace(1, 0, r) ** 2
    return e


def pad(freqs, dur, bright=1.0, detune=0.25):
    t = np.arange(int(dur * SR)) / SR
    out = np.zeros_like(t)
    for f in freqs:
        for d in (-detune, 0, detune):
            ph = rng.uniform(0, 2 * np.pi)
            for h, amp in ((1, 1.0), (2, 0.28 * bright), (3, 0.1 * bright)):
                out += amp * np.sin(2 * np.pi * (f + d) * h * t + ph)
    return out / (len(freqs) * 3)


def place(buf, sig, start, gain=1.0):
    s = int(start * SR)
    e = min(len(buf), s + len(sig))
    if e > s:
        buf[s:e] += sig[: e - s] * gain


def reverb(x, seconds=3.2, mix=0.32):
    n = int(seconds * SR)
    ir = rng.standard_normal(n) * np.exp(-np.linspace(0, 7, n))
    ir = np.convolve(ir, np.ones(24) / 24, mode="same")  # darken tail
    ir /= np.sqrt(np.sum(ir ** 2))
    size = 1 << int(np.ceil(np.log2(len(x) + n)))
    wet = np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[: len(x)]
    return (1 - mix) * x + mix * wet * 0.6


def norm(x, peak=0.9):
    m = np.max(np.abs(x))
    return x * (peak / m) if m > 0 else x


def build_score(tl):
    total = tl["duration"]
    L = {l["index"]: l for l in tl["lines"]}
    n = int(total * SR)
    t = np.arange(n) / SR
    mix = np.zeros(n)

    # 1. Foundation: sub drone on D with breathing LFO, present throughout.
    drone = (np.sin(2 * np.pi * note("D1") * t) * 0.55 + np.sin(2 * np.pi * note("D2") * t + 1.3) * 0.35
             + np.sin(2 * np.pi * note("A2") * t + 0.4) * 0.08)
    drone *= 0.75 + 0.25 * np.sin(2 * np.pi * 0.07 * t)
    drone *= np.clip(t / 1.2, 0, 1) * np.clip((total - t) / 2.5, 0, 1)
    mix += drone * 0.32

    # 2. Availability (lines 2-4): soft D-minor pad with a gentle pulse.
    s2, e2 = L[2]["start"] - 0.4, L[5]["start"] - 0.2
    p = pad([note("D3"), note("F3"), note("A3"), note("C4")], e2 - s2, bright=0.8)
    tt = np.arange(len(p)) / SR
    p *= 0.7 + 0.3 * (0.5 + 0.5 * np.cos(2 * np.pi * (78 / 60) * tt))
    place(mix, p * env_ar(len(p), 1.2, 1.4), s2, 0.22)

    # 3. The "No" (line 5): pad falls away; thin cold shimmer high above.
    s3, e3 = L[5]["start"] - 0.3, L[8]["start"]
    sh = pad([note("A5"), note("E6")], e3 - s3, bright=0.2, detune=0.8)
    tt = np.arange(len(sh)) / SR
    sh *= 0.6 + 0.4 * np.sin(2 * np.pi * 5.2 * tt)
    place(mix, sh * env_ar(len(sh), 2.0, 2.5), s3, 0.05)

    # 4. Silence (lines 6-7): slow heartbeat that thins out.
    beat = np.sin(2 * np.pi * 52 * np.arange(int(0.22 * SR)) / SR) * np.exp(-np.linspace(0, 9, int(0.22 * SR)))
    bt, gap, g = L[6]["start"], 0.95, 0.5
    while bt < L[8]["start"] - 0.3:
        place(mix, beat, bt, g)
        place(mix, beat, bt + 0.26, g * 0.6)
        bt += gap
        gap *= 1.16
        g *= 0.86

    # 5. Pattern / calm (lines 8-11): suspended, warmer, grounded.
    s5 = L[8]["start"] - 0.6
    w = pad([note("D3"), note("A3"), note("E4"), note("F#4")], total - s5, bright=0.6, detune=0.18)
    place(mix, w * env_ar(len(w), 3.0, 3.5), s5, 0.2)
    # final lift on the resolution
    s6 = L[11]["start"] - 0.3
    f = pad([note("D4"), note("A4"), note("D5")], total - s6, bright=0.4, detune=0.3)
    place(mix, f * env_ar(len(f), 1.8, 2.8), s6, 0.12)

    # Air: very low filtered noise bed for room tone.
    air = lowpass(rng.standard_normal(n) * 0.5, 900)
    mix += air * 0.05 * (0.6 + 0.4 * np.sin(2 * np.pi * 0.05 * t))

    mix = reverb(mix)
    # Stereo: slight decorrelation for width.
    right = np.roll(mix, int(0.011 * SR))
    stereo = np.stack([mix, right * 0.96 + mix * 0.04], axis=1)
    return norm(stereo, 0.5)


def sfx():
    out = {}
    # sub impact: pitch-drop sine + noise transient
    d = 2.6
    tt = np.arange(int(d * SR)) / SR
    f = 30 + 34 * np.exp(-tt * 5)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 1.6)
    hit = lowpass(rng.standard_normal(len(tt)), 1800) * np.exp(-tt * 28) * 0.6
    out["impact"] = reverb(body + hit, 2.4, 0.25)
    # bubble pop: glassy two-partial blip
    d = 0.35
    tt = np.arange(int(d * SR)) / SR
    pop = (np.sin(2 * np.pi * 880 * tt * (1 + 0.15 * np.exp(-tt * 30))) * 0.7 + np.sin(2 * np.pi * 1760 * tt) * 0.2)
    out["pop"] = reverb(pop * np.exp(-tt * 22), 1.2, 0.3)
    # send: soft airy whoosh up
    d = 0.6
    tt = np.arange(int(d * SR)) / SR
    wh = lowpass(rng.standard_normal(len(tt)), 2600) * np.sin(np.pi * tt / d) ** 2
    out["send"] = reverb(wh, 1.4, 0.35)
    # reverse swell into a hit
    d = 1.6
    tt = np.arange(int(d * SR)) / SR
    sw = lowpass(rng.standard_normal(len(tt)), 1200) * (tt / d) ** 3 + np.sin(2 * np.pi * 73.4 * tt) * (tt / d) ** 4 * 0.6
    out["swell"] = sw
    # typing tick
    d = 0.06
    tt = np.arange(int(d * SR)) / SR
    out["tick"] = lowpass(rng.standard_normal(len(tt)), 4000) * np.exp(-tt * 120)
    return {k: norm(v, 0.85) for k, v in out.items()}


if __name__ == "__main__":
    tl = json.loads((ROOT / "src" / "data" / "timeline.json").read_text())
    adir = ROOT / "public" / "audio"
    (adir / "sfx").mkdir(parents=True, exist_ok=True)
    sf.write(adir / "score.wav", build_score(tl), SR)
    for k, v in sfx().items():
        sf.write(adir / "sfx" / f"{k}.wav", v.astype(np.float32), SR)
    print("score + sfx written")
