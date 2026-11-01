import timelineJson from '../data/timeline-005.json';
import {narration, type Timeline} from '../lib/timeline';

export const timeline005 = timelineJson as Timeline;
const T = timeline005;
const N = narration(T);

/** Video 005 — the doorway effect ("your brain" cartoon series, ep. 2). */
export const video005 = {
	timeline: T,
	audioDir: 'audio/v005',
	scenes: {
		kitchen: [0, N.start(2) - 0.05],
		door: [N.start(2) - 0.05, N.start(3)],
		game: [N.start(3), N.start(4) - 0.05],
		pass: [N.start(4) - 0.05, N.start(5) - 0.05],
		old: [N.start(5) - 0.05, N.start(6) - 0.05],
		study: [N.start(6) - 0.05, N.start(7) - 0.05],
		fix: [N.start(7) - 0.05, N.start(8)],
		fridge: [N.start(8), T.duration],
	} as Record<string, [number, number]>,
	t: {
		stop: 0.95,
		blank: N.word(0, 6),
		crickets: N.end(0) + 0.05,
		why: N.start(1),
		door: N.word(2, 2) - 0.05,
		scenes: N.word(3, 5),
		chapters: N.word(3, 7),
		doorway: N.word(4, 3),
		newRoom: N.word(4, 8),
		save: N.word(4, 12),
		close: N.word(4, 14),
		stayed: N.word(5, 6),
		study: N.word(6, 4),
		doorLane: N.word(6, 6),
		forget: N.word(6, 9),
		sameWalk: N.word(6, 13),
		back: N.word(7, 3),
		thought: N.word(7, 9),
		everyone: N.word(8, 3),
		open: N.word(8, 5),
		act: N.word(8, 9),
		plan: N.word(8, 14),
	},
};

export type Video005 = typeof video005;
