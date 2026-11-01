"""Video 002 score + SFX — synthesised, royalty-free. Reuses the DSP helpers from build_score.py.

Usage:  tools/tts/venv/bin/python tools/build_score_002.py
Reads   src/data/timeline-002.json
Writes  public/audio/v002/score.wav and public/audio/v002/sfx/*.wav
"""
import json
from pathlib import Path

import numpy as np
import soundfile as sf

from build_score import SR, env_ar, lowpass, norm, note, pad, place, reverb, rng

ROOT = Path(__file__).resolve().parent.parent


def bell(f, dur, decay=3.0):
    t = np.arange(int(dur * SR)) / SR
    s = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 2.01 * t) * np.exp(-t * 6) + 0.12 * np.sin(2 * np.pi * f * 3.98 * t) * np.exp(-t * 9)
    return s * np.exp(-t * decay) * np.clip(t / 0.004, 0, 1)


def build_score(tl):
    total = tl["duration"]
    L = {l["index"]: l for l in tl["lines"]}
    n = int(total * SR)
    t = np.arange(n) / SR
    mix = np.zeros(n)

    # Room: low hum + muted night air, ducks out at the realisation.
    real = L[12]["end"]  # freeze → silence
    gate = np.clip((real - t) / 0.25, 0, 1) + np.clip((t - (real + 1.15)) / 1.2, 0, 1)
    gate = np.clip(gate, 0, 1)
    hum = (np.sin(2 * np.pi * note("A1") * t) * 0.5 + np.sin(2 * np.pi * note("E2") * t + 0.6) * 0.22 + np.sin(2 * np.pi * note("A2") * t + 1.1) * 0.15)
    hum *= (0.8 + 0.2 * np.sin(2 * np.pi * 0.06 * t)) * np.clip(t / 1.5, 0, 1)
    mix += hum * 0.26 * gate
    air = lowpass(rng.standard_normal(n) * 0.5, 700)
    mix += air * 0.06 * gate

    # Memory (lines 2–5): suspended violet pad, Am(add9).
    s2, e2 = L[2]["start"] - 0.4, L[6]["start"]
    p = pad([note("A3"), note("C4"), note("E4"), note("B4")], e2 - s2, bright=0.7, detune=0.35)
    place(mix, p * env_ar(len(p), 1.5, 1.2), s2, 0.17)

    # Loop (lines 5–11): a 4-note ostinato that never resolves; density and tempo creep up.
    motif = [note("E5"), note("C5"), note("A4"), note("B4")]
    s3, e3 = L[5]["word_start_searching"], real
    step, k, tt = 0.3, 0, s3
    while tt < e3:
        prog = (tt - s3) / (e3 - s3)
        place(mix, bell(motif[k % 4], 1.4, 3.5), tt, 0.07 + 0.06 * prog)
        if prog > 0.45 and k % 2 == 0:  # second voice, an octave down, for the claustrophobic middle
            place(mix, bell(motif[(k + 2) % 4] / 2, 1.4, 3.0), tt + step / 2, 0.05 * prog)
        tt += step * (1 - 0.18 * prog)
        k += 1
    # tension bed under the loop
    tb = pad([note("A2"), note("E3"), note("F3")], e3 - s3, bright=0.5, detune=0.6)
    tb *= np.linspace(0.5, 1.0, len(tb))
    place(mix, tb * env_ar(len(tb), 1.5, 0.08), s3, 0.15)

    # Ending (lines 13–14): calmer, open fifths + 9th, slow fade.
    s6 = real + 1.2
    w = pad([note("F3"), note("C4"), note("G4"), note("A4")], total - s6, bright=0.45, detune=0.2)
    place(mix, w * env_ar(len(w), 2.2, 2.6), s6, 0.19)

    mix = reverb(mix, 3.6, 0.36)
    right = np.roll(mix, int(0.013 * SR))
    return norm(np.stack([mix, right * 0.95 + mix * 0.05], axis=1), 0.5)


def sfx():
    out = {}
    # Clock tick / tock: short resonant clicks at two pitches.
    for name, f in (("tick", 3200), ("tock", 2500)):
        d = 0.12
        tt = np.arange(int(d * SR)) / SR
        click = lowpass(rng.standard_normal(len(tt)), 6000) * np.exp(-tt * 260)
        body = np.sin(2 * np.pi * f * tt) * np.exp(-tt * 90) * 0.5
        out[name] = click + body
    # Notification: soft two-note glass chime.
    ch = np.zeros(int(1.6 * SR))
    place(ch, bell(note("E6"), 1.2, 4.5), 0, 0.7)
    place(ch, bell(note("B6"), 1.2, 4.0), 0.11, 0.55)
    out["notify"] = reverb(ch, 1.8, 0.3)
    # Rewind: tape whirr — rising chirps over a band of noise.
    d = 1.3
    tt = np.arange(int(d * SR)) / SR
    f = 380 + 1700 * (tt / d) ** 1.4
    whirr = np.sin(2 * np.pi * np.cumsum(f) / SR) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 34 * tt)))
    hiss = lowpass(rng.standard_normal(len(tt)), 3200) * 0.6
    out["rewind"] = (whirr * 0.35 + hiss) * np.sin(np.pi * tt / d) ** 0.6
    # Short rewind blip for memory repeats.
    d = 0.45
    tt = np.arange(int(d * SR)) / SR
    f = 600 + 1400 * (tt / d)
    out["rew_short"] = (np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.3 + lowpass(rng.standard_normal(len(tt)), 2800) * 0.5) * np.sin(np.pi * tt / d)
    # Tape stop: pitch dives to nothing (the freeze).
    d = 0.9
    tt = np.arange(int(d * SR)) / SR
    f = 220 * (1 - tt / d) ** 2 + 18
    stop = np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.4 * np.sin(2 * np.pi * np.cumsum(f * 2) / SR)
    out["tapestop"] = stop * (1 - tt / d) ** 1.2
    # Soft breath transition for the ending.
    d = 2.2
    tt = np.arange(int(d * SR)) / SR
    br = lowpass(rng.standard_normal(len(tt)), 1400) * np.sin(np.pi * tt / d) ** 2
    out["breath"] = reverb(br, 2.0, 0.4)
    # Low thud into the mind (scene 3 entry).
    d = 1.8
    tt = np.arange(int(d * SR)) / SR
    fl = 40 + 30 * np.exp(-tt * 6)
    out["thud"] = reverb(np.sin(2 * np.pi * np.cumsum(fl) / SR) * np.exp(-tt * 2.2), 2.0, 0.3)
    return {k: norm(v, 0.85) for k, v in out.items()}


if __name__ == "__main__":
    tl = json.loads((ROOT / "src" / "data" / "timeline-002.json").read_text())
    L5 = tl["lines"][5]
    L5["word_start_searching"] = next(w["start"] for w in L5["words"] if w["word"].startswith("searching"))
    tl["lines"][5] = L5
    adir = ROOT / "public" / "audio" / "v002"
    (adir / "sfx").mkdir(parents=True, exist_ok=True)
    sf.write(adir / "score.wav", build_score(tl), SR)
    for k, v in sfx().items():
        sf.write(adir / "sfx" / f"{k}.wav", v.astype(np.float32), SR)
    print("v002 score + sfx written:", sorted(sfx().keys()))
