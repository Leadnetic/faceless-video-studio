import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Annot, Burst, Bust, N, Panel, SfxWord, talkAmp} from '../components/Noir';
import {pop} from '../components/Toon';
import tlJson from '../data/timeline-012.json';
import {ease, rise, tween} from '../lib/anim';
import {narration, type Timeline} from '../lib/timeline';
import type {NoirEpisodeDef} from '../NoirEpisode';
import {BrandVoid, Interrogation, Notepad, PaperDesk, Pen} from '../scenes/noir/Sets';
import {fonts} from '../theme';
import type {ShotCtx} from '../ToonEpisode';

const tl = tlJson as Timeline;
const n = narration(tl);
const talk = (t: number, who: string) => talkAmp(tl, t, who);
const push = (t: number, s: number, e: number, a = 1, b = 1.06) => tween(t, [s, e], [a, b], ease.inOut);

/* ------------------------------------------------------------------ pen-top trails */

type Pt = [number, number];
const LETTERS: Record<string, Pt[][]> = {
	M: [[[0, 120], [0, 0], [50, 70], [100, 0], [100, 120]]],
	A: [[[0, 120], [50, 0], [100, 120]], [[22, 72], [78, 72]]],
	X: [[[0, 0], [100, 120]], [[100, 0], [0, 120]]],
};
const word = (w: string, gap = 140): Pt[][] => w.split('').flatMap((ch, i) => LETTERS[ch].map((st) => st.map(([x, y]) => [x + i * gap, y] as Pt)));
const segLen = (a: Pt, b: Pt) => Math.hypot(b[0] - a[0], b[1] - a[1]);

/** Partial polylines for progress p, plus the current tip point. */
const trace = (strokes: Pt[][], p: number) => {
	const total = strokes.reduce((acc, st) => acc + st.slice(1).reduce((a, pt, i) => a + segLen(st[i], pt), 0), 0);
	let left = total * Math.max(0, Math.min(1, p));
	const out: Pt[][] = [];
	let tip: Pt = strokes[0][0];
	for (const st of strokes) {
		if (left <= 0) break;
		const part: Pt[] = [st[0]];
		tip = st[0];
		for (let i = 1; i < st.length; i++) {
			const l = segLen(st[i - 1], st[i]);
			if (left >= l) {
				part.push(st[i]);
				tip = st[i];
				left -= l;
			} else {
				const k = left / l;
				tip = [st[i - 1][0] + (st[i][0] - st[i - 1][0]) * k, st[i - 1][1] + (st[i][1] - st[i - 1][1]) * k];
				part.push(tip);
				left = 0;
				break;
			}
		}
		out.push(part);
	}
	return {parts: out, tip};
};

const Trail: React.FC<{strokes: Pt[][]; p: number; x: number; y: number; scale: number; color?: string; width?: number; dot?: boolean}> = ({strokes, p, x, y, scale, color = N.mustard, width = 14, dot = true}) => {
	const {parts, tip} = trace(strokes, p);
	return (
		<svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
			<g transform={`translate(${x} ${y}) scale(${scale})`}>
				{parts.map((pt, i) => (
					<polyline key={i} points={pt.map((q) => q.join(',')).join(' ')} fill="none" stroke={color} strokeWidth={width / scale} strokeLinecap="round" strokeLinejoin="round" opacity={0.95} />
				))}
				{dot && p > 0 && p < 1 ? <circle cx={tip[0]} cy={tip[1]} r={16 / scale} fill={N.white} stroke={N.ink} strokeWidth={5 / scale} /> : null}
			</g>
		</svg>
	);
};

/** Detective's writing: pen top position along "MAX" for progress p (tip hidden behind the pad). */
const writing = (p: number) => {
	const {tip} = trace(word('MAX'), p);
	return tip;
};

/* ------------------------------------------------------------------ shots */

