import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Burst, Bust, CaseFile, N, Panel, SfxWord, Stamp, talkAmp} from '../components/Noir';
import {pop} from '../components/Toon';
import tlJson from '../data/timeline-014.json';
import {ease, rise, tween} from '../lib/anim';
import {narration, type Timeline} from '../lib/timeline';
import type {NoirEpisodeDef} from '../NoirEpisode';
import {Crowd} from '../scenes/noir/Sets';
import {fonts} from '../theme';
import type {ShotCtx} from '../ToonEpisode';
import {Bunker, ItemCard, STEEL} from './episode013';

const tl = tlJson as Timeline;
const n = narration(tl);
const talk = (t: number, who: string) => talkAmp(tl, t, who);
const push = (t: number, s: number, e: number, a = 1, b = 1.05) => tween(t, [s, e], [a, b], ease.inOut);

const Dim: React.FC<{o?: number}> = ({o = 0.5}) => <AbsoluteFill style={{background: `rgba(14,13,18,${o})`}} />;

/** Handwritten notes that appear on cue. */
const Notes: React.FC<{t: number; items: [string, number][]; x?: number; y?: number; size?: number; color?: string}> = ({t, items, x = 90, y = 740, size = 58, color = N.mustard}) => (
	<>
		{items.map(([text, at], i) => (
			<div key={i} style={{position: 'absolute', left: x, top: y + i * (size + 14), fontFamily: fonts.hand, fontWeight: 700, fontSize: size, color, whiteSpace: 'nowrap', opacity: rise(t, at, 0.2), transform: `translateX(${(1 - rise(t, at, 0.3)) * -40}px) rotate(-2deg)`}}>
				{text}
			</div>
		))}
	</>
);

/** One "reading": the card, a type stamp and handwritten notes, with the Reader on the right. */
const reading = (i: number, line: number, title: string, titleSize: number, notes: [string, number][]): React.FC<ShotCtx> => {
	const R: React.FC<ShotCtx> = ({t, s, e}) => (
		<AbsoluteFill>
			<Bunker t={t} door={1} outside={false} />
			<Dim o={0.55} />
			<AbsoluteFill style={{transform: `scale(${push(t, s, e)})`, transformOrigin: '780px 1100px'}}>
				<Bust who="reader" x={790} y={1760} size={1000} t={t} talk={talk(t, 'reader')} smile={0.4} asym={0.5} browR={0.5} lookX={-0.6} turn={-0.3} light="right" />
			</AbsoluteFill>
			<ItemCard i={i} x={90} y={320} w={430} t={t} at={s + 0.02} />
			<Stamp text={title} x={770} y={480} t={t} at={n.word(line, 2) + 0.1} size={titleSize} rot={-8} color="#ff5a4f" blend="normal" />
			<Notes t={t} items={notes} />
		</AbsoluteFill>
	);
	return R;
};

/** 0 — "You picked one thing. Let me read you." */
const Intro: React.FC<ShotCtx> = ({t, s, e}) => (
	<AbsoluteFill>
		<Bunker t={t} door={1} outside={false} />
		<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 35%, rgba(255,236,190,0.25) 0%, rgba(14,13,18,0.65) 60%)'}} />
		{[0, 1, 2, 3].map((i) => (
			<ItemCard key={i} i={i} x={70 + i * 240} y={560} w={210} t={t} at={s + 0.2 + i * 0.08} />
		))}
		<AbsoluteFill style={{transform: `scale(${push(t, s, e, 1, 1.06)})`, transformOrigin: '540px 1200px'}}>
			<Bust who="reader" x={540} y={1760} size={1080} t={t} talk={talk(t, 'reader')} smile={0.55} asym={0.7} browR={0.7} lookX={0} />
		</AbsoluteFill>
	</AbsoluteFill>
);

const ReadA = reading(0, 1, 'PROTECTOR', 84, [
	['plans for damage', n.word(1, 7)],
	['fix it first ✓', n.word(2, 6)],
	['feel it later…', n.word(2, 9)],
]);
const ReadB = reading(1, 3, 'PROBLEM-SOLVER', 62, [
	['fear → checklist', n.word(3, 9)],
	['☑ water  ☑ food  ☑ exits', n.word(3, 12)],
]);
const ReadC = reading(2, 4, 'CONNECTOR', 84, [
	['not alone', n.word(4, 6)],
	['reach for people', n.word(4, 12)],
]);
const ReadD = reading(3, 6, 'MEANING-KEEPER', 62, [
	['keep the "why"', n.word(6, 5)],
	['comfort < meaning', n.word(6, 9)],
]);

