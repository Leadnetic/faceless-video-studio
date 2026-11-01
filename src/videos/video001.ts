import timelineJson from '../data/timeline.json';
import type {BubbleSpec} from '../components/Messaging';
import {narration, type Timeline} from '../lib/timeline';

export const timeline = timelineJson as Timeline;
const N = narration(timeline);

/** Every timing below is anchored to narration, so re-recording the voice re-times the film. */
export const video001 = {
	timeline,
	kicker: 'One word changes everything',
	hook: {word: 'NO', impactAt: N.start(1)},
	scenes: {
		hook: [0, N.start(2) - 0.1],
		availability: [N.start(2) - 0.5, N.start(5) - 0.05],
		refusal: [N.start(5) - 0.45, N.start(6) - 0.05],
		silence: [N.start(6) - 0.45, N.start(8) - 0.1],
		pattern: [N.start(8) - 0.5, N.start(10) - 0.15],
		respect: [N.start(10) - 0.55, timeline.duration],
	} as Record<string, [number, number]>,

	availability: [
		{from: 'them', text: 'you up?', at: N.start(2) - 0.15, y: 330, time: '23:48'},
		{from: 'me', text: "Yes, I'm here.", at: N.word(2, 2) - 0.05, y: 480, time: '23:48'},
		{from: 'them', text: 'need a favour', at: N.word(2, 4) - 0.05, y: 960, inset: 110, time: '00:12'},
		{from: 'me', text: 'Of course.', at: N.end(2), y: 1090, inset: 190, time: '00:12'},
		{from: 'them', text: 'come on, just this once', at: N.start(3), y: 330, time: '01:37'},
		{from: 'me', text: 'Okay. Fine.', at: N.word(3, 2), y: 480, time: '01:38'},
		{from: 'them', text: "knew you'd say yes", at: N.end(3) - 0.05, y: 960, inset: 110, time: '01:40'},
		{from: 'me', text: 'Sure.', at: N.start(4), y: 320, time: '06:02'},
		{from: 'me', text: 'No problem.', at: N.start(4) + 0.32, y: 470, time: '07:15'},
		{from: 'me', text: 'On my way.', at: N.start(4) + 0.64, y: 620, time: '12:30'},
		{from: 'me', text: 'Anytime.', at: N.end(4) - 0.05, y: 1060, inset: 190, time: '22:58'},
	].map((b, i, all) => ({...b, until: Math.min(b.at + 1.9, (all[i + 2]?.at ?? b.at + 1.9) + 0.25)})) as BubbleSpec[],

	refusal: {
		typing: [N.start(5) + 0.25, N.word(5, 5) - 0.12] as [number, number],
		sendAt: N.word(5, 5) - 0.1,
		text: 'No.',
		time: '23:50',
	},

	silence: [
		{from: 'them', text: 'ok.', at: N.start(6) + 0.2, until: N.start(7) + 0.4, y: 420, inset: 150, time: '23:58'},
		{from: 'them', text: 'fine.', at: N.word(6, 3) - 0.1, until: N.start(7) + 1.0, y: 600, inset: 150, time: '02:14', scale: 0.9},
		{from: 'them', text: 'k', at: N.start(7) + 0.1, until: N.end(7) + 0.3, y: 770, inset: 150, time: 'Tue 14:03', scale: 0.8},
	] as BubbleSpec[],
	silenceTyping: [N.word(7, 2) + 0.1, N.end(7) + 0.5] as [number, number],

	pattern: {reactionAt: N.start(8) + 0.15, patternAt: N.start(9) + 0.1},

	respect: {
		yesAt: N.start(10) + 0.3,
		noAt: N.word(10, 4),
		yesGlowAt: N.word(10, 8) - 0.1,
		shiftAt: N.end(10) - 0.1,
		cardAt: N.start(11) - 0.2,
		lines: ['Watch what happens', 'when you say'],
		lineAt: [N.start(11), N.word(11, 3)],
		finalAt: N.word(11, 6) - 0.05,
	},
	hiddenCaptions: [1, 11],
};

export type VideoConfig = typeof video001;