/** 0 — "Write a name. Any name. I won't look at the paper." */
const Setup: React.FC<ShotCtx> = ({t, s, e}) => {
	const away = rise(t, n.word(0, 5) - 0.1, 0.4);
	return (
		<AbsoluteFill>
			<Interrogation t={t} />
			<AbsoluteFill style={{transform: `scale(${push(t, s, e, 1, 1.05)})`, transformOrigin: '540px 900px'}}>
				<Bust who="detective" x={800} y={1430} size={860} t={t} smile={-0.1} knit={0.4} light="right" lookX={-0.6} />
				<Pen x={790} y={1230} len={330} angle={-14} />
				<Notepad x={640} y={1070} w={340} h={360} rot={-6} />
				<Bust who="reader" x={300} y={1640} size={1100} t={t} talk={talk(t, 'reader')} smile={0.45} asym={0.5} browR={0.4} lookX={0.5 - away * 0.3} lookY={-away * 0.9} tilt={-away * 6} />
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

/** 1 — "Fine. Done." The pad from behind; only the top of the pen moves. */
const Scribble: React.FC<ShotCtx> = ({t, s}) => {
	const p = tween(t, [n.start(1) - 0.1, n.word(1, 1) + 0.15], [0, 1], (x) => x);
	const [mx, my] = writing(p);
	const tipX = 420 + mx * 0.35;
	const tipY = 1010 + my * 0.35;
	const ang = -18 + (mx / 400 - 0.5) * 10;
	const topX = tipX + Math.sin((ang * Math.PI) / 180) * 560;
	const topY = tipY - Math.cos((ang * Math.PI) / 180) * 560;
	const samples = new Array(41).fill(0).map((_, i) => {
		const q = (p * i) / 40;
		const [qx, qy] = writing(q);
		const a = -18 + (qx / 400 - 0.5) * 10;
		return [420 + qx * 0.35 + Math.sin((a * Math.PI) / 180) * 560, 1010 + qy * 0.35 - Math.cos((a * Math.PI) / 180) * 560];
	});
	return (
		<AbsoluteFill>
			<Interrogation t={t} lamp={false} table={false} />
			<Pen x={tipX} y={tipY} len={600} angle={ang} />
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
				<polyline points={samples.map((q) => q.join(',')).join(' ')} fill="none" stroke={N.mustard} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" opacity={0.8} strokeDasharray="2 16" />
			</svg>
			<Notepad x={220} y={780} w={640} h={560} rot={-3} />
			<Annot x={topX - 70} y={topY - 70} w={140} h={140} t={t} at={s + 0.5} color={N.mustard} label="watch this" labelX={150} labelY={10} labelSize={56} />
		</AbsoluteFill>
	);
};

/** 2 — "Short name. Three letters." */
const Three: React.FC<ShotCtx> = ({t, s}) => (
	<AbsoluteFill>
		<Interrogation t={t} table={false} />
		<Bust who="reader" x={540} y={1760} size={1500} t={t} talk={talk(t, 'reader')} smile={0.3} asym={0.4} lids={0.85} lookX={Math.sin(t * 5) * 0.5} lookY={-0.5} browL={0.3} />
		<div style={{position: 'absolute', left: 0, right: 0, top: 330, display: 'flex', justifyContent: 'center', gap: 34}}>
			{[0, 1, 2].map((i) => {
				const p = pop(t, n.word(2, 2) + i * 0.12, 0.3);
				return <div key={i} style={{width: 170, height: 200, background: N.white, border: `8px solid ${N.ink}`, boxShadow: `10px 10px 0 ${N.ink}`, transform: `scale(${p}) rotate(${(i - 1) * 4}deg)`, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', fontFamily: fonts.comic, fontSize: 120, color: N.ink}}>_</div>;
			})}
		</div>
	</AbsoluteFill>
);

/** 3 — "Two mountains. A peak. A cross." The pen-top trails, replayed in the dark. */
const Replay: React.FC<ShotCtx> = ({t}) => {
	const segs: [string, number, number, string, string][] = [
		['M', n.word(3, 2) - 0.2, n.word(3, 3) + 0.4, 'two mountains', '#ffd36b'],
		['A', n.word(3, 4), n.word(3, 6) + 0.3, 'a peak', '#ffd36b'],
		['X', n.word(3, 7), n.word(3, 9) + 0.35, 'a cross', '#ffd36b'],
	];
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: N.ink}} />
			<Interrogation t={t} lamp={false} table={false} blinds={0.25} tone="#0f1a1b" />
			{segs.map(([ch, a, b, label, col], i) => {
				const p = tween(t, [a, b], [0, 1], ease.inOut);
				const x = 110 + i * 300;
				return (
					<div key={ch}>
						<Panel x={x - 20} y={420} w={280} h={360} t={t} at={a - 0.15} bg="#16282a" rot={(i - 1) * 3}>
							<Trail strokes={LETTERS[ch]} p={p} x={50} y={90} scale={1.6} color={col} width={20} />
						</Panel>
						<div style={{position: 'absolute', left: x - 30, width: 300, top: 820, textAlign: 'center', fontFamily: fonts.hand, fontWeight: 700, fontSize: 54, color: N.mustard, transform: `scale(${pop(t, b - 0.2, 0.3)}) rotate(-3deg)`}}>{label}</div>
					</div>
				);
			})}
		</AbsoluteFill>
	);
};

/** 4 — "Max." The pad turns around. */
const Reveal: React.FC<ShotCtx> = ({t, s}) => {
	const flip = tween(t, [s + 0.05, s + 0.35], [0, 1], ease.out);
	return (
		<AbsoluteFill>
			<Burst cx={540} cy={740} t={t} color={N.redDeep} bg={N.red} n={40} spin={6} />
			<div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: `perspective(1800px) rotateY(${(1 - flip) * 90}deg)`, transformOrigin: '540px 740px'}}>
				<Notepad x={200} y={430} w={680} h={600} side="front" text="MAX" reveal={rise(t, s + 0.2, 0.35)} rot={-3} />
			</div>
			<Annot x={290} y={560} w={500} h={340} t={t} at={s + 0.6} color={N.ink} />
		</AbsoluteFill>
	);
};