/** 5 — tend-and-befriend (Taylor et al., 2000). */
const Befriend: React.FC<ShotCtx> = ({t, s}) => (
	<AbsoluteFill>
		<Bunker t={t} door={1} outside={false} />
		<Dim o={0.6} />
		<CaseFile x={90} y={330} w={900} h={780} t={t} at={s + 0.05} title="CASE FILE · STRESS" lines={['Taylor et al. (2000)', '"tend-and-befriend"', 'stress → seek connection']}>
			<Crowd x={90} y={330} cols={6} rows={3} cell={110} t={t} at={n.word(5, 3)} dur={0.8} color={N.tealMid} mark={(k) => (k % 3 === 0 ? '♥' : null)} markAt={n.word(5, 13) - 0.2} />
		</CaseFile>
		<Stamp text="CONNECTION" x={680} y={1020} t={t} at={n.word(5, 13)} size={80} rot={-6} />
	</AbsoluteFill>
);

/** 7 — "Coping styles: fix the problem, or protect the feeling." */
const Styles: React.FC<ShotCtx> = ({t, s}) => {
	const l = n.word(7, 4);
	const r = n.word(7, 8);
	return (
		<AbsoluteFill>
			<Burst cx={540} cy={640} t={t} color="#1f2328" bg={STEEL} n={40} spin={3} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 280, textAlign: 'center', fontFamily: fonts.comic, fontSize: 92, color: N.mustard, transform: `scale(${pop(t, s + 0.05, 0.3)})`}}>COPING STYLES</div>
			<Panel x={60} y={420} w={460} h={560} t={t} at={l - 0.2} bg={N.paper} rot={-2} from="left">
				<div style={{position: 'absolute', left: 0, right: 0, top: 24, textAlign: 'center', fontFamily: fonts.comic, fontSize: 64, lineHeight: 1, color: N.ink}}>
					FIX THE
					<br />
					PROBLEM
				</div>
				<ItemCard i={0} x={40} y={200} w={170} t={t} />
				<ItemCard i={1} x={240} y={200} w={170} t={t} />
			</Panel>
			<Panel x={560} y={420} w={460} h={560} t={t} at={r - 0.2} bg={N.paper} rot={2} from="right">
				<div style={{position: 'absolute', left: 0, right: 0, top: 24, textAlign: 'center', fontFamily: fonts.comic, fontSize: 64, lineHeight: 1, color: N.ink}}>
					PROTECT THE
					<br />
					FEELING
				</div>
				<ItemCard i={2} x={40} y={200} w={170} t={t} />
				<ItemCard i={3} x={240} y={200} w={170} t={t} />
			</Panel>
			<div style={{position: 'absolute', left: 90, top: 1030, fontFamily: fonts.mono, fontSize: 24, color: N.paper, opacity: 0.7}}>after Lazarus & Folkman (1984) · simplified</div>
		</AbsoluteFill>
	);
};

/** 8 — "None of them is wrong." */
const NoneWrong: React.FC<ShotCtx> = ({t, s}) => (
	<AbsoluteFill>
		<Bunker t={t} door={1} outside={false} />
		<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 35%, rgba(255,236,190,0.25) 0%, rgba(14,13,18,0.65) 60%)'}} />
		{[0, 1, 2, 3].map((i) => (
			<div key={i}>
				<ItemCard i={i} x={70 + i * 240} y={400} w={210} t={t} />
				<div style={{position: 'absolute', left: 150 + i * 240, top: 470, fontFamily: fonts.comic, fontSize: 120, color: '#5fd17a', WebkitTextStroke: `6px ${N.ink}`, paintOrder: 'stroke fill', transform: `scale(${pop(t, n.word(8, 4) + i * 0.12, 0.3)})`}}>✓</div>
			</div>
		))}
		<Bust who="reader" x={540} y={1760} size={1080} t={t} talk={talk(t, 'reader')} smile={0.6} lookX={0} />
	</AbsoluteFill>
);

