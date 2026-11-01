"""Expressive narration with ElevenLabs (uses the user's own subscription; needs ELEVENLABS_API_KEY).

Usage:  python3 tools/build_voiceover_11labs.py script/voiceover-018.json --audio-dir public/audio/v018 --timeline src/data/timeline-018.json

Why this is better than the local Kokoro path:
  * eleven_v3 understands audio tags inside the spoken text, e.g. "[whispers]", "[pause]", "[sighs]",
    "[curious]", "[dramatic]", "[short pause]" — so emphasis and emotion are performed, not just read.
  * the /with-timestamps endpoint returns character-level alignment, so caption word timings are exact
    (Kokoro timings were estimated from syllables).

Script JSON (same as the Kokoro scripts, plus optional fields):
  "eleven": {"voice_id": "...", "model": "eleven_v3", "stability": 0.35, "similarity": 0.8, "style": 0.45}
  per line: "say" = text sent to TTS (may contain [tags] and "..."), "text" = clean caption text.
  per line optional: "voice_id" (multi-voice), "stability".
"""
import argparse
import base64
import json
import os
import re
import subprocess
import tempfile
import urllib.request
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
SR = 24000
API = "https://api.elevenlabs.io/v1/text-to-speech/{voice}/with-timestamps?output_format=mp3_44100_128"
TAG = re.compile(r"\[[^\]]*\]")


def tts(text, voice, model, settings, prev_text=None, next_text=None):
    body = {"text": text, "model_id": model, "voice_settings": settings}
    if model != "eleven_v3":  # request stitching keeps prosody continuous across lines (not supported by v3)
        if prev_text:
            body["previous_text"] = prev_text
        if next_text:
            body["next_text"] = next_text
    req = urllib.request.Request(API.format(voice=voice), data=json.dumps(body).encode(), headers={
        "xi-api-key": os.environ["ELEVENLABS_API_KEY"], "Content-Type": "application/json", "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=180) as r:
        data = json.loads(r.read())
    with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as f:
        f.write(base64.b64decode(data["audio_base64"]))
        mp3 = f.name
    wav = mp3.replace(".mp3", ".wav")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", mp3, "-ac", "1", "-ar", str(SR), wav], check=True)
    samples, _ = sf.read(wav, dtype="float32")
    al = data.get("normalized_alignment") or data.get("alignment")
    return samples, al


def word_times(spoken, al, offset):
    """Map the alignment back onto the caption words (tags in the spoken text are skipped)."""
    chars = al["characters"]
    starts = al["character_start_times_seconds"]
    ends = al["character_end_times_seconds"]
    words, cur, ws, we, in_tag = [], "", None, None, False
    for c, s, e in zip(chars, starts, ends):
        if c == "[":
            in_tag = True
        if in_tag:
            if c == "]":
                in_tag = False
            continue
        if c.isspace():
            if cur.strip():
                words.append((cur, ws, we))
            cur, ws = "", None
            continue
        if ws is None:
            ws = s
        cur += c
        we = e
    if cur.strip():
        words.append((cur, ws, we))
    return [{"word": w, "start": round(offset + s, 3), "end": round(offset + e, 3)} for w, s, e in words]


def main(script_path, audio_dir, timeline_path):
    cfg = json.loads((ROOT / script_path).read_text())
    el = cfg["eleven"]
    settings = {"stability": el.get("stability", 0.35), "similarity_boost": el.get("similarity", 0.8), "style": el.get("style", 0.45), "use_speaker_boost": True}
    track = [np.zeros(int(SR * cfg["leadIn"]), dtype=np.float32)]
    t = cfg["leadIn"]
    lines = []
    L = cfg["lines"]
    for i, line in enumerate(L):
        spoken = line.get("say11", line.get("say", line["text"]))
        voice = line.get("voice_id", el["voice_id"])
        st = {**settings, **({"stability": line["stability"]} if "stability" in line else {})}
        samples, al = tts(spoken, voice, el.get("model", "eleven_v3"), st,
                          L[i - 1].get("say11", L[i - 1]["text"]) if i else None,
                          L[i + 1].get("say11", L[i + 1]["text"]) if i + 1 < len(L) else None)
        dur = len(samples) / SR
        ws = word_times(spoken, al, t) if al else []
        # captions show the clean text; if word counts differ (tags, numbers), fall back to spreading clean words
        clean = line["text"].split()
        if len(ws) != len(clean):
            span0, span1 = (ws[0]["start"], ws[-1]["end"]) if ws else (t, t + dur)
            step = (span1 - span0) / max(1, len(clean))
            ws = [{"word": w, "start": round(span0 + k * step, 3), "end": round(span0 + (k + 1) * step, 3)} for k, w in enumerate(clean)]
        else:
            for k, w in enumerate(clean):
                ws[k]["word"] = w
        lines.append({"index": i, "text": line["text"], "start": round(ws[0]["start"], 3), "end": round(ws[-1]["end"], 3),
                      "emphasis": line.get("emphasis", []), "words": ws, **({"speaker": line["speaker"]} if "speaker" in line else {})})
        track += [samples.astype(np.float32), np.zeros(int(SR * line.get("pause", 0.25)), dtype=np.float32)]
        t += dur + line.get("pause", 0.25)
        print(f"[{i:02d}] {lines[-1]['start']:6.2f}s  {dur:5.2f}s  {TAG.sub('', spoken).strip()}")
    track.append(np.zeros(int(SR * cfg["tail"]), dtype=np.float32))
    audio = np.concatenate(track)
    adir = ROOT / audio_dir
    adir.mkdir(parents=True, exist_ok=True)
    raw = adir / "voiceover_raw.wav"
    sf.write(raw, audio, SR)
    # light mastering only — ElevenLabs output is already clean; keep the performance intact
    af = "highpass=f=60,acompressor=threshold=-22dB:ratio=2:attack=10:release=150,loudnorm=I=-16:TP=-1.5:LRA=9"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(raw), "-af", af, "-ar", "48000", str(adir / "voiceover.wav")], check=True)
    total = len(audio) / SR
    (ROOT / timeline_path).write_text(json.dumps({"id": cfg["id"], "title": cfg["title"], "duration": round(total, 3), "lines": lines}, indent=2))
    print(f"total {total:.2f}s")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("script")
    ap.add_argument("--audio-dir", required=True)
    ap.add_argument("--timeline", required=True)
    a = ap.parse_args()
    main(a.script, a.audio_dir, a.timeline)
