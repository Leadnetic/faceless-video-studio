import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {Annot, Burst, Bust, N, Panel, SfxWord, talkAmp} from '../components/Noir';
import {SevenSeg} from '../components/SevenSeg';
import {pop} from '../components/Toon';
import tlJson from '../data/timeline-013.json';
import {ease, keys, rise, tween} from '../lib/anim';
import {narration, type Timeline} from '../lib/timeline';
import type {NoirEpisodeDef} from '../NoirEpisode';
import {fonts} from '../theme';
import type {ShotCtx} from '../ToonEpisode';

const tl = tlJson as Timeline;
const n = narration(tl);
const talk = (t: number, who: string) => talkAmp(tl, t, who);
const push = (t: number, s: number, e: number, a = 1, b = 1.06) => tween(t, [s, e], [a, b], ease.inOut);
const SLAM = n.end(4) + 0.4;
export const STEEL = '#2a2e33';

/* ------------------------------------------------------------------ bunker kit */

/** Doors-closing timer: 10 → 0, landing on 3-2-1 exactly with the alarm's countdown. */
const secondsLeft = (t: number) =>
	Math.max(0, Math.ceil(keys(t, [[n.word(0, 5), 10], [n.word(4, 0) - 0.01, 3.01], [n.word(4, 1), 2], [n.word(4, 2), 1], [SLAM, 0]], (x) => x) - 0.001));

