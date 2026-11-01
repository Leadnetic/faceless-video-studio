import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {Annot, Burst, Bust, CaseFile, N, Panel, SfxWord, Stamp, talkAmp} from '../components/Noir';
import {pop} from '../components/Toon';
import tlJson from '../data/timeline-016.json';
import {ease, keys, rise, tween} from '../lib/anim';
import {narration, type Timeline} from '../lib/timeline';
import type {NoirEpisodeDef} from '../NoirEpisode';
import {LoadBar} from '../scenes/noir/Sets';
import {fonts} from '../theme';
import type {ShotCtx} from '../ToonEpisode';

const tl = tlJson as Timeline;
const n = narration(tl);
const talk = (t: number, who: string) => talkAmp(tl, t, who);
const push = (t: number, s: number, e: number, a = 1, b = 1.06) => tween(t, [s, e], [a, b], ease.inOut);

/** Late-night diner: rain on the window, neon, red booths. */
const Diner: React.FC<{t: number; neon?: number}> = ({t, neon = 1}) => (
	<AbsoluteFill style={{background: 'linear-gradient(180deg, #1c3436 0%, #10201f 100%)'}}>
		{/* window */}
		<div style={{position: 'absolute', left: 60, top: 230, width: 960, height: 760, background: 'linear-gradient(180deg, #0b1218 0%, #1b2a3a 100%)', border: `14px solid ${N.ink}`, overflow: 'hidden'}}>
			{new Array(36).fill(0).map((_, i) => (
				<div key={i} style={{position: 'absolute', left: (i * 83) % 960, top: ((i * 131 + t * 700) % 900) - 60, width: 3, height: 46, background: 'rgba(190,220,240,0.35)', transform: 'rotate(10deg)'}} />
			))}
			{new Array(8).fill(0).map((_, i) => (
				<div key={`b${i}`} style={{position: 'absolute', left: random(`bk${i}`) * 900, top: 300 + random(`bt${i}`) * 300, width: 60 + random(`bw${i}`) * 80, height: 60 + random(`bw${i}`) * 80, borderRadius: '50%', background: ['rgba(255,90,79,0.25)', 'rgba(226,179,60,0.25)', 'rgba(120,200,220,0.2)'][i % 3], filter: 'blur(6px)'}} />
			))}
			<div style={{position: 'absolute', left: 470, top: 0, bottom: 0, width: 14, background: N.ink}} />
		</div>
		{/* neon */}
		<div style={{position: 'absolute', right: 110, top: 270, fontFamily: fonts.comic, fontSize: 90, color: '#ff6b5f', textShadow: `0 0 18px rgba(255,80,70,${0.8 * neon}), 0 0 40px rgba(255,80,70,${0.5 * neon})`, opacity: 0.7 + 0.3 * Math.abs(Math.sin(t * 9)) * neon, transform: 'rotate(-4deg)'}}>OPEN</div>
		{/* booth backs */}
		<div style={{position: 'absolute', left: -40, right: -40, top: 1000, height: 260, background: '#8e2a33', border: `10px solid ${N.ink}`, borderRadius: '50px 50px 0 0', boxShadow: 'inset 0 -40px 0 rgba(0,0,0,0.25)'}} />
		<div style={{position: 'absolute', left: -40, right: -40, top: 1250, bottom: 0, background: '#4a1a20'}} />
	</AbsoluteFill>
);

/** 0 — someone's staring at you. */
const Starer: React.FC<ShotCtx> = ({t, s, e}) => (
	<AbsoluteFill>
		<Diner t={t} />
		<AbsoluteFill style={{transform: `scale(${push(t, s, e, 1, 1.12)})`, transformOrigin: '540px 700px'}}>
			<Bust who="suspect" x={540} y={1700} size={1400} t={t} lids={0.72} knit={0.7} smile={-0.15} lookX={0} blink={false} light="right" />
		</AbsoluteFill>
	</AbsoluteFill>
);

