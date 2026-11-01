"""Video 003 score + SFX — synthesised, royalty-free. Reuses DSP helpers from build_score.py.

Usage:  tools/tts/venv/bin/python tools/build_score_003.py
Reads   src/data/timeline-003.json
Writes  public/audio/v003/score.wav and public/audio/v003/sfx/*.wav
"""
import json
from pathlib import Path

import numpy as np
import soundfile as sf

from build_score import SR, env_ar, lowpass, norm, note, pad, place, reverb, rng

ROOT = Path(__file__).resolve().parent.parent


def build_score(tl):
    total = tl["duration"]
    L = {l["index"]: l for l in tl["lines"]}
    n = int(total * SR)
    t = np.arange(n) / SR
    mix = np.zeros(n)

    # Tension (hook → criticism): low D drone + a faint minor-second glass cluster.
    e1 = L[3]["start"]
    d = (np.sin(2 * np.pi * note("D2") * t) * 0.5 + np.sin(2 * np.pi * note("A2") * t + 0.4) * 0.25)
    d *= np.clip(t / 0.3, 0, 1) * np.clip((e1 + 1.5 - t) / 1.5, 0, 1)
    mix += d * 0.22
    cl = pad([note("F5"), note("F#5")], e1, bright=0.15, detune=1.2)
    place(mix, cl * env_ar(len(cl), 0.4, 1.5), 0, 0.035)

    # Middle (examples → mirror): soft rhythmic pulse at 96 bpm with a muted minor pad.
    s2, e2 = L[3]["start"] - 0.2, L[6]["start"]
    beat = 60 / 96
    k = 0
    tt = s2
    thump = np.sin(2 * np.pi * 55 * np.arange(int(0.25 * SR)) / SR) * np.exp(-np.linspace(0, 10, int(0.25 * SR)))
    while tt < e2 - 0.2:
        place(mix, thump, tt, 0.32 if k % 4 == 0 else 0.18)
        k += 1
        tt += beat
    p = pad([note("D3"), note("F3"), note("A3"), note("C4")], e2 - s2, bright=0.6, detune=0.3)
    place(mix, p * env_ar(len(p), 1.0, 1.4), s2, 0.13)

    # Final: calmer, open and warm — D major 9 without the third's urgency.
    s3 = L[6]["start"] - 0.3
    f = pad([note("D3"), note("A3"), note("E4"), note("F#4")], total - s3, bright=0.5, detune=0.2)
    place(mix, f * env_ar(len(f), 1.8, 2.0), s3, 0.2)

    mix += lowpass(rng.standard_normal(n) * 0.5, 800) * 0.04
    mix = reverb(mix, 3.0, 0.3)
    right = np.roll(mix, int(0.012 * SR))
    return norm(np.stack([mix, right * 0.95 + mix * 0.05], axis=1), 0.5)


def sfx():
    out = {}
    # Mirror crack: hard transient + crackle burst + ringing glass partials.
    d = 1.6
    tt = np.arange(int(d * SR)) / SR
    hit = rng.standard_normal(len(tt)) * np.exp(-tt * 60)
    crackle = np.zeros(len(tt))
    for _ in range(70):
        pos = int(abs(rng.normal(0, 0.12)) * SR)
        if pos < len(tt) - 400:
            crackle[pos:pos + 300] += rng.standard_normal(300) * np.exp(-np.linspace(0, 8, 300)) * rng.uniform(0.2, 1)
    ring = sum(np.sin(2 * np.pi * f * tt) * np.exp(-tt * dcy) for f, dcy in ((2640, 5), (3910, 7), (5180, 9), (1720, 4)))
    body = np.sin(2 * np.pi * 60 * tt) * np.exp(-tt * 9)
    out["crack"] = reverb(hit * 0.8 + crackle * 0.9 + ring * 0.12 + body * 0.6, 1.8, 0.25)
    # Small crack tick.
    d = 0.35
    tt = np.arange(int(d * SR)) / SR
    out["crack_small"] = reverb(rng.standard_normal(len(tt)) * np.exp(-tt * 90) + np.sin(2 * np.pi * 4200 * tt) * np.exp(-tt * 30) * 0.2, 0.8, 0.2)
    # Low hit.
    d = 1.6
    tt = np.arange(int(d * SR)) / SR
    f = 34 + 40 * np.exp(-tt * 7)
    out["lowhit"] = reverb(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 2.6) + lowpass(rng.standard_normal(len(tt)), 900) * np.exp(-tt * 25) * 0.5, 1.6, 0.25)
    # Whoosh (short, airy).
    d = 0.45
    tt = np.arange(int(d * SR)) / SR
    out["whoosh"] = lowpass(rng.standard_normal(len(tt)), 3000) * np.sin(np.pi * tt / d) ** 2
    # Heartbeat (lub-dub), muted.
    d = 0.7
    tt = np.arange(int(d * SR)) / SR
    hb = np.zeros(len(tt))
    for off, g in ((0, 1.0), (0.22, 0.65)):
        s = int(off * SR)
        seg = np.arange(len(tt) - s) / SR
        hb[s:] += np.sin(2 * np.pi * 48 * seg) * np.exp(-seg * 16) * g
    out["heartbeat"] = hb
    # Glass tension: bowed-glass partials swelling in pitch.
    d = 1.8
    tt = np.arange(int(d * SR)) / SR
    gl = sum(np.sin(2 * np.pi * np.cumsum(f0 * (1 + 0.04 * tt / d)) / SR) * a for f0, a in ((1320, 1), (1980, 0.5), (2640, 0.3)))
    out["glass"] = reverb(gl * (tt / d) ** 1.5 * (1 - np.clip((tt - d + 0.15) / 0.15, 0, 1)), 1.5, 0.3)
    # Soft release at the final zoom-out.
    d = 2.6
    tt = np.arange(int(d * SR)) / SR
    rel = pad([note("A4"), note("D5"), note("E5")], d, bright=0.3, detune=0.6) * np.sin(np.pi * tt / d) ** 2
    out["release"] = reverb(rel + lowpass(rng.standard_normal(len(tt)), 1200) * np.sin(np.pi * tt / d) ** 2 * 0.3, 2.2, 0.4)
    # Phone refresh flick.
    d = 0.18
    tt = np.arange(int(d * SR)) / SR
    out["flick"] = lowpass(rng.standard_normal(len(tt)), 5000) * np.exp(-tt * 40) * 0.6 + np.sin(2 * np.pi * 1800 * tt) * np.exp(-tt * 50) * 0.3
    return {k: norm(v, 0.85) for k, v in out.items()}


if __name__ == "__main__":
    tl = json.loads((ROOT / "src" / "data" / "timeline-003.json").read_text())
    adir = ROOT / "public" / "audio" / "v003"
    (adir / "sfx").mkdir(parents=True, exist_ok=True)
    sf.write(adir / "score.wav", build_score(tl), SR)
    fx = sfx()
    for k, v in fx.items():
        sf.write(adir / "sfx" / f"{k}.wav", v.astype(np.float32), SR)
    print("v003 score + sfx:", sorted(fx))
