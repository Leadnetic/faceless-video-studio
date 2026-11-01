"""Noir-jazz score + SFX kit for the graphic-novel "Reader" series (video 009+). Royalty-free, synthesized here.

Usage:  tools/tts/venv/bin/python tools/build_score_noir.py 009 --key D --drops 4 --bpm 92
  --key    tonic of the minor i–iv–ii°–V walking-bass progression
  --drops  line indices where the band stops dead and a piano stinger hits (reveals)
Writes public/audio/v<id>/score.wav and public/audio/v<id>/sfx/*.wav
"""
import argparse
import json
from pathlib import Path

import numpy as np
import soundfile as sf

import build_score_004 as kit4
from build_score import SR, lowpass, norm, note, place, reverb, rng

ROOT = Path(__file__).resolve().parent.parent
SEMI = {"C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11}


def hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


def tone_bass(f, dur):
    t = np.arange(int(dur * SR)) / SR
    body = np.sin(2 * np.pi * f * t) + 0.45 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 9) + 0.15 * np.sin(2 * np.pi * 3 * f * t) * np.exp(-t * 14)
    thump = np.sin(2 * np.pi * f * 0.5 * t) * np.exp(-t * 30) * 0.3
    return (body * np.exp(-t * 4.2) + thump) * np.clip(t / 0.006, 0, 1)


def tone_keys(freqs, dur, bright=1.0):
    """Mellow electric-piano voicing: fundamental + soft bell partial."""
    t = np.arange(int(dur * SR)) / SR
    s = np.zeros_like(t)
    for f in freqs:
        s += np.sin(2 * np.pi * f * t) * np.exp(-t * 2.2) + 0.22 * bright * np.sin(2 * np.pi * f * 3.98 * t) * np.exp(-t * 7)
    return s / max(1, len(freqs)) * np.clip(t / 0.004, 0, 1) * (1 + 0.04 * np.sin(2 * np.pi * 5 * t))


def tone_vibes(f, dur):
    t = np.arange(int(dur * SR)) / SR
    trem = 0.75 + 0.25 * np.sin(2 * np.pi * 5.5 * t)
    return (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t * 10)) * np.exp(-t * 1.8) * trem


_noise = lowpass(rng.standard_normal(int(1.0 * SR)), 7000)
_ride_t = np.arange(int(0.9 * SR)) / SR
RIDE = sum(np.sin(2 * np.pi * f * _ride_t + rng.uniform(0, 6)) for f in (3120, 4470, 5310, 6890, 8220)) / 5 * np.exp(-_ride_t * 5) + _noise[: len(_ride_t)] * 0.15 * np.exp(-_ride_t * 18)
_br_t = np.arange(int(0.22 * SR)) / SR
BRUSH = _noise[: len(_br_t)] * np.sin(np.pi * _br_t / 0.22) ** 1.5 * 0.9
_kick_t = np.arange(int(0.25 * SR)) / SR
FEATHER = np.sin(2 * np.pi * np.cumsum(60 + 40 * np.exp(-_kick_t * 30)) / SR) * np.exp(-_kick_t * 14)


