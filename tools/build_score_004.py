"""Video 004 score + SFX — playful, synthesised, royalty-free. Reuses DSP helpers from build_score.py.

Usage:  tools/tts/venv/bin/python tools/build_score_004.py
"""
import json
from pathlib import Path

import numpy as np
import soundfile as sf

from build_score import SR, lowpass, norm, note, place, reverb, rng

ROOT = Path(__file__).resolve().parent.parent


def pluck(f, dur=0.35, bright=1.0):
    t = np.arange(int(dur * SR)) / SR
    s = sum(np.sin(2 * np.pi * f * h * t) * (0.6 ** (h - 1)) * np.exp(-t * (14 + h * 6 * bright)) for h in range(1, 6))
    return s * np.clip(t / 0.002, 0, 1)


def build_score(tl):
    total = tl["duration"]
    L = {l["index"]: l for l in tl["lines"]}
    n = int(total * SR)
    mix = np.zeros(n)
    bpm = 108
    b = 60 / bpm
    # comedic dropouts: the beat stops on the punchlines
    gaps = [(L[2]["start"] + 0.5, L[3]["end"] + 0.1), (L[7]["start"] - 0.05, L[7]["end"] + 0.05)]

    def silent(x):
        return any(a <= x < c for a, c in gaps)

    bass = [note("C2"), note("C2"), note("G1"), note("A1")]
    mel = [note("E4"), None, note("G4"), note("E4"), note("D4"), None, note("C4"), note("D4"),
           note("E4"), None, note("G4"), note("A4"), note("G4"), None, note("E4"), None]
    k = 0
    tt = 0.0
    while tt < total - 0.4:
        if not silent(tt):
            if k % 2 == 0:
                place(mix, pluck(bass[(k // 8) % 4], 0.4, 0.5), tt, 0.5)
            m = mel[k % 16]
            if m and k > 8:
                place(mix, pluck(m, 0.25), tt, 0.16)
            if k % 4 == 2:  # soft snap
                place(mix, lowpass(rng.standard_normal(int(0.05 * SR)), 5000) * np.exp(-np.linspace(0, 12, int(0.05 * SR))), tt, 0.1)
        k += 1
        tt += b / 2
    # final warm chord under the twist resolution
    s = L[9]["start"]
    t2 = np.arange(int((total - s) * SR)) / SR
    chord = sum(np.sin(2 * np.pi * f * t2) for f in (note("C4"), note("E4"), note("G4"), note("B4"))) / 4
    place(mix, chord * np.clip(t2 / 1.0, 0, 1) * np.clip((total - s - t2) / 1.2, 0, 1), s, 0.08)
    mix = reverb(mix, 1.4, 0.18)
    return norm(np.stack([mix, np.roll(mix, int(0.008 * SR))], axis=1), 0.5)


def sfx():
    out = {}
    d = 0.12
    t = np.arange(int(d * SR)) / SR
    f = 500 + 900 * np.exp(-t * 40)
    out["pop"] = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 35)
    d = 0.5
    t = np.arange(int(d * SR)) / SR
    f = 180 + 120 * np.sin(2 * np.pi * 9 * t) * np.exp(-t * 4)
    out["boing"] = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 6)
    d = 0.55
    t = np.arange(int(d * SR)) / SR
    f = 1400 * (1 - t / d) ** 2 + 120
    out["scratch"] = (lowpass(rng.standard_normal(len(t)), 3500) * 0.7 + np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.5) * np.sin(np.pi * t / d) ** 0.5
    d = 0.5
    t = np.arange(int(d * SR)) / SR
    out["stamp"] = np.sin(2 * np.pi * 70 * t) * np.exp(-t * 18) + lowpass(rng.standard_normal(len(t)), 1800) * np.exp(-t * 45) * 0.8
    d = 0.35
    t = np.arange(int(d * SR)) / SR
    out["whoosh"] = lowpass(rng.standard_normal(len(t)), 2600) * np.sin(np.pi * t / d) ** 2
    d = 1.0
    t = np.arange(int(d * SR)) / SR
    out["ding"] = reverb((np.sin(2 * np.pi * note("E6") * t) + 0.4 * np.sin(2 * np.pi * note("B6") * t)) * np.exp(-t * 5), 1.0, 0.25)
    d = 0.8
    t = np.arange(int(d * SR)) / SR
    f = 300 + 1500 * (t / d)
    out["rewind"] = (np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.4 * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 30 * t))) + lowpass(rng.standard_normal(len(t)), 3000) * 0.4) * np.sin(np.pi * t / d)
    d = 0.9
    t = np.arange(int(d * SR)) / SR
    out["cringe"] = reverb(sum(np.sin(2 * np.pi * f0 * t) for f0 in (note("C5"), note("C#5"), note("F#5"))) / 3 * np.exp(-t * 2.5) * np.clip(t / 0.02, 0, 1), 1.0, 0.3)
    d = 0.6
    t = np.arange(int(d * SR)) / SR
    out["gulp"] = np.sin(2 * np.pi * np.cumsum(260 - 140 * t / d) / SR) * np.exp(-t * 9)
    return {k: norm(v, 0.85) for k, v in out.items()}


if __name__ == "__main__":
    tl = json.loads((ROOT / "src" / "data" / "timeline-004.json").read_text())
    adir = ROOT / "public" / "audio" / "v004"
    (adir / "sfx").mkdir(parents=True, exist_ok=True)
    sf.write(adir / "score.wav", build_score(tl), SR)
    fx = sfx()
    for k, v in fx.items():
        sf.write(adir / "sfx" / f"{k}.wav", v.astype(np.float32), SR)
    print("v004:", sorted(fx))
