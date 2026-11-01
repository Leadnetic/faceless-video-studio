import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Annot, Burst, Bust, CaseFile, N, Panel, SfxWord, Stamp, talkAmp} from '../components/Noir';
import {pop} from '../components/Toon';
import tlJson from '../data/timeline-011.json';
import {ease, keys, rise, tween} from '../lib/anim';
import {narration, type Timeline} from '../lib/timeline';
import type {NoirEpisodeDef} from '../NoirEpisode';
import {BrandVoid, ClockCard, Gear, Interrogation, LoadBar, PaperDesk} from '../scenes/noir/Sets';
import {fonts} from '../theme';
import type {ShotCtx} from '../ToonEpisode';

const tl = tlJson as Timeline;
const n = narration(tl);
const talk = (t: number, who: string) => talkAmp(tl, t, who);
const push = (t: number, s: number, e: number, a = 1, b = 1.06) => tween(t, [s, e], [a, b], ease.inOut);

/** Inked eye that looks in a direction (-1 left … 1 right). */
const Eye: React.FC<{x: number; y: number; w: number; look: number; lookY?: number}> = ({x, y, w, look, lookY = 0}) => (
	<svg width={w} height={w * 0.56} viewBox="-160 -90 320 180" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.28}}>
		<path d="M-150 0 Q0 -110 150 0 Q0 110 -150 0 Z" fill={N.white} stroke={N.ink} strokeWidth={10} />
		<clipPath id={`eye${x}${y}`}>
			<path d="M-150 0 Q0 -110 150 0 Q0 110 -150 0 Z" />
		</clipPath>
		<g clipPath={`url(#eye${x}${y})`}>
			<circle cx={look * 70} cy={lookY * 30} r={50} fill={N.tealMid} stroke={N.ink} strokeWidth={8} />
			<circle cx={look * 70} cy={lookY * 30} r={22} fill={N.ink} />
			<circle cx={look * 70 + 15} cy={lookY * 30 - 16} r={9} fill="#fff" />
		</g>
	</svg>
);

/** 0 — the suspect's alibi under the lamp. */
const Alibi: React.FC<ShotCtx> = ({t, s, e}) => (
	<AbsoluteFill>
		<Interrogation t={t} />
		<AbsoluteFill style={{transform: `scale(${push(t, s, e, 1, 1.06)})`, transformOrigin: '540px 900px'}}>
			<Bust who="suspect" x={540} y={1590} size={1150} t={t} talk={talk(t, 'suspect')} smile={0.35} sweat={0.3} lookX={0.25} browL={0.2} />
		</AbsoluteFill>
		<ClockCard x={220} y={560} s={150} time="6:00" label="WORK" t={t} at={n.word(0, 4)} rot={-6} />
		<ClockCard x={540} y={560} s={150} time="7:00" label="DINNER" t={t} at={n.word(0, 6)} rot={3} />
		<ClockCard x={860} y={560} s={150} time="8:00" label="HOME" t={t} at={n.word(0, 12)} rot={-3} />
	</AbsoluteFill>
);

/** 1 — Detective: "Smooth. Too smooth." */
const TooSmooth: React.FC<ShotCtx> = ({t, s, e}) => (
	<AbsoluteFill>
		<Interrogation t={t} table={false} />
		<AbsoluteFill style={{transform: `scale(${push(t, s, e, 1.02, 1.1)})`, transformOrigin: '540px 760px'}}>
			<Bust who="detective" x={540} y={1700} size={1450} t={t} talk={talk(t, 'detective')} knit={0.9} lids={0.55} smile={-0.25} asym={-0.3} light="right" lookX={-0.3} />
		</AbsoluteFill>
	</AbsoluteFill>
);

/** 2 — Reader: "Okay. Now tell it backwards." */
const Backwards: React.FC<ShotCtx> = ({t, s}) => (
	<AbsoluteFill>
		<Interrogation t={t} table={false} />
		<Bust who="reader" x={540} y={1680} size={1350} t={t} talk={talk(t, 'reader')} smile={0.45} asym={0.6} browR={0.6} lookX={-0.3} tilt={tween(t, [s, s + 1.5], [0, -3])} />
		<SfxWord text="◀◀ REWIND" x={540} y={420} t={t} at={n.word(2, 4)} size={110} color={N.mustard} rot={-4} />
	</AbsoluteFill>
);

