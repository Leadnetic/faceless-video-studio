#!/usr/bin/env bash
# Re-installs the third-party skills used by this studio (cloud containers are ephemeral).
# Plugins are installed from local reviewed clones; Understand-Anything is installed as skills only
# (its plugin ships SessionStart/PostToolUse hooks that act without asking — deliberately not installed).
set -euo pipefail
SRC="${1:-/tmp/skillsrc}"; V="$HOME/.claude/vendor"; S="$HOME/.claude/skills"
mkdir -p "$SRC" "$V" "$S"
clone() { test -d "$SRC/$2" || git clone -q --depth 1 "https://github.com/$1.git" "$SRC/$2"; }
clone AgriciDaniel/claude-blog claude-blog; clone higgsfield-ai/skills higgsfield; clone kajisho5/ffmpeg-skill ffmpeg-skill
clone kurbaitaev/ghost-editor ghost-editor; clone hardikpandya/stop-slop stop-slop; clone zarazhangrui/frontend-slides frontend-slides
clone Egonex-AI/Understand-Anything understand-anything; clone blader/humanizer humanizer
for d in claude-blog higgsfield ffmpeg-skill humanizer frontend-slides; do test -e "$V/$d" || cp -r "$SRC/$d" "$V/$d"; claude plugin marketplace add "$V/$d" || true; done
for p in claude-blog@agricidaniel-blog higgsfield@higgsfield ffmpeg-skill@ffmpeg-skill humanizer@humanizer frontend-slides@frontend-slides; do claude plugin install "$p" --scope user || true; done
mkdir -p "$S/stop-slop" "$S/ghost-editor"
tar -C "$SRC/stop-slop" --exclude=.git -cf - . | tar -C "$S/stop-slop" -xf -
tar -C "$SRC/ghost-editor" --exclude=.git --exclude=examples --exclude=tests -cf - . | tar -C "$S/ghost-editor" -xf -
for s in "$SRC"/understand-anything/understand-anything-plugin/skills/*/; do n=$(basename "$s"); test -e "$S/$n" || cp -r "$s" "$S/$n"; done
echo "skills installed"
