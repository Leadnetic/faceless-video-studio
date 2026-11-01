import timelineJson from '../data/timeline-004.json';
import {narration, type Timeline} from '../lib/timeline';

export const timeline004 = timelineJson as Timeline;
const T = timeline004;
const N = narration(T);

/** Video 004 — "Why your brain replays that embarrassing moment at 3AM" (bright cartoon format). */
export const video004 = {
	timeline: T,
	audioDir: 'audio/v004',
	scenes: {
		bed: [0, N.start(1) + 2.0],
		restaurant: [N.start(1) + 1.95, N.start(3)],
		files: [N.start(3), N.start(5) - 0.05],
		cave: [N.start(5) - 0.05, N.start(6) - 0.05],
		replay: [N.start(6) - 0.05, N.start(7) - 0.05],
		twist: [N.start(7) - 0.05, N.start(9) - 0.05],
		stage: [N.start(9) - 0.05, N.start(10) - 0.05],
		city: [N.start(10) - 0.05, T.duration],
	} as Record<string, [number, number]>,
	t: {
		sleepy: N.end(0),
		brainPop: N.word(1, 2) - 0.1,
		hey: N.word(1, 4),
		cloud: N.word(1, 5),
		enjoy: N.word(1, 10) - 0.1,
		youToo: N.word(2, 3) - 0.08,
		cringe: N.end(2) - 0.2,
		awake: N.end(2) + 0.18,
		notRandom: N.start(3),
		folder: N.word(4, 2) - 0.1,
		stamp: N.word(4, 6),
		toDrawer: N.end(4) + 0.05,
		kicked: N.word(5, 4),
		threat: N.word(5, 12) - 0.1,
		press: N.word(6, 4) - 0.1,
		never: N.word(6, 9),
		twist: N.start(7),
		forgot: N.word(8, 2),
		spotlight: N.word(9, 3),
		people: N.word(9, 5),
		own: N.word(10, 0),
		ownWord: N.word(10, 6),
	},
};

export type Video004 = typeof video004;