/** 1–2 — stare back or stare at the floor: both lose. */
const Options: React.FC<ShotCtx> = ({t}) => {
	const back = n.word(1, 7);
	const floor = n.word(1, 10);
	const lose = n.word(2, 4);
	return (
		<AbsoluteFill>
			<Diner t={t} neon={0.6} />
			<AbsoluteFill style={{background: 'rgba(14,13,18,0.45)'}} />
			<Panel x={50} y={300} w={480} h={640} t={t} at={back - 0.2} bg="#2b2e36" rot={-2} from="left">
				<Bust who="client" x={240} y={720} size={640} t={t} knit={1} lids={0.7} smile={-0.3} lookX={0.5} blink={false} />
				<div style={{position: 'absolute', left: 0, right: 0, top: 18, textAlign: 'center', fontFamily: fonts.comic, fontSize: 64, color: N.mustard}}>STARE BACK</div>
			</Panel>
			<Panel x={550} y={300} w={480} h={640} t={t} at={floor - 0.2} bg="#2b2e36" rot={2} from="right">
				<Bust who="client" x={240} y={720} size={640} t={t} lids={0.55} lookY={1} lookX={-0.3} blush={0.7} tilt={8} />
				<div style={{position: 'absolute', left: 0, right: 0, top: 18, textAlign: 'center', fontFamily: fonts.comic, fontSize: 64, color: N.mustard}}>LOOK DOWN</div>
			</Panel>
			<Annot x={70} y={330} w={440} h={590} t={t} at={lose - 0.1} kind="cross" color={N.red} width={16} />
			<Annot x={570} y={330} w={440} h={590} t={t} at={lose + 0.1} kind="cross" color={N.red} width={16} />
			<SfxWord text="HE WINS." x={540} y={1060} t={t} at={lose} size={120} color={N.red} rot={-4} />
		</AbsoluteFill>
	);
};

/** 3–4 — 1972: stared-at drivers leave the light faster. */
const Traffic: React.FC<ShotCtx> = ({t, s}) => {
	const green = n.word(4, 4);
	const isGreen = t >= green;
	const fast = n.word(4, 11);
	const carA = isGreen ? tween(t, [green + 0.2, green + 1.6], [0, 1300], ease.in) : 0;
	const carB = isGreen ? tween(t, [fast - 0.25, fast + 0.5], [0, 1500], ease.in) : 0;
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: 'linear-gradient(180deg, #0d1620 0%, #1b2a3a 36%, #2a2a30 36%, #1d1d22 100%)'}} />
			{/* road lines */}
			{[0, 1, 2, 3, 4, 5].map((i) => (
				<div key={i} style={{position: 'absolute', left: i * 200 - 40, top: 950, width: 120, height: 14, background: N.paper, opacity: 0.6}} />
			))}
			{/* traffic light */}
			<div style={{position: 'absolute', left: 820, top: 300, width: 150, height: 400, background: N.ink, borderRadius: 30, border: `6px solid #3a3f45`}}>
				{[0, 1, 2].map((i) => {
					const on = (i === 0 && !isGreen) || (i === 2 && isGreen);
					const col = ['#ff3b30', '#ffcc33', '#3ee07a'][i];
					return <div key={i} style={{position: 'absolute', left: 25, top: 20 + i * 125, width: 100, height: 100, borderRadius: '50%', background: on ? col : '#2a2d31', boxShadow: on ? `0 0 40px ${col}` : undefined}} />;
				})}
			</div>
			<div style={{position: 'absolute', left: 885, top: 700, width: 20, height: 500, background: N.ink}} />
			{/* cars */}
			{[0, 1].map((i) => {
				const dx = i === 0 ? carA : carB;
				const y = i === 0 ? 760 : 980;
				return (
					<div key={i} style={{position: 'absolute', left: 120 + dx - i * 60, top: y, width: 380, height: 150}}>
						<svg width={380} height={150} viewBox="0 0 380 150">
							<path d="M20 110 L20 70 Q30 50 70 48 L120 18 Q140 8 180 8 L250 8 Q280 10 300 40 L350 52 Q370 58 370 80 L370 110 Z" fill={i === 1 ? N.red : N.tealLight} stroke={N.ink} strokeWidth={8} strokeLinejoin="round" />
							<path d="M130 26 L180 18 L245 18 L280 46 L120 46 Z" fill="#9fd3e6" stroke={N.ink} strokeWidth={5} />
							<circle cx={90} cy={112} r={30} fill={N.ink} />
							<circle cx={300} cy={112} r={30} fill={N.ink} />
						</svg>
						{dx > 30 ? new Array(4).fill(0).map((_, k) => <div key={k} style={{position: 'absolute', left: -120 - k * 40, top: 30 + k * 26, width: 110, height: 8, background: N.paper, opacity: 0.5}} />) : null}
						<div style={{position: 'absolute', left: 110, top: -58, fontFamily: fonts.comic, fontSize: 44, color: i === 1 ? '#ff8a80' : N.paper, opacity: dx > 0 ? 0 : 1}}>{i === 1 ? 'STARED AT' : 'NORMAL'}</div>
					</div>
				);
			})}
			{/* the starer on the corner */}
			<div style={{position: 'absolute', left: 620, top: 660, opacity: rise(t, n.word(3, 7) - 0.1, 0.3)}}>
				<Bust who="suspect" x={0} y={240} size={300} t={t} solid={N.ink} />
				<div style={{position: 'absolute', left: -30, top: -60, width: 260, fontFamily: fonts.hand, fontWeight: 700, fontSize: 44, color: N.mustard, transform: 'rotate(-6deg)'}}>👀 staring</div>
			</div>
			<Stamp text="1972" x={250} y={380} t={t} at={n.word(3, 1)} size={110} rot={-8} color="#ff6b5f" blend="normal" />
			<div style={{position: 'absolute', left: 120, top: 520, fontFamily: fonts.mono, fontSize: 30, color: N.paper, opacity: rise(t, n.word(3, 2), 0.3)}}>Ellsworth, Carlsmith & Henson</div>
			<SfxWord text="FASTER!" x={540} y={620} t={t} at={fast} size={140} color={N.mustard} rot={-6} />
		</AbsoluteFill>
	);
};

