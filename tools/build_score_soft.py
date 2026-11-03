"""Warm, soft score for the self-help Tierlist series (020+): lo-fi pad, gentle piano arpeggio, soft kick, + UI sfx.
Usage: tools/tts/venv/bin/python build_score_soft.py 020 --key C"""
import argparse, json
from pathlib import Path
import numpy as np, soundfile as sf
import build_score_004 as kit4
from build_score import SR, lowpass, norm, pad, place, reverb, rng
from build_score_noir import hz, tone_keys
from build_score_board import sfx as board_sfx, pulse

ROOT = Path(__file__).resolve().parent.parent
SEMI = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9}

def build(tl, key):
    total = tl["duration"]; n = int((total + 2) * SR); mix = np.zeros(n)
    r = 48 + SEMI[key]
    prog = [[r, r + 4, r + 7, r + 11], [r - 3, r + 4, r + 7, r + 9], [r + 5, r + 9, r + 12, r + 16], [r + 7, r + 11, r + 14, r + 17]]
    bar = 60 / 78 * 4
    k = 0
    while k * bar < total:
        ch = prog[k % 4]
        place(mix, pad([hz(m) for m in ch[:3]], bar + 1.5, bright=0.45), k * bar, 0.16)
        for j in range(8):  # gentle arpeggio, 8ths
            if (j + k) % 3 != 2:
                place(mix, tone_keys([hz(ch[(j * 2 + k) % 4] + 12)], 1.2, 0.35), k * bar + j * bar / 8, 0.07)
        if k >= 1:
            for b in range(4):
                place(mix, pulse(hz(r - 24), 0.35, 0.28), k * bar + b * bar / 4, 1)
                if b % 2 == 1:
                    t = np.arange(int(0.12 * SR)) / SR
                    place(mix, lowpass(rng.standard_normal(len(t)), 3500) * np.exp(-t * 35) * 0.18, k * bar + b * bar / 4, 1)
        k += 1
    mix = reverb(mix, 2.0, 0.25)
    st = np.stack([mix, np.roll(mix, int(0.012 * SR))], axis=1)
    return norm(st[: int(total * SR)], 0.45)

def ping():
    t = np.arange(int(0.6 * SR)) / SR
    return reverb((np.sin(2 * np.pi * 1318 * t) + 0.5 * np.sin(2 * np.pi * 1976 * t * (t > 0.09))) * np.exp(-t * 7), 0.6, 0.2)

if __name__ == "__main__":
    ap = argparse.ArgumentParser(); ap.add_argument("id"); ap.add_argument("--key", default="C"); a = ap.parse_args()
    tl = json.loads((ROOT / "src" / "data" / f"timeline-{a.id}.json").read_text())
    adir = ROOT / "public" / "audio" / f"v{a.id}"; (adir / "sfx").mkdir(parents=True, exist_ok=True)
    sf.write(adir / "score.wav", build(tl, a.key).astype(np.float32), SR)
    fx = {**board_sfx(), **{k: v for k, v in kit4.sfx().items() if k in ("pop", "ding", "boing")}, "ping": norm(ping(), 0.8)}
    for k, v in fx.items(): sf.write(adir / "sfx" / f"{k}.wav", np.asarray(v, dtype=np.float32), SR)
    print(f"v{a.id}: soft score ({tl['duration']}s) + {len(fx)} sfx")
