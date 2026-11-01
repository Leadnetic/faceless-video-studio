import timelineJson from '../data/timeline-002.json';
import type {Fragment, Ring} from '../components/Orbit';
import {narration, type Timeline} from '../lib/timeline';

export const timeline002 = timelineJson as Timeline;
const T = timeline002;
const N = narration(T);

/** Video 002 — "The Conversation Ended. Your Mind Didn't." All timings anchored to narration. */
export const video002 = {
	timeline: T,
	audioDir: 'audio/v002',
	look: {
		violet: '#7d6bc4',
		lilac: '#b9aee6',
		lilacRGB: '185,174,230',
		moon: '#9aa6e8',
		night: '#0a0a18',
		ink: '#05050d',
	},
	scenes: {
		bedroom: [0, N.start(2) - 0.05],
		memory: [N.start(2) - 0.45, N.word(5, 3) + 0.5],
		mind: [N.word(5, 3) + 0.15, N.word(6, 3) + 0.3],
		corridor: [N.word(6, 3) - 0.05, N.start(12) + 0.9],
		ring: [N.start(12) + 0.5, T.duration],
	} as Record<string, [number, number]>,

	hook: {
		clock: '2:47',
		notifyAt: 0.85,
		title: [
			{text: 'THE CONVERSATION ENDED.', at: N.start(0)},
			{text: "YOUR MIND DIDN'T.", at: N.start(1) + 0.05},
		],
	},

	memory: {
		word: {at: N.start(2) - 0.1, them: 'so you’re okay with it?', me: 'Sure. Whatever.', word: 'Whatever.'},
		pause: {at: N.start(3) - 0.1},
		face: {at: N.start(4) - 0.1},
		rewind: [N.start(5) - 0.05, N.word(5, 2) + 0.1] as [number, number],
		repeats: [N.word(5, 2) + 0.15, N.word(5, 2) + 0.45],
		dive: N.word(5, 3),
	},

	mind: {
		questions: [
			{text: 'WHAT IF?', at: N.word(5, 4) + 0.2, until: N.word(5, 7) - 0.05},
			{text: 'DID I SAY SOMETHING WRONG?', at: N.word(5, 7), until: N.end(5) + 0.35},
			{text: 'WHY DID THEY LOOK AT ME LIKE THAT?', at: N.start(6) - 0.05, until: N.word(6, 3) + 0.1},
		],
		rings: [
			{cy: 860, rx: 360, ry: 80, speed: 0.9},
			{cy: 1080, rx: 420, ry: 110, speed: -0.7},
			{cy: 1300, rx: 380, ry: 95, speed: 1.1},
		] as Ring[],
		fragments: [
			{ring: 0, phase: 0.3, kind: 'bubble', text: 'whatever.'},
			{ring: 0, phase: 2.4, kind: 'shard'},
			{ring: 0, phase: 4.2, kind: 'bubble', text: '…'},
			{ring: 1, phase: 1.1, kind: 'bubble', text: 'sure.'},
			{ring: 1, phase: 2.9, kind: 'shard'},
			{ring: 1, phase: 4.0, kind: 'bubble', text: 'what did you mean?'},
			{ring: 1, phase: 5.4, kind: 'dot'},
			{ring: 2, phase: 0.8, kind: 'shard'},
			{ring: 2, phase: 2.2, kind: 'bubble', text: 'haha ok'},
			{ring: 2, phase: 3.6, kind: 'dot'},
			{ring: 2, phase: 5.0, kind: 'bubble', text: '…'},
			{ring: 0, phase: 5.6, kind: 'dot'},
		] as Fragment[],
	},

	corridor: {
		speed: 1.05,
		freezeAt: N.start(12),
		memoryEvery: 3,
	},

	ring: {
		dissolveAt: N.word(12, 6) - 0.05,
		calmAt: N.end(12) + 0.9,
		walk: [N.start(13) + 0.1, N.end(14) + 0.9] as [number, number],
		final: [
			{text: 'STOP', at: N.word(14, 2)},
			{text: 'PRESSING', at: N.word(14, 3)},
		],
		rewindAt: N.word(14, 4),
		fadeOut: T.duration - 0.7,
	},

	hiddenCaptions: [0, 14],
};

export type Video002 = typeof video002;