/** 5 — Detective: "You looked!" */
const Looked: React.FC<ShotCtx> = ({t}) => (
	<AbsoluteFill>
		<Burst cx={540} cy={700} t={t} color={N.tealMid} bg={N.teal} n={48} spin={-10} r0={380} />
		<Bust who="detective" x={540} y={1720} size={1560} t={t} talk={talk(t, 'detective')} open={0.4} smile={-0.5} knit={1} browL={-0.2} browR={-0.2} light="right" lookX={-0.2} />
		<SfxWord text="!!" x={870} y={430} t={t} at={n.start(5)} size={200} color={N.mustard} rot={10} shake />
	</AbsoluteFill>
);

/** 6 — "I watched the pen. Not the paper." */
const Watched: React.FC<ShotCtx> = ({t}) => (
	<AbsoluteFill>
		<Interrogation t={t} table={false} />
		<Bust who="reader" x={360} y={1720} size={1150} t={t} talk={talk(t, 'reader')} smile={0.5} asym={0.7} browR={0.7} lookX={0.6} turn={0.3} />
		<Pen x={700} y={760} len={440} angle={18} />
		<Annot x={760} y={260} w={180} h={180} t={t} at={n.word(6, 3)} color={N.mustard} label="pen ✓" labelX={-200} labelY={40} labelSize={64} />
		<Notepad x={620} y={820} w={300} h={260} side="front" text="" rot={6} />
		<Annot x={620} y={820} w={300} h={260} t={t} at={n.word(6, 6)} kind="cross" color={N.red} width={14} label="paper" labelX={30} labelY={270} labelSize={56} />
	</AbsoluteFill>
);