/** 9 — "But some of you didn't pick at all. You froze." */
const Froze: React.FC<ShotCtx> = ({t, s, e: end}) => {
	const ice = rise(t, n.word(9, 9) - 0.1, 0.5);
	return (
		<AbsoluteFill>
			<Bunker t={t} door={1} outside={false} />
			<Dim o={0.5} />
			{[0, 1, 2, 3].map((i) => (
				<ItemCard key={i} i={i} x={70 + i * 240} y={400} w={210} t={t} dim={rise(t, n.word(9, 5), 0.4)} />
			))}
			<AbsoluteFill style={{transform: `scale(${push(t, s, end, 1, 1.12)})`, transformOrigin: '540px 900px'}}>
				<Bust who="reader" x={540} y={1800} size={1350} t={t} talk={talk(t, 'reader')} smile={0.1} lids={1.05} lookX={0} browL={0.3} browR={0.3} blink={false} />
			</AbsoluteFill>
			<AbsoluteFill style={{background: `rgba(150,205,240,${0.3 * ice})`, mixBlendMode: 'screen'}} />
			<AbsoluteFill style={{background: `radial-gradient(ellipse at center, transparent 45%, rgba(230,245,255,${0.85 * ice}) 100%)`}} />
			<SfxWord text="FROZE." x={540} y={420} t={t} at={n.word(9, 9)} size={190} color="#bfe3f2" rot={-4} />
		</AbsoluteFill>
	);
};

/** 10 — "That's part three." */
const Part3: React.FC<ShotCtx> = ({t, s}) => {
	const rp = pop(t, n.word(10, 1) - 0.1, 0.4);
	return (
		<AbsoluteFill>
			<Burst cx={540} cy={600} t={t} color="#1f2328" bg={STEEL} n={40} spin={3} />
			{rp > 0 ? (
				<div style={{position: 'absolute', left: 150, top: 380, transform: `scale(${rp}) rotate(-5deg)`}}>
					<svg width={700} height={220} style={{overflow: 'visible'}}>
						<path d="M0 20 H560 L690 110 L560 200 H0 Z" fill={N.red} stroke={N.ink} strokeWidth={12} strokeLinejoin="round" />
					</svg>
					<div style={{position: 'absolute', left: 40, top: 30, fontFamily: fonts.comic, fontSize: 150, color: N.white, WebkitTextStroke: `7px ${N.ink}`, paintOrder: 'stroke fill', whiteSpace: 'nowrap'}}>PART 3</div>
				</div>
			) : null}
			<div style={{position: 'absolute', left: 0, right: 0, top: 680, textAlign: 'center', fontFamily: fonts.hand, fontWeight: 700, fontSize: 70, color: N.mustard, opacity: rise(t, n.word(10, 2), 0.3), transform: 'rotate(-3deg)'}}>follow so you don't miss it</div>
			<Bust who="reader" x={540} y={1760} size={1000} t={t} talk={talk(t, 'reader')} smile={0.55} asym={0.8} browR={0.8} lookX={0.2} />
		</AbsoluteFill>
	);
};

export const episode014: NoirEpisodeDef = {
	id: '014',
	timeline: tl,
	audioDir: 'audio/v014',
	hook: 'PART 2: YOUR PICK, DECODED',
	hookUntil: 2.4,
	shots: [
		{at: 0, C: Intro, cut: 'none'},
		{at: n.start(1) - 0.15, C: ReadA},
		{at: n.start(3) - 0.15, C: ReadB},
		{at: n.start(4) - 0.15, C: ReadC},
		{at: n.start(5) - 0.15, C: Befriend},
		{at: n.start(6) - 0.15, C: ReadD},
		{at: n.start(7) - 0.15, C: Styles},
		{at: n.start(8) - 0.15, C: NoneWrong},
		{at: n.start(9) - 0.15, C: Froze},
		{at: n.start(10) - 0.15, C: Part3},
	],
	sfx: [
		['rumble', 0.0, 0.35],
		['pop', 0.3, 0.25],
		['whoosh', n.start(1) - 0.18, 0.3],
		['stamp', n.word(1, 2) + 0.1, 0.5],
		['scribble', n.word(2, 6), 0.25],
		['whoosh', n.start(3) - 0.18, 0.3],
		['stamp', n.word(3, 2) + 0.1, 0.5],
		['scribble', n.word(3, 12), 0.3],
		['whoosh', n.start(4) - 0.18, 0.3],
		['stamp', n.word(4, 2) + 0.1, 0.5],
		['paper', n.start(5) - 0.1, 0.4],
		['stamp', n.word(5, 13), 0.5],
		['whoosh', n.start(6) - 0.18, 0.3],
		['stamp', n.word(6, 2) + 0.1, 0.5],
		['swish', n.word(7, 4) - 0.2, 0.3],
		['swish', n.word(7, 8) - 0.2, 0.3],
		['ding', n.word(8, 4), 0.3],
		['ding', n.word(8, 4) + 0.24, 0.25],
		['heart', n.word(9, 5), 0.5],
		['heart', n.word(9, 5) + 0.8, 0.55],
		['whoosh', n.start(10) - 0.18, 0.3],
		['stamp', n.word(10, 1) - 0.1, 0.45],
	],
	music: 0.28,
};