const Timer: React.FC<{t: number; x: number; y: number; h?: number}> = ({t, x, y, h = 120}) => (
	<div style={{position: 'absolute', left: x - h * 1.6, top: y - h / 2, width: h * 3.2, height: h, background: '#120c0c', border: `7px solid ${N.ink}`, boxShadow: `8px 8px 0 ${N.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
		<SevenSeg text={`00:${String(secondsLeft(t)).padStart(2, '0')}`} height={h * 0.62} color="#ff4436" t={t} glow={0.8} />
	</div>
);

/** Rotating red emergency beacon wash. */
export const Alarm: React.FC<{t: number; strength?: number}> = ({t, strength = 1}) => {
	const a = (t * 220) % 360;
	return (
		<AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen', opacity: 0.55 * strength}}>
			<AbsoluteFill style={{background: `conic-gradient(from ${a}deg at 50% 8%, rgba(255,40,30,0.75) 0deg, transparent 40deg, transparent 180deg, rgba(255,40,30,0.75) 180deg, transparent 220deg)`}} />
			<AbsoluteFill style={{background: `rgba(255,30,20,${0.12 + 0.1 * Math.max(0, Math.sin(t * 12))})`}} />
		</AbsoluteFill>
	);
};

/** Apocalypse sky: burning skyline, ash, streaks. */
export const Outside: React.FC<{t: number}> = ({t}) => (
	<AbsoluteFill style={{background: 'linear-gradient(180deg, #2b0d0a 0%, #8f2a14 45%, #e2752a 75%, #f2b04a 100%)'}}>
		{new Array(5).fill(0).map((_, i) => {
			const p = ((t * 0.35 + i * 0.23) % 1);
			return <div key={`m${i}`} style={{position: 'absolute', left: 1100 - p * 900 - i * 120, top: 120 + p * 520 + i * 70, width: 220, height: 8, borderRadius: 4, background: 'linear-gradient(90deg, #fff3c4, transparent)', transform: 'rotate(-32deg)', opacity: 0.8}} />;
		})}
		<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
			<path d="M0 1200 L0 960 L80 960 L80 860 L150 860 L150 1000 L210 1000 L210 780 L300 780 L300 920 L360 920 L360 700 L420 680 L470 700 L470 980 L540 980 L540 840 L620 840 L620 760 L700 760 L700 940 L760 940 L760 820 L860 820 L860 1000 L930 1000 L930 880 L1080 880 L1080 1200 Z" fill={N.ink} />
			{new Array(14).fill(0).map((_, i) => (
				<rect key={i} x={40 + ((i * 73) % 1000)} y={880 + ((i * 41) % 120)} width={14} height={18} fill="#ffb347" opacity={0.4 + 0.6 * Math.abs(Math.sin(t * 3 + i))} />
			))}
		</svg>
		{new Array(40).fill(0).map((_, i) => {
			const y = ((random(`ay${i}`) * 1920 + t * (60 + random(`as${i}`) * 80)) % 1920);
			return <div key={`a${i}`} style={{position: 'absolute', left: random(`ax${i}`) * 1080 + Math.sin(t + i) * 20, top: y, width: 6, height: 6, borderRadius: 3, background: '#d9d0c4', opacity: 0.5}} />;
		})}
	</AbsoluteFill>
);

/** Steel bunker interior with a round vault opening; `door` 0 open … 1 shut. */
export const Bunker: React.FC<{t: number; door?: number; outside?: boolean}> = ({t, door = 0, outside = true}) => (
	<AbsoluteFill style={{background: `linear-gradient(180deg, ${STEEL} 0%, #191b1f 100%)`}}>
		{new Array(6).fill(0).map((_, i) => (
			<div key={i} style={{position: 'absolute', left: 0, right: 0, top: i * 330, height: 8, background: 'rgba(0,0,0,0.45)'}} />
		))}
		{new Array(36).fill(0).map((_, i) => (
			<div key={`r${i}`} style={{position: 'absolute', left: 30 + (i % 6) * 200, top: 20 + Math.floor(i / 6) * 330, width: 14, height: 14, borderRadius: 7, background: '#4a5058', border: `3px solid ${N.ink}`}} />
		))}
		{/* vault opening */}
		<div style={{position: 'absolute', left: 540 - 420, top: 760 - 420, width: 840, height: 840, borderRadius: '50%', overflow: 'hidden', border: `26px solid #4a5058`, boxShadow: `0 0 0 10px ${N.ink}, inset 0 0 0 10px ${N.ink}`}}>
			{outside ? (
				<div style={{position: 'absolute', left: -120, top: -340, width: 1080, height: 1920}}>
					<Outside t={t} />
				</div>
			) : null}
			{/* vault door slides across */}
			<div style={{position: 'absolute', inset: -30, transform: `translateX(${(1 - door) * 105}%)`}}>
				<svg width={850} height={850} viewBox="-425 -425 850 850">
					<circle r={420} fill="#5b626b" stroke={N.ink} strokeWidth={12} />
					<circle r={300} fill="none" stroke={N.ink} strokeWidth={8} />
					<circle r={120} fill="#3a3f45" stroke={N.ink} strokeWidth={10} />
					{[0, 1, 2, 3, 4, 5].map((i) => (
						<rect key={i} x={-14} y={-300} width={28} height={180} fill="#7d858f" stroke={N.ink} strokeWidth={6} transform={`rotate(${i * 60 + door * 90})`} />
					))}
					{new Array(16).fill(0).map((_, i) => {
						const a = (i / 16) * Math.PI * 2;
						return <circle key={i} cx={Math.cos(a) * 365} cy={Math.sin(a) * 365} r={16} fill="#8b939c" stroke={N.ink} strokeWidth={5} />;
					})}
				</svg>
			</div>
		</div>
	</AbsoluteFill>
);

type Kind = 'aid' | 'food' | 'radio' | 'photo';
const ITEMS: [string, Kind, string][] = [
	['A', 'aid', 'FIRST-AID KIT'],
	['B', 'food', 'FOOD & WATER'],
	['C', 'radio', 'RADIO'],
	['D', 'photo', 'A PHOTO'],
];

const Icon: React.FC<{kind: Kind; w: number}> = ({kind, w}) => (
	<svg width={w} height={w * 0.7} viewBox="0 0 200 140">
		{kind === 'aid' ? (
			<g stroke={N.ink} strokeWidth={6} strokeLinejoin="round">
				<path d="M75 30 v-12 h50 v12" fill="none" strokeWidth={8} />
				<rect x={30} y={30} width={140} height={100} rx={12} fill={N.white} />
				<path d="M88 52 h24 v20 h20 v24 h-20 v20 h-24 v-20 h-20 v-24 h20 Z" fill={N.red} />
			</g>
		) : kind === 'food' ? (
			<g stroke={N.ink} strokeWidth={6} strokeLinejoin="round">
				<path d="M30 40 h70 v84 h-70 Z" fill={N.mustard} />
				<ellipse cx={65} cy={40} rx={35} ry={10} fill="#c9cbd1" />
				<path d="M30 70 h70 v28 h-70 Z" fill={N.white} />
				<path d="M140 30 h24 v14 l12 16 v66 h-48 v-66 l12 -16 Z" fill="#9fd3e6" />
				<rect x={138} y={14} width={28} height={16} fill={N.tealMid} />
			</g>
		) : kind === 'radio' ? (
			<g stroke={N.ink} strokeWidth={6} strokeLinejoin="round">
				<path d="M130 40 L165 4" strokeWidth={6} />
				<rect x={25} y={40} width={150} height={90} rx={12} fill={N.tealLight} />
				<circle cx={70} cy={85} r={28} fill={N.paper} />
				{[0, 1, 2].map((i) => (
					<line key={i} x1={52} y1={74 + i * 11} x2={88} y2={74 + i * 11} strokeWidth={4} />
				))}
				<rect x={115} y={60} width={44} height={22} fill={N.mustard} />
				<circle cx={137} cy={108} r={12} fill={N.paper} />
			</g>
		) : (
			<g stroke={N.ink} strokeWidth={6} strokeLinejoin="round">
				<g transform="rotate(-6 100 70)">
					<rect x={45} y={8} width={110} height={128} fill={N.white} />
					<rect x={57} y={20} width={86} height={80} fill={N.mustard} />
					<circle cx={84} cy={50} r={11} fill={N.ink} strokeWidth={0} />
					<path d="M68 100 q16 -32 32 0 Z" fill={N.ink} strokeWidth={0} />
					<circle cx={116} cy={54} r={10} fill={N.ink} strokeWidth={0} />
					<path d="M101 100 q15 -28 30 0 Z" fill={N.ink} strokeWidth={0} />
					<path d="M100 32 c-6 -10 -18 -2 -10 8 l10 10 l10 -10 c8 -10 -4 -18 -10 -8 Z" fill={N.red} strokeWidth={3} />
				</g>
			</g>
		)}
	</svg>
);

export const ItemCard: React.FC<{i: number; x: number; y: number; w: number; t: number; at?: number; dim?: number; shake?: number}> = ({i, x, y, w, t, at = -1, dim = 0, shake = 0}) => {
	const [letter, kind, label] = ITEMS[i];
	const p = at < 0 ? 1 : pop(t, at, 0.3);
	if (p <= 0) return null;
	const h = w * 0.78;
	const sx = Math.sin(t * 55 + i * 2) * shake * 6;
	return (
		<div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `translate(${sx}px, ${-sx * 0.5}px) scale(${p}) rotate(${(i % 2 ? 2 : -2)}deg)`, opacity: 1 - dim * 0.6}}>
			<div style={{position: 'absolute', inset: 0, background: N.paper, border: `7px solid ${N.ink}`, boxShadow: `10px 10px 0 ${N.ink}`}} />
			<div style={{position: 'absolute', left: -18, top: -22, width: w * 0.24, height: w * 0.24, borderRadius: '50%', background: N.mustard, border: `6px solid ${N.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.comic, fontSize: w * 0.16, color: N.ink}}>{letter}</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: h * 0.08, display: 'flex', justifyContent: 'center'}}>
				<Icon kind={kind} w={w * 0.62} />
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, bottom: h * 0.06, textAlign: 'center', fontFamily: fonts.comic, fontSize: w * 0.11, color: N.ink, letterSpacing: 1}}>{label}</div>
		</div>
	);
};

/* ------------------------------------------------------------------ shots */

/** 0 — alarm: "Bunker doors closing in ten seconds." */
const Siren: React.FC<ShotCtx> = ({t, s, e}) => (
	<AbsoluteFill>
		<AbsoluteFill style={{transform: `scale(${push(t, s, e, 1, 1.05)})`, transformOrigin: '540px 800px'}}>
			<Bunker t={t} />
			<Bust who="reader" x={540} y={1700} size={1120} t={t} lookX={0.5} turn={0.3} lookY={-0.2} browL={0.4} browR={0.5} light="right" />
		</AbsoluteFill>
		<Alarm t={t} />
		<Timer t={t} x={540} y={520} />
	</AbsoluteFill>
);

/** 1 — "The world is ending. You can take one thing inside." */
const End: React.FC<ShotCtx> = ({t, s, e}) => (
	<AbsoluteFill>
		<AbsoluteFill style={{transform: `scale(${push(t, s, e, 1.0, 1.1)})`, transformOrigin: '540px 760px'}}>
			<Outside t={t} />
		</AbsoluteFill>
		<Bust who="reader" x={300} y={1760} size={1400} t={t} talk={talk(t, 'reader')} solid={N.ink} />
		<Timer t={t} x={760} y={330} h={90} />
		<SfxWord text="ONE." x={720} y={760} t={t} at={n.word(1, 7)} size={180} color={N.mustard} rot={-6} />
	</AbsoluteFill>
);

/** 2 — the four choices. */
const Choices: React.FC<ShotCtx> = ({t}) => {
	const at = [n.word(2, 0), n.word(2, 4), n.word(2, 8), n.word(2, 11)];
	return (
		<AbsoluteFill>
			<Bunker t={t} outside={false} door={1} />
			<AbsoluteFill style={{background: 'rgba(14,13,18,0.55)'}} />
			<Alarm t={t} strength={0.6} />
			{[0, 1, 2, 3].map((i) => (
				<ItemCard key={i} i={i} x={i % 2 ? 560 : 110} y={i < 2 ? 330 : 680} w={360} t={t} at={at[i] - 0.05} />
			))}
			<Timer t={t} x={540} y={1080} h={100} />
		</AbsoluteFill>
	);
};

/** 3 — "Don't think. Pick." */
const Pick: React.FC<ShotCtx> = ({t, s, e}) => (
	<AbsoluteFill>
		<Bunker t={t} />
		<AbsoluteFill style={{transform: `scale(${push(t, s, e, 1.0, 1.1)}) translateX(${Math.sin(t * 40) * 3}px)`, transformOrigin: '540px 640px'}}>
			<Bust who="reader" x={540} y={1880} size={1800} t={t} talk={talk(t, 'reader')} lids={0.8} knit={0.5} smile={0.1} lookX={0} light="right" blink={false} />
		</AbsoluteFill>
		<Alarm t={t} strength={1.2} />
	</AbsoluteFill>
);

/** 4 — "Three. Two. One." The door rolls shut. SLAM. */
const Countdown: React.FC<ShotCtx> = ({t}) => {
	const door = tween(t, [n.word(4, 0), SLAM], [0, 1], ease.in);
	const k = secondsLeft(t);
	const slam = t >= SLAM;
	const flash = slam ? 1 - rise(t, SLAM, 0.35) : 0;
	const shake = slam ? Math.sin(t * 70) * 22 * (1 - rise(t, SLAM, 0.5)) : 0;
	return (
		<AbsoluteFill style={{transform: `translate(${shake}px, ${shake * 0.6}px)`}}>
			<Bunker t={t} door={door} />
			{[0, 1, 2, 3].map((i) => (
				<ItemCard key={i} i={i} x={[40, 700, 60, 680][i]} y={[260, 300, 1000, 980][i]} w={250} t={t} shake={slam ? 0 : 1} />
			))}
			{!slam && k > 0 ? <SfxWord key={k} text={String(k)} x={540} y={760} t={t} at={[0, n.word(4, 2), n.word(4, 1), n.word(4, 0)][k] ?? n.word(4, 0)} size={420} color={N.red} rot={-4} /> : null}
			<Alarm t={t} strength={slam ? 0 : 1.3} />
			{slam ? <SfxWord text="KLANG!" x={540} y={760} t={t} at={SLAM} size={210} color={N.mustard} rot={-8} /> : null}
			<AbsoluteFill style={{background: '#fff', opacity: flash * 0.9}} />
		</AbsoluteFill>
	);
};

/** 5 — "Done? Good." Silence inside, dust falls. */
const Quiet: React.FC<ShotCtx> = ({t}) => (
	<AbsoluteFill>
		<Bunker t={t} door={1} />
		<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 30%, rgba(255,236,190,0.28) 0%, rgba(14,13,18,0.7) 55%)'}} />
		{new Array(30).fill(0).map((_, i) => (
			<div key={i} style={{position: 'absolute', left: random(`dx${i}`) * 1080, top: ((random(`dy${i}`) * 900 + t * 120) % 1400), width: 4, height: 4, borderRadius: 2, background: N.paper, opacity: 0.5}} />
		))}
		<Bust who="reader" x={540} y={1720} size={1400} t={t} talk={talk(t, 'reader')} smile={0.55} asym={0.7} browR={0.6} lookX={0} />
	</AbsoluteFill>
);

/** 6 — "What you grab in a panic shows how your brain handles fear." */
const Panic: React.FC<ShotCtx> = ({t}) => (
	<AbsoluteFill>
		<Bunker t={t} door={1} />
		<AbsoluteFill style={{background: 'rgba(14,13,18,0.45)'}} />
		{[0, 1, 2, 3].map((i) => (
			<ItemCard key={i} i={i} x={70 + i * 240} y={330} w={210} t={t} at={n.start(6) + i * 0.06} />
		))}
		<Annot x={50} y={300} w={980} h={230} t={t} at={n.word(6, 5) - 0.1} color={N.mustard} label="your panic pick" labelX={260} labelY={250} labelSize={66} />
		<Bust who="reader" x={560} y={1720} size={1080} t={t} talk={talk(t, 'reader')} smile={0.3} asym={0.4} lookY={-0.5} browL={0.3} />
	</AbsoluteFill>
);

/** 7 — "Two protect your body. Two protect something else." */
const Split: React.FC<ShotCtx> = ({t}) => {
	const sep = rise(t, n.word(7, 0), 0.5);
	const body = n.word(7, 5);
	const els = n.word(7, 11);
	return (
		<AbsoluteFill>
			<Bunker t={t} door={1} outside={false} />
			<AbsoluteFill style={{background: 'rgba(14,13,18,0.55)'}} />
			<ItemCard i={0} x={90 - sep * 20} y={300} w={300} t={t} />
			<ItemCard i={1} x={90 - sep * 20} y={600} w={300} t={t} />
			<ItemCard i={2} x={690 + sep * 20 - 40} y={300} w={300} t={t} dim={0} />
			<ItemCard i={3} x={690 + sep * 20 - 40} y={600} w={300} t={t} />
			<div style={{position: 'absolute', left: 536, top: 290, width: 8, height: 600, background: N.mustard, opacity: sep, transform: `scaleY(${sep})`}} />
			<div style={{position: 'absolute', left: 70, width: 340, top: 880, textAlign: 'center', fontFamily: fonts.comic, fontSize: 100, color: N.mustard, transform: `scale(${pop(t, body - 0.1, 0.3)}) rotate(-4deg)`}}>BODY</div>
			<div style={{position: 'absolute', left: 630, width: 340, top: 880, textAlign: 'center', fontFamily: fonts.comic, fontSize: 100, color: N.red, transform: `scale(${pop(t, els - 0.1, 0.3)}) rotate(4deg)`}}>???</div>
		</AbsoluteFill>
	);
};

/** 8 — "Comment your letter. In part two, I'll read you." Open ending. */
const Cliff: React.FC<ShotCtx> = ({t, s}) => {
	const at = n.word(8, 0);
	const p = tween(t, [at, at + 0.5], [0, 1], ease.out);
	const part = n.word(8, 4);
	const rp = pop(t, part - 0.1, 0.4);
	return (
		<AbsoluteFill>
			<Burst cx={540} cy={560} t={t} color="#1f2328" bg={STEEL} n={40} spin={3} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', justifyContent: 'center', gap: 22}}>
				{['A', 'B', 'C', 'D'].map((l, i) => (
					<div key={l} style={{width: 170, height: 190, background: N.mustard, border: `8px solid ${N.ink}`, boxShadow: `10px 10px 0 ${N.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.comic, fontSize: 150, color: N.ink, transform: `scale(${pop(t, s + 0.05 + i * 0.08, 0.3)}) rotate(${(i - 1.5) * 4}deg)`}}>
						{l}
					</div>
				))}
			</div>
			<Bust who="reader" x={340} y={1720} size={1150} t={t} talk={talk(t, 'reader')} smile={0.6} asym={0.8} browR={0.8} lookX={0.4} />
			{rp > 0 ? (
				<div style={{position: 'absolute', left: 560, top: 620, transform: `scale(${rp}) rotate(-5deg)`, transformOrigin: 'left center'}}>
					<svg width={420} height={150} style={{overflow: 'visible'}}>
						<path d="M0 20 H330 L410 75 L330 130 H0 Z" fill={N.red} stroke={N.ink} strokeWidth={10} strokeLinejoin="round" />
					</svg>
					<div style={{position: 'absolute', left: 26, top: 22, fontFamily: fonts.comic, fontSize: 92, color: N.white, WebkitTextStroke: `5px ${N.ink}`, paintOrder: 'stroke fill', whiteSpace: 'nowrap'}}>PART 2</div>
				</div>
			) : null}
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
				<path d="M800 830 C900 900 920 1010 935 1110" stroke={N.mustard} strokeWidth={12} fill="none" strokeLinecap="round" strokeDasharray={330} strokeDashoffset={330 * (1 - p)} />
				{p > 0.95 ? <path d="M905 1085 L938 1120 L955 1070" stroke={N.mustard} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
			</svg>
		</AbsoluteFill>
	);
};