/** 7 — the lever: the top moves more than the tip. */
const Lever: React.FC<ShotCtx> = ({t}) => {
	const th = Math.sin(t * 2.6) * 11;
	const r = (th * Math.PI) / 180;
	const pivot: Pt = [540, 1080];
	const tip: Pt = [pivot[0] + Math.sin(r) * 70, pivot[1] - Math.cos(r) * 70];
	const top: Pt = [pivot[0] + Math.sin(r) * 760, pivot[1] - Math.cos(r) * 760];
	const arc = (R: number) => `M${pivot[0] + Math.sin(-0.2) * R} ${pivot[1] - Math.cos(-0.2) * R} A${R} ${R} 0 0 1 ${pivot[0] + Math.sin(0.2) * R} ${pivot[1] - Math.cos(0.2) * R}`;
	const lettersAt = n.word(7, 11);
	return (
		<AbsoluteFill>
			<PaperDesk />
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
				<path d={arc(760)} stroke={N.red} strokeWidth={8} fill="none" strokeDasharray="20 14" opacity={rise(t, n.word(7, 5), 0.4)} />
				<path d={arc(70)} stroke={N.tealMid} strokeWidth={8} fill="none" opacity={rise(t, n.word(7, 9), 0.4)} />
			</svg>
			<Pen x={tip[0]} y={tip[1]} len={690} angle={th} />
			<div style={{position: 'absolute', left: tip[0] + Math.sin(r) * 140 - 46, top: tip[1] - Math.cos(r) * 140 - 30, width: 92, height: 60, borderRadius: 30, background: CAST_SKIN, border: `6px solid ${N.ink}`, transform: `rotate(${th}deg)`}} />
			<div style={{position: 'absolute', left: top[0] + 40, top: top[1] - 20, fontFamily: fonts.comic, fontSize: 70, color: N.red, opacity: rise(t, n.word(7, 5), 0.3)}}>TOP: BIG</div>
			<div style={{position: 'absolute', left: tip[0] + 60, top: tip[1] + 10, fontFamily: fonts.comic, fontSize: 56, color: N.tealMid, opacity: rise(t, n.word(7, 9), 0.3)}}>TIP: small</div>
			<div style={{position: 'absolute', left: 90, right: 160, top: 1120, display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center'}}>
				{'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((ch, i) => (
					<span key={ch} style={{fontFamily: fonts.hand, fontWeight: 700, fontSize: 44, color: N.ink, opacity: rise(t, lettersAt + i * 0.03, 0.2)}}>
						{ch}
					</span>
				))}
			</div>
		</AbsoluteFill>
	);
};
const CAST_SKIN = '#e7b892';

/** 8 — M, A, X: each letter has its own shape in the air. */
const Shapes: React.FC<ShotCtx> = ({t}) => {
	const segs: [string, number, number, string][] = [
		['M', n.word(8, 1), n.word(8, 6) + 0.25, 'up · down · up · down'],
		['A', n.word(8, 8), n.word(8, 12) + 0.2, 'one peak'],
		['X', n.word(8, 14), n.word(8, 19) + 0.2, 'two slashes'],
	];
	return (
		<AbsoluteFill>
			<PaperDesk />
			{segs.map(([ch, a, b, label], i) => {
				const p = tween(t, [a, b], [0, 1], ease.inOut);
				const y = 300 + i * 290;
				return (
					<div key={ch}>
						<Panel x={110} y={y} w={300} h={250} t={t} at={a - 0.15} bg={N.ink} rot={-2 + i * 2}>
							<Trail strokes={LETTERS[ch]} p={p} x={70} y={40} scale={1.4} color={N.mustard} width={18} />
						</Panel>
						<div style={{position: 'absolute', left: 450, top: y + 30, fontFamily: fonts.comic, fontSize: 150, lineHeight: 1, color: N.red, transform: `scale(${pop(t, b - 0.1, 0.3)})`}}>{ch}</div>
						<div style={{position: 'absolute', left: 560, top: y + 70, width: 380, fontFamily: fonts.hand, fontWeight: 700, fontSize: 46, color: N.ink, opacity: rise(t, a + 0.1, 0.3)}}>{label}</div>
					</div>
				);
			})}
		</AbsoluteFill>
	);
};