/** 5–6 — a stare = threat alarm. */
const Alert: React.FC<ShotCtx> = ({t}) => {
	const v = keys(t, [[n.start(5), 0.25], [n.word(5, 8), 0.55], [n.word(5, 11), 0.85], [n.word(6, 6), 1.0]]);
	return (
		<AbsoluteFill>
			<Burst cx={540} cy={700} t={t} color="#3a1a20" bg="#2a1218" n={40} spin={3} />
			<div style={{position: 'absolute', left: 90, top: 300, width: 540}}>
				{[['CHALLENGE?', n.word(5, 8)], ['THREAT?', n.word(5, 11)], ['MOVE!', n.word(5, 16)]].map(([w, at], i) => (
					<div key={w as string} style={{fontFamily: fonts.comic, fontSize: 104, color: i === 2 ? N.mustard : '#ff6b5f', transform: `scale(${pop(t, (at as number) - 0.1, 0.3)}) rotate(${(i - 1) * 3}deg)`, transformOrigin: 'left center', marginBottom: 30}}>
						{w}
					</div>
				))}
			</div>
			<LoadBar x={720} y={330} w={170} h={620} v={v} label="ALERT" over={v > 0.95} t={t} />
			<SfxWord text="THAT'S THE TRICK." x={460} y={1080} t={t} at={n.word(6, 9)} size={84} color={N.paper} rot={-3} />
		</AbsoluteFill>
	);
};

/** 7 — "So don't play his game. Here's what I do." */
const Enter: React.FC<ShotCtx> = ({t, s, e}) => (
	<AbsoluteFill>
		<Diner t={t} />
		<AbsoluteFill style={{transform: `scale(${push(t, s, e)})`, transformOrigin: '540px 900px'}}>
			<Bust who="reader" x={540} y={1740} size={1350} t={t} talk={talk(t, 'reader')} smile={0.5} asym={0.7} browR={0.6} lookX={0} style={{transform: `translateX(${(1 - rise(t, s, 0.35)) * 500}px)`}} />
		</AbsoluteFill>
	</AbsoluteFill>
);