export const episode013: NoirEpisodeDef = {
	id: '013',
	timeline: tl,
	audioDir: 'audio/v013',
	hook: 'APOCALYPSE: PICK ONE',
	hookUntil: 2.8,
	shots: [
		{at: 0, C: Siren, cut: 'none'},
		{at: n.start(1) - 0.12, C: End},
		{at: n.start(2) - 0.15, C: Choices},
		{at: n.start(3) - 0.12, C: Pick},
		{at: n.start(4) - 0.12, C: Countdown},
		{at: n.start(5) - 0.4, C: Quiet},
		{at: n.start(6) - 0.12, C: Panic},
		{at: n.start(7) - 0.12, C: Split},
		{at: n.start(8) - 0.15, C: Cliff},
	],
	sfx: [
		['alarm', 0.0, 0.35],
		['alarm', 1.6, 0.3],
		['rumble', 2.6, 0.5],
		['whoosh', n.start(1) - 0.15, 0.3],
		['pop', n.word(2, 0), 0.3],
		['pop', n.word(2, 4), 0.3],
		['pop', n.word(2, 8), 0.3],
		['pop', n.word(2, 11), 0.3],
		['alarm', n.start(3) - 0.1, 0.3],
		['heart', n.start(3), 0.5],
		['heart', n.word(4, 0) - 0.05, 0.6],
		['heart', n.word(4, 1) - 0.05, 0.65],
		['heart', n.word(4, 2) - 0.05, 0.7],
		['slam', SLAM - 0.02, 0.9],
		['rumble', SLAM + 0.3, 0.45],
		['zing', n.word(6, 5) - 0.1, 0.3],
		['swish', n.start(7), 0.3],
		['ding', n.word(7, 5), 0.3],
		['sting', n.word(7, 11) - 0.05, 0.4],
		['pop', n.start(8) - 0.1, 0.3],
		['stamp', n.word(8, 4) - 0.1, 0.45],
	],
	music: 0.28,
};
