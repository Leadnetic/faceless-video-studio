export type Word = {word: string; start: number; end: number};
export type Line = {index: number; text: string; start: number; end: number; emphasis: string[]; words: Word[]; speaker?: string};
export type Timeline = {id: string; title: string; duration: number; lines: Line[]};

/** Convenience accessors so scenes are written against narration, not hard-coded seconds. */
export const narration = (tl: Timeline) => ({
	start: (i: number) => tl.lines[i].start,
	end: (i: number) => tl.lines[i].end,
	/** Start time of word `w` (0-based) in line `i`. */
	word: (i: number, w: number) => tl.lines[i].words[Math.min(w, tl.lines[i].words.length - 1)].start,
});
