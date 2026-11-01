import timelineJson from '../data/timeline-003.json';
import {MAIN_LOOK, type Look} from '../components/Person';
import {narration, type Timeline} from '../lib/timeline';

export const timeline003 = timelineJson as Timeline;
const T = timeline003;
const N = narration(T);

export const look003 = {
	charcoal: '#1b1a1e',
	navy: '#111827',
	paper: '#efe9df',
	beige: '#c9b79c',
	amber: '#e0a957',
	red: '#a3242c',
	ink: '#1d1b1f',
};

export const cast: Record<string, Look> = {
	main: MAIN_LOOK,
	colleague: {skin: '#8d5f45', hair: '#17110e', coat: '#2c3446', inner: '#1f2128', trousers: '#23252c', hairStyle: 'long'},
	praised: {skin: '#e0b89a', hair: '#3a2a20', coat: '#3a3a40', inner: '#d9cfc0', trousers: '#2a2a30', hairStyle: 'bun'},
	guest: {skin: '#a8765a', hair: '#141210', coat: '#6b5a48', inner: '#222024', trousers: '#2a2a30', hairStyle: 'crop'},
	quiet: {skin: '#d9b08f', hair: '#2b211b', coat: '#2c3446', inner: '#c9b79c', trousers: '#23252c', hairStyle: 'long'},
	glass: {skin: 'rgba(170,196,222,0.22)', hair: 'rgba(120,150,180,0.35)', coat: 'rgba(170,196,222,0.18)', inner: 'rgba(120,150,180,0.22)', trousers: 'rgba(150,170,195,0.2)', hairStyle: 'swept'},
};

/** Video 003 — "Narcissism doesn't always look confident." All timings anchored to narration. */
export const video003 = {
	timeline: T,
	audioDir: 'audio/v003',
	scenes: {
		hook: [0, N.start(1) - 0.1],
		room: [N.start(1) - 0.2, N.start(2) - 0.05],
		critique: [N.start(2) - 0.15, N.start(3) - 0.02],
		examples: [N.start(3) - 0.05, N.start(4) - 0.05],
		mirror: [N.start(4) - 0.15, N.start(6) - 0.05],
		lineup: [N.start(6) - 0.4, T.duration],
	} as Record<string, [number, number]>,

	hook: {crackAt: 0.45, crack2At: 0.78, title: 'NARCISSISM', sub: "DOESN'T ALWAYS LOOK CONFIDENT."},

	room: {
		enter: [N.start(1) - 0.2, N.start(1) + 0.75] as [number, number],
		words: [
			{text: 'CHARMING', at: N.word(1, 3)},
			{text: 'CALM', at: N.word(1, 4)},
			{text: 'INSECURE', at: N.word(1, 6)},
		],
		praiseAt: N.word(1, 5) + 0.05,
	},

	critique: {
		commentAt: N.start(2) + 0.05,
		comment: 'Maybe try it another way next time?',
		freezeAt: N.word(2, 3),
		arrowAt: N.word(2, 4) - 0.05,
		insideAt: N.word(2, 6) - 0.15,
		strikeAt: N.word(2, 7) + 0.02,
		threatAt: N.word(2, 9) - 0.15,
	},

	examples: {
		cuts: [N.start(3) - 0.05, N.word(3, 6) - 0.2, N.word(3, 10) - 0.15, N.start(4) - 0.05],
		labels: ['STATUS THREAT', 'DEFENSIVENESS', 'VALIDATION'],
	},

	mirror: {
		revealEnd: N.word(4, 2),
		cracks: [N.word(4, 1), N.word(4, 4), N.word(4, 6)],
		orbit: [N.word(4, 3), N.word(4, 8), N.word(5, 3)] as [number, number, number],
		hugeAt: N.word(4, 8),
		fragileAt: N.word(5, 6),
		tensionAt: N.word(5, 3),
	},

	lineup: {
		zoom: [N.start(6) - 0.4, N.start(6) + 1.6] as [number, number],
		labels: [
			{text: 'CONFIDENT', at: N.word(6, 8)},
			{text: 'QUIET', at: N.word(6, 5)},
			{text: 'CHARMING', at: N.word(6, 6)},
			{text: 'INSECURE', at: N.word(6, 9)},
		],
		removeAt: N.word(6, 11),
		finalAt: [N.start(7), N.word(7, 3)] as [number, number],
		askAt: N.end(7) + 0.55,
	},

	hiddenCaptions: [7],
	lightWindows: [
		[N.word(2, 6) - 0.15, N.start(3) - 0.05],
		[N.start(6) + 0.1, T.duration + 1],
	] as [number, number][],
};

export type Video003 = typeof video003;
