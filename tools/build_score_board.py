"""Dark documentary score + SFX for the "Evidence Board" series (video 017+). Synthesized, royalty-free.

Usage:  tools/tts/venv/bin/python tools/build_score_board.py 017 --key D --hits 4,6,8 --drops 5,8
  --hits   line indices that get a low impact hit on their first word (the "but…" turns)
  --drops  line indices where everything except the drone drops out (the reveals)
The pulse tightens in three acts (setup → investigation → reveal) so tension rises through the minute.
"""
import argparse
import json
from pathlib import Path

import numpy as np
import soundfile as sf

from build_score import SR, lowpass, norm, note, pad, place, reverb, rng
from build_score_noir import _noise, hz, stinger, tone_keys

ROOT = Path(__file__).resolve().parent.parent
SEMI = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9}


def pulse(f, dur, k=1.0):
    t = np.arange(int(dur * SR)) / SR
    return np.sin(2 * np.pi * np.cumsum(f * (1 + 0.6 * np.exp(-t * 30))) / SR) * np.exp(-t * 9) * k


def tick():
    t = np.arange(int(0.05 * SR)) / SR
    return lowpass(rng.standard_normal(len(t)), 7000) * np.exp(-t * 160)


def riser(dur):
    t = np.arange(int(dur * SR)) / SR
    f = 120 * 2 ** (3 * t / dur)
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.4 + lowpass(rng.standard_normal(len(t)), 3000) * 0.6) * (t / dur) ** 2.5