/** A numbered step card with the Reader demonstrating it. */
const step = (k: number, line: number, title: string, sub: string, pose: (t: number) => {lids?: number; lookX?: number; lookY?: number; tilt?: number; smile?: number; turn?: number}): React.FC<ShotCtx> => {
	const S: React.FC<ShotCtx> = ({t, s}) => {
		const p = pose(t);
		return (
			<AbsoluteFill>
				<Diner t={t} neon={0.5} />
				<AbsoluteFill style={{background: 'rgba(14,13,18,0.35)'}} />
				<Bust who="reader" x={560} y={1760} size={1150} t={t} talk={talk(t, 'reader')} smile={p.smile ?? 0.3} lids={p.lids ?? 1} lookX={p.lookX ?? 0} lookY={p.lookY ?? 0} tilt={p.tilt ?? 0} turn={p.turn ?? 0} />
				<Panel x={90} y={300} w={900} h={250} t={t} at={s + 0.05} bg={N.mustard} rot={-2}>
					<div style={{position: 'absolute', left: 30, top: 18, width: 170, height: 210, background: N.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.comic, fontSize: 170, color: N.mustard}}>{k}</div>
					<div style={{position: 'absolute', left: 230, top: 30, right: 20, fontFamily: fonts.comic, fontSize: 76, lineHeight: 1, color: N.ink}}>{title}</div>
					<div style={{position: 'absolute', left: 232, top: 150, right: 20, fontFamily: fonts.hand, fontWeight: 700, fontSize: 48, color: N.ink, opacity: rise(t, n.word(line, 4), 0.3)}}>{sub}</div>
				</Panel>
			</AbsoluteFill>
		);
	};
	return S;
};

const Step1 = step(1, 8, 'BREATHE OUT, RELAX FACE', 'calm reads as confident', (t) => ({lids: keys(t, [[n.word(8, 1), 1], [n.word(8, 3), 0.45], [n.word(8, 8), 0.8]]), smile: 0.2}));
const Step2 = step(2, 9, '1 SECOND + SMALL NOD', 'like you just noticed him', (t) => ({lookX: 0, tilt: Math.max(0, Math.sin((t - n.word(9, 10)) * 8)) * (t > n.word(9, 10) && t < n.word(9, 10) + 0.8 ? 6 : 0), smile: 0.35}));
const Step3 = step(3, 10, 'LOOK TO THE SIDE', 'slowly. never down.', (t) => ({lookX: tween(t, [n.word(10, 1), n.word(10, 3)], [0, 1], ease.inOut), turn: tween(t, [n.word(10, 1), n.word(10, 3)], [0, 0.4], ease.inOut), smile: 0.3}));

/** 11 — "Can I help you?" */
const Ask: React.FC<ShotCtx> = ({t}) => (
	<AbsoluteFill>
		<Diner t={t} />
		<Bust who="suspect" x={830} y={1350} size={760} t={t} lids={0.75} knit={0.6} lookX={-0.7} light="right" />
		<Bust who="reader" x={320} y={1760} size={1150} t={t} talk={talk(t, 'reader')} smile={0.55} browR={0.5} lookX={0.7} turn={0.35} />
		<SfxWord text={'"CAN I\nHELP YOU?"'} x={340} y={480} t={t} at={n.word(11, 8)} size={110} color={N.white} rot={-4} />
	</AbsoluteFill>
);

/** 12 — the starer backs down. */
const Backs: React.FC<ShotCtx> = ({t}) => (
	<AbsoluteFill>
		<Diner t={t} />
		<Bust who="suspect" x={540} y={1720} size={1450} t={t} talk={talk(t, 'suspect')} smile={-0.2} lookY={0.9} lookX={-0.5} lids={0.7} blush={0.8} sweat={0.6} tilt={6} />
		<SfxWord text="…" x={820} y={460} t={t} at={n.start(12)} size={180} color={N.white} rot={8} />
	</AbsoluteFill>
);

/** 13 — stares only work in silence; danger = leave. */
const Rule: React.FC<ShotCtx> = ({t}) => {
	const leave = n.word(13, 16);
	return (
		<AbsoluteFill>
			<Diner t={t} neon={0.6} />
			<AbsoluteFill style={{background: 'rgba(14,13,18,0.45)'}} />
			<Bust who="reader" x={360} y={1760} size={1100} t={t} talk={talk(t, 'reader')} smile={0.2} lookX={0.4} />
			<Panel x={110} y={300} w={860} h={200} t={t} at={n.word(13, 0) - 0.1} bg={N.white} rot={-2}>
				<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.comic, fontSize: 74, color: N.ink}}>STARES NEED SILENCE</div>
			</Panel>
			<Panel x={600} y={600} w={380} h={300} t={t} at={n.word(13, 10) - 0.1} bg="#1f6b3a" rot={3}>
				<div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.comic, color: N.white}}>
					<div style={{fontSize: 56}}>DANGER?</div>
					<div style={{fontSize: 110, transform: `scale(${pop(t, leave - 0.1, 0.3)})`}}>EXIT →</div>
				</div>
			</Panel>
		</AbsoluteFill>
	);
};