/** 3 — the suspect stumbles. */
const Stumble: React.FC<ShotCtx> = ({t, s, e}) => {
	const panic = rise(t, n.word(3, 6), e - n.word(3, 6), ease.inOut);
	const shake = Math.sin(t * 47) * 5 * panic;
	const fall = tween(t, [n.word(3, 10), n.word(3, 10) + 0.8], [0, 1], ease.in);
	return (
		<AbsoluteFill>
			<Interrogation t={t} swing={2} />
			<AbsoluteFill style={{transform: `translate(${shake}px, ${-shake * 0.6}px) scale(${push(t, s, e, 1.02, 1.12)})`, transformOrigin: '540px 800px'}}>
				<Bust who="suspect" x={540} y={1720} size={1520} t={t} talk={talk(t, 'suspect')} open={rise(t, n.word(3, 10), 0.2) * 0.3} smile={-0.4 * panic} sweat={0.4 + 0.6 * panic} browL={0.5 + panic * 0.5} browR={0.3 + panic * 0.6} knit={-0.4} lookX={Math.sin(t * 7) * (0.3 + 0.6 * panic)} lookY={-0.2} />
			</AbsoluteFill>
			<ClockCard x={830} y={420} s={150} time="8:00" label="HOME" t={t} at={n.word(3, 4)} rot={4} />
			<ClockCard x={250} y={420} s={150} time="7:??" label="???" t={t} at={n.word(3, 7)} rot={-6} fall={fall} />
			<SfxWord text="UH..." x={760} y={680} t={t} at={n.word(3, 10)} size={120} color={N.white} rot={10} shake />
		</AbsoluteFill>
	);
};

/** 4 — Reader: "There it is." */
const ThereItIs: React.FC<ShotCtx> = ({t}) => (
	<AbsoluteFill>
		<Burst cx={540} cy={700} t={t} color={N.tealMid} bg={N.teal} n={44} spin={-4} r0={420} />
		<Bust who="reader" x={540} y={1860} size={1780} t={t} talk={talk(t, 'reader')} smile={0.55} asym={0.9} browR={0.9} lids={0.85} lookX={-0.4} light="right" rim={N.mustard} />
	</AbsoluteFill>
);

/** 5 — "Lying is hard work": invent / remember / watch gears and a load meter. */
const Work: React.FC<ShotCtx> = ({t}) => {
	const load = keys(t, [[n.word(5, 0), 0.12], [n.word(5, 5), 0.32], [n.word(5, 8), 0.52], [n.word(5, 11), 0.72]]);
	return (
		<AbsoluteFill>
			<PaperDesk />
			<div style={{position: 'absolute', left: 120, top: 270, fontFamily: fonts.comic, fontSize: 84, color: N.ink}}>A LIAR'S BRAIN</div>
			<Gear x={300} y={540} r={130} t={t} speed={40} label="INVENT" p={pop(t, n.word(5, 5) - 0.1, 0.35)} />
			<Gear x={560} y={760} r={110} t={t} speed={-48} color={N.tealLight} label="REMEMBER" p={pop(t, n.word(5, 8) - 0.1, 0.35)} />
			<Gear x={290} y={940} r={100} t={t} speed={52} color={N.red} label="WATCH" p={pop(t, n.word(5, 11) - 0.1, 0.35)} />
			<LoadBar x={780} y={380} w={110} h={560} v={load} label="LOAD" t={t} />
		</AbsoluteFill>
	);
};

/** 6 — reverse order overloads the liar, not the truth-teller. */
const Overload: React.FC<ShotCtx> = ({t, s}) => {
	const liar = keys(t, [[s, 0.62], [n.word(6, 4), 0.85], [n.word(6, 10), 1.0], [n.word(6, 13), 1.08]]);
	const over = t >= n.word(6, 13) - 0.05;
	return (
		<AbsoluteFill>
			<PaperDesk />
			<SfxWord text="+ ◀◀ REVERSE" x={720} y={330} t={t} at={s + 0.05} size={86} color={N.mustard} rot={-3} />
			<LoadBar x={190} y={440} w={220} h={540} v={tween(t, [n.word(6, 6) - 0.3, n.word(6, 6) + 0.4], [0, 0.45])} label="TRUTH" color={N.tealLight} t={t} />
			<LoadBar x={620} y={440} w={220} h={540} v={liar} label="LIE" over={over} t={t} />
			{over ? <SfxWord text="FULL!" x={730} y={540} t={t} at={n.word(6, 13) - 0.05} size={130} color={N.red} rot={8} shake /> : null}
			<Annot x={170} y={420} w={260} h={580} t={t} at={n.word(6, 7)} color={N.tealMid} label="just remember" labelX={-30} labelY={-70} labelSize={46} />
		</AbsoluteFill>
	);
};