/** 9 — "Pencil reading. Practice, not magic." */
const Title: React.FC<ShotCtx> = ({t, s}) => (
	<AbsoluteFill>
		<BrandVoid t={t} />
		<Panel x={90} y={360} w={900} h={260} t={t} at={n.word(9, 3) - 0.2} bg={N.ink} rot={-3}>
			<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.comic, fontSize: 132, color: N.mustard, letterSpacing: 3}}>PENCIL READING</div>
		</Panel>
		<div style={{position: 'absolute', left: 140, top: 720, fontFamily: fonts.comic, fontSize: 110, color: N.ink, transform: `scale(${pop(t, n.word(9, 6), 0.3)})`}}>PRACTICE ✓</div>
		<div style={{position: 'absolute', left: 140, top: 870, fontFamily: fonts.comic, fontSize: 110, color: N.ink, opacity: 0.85, transform: `scale(${pop(t, n.word(9, 7), 0.3)})`}}>MAGIC</div>
		<Annot x={120} y={880} w={360} h={110} t={t} at={n.word(9, 8)} kind="strike" color={N.red} width={16} />
	</AbsoluteFill>
);

/** 10 — "Try it on a friend. Make them write in capitals." Arrow to the share button. */
const Cta: React.FC<ShotCtx> = ({t, s}) => {
	const at = n.word(10, 4);
	const p = tween(t, [at, at + 0.5], [0, 1], ease.out);
	return (
		<AbsoluteFill>
			<Interrogation t={t} table={false} />
			<Bust who="reader" x={400} y={1720} size={1300} t={t} talk={talk(t, 'reader')} smile={0.6} asym={0.7} browR={0.7} lookX={0.2} tilt={tween(t, [s, s + 1], [0, 4])} />
			<Notepad x={640} y={330} w={320} h={280} side="front" text="ABC" reveal={rise(t, n.word(10, 9), 0.4)} rot={6} />
			<div style={{position: 'absolute', left: 690, top: 700, fontFamily: fonts.hand, fontWeight: 700, fontSize: 64, lineHeight: 1.0, color: N.mustard, transform: `rotate(-6deg) scale(${pop(t, at, 0.3)})`, textAlign: 'center'}}>
				test a
				<br />
				friend
			</div>
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
				<path d="M800 900 C900 980 920 1100 935 1240" stroke={N.mustard} strokeWidth={12} fill="none" strokeLinecap="round" strokeDasharray={400} strokeDashoffset={400 * (1 - p)} />
				{p > 0.95 ? <path d="M905 1212 L937 1250 L957 1200" stroke={N.mustard} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
			</svg>
		</AbsoluteFill>
	);
};

export const episode012: NoirEpisodeDef = {
	id: '012',
	timeline: tl,
	audioDir: 'audio/v012',
	hook: 'HE READ MY PEN',
	hookUntil: 3.2,
	shots: [
		{at: 0, C: Setup, cut: 'none'},
		{at: n.start(1) - 0.15, C: Scribble},
		{at: n.start(2) - 0.15, C: Three},
		{at: n.start(3) - 0.15, C: Replay},
		{at: n.start(4) - 0.15, C: Reveal},
		{at: n.start(5) - 0.12, C: Looked},
		{at: n.start(6) - 0.12, C: Watched},
		{at: n.start(7) - 0.12, C: Lever},
		{at: n.start(8) - 0.12, C: Shapes},
		{at: n.start(9) - 0.15, C: Title},
		{at: n.start(10) - 0.15, C: Cta},
	],
	sfx: [
		['paper', 0.3, 0.35],
		['scribble', n.start(1) - 0.1, 0.55],
		['whoosh', n.start(2) - 0.18, 0.25],
		['pop', n.word(2, 2), 0.25],
		['scribble', n.word(3, 2) - 0.2, 0.3],
		['scribble', n.word(3, 4), 0.3],
		['scribble', n.word(3, 7), 0.3],
		['swish', n.start(4) - 0.1, 0.45],
		['zing', n.start(5), 0.3],
		['ding', n.word(6, 3), 0.3],
		['scratch', n.word(6, 6), 0.3],
		['swish', n.start(7) - 0.15, 0.3],
		['pop', n.word(8, 1) - 0.15, 0.25],
		['pop', n.word(8, 8) - 0.15, 0.25],
		['pop', n.word(8, 14) - 0.15, 0.25],
		['stamp', n.word(9, 3) - 0.2, 0.45],
		['scratch', n.word(9, 8), 0.3],
		['whoosh', n.start(10) - 0.18, 0.3],
		['scribble', n.word(10, 9), 0.3],
	],
	music: 0.3,
};