/** 14–15 — comment CTA + tomorrow teaser. */
const Cta: React.FC<ShotCtx> = ({t, s}) => {
	const at = n.word(14, 0);
	const p = tween(t, [at, at + 0.5], [0, 1], ease.out);
	const tm = n.word(15, 0);
	return (
		<AbsoluteFill>
			<Diner t={t} />
			<Bust who="reader" x={400} y={1720} size={1300} t={t} talk={talk(t, 'reader')} smile={0.6} asym={0.8} browR={0.8} lookX={0.4} />
			<div style={{position: 'absolute', left: 660, top: 720, fontFamily: fonts.hand, fontWeight: 700, fontSize: 60, lineHeight: 1.0, color: N.mustard, transform: `rotate(-6deg) scale(${pop(t, at, 0.3)})`, textAlign: 'center'}}>
				weirdest
				<br />
				stare?
			</div>
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
				<path d="M790 860 C890 930 915 1030 935 1110" stroke={N.mustard} strokeWidth={12} fill="none" strokeLinecap="round" strokeDasharray={330} strokeDashoffset={330 * (1 - p)} />
				{p > 0.95 ? <path d="M905 1085 L938 1120 L955 1070" stroke={N.mustard} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
			</svg>
			<Panel x={100} y={310} w={880} h={220} t={t} at={tm - 0.1} bg={N.ink} rot={-3}>
				<div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
					<div style={{fontFamily: fonts.mono, fontSize: 32, color: N.paper, letterSpacing: 6}}>TOMORROW · CASE FILE</div>
					<div style={{fontFamily: fonts.comic, fontSize: 96, color: N.mustard}}>"TOO CLOSE"</div>
				</div>
			</Panel>
		</AbsoluteFill>
	);
};

export const episode016: NoirEpisodeDef = {
	id: '016',
	timeline: tl,
	audioDir: 'audio/v016',
	hook: 'IF SOMEONE STARES AT YOU…',
	hookUntil: 3.4,
	shots: [
		{at: 0, C: Starer, cut: 'none'},
		{at: n.start(1) - 0.12, C: Options},
		{at: n.start(3) - 0.15, C: Traffic},
		{at: n.start(5) - 0.12, C: Alert},
		{at: n.start(7) - 0.12, C: Enter},
		{at: n.start(8) - 0.12, C: Step1},
		{at: n.start(9) - 0.12, C: Step2},
		{at: n.start(10) - 0.12, C: Step3},
		{at: n.start(11) - 0.12, C: Ask},
		{at: n.start(12) - 0.12, C: Backs},
		{at: n.start(13) - 0.12, C: Rule},
		{at: n.start(14) - 0.12, C: Cta},
	],
	sfx: [
		['heart', 0.4, 0.45],
		['heart', 1.4, 0.5],
		['heart', 2.4, 0.55],
		['whoosh', n.start(1) - 0.15, 0.3],
		['swish', n.word(1, 7) - 0.2, 0.3],
		['swish', n.word(1, 10) - 0.2, 0.3],
		['buzzer', n.word(2, 4), 0.25],
		['swish', n.start(3) - 0.15, 0.3],
		['stamp', n.word(3, 1), 0.5],
		['ding', n.word(4, 4), 0.35],
		['whoosh', n.word(4, 4) + 0.2, 0.3],
		['whoosh', n.word(4, 11) - 0.25, 0.4],
		['alarm', n.start(5), 0.18],
		['pop', n.word(5, 8) - 0.1, 0.25],
		['pop', n.word(5, 11) - 0.1, 0.25],
		['pop', n.word(5, 16) - 0.1, 0.25],
		['whoosh', n.start(7) - 0.15, 0.3],
		['stamp', n.start(8) - 0.05, 0.4],
		['stamp', n.start(9) - 0.05, 0.4],
		['stamp', n.start(10) - 0.05, 0.4],
		['zing', n.word(11, 8), 0.3],
		['sting', n.start(12) - 0.05, 0.35],
		['pop', n.word(13, 0) - 0.1, 0.25],
		['pop', n.word(13, 10) - 0.1, 0.3],
		['pop', n.start(14), 0.25],
		['stamp', n.word(15, 0) - 0.1, 0.4],
	],
	music: 0.28,
};