def build_score(tl, key, drops, bpm):
    total = tl["duration"]
    L = {l["index"]: l for l in tl["lines"]}
    n = int((total + 0.5) * SR)
    mix = np.zeros(n)
    beat = 60 / bpm
    root = 38 + SEMI[key] - SEMI["D"]  # D2 by default
    # i – iv – ii° – V  (bass walks: root, 3rd/5th, approach tone)
    prog = [
        (root, [root, root + 3, root + 7, root + 6]),
        (root + 5, [root + 5, root + 8, root + 12, root + 1]),
        (root + 2, [root + 2, root + 5, root + 8, root + 6]),
        (root + 7, [root + 7, root + 11, root + 10, root - 1]),
    ]
    chords = [[3, 7, 10, 14], [3, 7, 10, 14], [3, 6, 10, 13], [4, 10, 13, 15]]
    gaps = [(L[i]["start"] - 0.08, L[i]["end"] + 0.35) for i in drops if i in L]
    stingers = [L[i]["start"] - 0.06 for i in drops if i in L]
    motif = [0, 3, 7, 10, 8, 7, 3, 5]
    k, tt = 0, 0.0
    while tt < total - 0.3:
        bar, b = divmod(k, 4)
        chord_root, walk = prog[bar % 4]
        muted = any(a <= tt < c for a, c in gaps)
        if not muted:
            place(mix, tone_bass(hz(walk[b]), beat * 1.05), tt, 0.55)
            # swung ride: ding … ding-a ding
            place(mix, RIDE, tt, 0.07 if b % 2 == 0 else 0.05)
            if b % 2 == 1:
                place(mix, RIDE, tt + beat * 0.66, 0.035)
                place(mix, BRUSH, tt - 0.05, 0.16)
            if b == 0:
                place(mix, FEATHER, tt, 0.18)
            # comping: chord on the "and of 2" every bar, voiced around middle C
            if b == 1 and bar >= 1:
                ch = [hz(chord_root + 24 + c) for c in chords[bar % 4]]
                place(mix, tone_keys(ch, beat * 1.6), tt + beat * 0.66, 0.16)
            # vibes motif every other phrase so a 40 s piece breathes
            if bar >= 4 and (bar // 4) % 2 == 1:
                m = motif[(bar * 2 + b) % 8]
                if b in (0, 2):
                    place(mix, tone_vibes(hz(root + 36 + m), beat * 2), tt, 0.08)
        k += 1
        tt += beat
    for s in stingers:
        place(mix, stinger(), max(0, s), 0.9)
    mix = reverb(mix, 1.8, 0.2)
    stereo = np.stack([mix, np.roll(mix, int(0.011 * SR))], axis=1)
    return norm(stereo[: int(total * SR)], 0.5)


def stinger():
    """Low piano cluster + reversed cymbal swell into it: the 'reveal' hit."""
    d = 2.4
    t = np.arange(int(d * SR)) / SR
    cl = sum(np.sin(2 * np.pi * f * t) * np.exp(-t * 1.6) for f in (hz(26), hz(38), hz(41), hz(44), hz(50))) / 5
    hit = cl * np.clip(t / 0.003, 0, 1)
    swell_t = np.arange(int(0.5 * SR)) / SR
    swell = (lowpass(rng.standard_normal(len(swell_t)), 5000) * (swell_t / 0.5) ** 3) * 0.4
    out = np.zeros(int((d + 0.5) * SR))
    place(out, swell, 0, 1)
    place(out, hit, 0.5, 1)
    return reverb(out, 2.2, 0.35)[int(0.44 * SR):]


def sfx():
    out = {}
    # pen scribble: band-limited noise gated by quick strokes
    d = 1.4
    t = np.arange(int(d * SR)) / SR
    strokes = np.abs(np.sin(2 * np.pi * 7.5 * t)) ** 3 * (0.6 + 0.4 * np.sin(2 * np.pi * 1.3 * t))
    nz = lowpass(rng.standard_normal(len(t)), 4500) - lowpass(lowpass(rng.standard_normal(len(t)), 900), 900) * 0.5
    out["scribble"] = nz * strokes * np.clip(t / 0.03, 0, 1) * np.clip((d - t) / 0.08, 0, 1)
    # coin: metallic ring with a flip flutter
    d = 1.2
    t = np.arange(int(d * SR)) / SR
    ring = sum(np.sin(2 * np.pi * f * t) * np.exp(-t * dc) for f, dc in ((2650, 4), (4120, 6), (6930, 9))) / 3
    out["coin"] = ring * (0.7 + 0.3 * np.sign(np.sin(2 * np.pi * 18 * t)) * np.exp(-t * 4))
    # paper rustle
    d = 0.6
    t = np.arange(int(d * SR)) / SR
    out["paper"] = lowpass(rng.standard_normal(len(t)), 6000) * np.abs(np.sin(2 * np.pi * 4 * t)) * np.sin(np.pi * t / d)
    # heartbeat (lub-dub)
    hb = np.zeros(int(1.0 * SR))
    for at, g in ((0, 1), (0.22, 0.7)):
        tt = np.arange(int(0.18 * SR)) / SR
        place(hb, np.sin(2 * np.pi * np.cumsum(55 + 25 * np.exp(-tt * 25)) / SR) * np.exp(-tt * 22), at, g)
    out["heart"] = hb
    # clock tick
    d = 0.08
    t = np.arange(int(d * SR)) / SR
    out["tick"] = np.sin(2 * np.pi * 2900 * t) * np.exp(-t * 160) + lowpass(rng.standard_normal(len(t)), 5000) * np.exp(-t * 220) * 0.6
    # lamp: switch click + buzz
    d = 0.9
    t = np.arange(int(d * SR)) / SR
    click = np.zeros(len(t))
    click[: int(0.02 * SR)] = lowpass(rng.standard_normal(int(0.02 * SR)), 6000) * np.exp(-np.arange(int(0.02 * SR)) / SR * 300)
    out["lamp"] = click + np.sin(2 * np.pi * 100 * t) * 0.12 * np.sign(np.sin(2 * np.pi * 50 * t)) * np.exp(-t * 2.5) * np.clip(t / 0.05, 0, 1)
    # crystal shimmer
    d = 2.0
    t = np.arange(int(d * SR)) / SR
    out["shimmer"] = reverb(sum(np.sin(2 * np.pi * hz(m) * t + i) * np.exp(-((t - 0.12 * i) % d) * 3) * (t > 0.12 * i) for i, m in enumerate((86, 90, 93, 97, 98, 102))) / 6, 1.6, 0.4) * np.sin(np.pi * t / d) ** 0.4
    # typewriter clacks
    tw = np.zeros(int(1.2 * SR))
    for i in range(9):
        tt = np.arange(int(0.05 * SR)) / SR
        place(tw, (lowpass(rng.standard_normal(len(tt)), 3500) + 0.5 * np.sin(2 * np.pi * 1800 * tt)) * np.exp(-tt * 90), i * 0.11 + rng.uniform(0, 0.03), 0.8)
    out["type"] = tw
    # page turn swish
    d = 0.45
    t = np.arange(int(d * SR)) / SR
    out["swish"] = lowpass(rng.standard_normal(len(t)), 3800) * np.sin(np.pi * t / d) ** 2 * (t / d)
    # body thud (table slam)
    d = 0.5
    t = np.arange(int(d * SR)) / SR
    out["thud"] = np.sin(2 * np.pi * np.cumsum(90 * np.exp(-t * 3) + 40) / SR) * np.exp(-t * 11) + lowpass(rng.standard_normal(len(t)), 1200) * np.exp(-t * 30) * 0.7
    # comic "zing" for annotations
    d = 0.35
    t = np.arange(int(d * SR)) / SR
    out["zing"] = np.sin(2 * np.pi * np.cumsum(900 + 2400 * t / d) / SR) * np.exp(-t * 6) * 0.6
    out["sting"] = stinger()
    # buzzer (wrong / myth)
    d = 0.6
    t = np.arange(int(d * SR)) / SR
    out["buzzer"] = np.sign(np.sin(2 * np.pi * 110 * t)) * 0.5 * np.clip((d - t) / 0.05, 0, 1)
    # bunker kit (013): alarm klaxon, heavy vault door slam, rumble
    d = 1.6
    t = np.arange(int(d * SR)) / SR
    f = 520 + 180 * (np.sin(2 * np.pi * 1.2 * t) > 0)
    out["alarm"] = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * 0.35 * np.sin(np.pi * t / d) ** 0.3
    d = 2.2
    t = np.arange(int(d * SR)) / SR
    boom = np.sin(2 * np.pi * np.cumsum(55 * np.exp(-t * 1.5) + 30) / SR) * np.exp(-t * 2.2)
    clang = sum(np.sin(2 * np.pi * fr * t) * np.exp(-t * dc) for fr, dc in ((187, 3), (433, 5), (911, 8))) / 3
    out["slam"] = reverb(boom + 0.5 * clang + lowpass(rng.standard_normal(len(t)), 1500) * np.exp(-t * 18) * 0.8, 2.0, 0.35)
    d = 3.0
    t = np.arange(int(d * SR)) / SR
    out["rumble"] = lowpass(lowpass(rng.standard_normal(len(t)), 200), 200) * np.sin(np.pi * t / d) * 6
    return {k: norm(v, 0.85) for k, v in out.items()}


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("id")
    ap.add_argument("--key", default="D")
    ap.add_argument("--drops", default="")
    ap.add_argument("--bpm", type=float, default=92)
    a = ap.parse_args()
    tl = json.loads((ROOT / "src" / "data" / f"timeline-{a.id}.json").read_text())
    adir = ROOT / "public" / "audio" / f"v{a.id}"
    (adir / "sfx").mkdir(parents=True, exist_ok=True)
    drops = [int(x) for x in a.drops.split(",") if x]
    sf.write(adir / "score.wav", build_score(tl, a.key, drops, a.bpm).astype(np.float32), SR)
    fx = {**{k: v for k, v in kit4.sfx().items() if k in ("pop", "whoosh", "stamp", "ding", "scratch", "rewind")}, **sfx()}
    for k, v in fx.items():
        sf.write(adir / "sfx" / f"{k}.wav", v.astype(np.float32), SR)
    print(f"v{a.id}: noir score ({tl['duration']}s, {a.key} minor, {a.bpm} bpm) + {len(fx)} sfx")