def build(tl, key, hits, drops):
    total = tl["duration"]
    L = {l["index"]: l for l in tl["lines"]}
    n = int((total + 1) * SR)
    mix = np.zeros(n)
    root = 38 + SEMI[key] - SEMI["D"]
    # drone bed: minor chord pad, slowly swelling
    chords = [[root, root + 7, root + 15], [root - 2, root + 5, root + 14], [root + 3, root + 10, root + 15], [root - 4, root + 3, root + 12]]
    seg = 9.0
    k = 0
    while k * seg < total:
        p = pad([hz(m + 12) for m in chords[k % 4]], seg + 2.0, bright=0.6)
        place(mix, p, k * seg, 0.22)
        k += 1
    gaps = [(L[i]["start"] - 0.3, L[i]["end"] + 0.2) for i in drops if i in L]
    acts = [total * 0.3, total * 0.7]  # setup | investigation | reveal
    t = 0.6
    i = 0
    while t < total - 1.0:
        act = 0 if t < acts[0] else 1 if t < acts[1] else 2
        beat = [0.86, 0.6, 0.43][act]
        if not any(a <= t < b for a, b in gaps):
            place(mix, pulse(hz(root - 12), 0.4, [0.35, 0.5, 0.6][act]), t, 1)
            if act >= 1:
                place(mix, tick(), t + beat / 2, 0.12)
            if act == 2 and i % 2 == 0:
                place(mix, tone_keys([hz(root + 24 + [0, 3, 7, 10][(i // 2) % 4])], 1.2, 0.5), t, 0.1)
            if act == 0 and i % 4 == 0:
                place(mix, tone_keys([hz(root + 24 + [7, 3, 5, 2][(i // 4) % 4])], 2.0, 0.4), t, 0.12)
        t += beat
        i += 1
    for idx in hits:
        if idx in L:
            s = L[idx]["start"]
            place(mix, riser(1.2), max(0, s - 1.2), 0.25)
            place(mix, stinger(), max(0, s - 0.05), 0.8)
    mix = reverb(mix, 2.6, 0.28)
    stereo = np.stack([mix, np.roll(mix, int(0.013 * SR))], axis=1)
    return norm(stereo[: int(total * SR)], 0.5)


def sfx():
    out = {}
    d = 0.5
    t = np.arange(int(d * SR)) / SR
    out["paper"] = lowpass(rng.standard_normal(len(t)), 6000) * np.abs(np.sin(2 * np.pi * 5 * t)) * np.sin(np.pi * t / d)
    d = 0.12
    t = np.arange(int(d * SR)) / SR
    out["pin"] = (np.sin(2 * np.pi * 1900 * t) * 0.4 + lowpass(rng.standard_normal(len(t)), 5000)) * np.exp(-t * 60)
    d = 0.9
    t = np.arange(int(d * SR)) / SR
    out["twang"] = sum(np.sin(2 * np.pi * f * t) for f in (196, 392, 589)) / 3 * np.exp(-t * 5) * (1 + 0.3 * np.sin(2 * np.pi * 6 * t))
    d = 0.45
    t = np.arange(int(d * SR)) / SR
    out["tape"] = lowpass(rng.standard_normal(len(t)), 4000) * (0.4 + 0.6 * np.abs(np.sin(2 * np.pi * 40 * t))) * np.sin(np.pi * t / d) ** 0.5
    d = 0.5
    t = np.arange(int(d * SR)) / SR
    sh = np.zeros(len(t))
    for at in (0.0, 0.09):
        tt = np.arange(int(0.08 * SR)) / SR
        place(sh, lowpass(rng.standard_normal(len(tt)), 5000) * np.exp(-tt * 70), at, 1)
    out["shutter"] = sh
    d = 1.4
    t = np.arange(int(d * SR)) / SR
    cr = np.zeros(len(t))
    for j in range(14):
        tt = np.arange(int(0.03 * SR)) / SR
        place(cr, lowpass(rng.standard_normal(len(tt)), 8000) * np.exp(-tt * 120), (j / 14) ** 1.8 * 0.6, 1 - j / 20)
    out["crack"] = reverb(cr + np.sin(2 * np.pi * np.cumsum(70 * np.exp(-t * 2)) / SR) * np.exp(-t * 3) * 0.6, 1.5, 0.3)
    tw = np.zeros(int(1.0 * SR))
    for j in range(8):
        tt = np.arange(int(0.05 * SR)) / SR
        place(tw, (lowpass(rng.standard_normal(len(tt)), 3500) + 0.5 * np.sin(2 * np.pi * 1800 * tt)) * np.exp(-tt * 90), j * 0.11, 0.8)
    out["type"] = tw
    d = 0.45
    t = np.arange(int(d * SR)) / SR
    out["stamp"] = np.sin(2 * np.pi * 70 * t) * np.exp(-t * 18) + lowpass(rng.standard_normal(len(t)), 1800) * np.exp(-t * 45) * 0.8
    d = 0.6
    t = np.arange(int(d * SR)) / SR
    out["whoosh"] = lowpass(rng.standard_normal(len(t)), 2600) * np.sin(np.pi * t / d) ** 2
    d = 2.2
    t = np.arange(int(d * SR)) / SR
    out["tape_rewind"] = (np.sin(2 * np.pi * np.cumsum(300 + 900 * (t / d)) / SR) * 0.3 + lowpass(rng.standard_normal(len(t)), 2500) * 0.5) * np.sin(np.pi * t / d)
    out["sting"] = stinger()
    d = 1.0
    t = np.arange(int(d * SR)) / SR
    out["heart"] = sum(np.sin(2 * np.pi * np.cumsum(55 + 25 * np.exp(-(t - a).clip(0) * 25)) / SR) * np.exp(-(t - a).clip(0) * 22) * (t >= a) * g for a, g in ((0, 1), (0.22, 0.7)))
    return {k: norm(v, 0.85) for k, v in out.items()}


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("id")
    ap.add_argument("--key", default="D")
    ap.add_argument("--hits", default="")
    ap.add_argument("--drops", default="")
    a = ap.parse_args()
    tl = json.loads((ROOT / "src" / "data" / f"timeline-{a.id}.json").read_text())
    adir = ROOT / "public" / "audio" / f"v{a.id}"
    (adir / "sfx").mkdir(parents=True, exist_ok=True)
    ints = lambda s: [int(x) for x in s.split(",") if x]
    sf.write(adir / "score.wav", build(tl, a.key, ints(a.hits), ints(a.drops)).astype(np.float32), SR)
    fx = sfx()
    for k, v in fx.items():
        sf.write(adir / "sfx" / f"{k}.wav", v.astype(np.float32), SR)
    print(f"v{a.id}: board score ({tl['duration']}s) + {len(fx)} sfx")
