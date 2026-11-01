"""Generate the narration locally with Kokoro (no paid API) and emit a timeline.

Usage:  tools/tts/venv/bin/python tools/build_voiceover.py script/voiceover.json [--audio-dir public/audio] [--timeline src/data/timeline.json]

Outputs (defaults = video 001 layout)
  <audio-dir>/voiceover.wav   – mastered narration (48 kHz)
  <timeline>                  – line + word timings consumed by Remotion
"""
import argparse
import json
import subprocess
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = Path(__file__).resolve().parent.parent
TTS = ROOT / "tools" / "tts"
SR = 24000


def trim(samples: np.ndarray, thresh: float = 0.012, pad: float = 0.03) -> np.ndarray:
    win = int(SR * 0.01)
    env = np.convolve(np.abs(samples), np.ones(win) / win, mode="same")
    idx = np.where(env > thresh)[0]
    if len(idx) == 0:
        return samples
    p = int(SR * pad)
    return samples[max(0, idx[0] - p): min(len(samples), idx[-1] + p)]


def word_weights(words):
    # Syllable-ish weight: vowel groups + punctuation pause bias.
    out = []
    for w in words:
        core = "".join(c for c in w.lower() if c.isalpha() or c == "'")
        groups, prev = 0, False
        for c in core:
            v = c in "aeiouy"
            if v and not prev:
                groups += 1
            prev = v
        out.append(max(1, groups) + 0.35 + (0.25 if w[-1] in ".,?!" else 0))
    return out


def main(script_path: str, audio_dir: str = "public/audio", timeline_path: str = "src/data/timeline.json"):
    cfg = json.loads((ROOT / script_path).read_text())
    v = cfg["voice"]
    kokoro = Kokoro(str(TTS / "kokoro-v1.0.onnx"), str(TTS / "voices-v1.0.bin"))

    track = [np.zeros(int(SR * cfg["leadIn"]), dtype=np.float32)]
    t = cfg["leadIn"]
    lines = []
    cast = cfg.get("cast", {})
    for i, line in enumerate(cfg["lines"]):
        # Multi-voice episodes (009+): a line may name a speaker from the cast; default = the narrator voice.
        who = line.get("speaker")
        role = {**v, **cast.get(who, {})} if who else v
        samples, _ = kokoro.create(line.get("say", line["text"]), voice=role["voice"], speed=line.get("speed", role["speed"]), lang=role.get("lang", "en-us"))
        samples = trim(samples.astype(np.float32))
        if cast:  # level-match voices so the dialogue doesn't jump in loudness between characters
            rms = np.sqrt(np.mean(samples ** 2)) + 1e-9
            samples = samples * (0.08 * role.get("gain", 1.0) / rms)
        dur = len(samples) / SR
        words = line["text"].split()
        weights = word_weights(words)
        total = sum(weights)
        cursor, wt = t, []
        for w, wgt in zip(words, weights):
            d = dur * wgt / total
            wt.append({"word": w, "start": round(cursor, 3), "end": round(cursor + d, 3)})
            cursor += d
        lines.append({"index": i, "text": line["text"], "start": round(t, 3), "end": round(t + dur, 3),
                      "emphasis": line.get("emphasis", []), "words": wt,
                      **({"speaker": who} if who else {})})
        track.append(samples)
        track.append(np.zeros(int(SR * line["pause"]), dtype=np.float32))
        t += dur + line["pause"]
        print(f"[{i:02d}] {t - line['pause'] - dur:6.2f}s  {dur:5.2f}s  {line['text']}")

    track.append(np.zeros(int(SR * cfg["tail"]), dtype=np.float32))
    audio = np.concatenate(track)
    adir = ROOT / audio_dir
    adir.mkdir(parents=True, exist_ok=True)
    raw = adir / "voiceover_raw.wav"
    sf.write(raw, audio, SR)

    # Mastering: subtle pitch drop (duration preserved), warmth, de-harsh, gentle room, loudness.
    p = v.get("pitchShift", 1.0)
    room = "" if v.get("dry") else "aecho=0.85:0.5:38|71:0.12|0.07,"
    af = (f"asetrate={int(SR * p)},aresample=48000,atempo={1 / p:.5f},"
          "highpass=f=70,lowshelf=f=160:g=2.5,equalizer=f=3200:t=q:w=1.2:g=-2,"
          "highshelf=f=9000:g=-3,acompressor=threshold=-20dB:ratio=2.5:attack=8:release=120,"
          f"{room}loudnorm=I=-16:TP=-1.5:LRA=7")
    out = adir / "voiceover.wav"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(raw), "-af", af, "-ar", "48000", str(out)], check=True)

    total_dur = len(audio) / SR
    tl_path = ROOT / timeline_path
    tl_path.parent.mkdir(parents=True, exist_ok=True)
    tl_path.write_text(json.dumps(
        {"id": cfg["id"], "title": cfg["title"], "duration": round(total_dur, 3), "lines": lines}, indent=2))
    print(f"total {total_dur:.2f}s -> {out.relative_to(ROOT)}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("script", nargs="?", default="script/voiceover.json")
    ap.add_argument("--audio-dir", default="public/audio")
    ap.add_argument("--timeline", default="src/data/timeline.json")
    a = ap.parse_args()
    main(a.script, a.audio_dir, a.timeline)
