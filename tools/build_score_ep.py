"""Generic score + SFX builder for "your brain" cartoon episodes (video 006+).

Usage:  tools/tts/venv/bin/python tools/build_score_ep.py 006 --key F --drops 3,14
  --key   root of the plucky groove (each episode gets its own key)
  --drops line indices where the beat drops out (punchlines)
Writes public/audio/v<id>/score.wav and the shared SFX kit into public/audio/v<id>/sfx/.
"""
import argparse
import json
from pathlib import Path

import numpy as np
import soundfile as sf

import build_score_004 as kit4
import build_score_005 as kit5
from build_score import SR, lowpass, norm, note, place, reverb, rng

ROOT = Path(__file__).resolve().parent.parent
SEMI = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9}


def transpose(n, key):
    return n * 2 ** ((SEMI[key] - SEMI["F"]) / 12)


def build_score(tl, key, drops):
    total = tl["duration"]
    L = {l["index"]: l for l in tl["lines"]}
    n = int(total * SR)
    mix = np.zeros(n)
    b = 60 / 110
    gaps = [(L[i]["start"] - 0.05, L[i]["end"] + 0.15) for i in drops if i in L]
    bass = [transpose(f, key) for f in (note("F2"), note("F2"), note("C2"), note("D2"))]
    mel = [note("A4"), None, note("C5"), note("A4"), note("G4"), None, note("F4"), note("G4"),
           note("A4"), None, note("C5"), note("D5"), note("C5"), None, note("A4"), None]
    mel = [transpose(m, key) if m else None for m in mel]
    k, tt = 0, 0.0
    while tt < total - 0.4:
        if not any(a <= tt < c for a, c in gaps):
            section = int(tt // 15)  # every ~15 s the groove changes texture so a minute doesn't feel looped
            if k % 2 == 0:
                place(mix, kit4.pluck(bass[(k // 8) % 4], 0.4, 0.5), tt, 0.5)
            m = mel[(k + section * 4) % 16]
            if m and k > 6:
                place(mix, kit4.pluck(m * (2 if section % 2 else 1), 0.25), tt, 0.13)
            if k % 4 == 2:
                place(mix, lowpass(rng.standard_normal(int(0.05 * SR)), 5000) * np.exp(-np.linspace(0, 12, int(0.05 * SR))), tt, 0.1)
            if section >= 2 and k % 8 == 4:
                place(mix, kit4.pluck(transpose(note("C6"), key), 0.2, 1.5), tt, 0.05)
        k += 1
        tt += b / 2
    mix = reverb(mix, 1.4, 0.18)
    return norm(np.stack([mix, np.roll(mix, int(0.008 * SR))], axis=1), 0.5)


def jingle():
    """The deliberately catchy earworm (episode 008): simple, repetitive, one surprising jump."""
    seq = [("C5", .25), ("C5", .25), ("G5", .25), ("E5", .25), ("F5", .25), ("E5", .25), ("D5", .5),
           ("C5", .25), ("C5", .25), ("G5", .25), ("E5", .25), ("C6", .5), ("B5", .25), ("G5", .75)]
    out = np.zeros(int(sum(d for _, d in seq) * 0.42 * SR / 0.25 * 0.25 * 4) + SR)
    tt = 0.0
    for nm, d in seq:
        dur = d * 1.68
        place(out, kit4.pluck(note(nm), dur + 0.2, 0.7) + 0.4 * np.pad(np.sign(np.sin(2 * np.pi * note(nm) * np.arange(int(min(dur, 0.3) * SR)) / SR)) * np.exp(-np.linspace(0, 6, int(min(dur, 0.3) * SR))), (0, int(0.2 * SR) + int(dur * SR) - int(min(dur, 0.3) * SR))), tt, 0.6)
        tt += dur
    return reverb(out[: int((tt + 0.6) * SR)], 1.2, 0.2)


def extra_sfx():
    out = {}
    d = 0.7
    t = np.arange(int(d * SR)) / SR
    out["buzz"] = np.sin(2 * np.pi * 150 * t) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 7 * t))) * np.sin(np.pi * t / d) * 0.8
    d = 0.9
    t = np.arange(int(d * SR)) / SR
    f = 330 + 40 * np.sin(2 * np.pi * 6 * t)
    out["coo"] = reverb(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / d) ** 2 * (0.6 + 0.4 * np.sin(2 * np.pi * 3 * t)), 0.8, 0.2)
    pk = np.zeros(int(1.2 * SR))
    for i in range(8):
        tt = np.arange(int(0.04 * SR)) / SR
        place(pk, lowpass(rng.standard_normal(len(tt)), 6000) * np.exp(-tt * 140), i * 0.15, 0.8)
    out["peck"] = pk
    d = 0.5
    t = np.arange(int(d * SR)) / SR
    out["lever"] = np.sin(2 * np.pi * 90 * t) * np.exp(-t * 14) + lowpass(rng.standard_normal(len(t)), 2500) * np.exp(-t * 40) * 0.6
    coin = np.zeros(int(1.0 * SR))
    for i, f0 in enumerate((note("B6"), note("E7"))):
        tt = np.arange(int(0.5 * SR)) / SR
        place(coin, np.sign(np.sin(2 * np.pi * f0 * tt)) * np.exp(-tt * 8) * 0.4, i * 0.09, 1)
    out["coin"] = coin
    d = 1.0
    t = np.arange(int(d * SR)) / SR
    f = 440 * (1 - 0.4 * t / d)
    out["sad"] = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2) * 0.7
    d = 1.4
    t = np.arange(int(d * SR)) / SR
    f = 700 + 300 * np.sign(np.sin(2 * np.pi * 2.5 * t))
    out["siren"] = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / d) * 0.5
    ch = np.zeros(int(1.4 * SR))
    for i in range(6):
        tt = np.arange(int(0.09 * SR)) / SR
        place(ch, lowpass(rng.standard_normal(len(tt)), 1800) * np.exp(-tt * 40), i * 0.22, 0.7)
    out["chew"] = ch
    ff = np.zeros(int(1.3 * SR))
    for i in range(16):
        tt = np.arange(int(0.03 * SR)) / SR
        place(ff, np.sin(2 * np.pi * (1800 + i * 60) * tt) * np.exp(-tt * 120), i * 0.075, 0.5)
    out["fastfwd"] = ff
    out["jingle"] = jingle()
    return {k: norm(v, 0.85) for k, v in out.items()}


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("id")
    ap.add_argument("--key", default="F")
    ap.add_argument("--drops", default="")
    a = ap.parse_args()
    tl = json.loads((ROOT / "src" / "data" / f"timeline-{a.id}.json").read_text())
    adir = ROOT / "public" / "audio" / f"v{a.id}"
    (adir / "sfx").mkdir(parents=True, exist_ok=True)
    drops = [int(x) for x in a.drops.split(",") if x]
    sf.write(adir / "score.wav", build_score(tl, a.key, drops), SR)
    fx = {**kit4.sfx(), **kit5.extra_sfx(), **extra_sfx()}
    for k, v in fx.items():
        sf.write(adir / "sfx" / f"{k}.wav", v.astype(np.float32), SR)
    print(f"v{a.id}: score ({tl['duration']}s, key {a.key}) + {len(fx)} sfx")
