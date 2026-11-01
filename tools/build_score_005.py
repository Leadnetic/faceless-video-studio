"""Video 005 score + SFX — reuses the playful kit from video 004 and adds topic sounds.

Usage:  tools/tts/venv/bin/python tools/build_score_005.py
"""
import json
from pathlib import Path

import numpy as np
import soundfile as sf

import build_score_004 as kit
from build_score import SR, lowpass, norm, note, place, reverb, rng

ROOT = Path(__file__).resolve().parent.parent


def build_score(tl):
    total = tl["duration"]
    L = {l["index"]: l for l in tl["lines"]}
    n = int(total * SR)
    mix = np.zeros(n)
    b = 60 / 112
    # the beat drops out for the blank stare, the "blame the door" sting and the fridge punchline
    gaps = [(L[0]["end"] - 0.2, L[1]["end"] + 0.1), (L[2]["start"] - 0.05, L[2]["end"] + 0.15), (L[8]["start"] + 1.3, L[8]["start"] + 1.7)]
    bass = [note("F2"), note("F2"), note("C2"), note("D2")]
    mel = [note("A4"), None, note("C5"), note("A4"), note("G4"), None, note("F4"), note("G4"),
           note("A4"), None, note("C5"), note("D5"), note("C5"), None, note("A4"), None]
    k, tt = 0, 0.0
    while tt < total - 0.4:
        if not any(a <= tt < c for a, c in gaps):
            if k % 2 == 0:
                place(mix, kit.pluck(bass[(k // 8) % 4], 0.4, 0.5), tt, 0.5)
            m = mel[k % 16]
            if m and k > 6:
                place(mix, kit.pluck(m, 0.25), tt, 0.15)
            if k % 4 == 2:
                place(mix, lowpass(rng.standard_normal(int(0.05 * SR)), 5000) * np.exp(-np.linspace(0, 12, int(0.05 * SR))), tt, 0.1)
        k += 1
        tt += b / 2
    mix = reverb(mix, 1.4, 0.18)
    return norm(np.stack([mix, np.roll(mix, int(0.008 * SR))], axis=1), 0.5)


def extra_sfx():
    out = {}
    # cricket: chirp trains
    d = 1.2
    t = np.arange(int(d * SR)) / SR
    gate = (np.sin(2 * np.pi * 28 * t) > 0.3) * ((t % 0.4) < 0.18)
    out["cricket"] = np.sin(2 * np.pi * 4400 * t) * gate * 0.6
    # door creak: slow scraped resonance
    d = 1.1
    t = np.arange(int(d * SR)) / SR
    f = 260 + 140 * np.sin(2 * np.pi * 0.8 * t)
    saw = np.mod(np.cumsum(f) / SR, 1) * 2 - 1
    out["creak"] = lowpass(saw * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 37 * t))), 1800) * np.sin(np.pi * t / d)
    # 8-bit save jingle
    seq = [note("C6"), note("E6"), note("G6"), note("C7")]
    j = np.zeros(int(0.6 * SR))
    for i, f0 in enumerate(seq):
        tt = np.arange(int(0.11 * SR)) / SR
        sq = np.sign(np.sin(2 * np.pi * f0 * tt)) * np.exp(-tt * 10)
        place(j, sq * 0.4, i * 0.1, 1)
    out["save"] = j
    # fridge: suction pop + hum
    d = 1.6
    t = np.arange(int(d * SR)) / SR
    pop = lowpass(rng.standard_normal(len(t)), 900) * np.exp(-t * 30)
    hum = (np.sin(2 * np.pi * 60 * t) + 0.5 * np.sin(2 * np.pi * 120 * t)) * np.clip((t - 0.1) / 0.3, 0, 1) * 0.25
    out["fridge"] = reverb(pop + hum, 0.8, 0.2)
    # lightbulb: bright ding
    d = 0.9
    t = np.arange(int(d * SR)) / SR
    out["idea"] = reverb((np.sin(2 * np.pi * note("A6") * t) + 0.5 * np.sin(2 * np.pi * note("E7") * t)) * np.exp(-t * 6), 1.0, 0.25)
    return {k: norm(v, 0.85) for k, v in out.items()}


if __name__ == "__main__":
    tl = json.loads((ROOT / "src" / "data" / "timeline-005.json").read_text())
    adir = ROOT / "public" / "audio" / "v005"
    (adir / "sfx").mkdir(parents=True, exist_ok=True)
    sf.write(adir / "score.wav", build_score(tl), SR)
    fx = {**kit.sfx(), **extra_sfx()}
    for k, v in fx.items():
        sf.write(adir / "sfx" / f"{k}.wav", v.astype(np.float32), SR)
    print("v005:", sorted(fx))