/** 7 — Vrij et al. 2008 case file. */
const Study: React.FC<ShotCtx> = ({t, s}) => {
	const up = pop(t, n.word(7, 5), 0.4);
	return (
		<AbsoluteFill>
			<Interrogation t={t} lamp={false} table={false} blinds={0.6} />
			<CaseFile x={90} y={330} w={900} h={780} t={t} at={s + 0.05} title="CASE FILE · LIES" lines={['Vrij et al.', 'officers watched interviews', 'story told: forward vs. ◀◀ reverse']}>
				<div style={{position: 'absolute', left: 60, top: 330, width: 780, height: 380, display: 'flex', alignItems: 'flex-end', gap: 80}}>
					<div style={{flex: 1, height: `${rise(t, n.word(7, 4), 0.5) * 45}%`, background: N.tealLight, border: `6px solid ${N.ink}`}} />
					<div style={{flex: 1, height: `${rise(t, n.word(7, 5), 0.8) * 80}%`, background: N.red, border: `6px solid ${N.ink}`}} />
				</div>
				<div style={{position: 'absolute', left: 60, top: 720, width: 780, display: 'flex', gap: 80, fontFamily: fonts.comic, fontSize: 44, color: N.ink, textAlign: 'center'}}>
					<div style={{flex: 1}}>FORWARD</div>
					<div style={{flex: 1}}>◀◀ REVERSE</div>
				</div>
				{up > 0 ? <div style={{position: 'absolute', left: 430, top: 270, transform: `scale(${up})`, transformOrigin: 'left center', fontFamily: fonts.comic, fontSize: 56, color: N.red, whiteSpace: 'nowrap'}}>▲ MORE LIES CAUGHT</div> : null}
			</CaseFile>
			<Stamp text="2008" x={820} y={430} t={t} at={n.word(7, 2)} size={100} rot={10} />
		</AbsoluteFill>
	);
};

/** 8 — Detective: "Liars look to the left." */
const EyesMyth: React.FC<ShotCtx> = ({t}) => {
	const look = tween(t, [n.word(8, 5), n.word(8, 8)], [0, -1], ease.inOut);
	return (
		<AbsoluteFill>
			<Interrogation t={t} table={false} />
			<Bust who="detective" x={540} y={1700} size={1180} t={t} talk={talk(t, 'detective')} browL={0.5} browR={0.2} lookX={-0.6} light="right" />
			<Panel x={130} y={300} w={820} h={380} t={t} at={n.word(8, 2)} bg={N.paper} rot={-2}>
				<Eye x={270} y={190} w={300} look={look} />
				<Eye x={550} y={190} w={300} look={look} />
				<div style={{position: 'absolute', left: 30, top: 290, fontFamily: fonts.hand, fontWeight: 700, fontSize: 52, color: N.red, opacity: rise(t, n.word(8, 8), 0.3)}}>← "liar!"</div>
			</Panel>
		</AbsoluteFill>
	);
};

/** 9 — Reader: "A myth. Tested in 2012. Eye direction tells you nothing." */
const Myth: React.FC<ShotCtx> = ({t, s}) => {
	const dart = t > n.word(9, 7) ? Math.sin(t * 3.1) * 0.9 : -1;
	const dartY = t > n.word(9, 7) ? Math.cos(t * 2.3) * 0.7 : 0;
	return (
		<AbsoluteFill>
			<Interrogation t={t} table={false} />
			<Bust who="reader" x={740} y={1730} size={1050} t={t} talk={talk(t, 'reader')} smile={0.3} asym={0.4} browR={0.5} lookX={-0.5} turn={-0.3} />
			<Panel x={130} y={300} w={820} h={380} t={t} at={-1} bg={N.paper} rot={-2}>
				<Eye x={270} y={190} w={300} look={dart} lookY={dartY} />
				<Eye x={550} y={190} w={300} look={dart} lookY={dartY} />
				{t > n.word(9, 9) ? <div style={{position: 'absolute', right: 30, top: 270, fontFamily: fonts.comic, fontSize: 90, color: N.ink, transform: `scale(${pop(t, n.word(9, 9), 0.3)})`}}>= ???</div> : null}
			</Panel>
			<Stamp text="MYTH" x={540} y={490} t={t} at={n.word(9, 1) - 0.05} size={150} rot={-12} />
			<Panel x={100} y={760} w={480} h={150} t={t} at={n.word(9, 3)} bg={N.white} rot={2}>
				<div style={{position: 'absolute', left: 24, top: 20, fontFamily: fonts.mono, fontSize: 30, color: N.ink, lineHeight: 1.5}}>
					Wiseman et al. (2012)
					<br />
					eye direction ≠ lying
				</div>
			</Panel>
		</AbsoluteFill>
	);
};

