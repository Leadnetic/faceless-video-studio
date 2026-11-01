"""Write an .srt (4-word cues) from a narration timeline: python3 tools/make_srt.py 006"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def ts(s):
    ms = int(round(s * 1000))
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"


def main(k):
    d = json.loads((ROOT / "src" / "data" / f"timeline-{k}.json").read_text())
    out, n = [], 1
    for line in d["lines"]:
        w = line["words"]
        for i in range(0, len(w), 4):
            ch = w[i:i + 4]
            end = ch[-1]["end"] if i + 4 >= len(w) else w[i + 4]["start"]
            out.append(f"{n}\n{ts(ch[0]['start'])} --> {ts(end)}\n{' '.join(x['word'] for x in ch)}\n")
            n += 1
    dst = ROOT / "output" / f"psychology-video-{k}.en.srt"
    dst.write_text("\n".join(out))
    print(dst.name, n - 1, "cues")


if __name__ == "__main__":
    for k in sys.argv[1:]:
        main(k)