/** 10 — "Want the truth? Make the story work harder." */
const Outro: React.FC<ShotCtx> = ({t, s, e}) => {
	const card = n.word(10, 6);
	return (
		<AbsoluteFill>
			<BrandVoid t={t} />
			<AbsoluteFill style={{transform: `scale(${push(t, s, e, 1, 1.08)})`, transformOrigin: '540px 900px'}}>
				<Bust who="reader" x={540} y={1760} size={1500} t={t} talk={talk(t, 'reader')} smile={0.5} asym={0.6} browR={0.6} lookX={0} light="right" />
			</AbsoluteFill>
			<Panel x={120} y={310} w={840} h={210} t={t} at={card} bg={N.ink} rot={-3}>
				<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.comic, fontSize: 92, color: N.mustard, letterSpacing: 2}}>◀◀ TELL IT BACKWARDS</div>
			</Panel>
		</AbsoluteFill>
	);
};

export const episode011: NoirEpisodeDef = {
	id: '011',
	timeline: tl,
	audioDir: 'audio/v011',
	hook: 'HOW TO CATCH A LIAR',
	hookUntil: 3.1,
	shots: [
		{at: 0, C: Alibi, cut: 'none'},
		{at: n.start(1) - 0.12, C: TooSmooth},
		{at: n.start(2) - 0.15, C: Backwards},
		{at: n.start(3) - 0.15, C: Stumble},
		{at: n.start(4) - 0.15, C: ThereItIs},
		{at: n.start(5) - 0.15, C: Work},
		{at: n.start(6) - 0.12, C: Overload},
		{at: n.start(7) - 0.12, C: Study},
		{at: n.start(8) - 0.12, C: EyesMyth},
		{at: n.start(9) - 0.12, C: Myth},
		{at: n.start(10) - 0.15, C: Outro},
	],
	sfx: [
		['lamp', 0.0, 0.4],
		['pop', n.word(0, 4), 0.25],
		['pop', n.word(0, 6), 0.25],
		['pop', n.word(0, 12), 0.25],
		['whoosh', n.start(1) - 0.15, 0.25],
		['whoosh', n.start(2) - 0.18, 0.25],
		['rewind', n.word(2, 4), 0.3],
		['heart', n.start(3) + 0.3, 0.5],
		['heart', n.start(3) + 1.1, 0.55],
		['heart', n.start(3) + 1.8, 0.6],
		['heart', n.start(3) + 2.4, 0.65],
		['thud', n.word(3, 10) + 0.5, 0.4],
		['swish', n.start(5) - 0.15, 0.3],
		['pop', n.word(5, 5) - 0.1, 0.25],
		['pop', n.word(5, 8) - 0.1, 0.25],
		['pop', n.word(5, 11) - 0.1, 0.25],
		['buzzer', n.word(6, 13) - 0.05, 0.3],
		['paper', n.start(7) - 0.1, 0.4],
		['stamp', n.word(7, 2), 0.5],
		['ding', n.word(7, 5), 0.3],
		['whoosh', n.start(8) - 0.15, 0.25],
		['stamp', n.word(9, 1) - 0.05, 0.55],
		['buzzer', n.word(9, 1), 0.25],
		['pop', n.word(9, 3), 0.25],
		['zing', n.word(9, 9), 0.3],
		['whoosh', n.start(10) - 0.18, 0.3],
		['stamp', n.word(10, 6), 0.45],
	],
	music: 0.3,
};
