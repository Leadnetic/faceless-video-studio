import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Annot, Burst, Bust, CaseFile, N, Panel, SfxWord, Stamp, talkAmp} from '../components/Noir';
import {pop} from '../components/Toon';
import tlJson from '../data/timeline-015.json';
import {ease, rise, tween} from '../lib/anim';
import {narration, type Timeline} from '../lib/timeline';
import type {NoirEpisodeDef} from '../NoirEpisode';
import {BrandVoid, InkBars, Interrogation, PaperDesk} from '../scenes/noir/Sets';
import {fonts} from '../theme';
import type {ShotCtx} from '../ToonEpisode';

const tl = tlJson as Timeline;
const n = narration(tl);
const talk = (t: number, who: string) => talkAmp(tl, t, who);
const push = (t: number, s: number, e: number, a = 1, b = 1.05) => tween(t, [s, e], [a, b], ease.inOut);

/** Phone on a lock screen: dots for typed digits, tries left, optional unlocked state. */
const LockPhone: React.FC<{x: number; y: number; w: number; typed: string; tries: number; unlocked?: number; rot?: number; strike?: string}> = ({x, y, w, typed, tries, unlocked = 0, rot = 0, strike}) => {
	const h = w * 1.9;
	return (
		<div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `rotate(${rot}deg)`}}>
			<div style={{position: 'absolute', inset: 0, background: N.ink, borderRadius: w * 0.14, boxShadow: `14px 14px 0 rgba(0,0,0,0.45)`}} />
			<div style={{position: 'absolute', inset: w * 0.05, borderRadius: w * 0.1, background: unlocked > 0.5 ? '#1f5c3a' : '#16242b', overflow: 'hidden'}}>
				<div style={{position: 'absolute', left: 0, right: 0, top: h * 0.08, textAlign: 'center', fontFamily: fonts.comic, fontSize: w * 0.11, color: unlocked > 0.5 ? '#9ff2b8' : N.paper, letterSpacing: 2}}>{unlocked > 0.5 ? 'UNLOCKED' : 'ENTER CODE'}</div>
				<div style={{position: 'absolute', left: 0, right: 0, top: h * 0.17, display: 'flex', justifyContent: 'center', gap: w * 0.06}}>
					{[0, 1, 2, 3].map((i) => (
						<div key={i} style={{width: w * 0.1, height: w * 0.1, borderRadius: '50%', border: `4px solid ${N.paper}`, background: i < typed.length ? N.paper : 'transparent'}} />
					))}
				</div>
				{unlocked > 0.5 ? (
					<div style={{position: 'absolute', left: 0, right: 0, top: h * 0.38, textAlign: 'center', fontSize: w * 0.4, color: '#9ff2b8', transform: `scale(${unlocked})`}}>✓</div>
				) : (
					<div style={{position: 'absolute', left: w * 0.12, right: w * 0.12, top: h * 0.27, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: w * 0.04}}>
						{['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', ''].map((k, i) => (
							<div key={i} style={{aspectRatio: '1', borderRadius: '50%', border: k ? `3px solid rgba(239,230,210,0.5)` : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.sans, fontWeight: 600, fontSize: w * 0.1, color: N.paper, background: k && typed.endsWith(k) ? 'rgba(226,179,60,0.6)' : 'transparent'}}>
								{k}
							</div>
						))}
					</div>
				)}
				<div style={{position: 'absolute', left: 0, right: 0, bottom: h * 0.05, textAlign: 'center', fontFamily: fonts.mono, fontSize: w * 0.06, color: '#ff6b5f'}}>{unlocked > 0.5 ? '' : `${tries} ${tries === 1 ? 'TRY' : 'TRIES'} LEFT`}</div>
			</div>
			{strike ? (
				<div style={{position: 'absolute', left: -w * 0.3, right: -w * 0.3, top: -h * 0.18, textAlign: 'center', fontFamily: fonts.comic, fontSize: w * 0.3, color: N.white, WebkitTextStroke: `6px ${N.ink}`, paintOrder: 'stroke fill'}}>{strike}</div>
			) : null}
		</div>
	);
};

/** 0 — "His phone. Four digits. Three tries." */
const Phone: React.FC<ShotCtx> = ({t, s, e}) => (
	<AbsoluteFill>
		<Interrogation t={t} />
		<AbsoluteFill style={{transform: `scale(${push(t, s, e)})`, transformOrigin: '540px 900px'}}>
			<Bust who="detective" x={790} y={1520} size={900} t={t} talk={talk(t, 'detective')} knit={0.3} light="right" lookX={-0.6} lookY={0.4} />
			<LockPhone x={360} y={1010} w={330} typed="" tries={3} rot={-8} />
		</AbsoluteFill>
	</AbsoluteFill>
);

/** 1 — suspect: "You'll never guess it." */
const Smug: React.FC<ShotCtx> = ({t, s, e}) => (
	<AbsoluteFill>
		<Interrogation t={t} table={false} />
		<AbsoluteFill style={{transform: `scale(${push(t, s, e, 1.02, 1.08)})`, transformOrigin: '540px 760px'}}>
			<Bust who="suspect" x={540} y={1720} size={1500} t={t} talk={talk(t, 'suspect')} smile={0.6} asym={-0.6} lids={0.75} browL={0.4} lookX={0.1} />
		</AbsoluteFill>
	</AbsoluteFill>
);

/** 2 — "It's not 1234." */
const Not1234: React.FC<ShotCtx> = ({t}) => (
	<AbsoluteFill>
		<Interrogation t={t} table={false} />
		<Bust who="reader" x={380} y={1700} size={1150} t={t} talk={talk(t, 'reader')} smile={0.4} asym={0.6} browR={0.6} lookX={0.6} turn={0.3} />
		<Panel x={600} y={330} w={400} h={260} t={t} at={n.word(2, 2) - 0.1} bg={N.white} rot={4}>
			<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.comic, fontSize: 130, color: N.ink, letterSpacing: 6}}>1234</div>
		</Panel>
		<Annot x={610} y={400} w={380} h={130} t={t} at={n.word(2, 5)} kind="cross" color={N.red} width={14} />
		<div style={{position: 'absolute', left: 620, top: 650, fontFamily: fonts.hand, fontWeight: 700, fontSize: 56, color: N.mustard, opacity: rise(t, n.word(2, 12), 0.3), transform: 'rotate(-4deg)'}}>too obvious for him</div>
	</AbsoluteFill>
);

/** 3 — "It's a date." */
const ADate: React.FC<ShotCtx> = ({t, s, e}) => {
	const p = pop(t, n.word(3, 2) - 0.1, 0.35);
	return (
		<AbsoluteFill>
			<Interrogation t={t} table={false} />
			<AbsoluteFill style={{transform: `scale(${push(t, s, e, 1, 1.07)})`, transformOrigin: '540px 900px'}}>
				<Bust who="reader" x={540} y={1760} size={1400} t={t} talk={talk(t, 'reader')} smile={0.3} lookX={0.2} browR={0.4} />
			</AbsoluteFill>
			{p > 0 ? (
				<div style={{position: 'absolute', left: 700, top: 330, width: 260, height: 280, transform: `scale(${p}) rotate(6deg)`}}>
					<div style={{position: 'absolute', inset: 0, background: N.white, border: `8px solid ${N.ink}`, boxShadow: `10px 10px 0 ${N.ink}`}} />
					<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 70, background: N.red, borderBottom: `8px solid ${N.ink}`, fontFamily: fonts.comic, fontSize: 52, color: N.white, textAlign: 'center', lineHeight: '70px'}}>JUNE</div>
					<div style={{position: 'absolute', left: 0, right: 0, top: 80, textAlign: 'center', fontFamily: fonts.comic, fontSize: 150, color: N.ink}}>??</div>
				</div>
			) : null}
		</AbsoluteFill>
	);
};

/** 4 — the engraved ring. */
const Ring: React.FC<ShotCtx> = ({t, s}) => {
	const digits = ['0', '6', '1', '4'];
	const at = [n.word(4, 3), n.word(4, 4) - 0.1, n.word(4, 5), n.word(4, 6) - 0.1];
	return (
		<AbsoluteFill>
			<BrandVoid t={t} color={N.teal} dots="#0f1e1f" />
			<Panel x={60} y={300} w={960} h={620} t={t} at={s + 0.02} bg="#1a1a20">
				<svg width={960} height={620} viewBox="0 0 960 620" style={{position: 'absolute', inset: 0}}>
					<defs>
						<linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
							<stop offset="0" stopColor="#fff1b5" />
							<stop offset="0.45" stopColor={N.mustard} />
							<stop offset="1" stopColor="#8a5f12" />
						</linearGradient>
					</defs>
					<ellipse cx={480} cy={310} rx={360} ry={210} fill="none" stroke={N.ink} strokeWidth={110} />
					<ellipse cx={480} cy={310} rx={360} ry={210} fill="none" stroke="url(#gold)" strokeWidth={90} />
					<ellipse cx={480} cy={310} rx={360} ry={210} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={8} strokeDasharray="300 1600" strokeDashoffset={-t * 200} />
				</svg>
				<div style={{position: 'absolute', left: 0, right: 0, top: 455, display: 'flex', justifyContent: 'center', gap: 26}}>
					{digits.map((d, i) => (
						<span key={i} style={{fontFamily: fonts.serifItalic, fontSize: 92, color: '#4a3207', textShadow: '0 2px 0 rgba(255,255,255,0.5)', opacity: rise(t, at[i], 0.2), transform: `scale(${pop(t, at[i], 0.25)})`, display: 'inline-block'}}>
							{d}
							{i === 1 ? <span style={{margin: '0 6px'}}>·</span> : null}
						</span>
					))}
				</div>
			</Panel>
			<Annot x={300} y={730} w={480} h={170} t={t} at={n.word(4, 2)} color={N.mustard} label="engraved" labelX={130} labelY={180} labelSize={64} />
			<SfxWord text="♥ WEDDING DAY" x={540} y={1060} t={t} at={n.word(4, 9)} size={96} color={N.red} rot={-3} />
		</AbsoluteFill>
	);
};

/** 5 — suspect cracks. */
const Crack: React.FC<ShotCtx> = ({t, s, e}) => (
	<AbsoluteFill>
		<Interrogation t={t} table={false} swing={2} />
		<AbsoluteFill style={{transform: `translateX(${Math.sin(t * 40) * 4}px) scale(${push(t, s, e, 1.04, 1.12)})`, transformOrigin: '540px 760px'}}>
			<Bust who="suspect" x={540} y={1740} size={1550} t={t} talk={talk(t, 'suspect')} open={0.25} smile={-0.4} sweat={1} browL={0.9} browR={0.9} lids={1.15} lookX={Math.sin(t * 6) * 0.5} />
		</AbsoluteFill>
	</AbsoluteFill>
);

/** 6 — 0614 → unlocked. "We're in." */
const Unlock: React.FC<ShotCtx> = ({t, s}) => {
	const typed = '0614'.slice(0, Math.max(0, Math.min(4, Math.floor((t - s) / 0.09))));
	const un = pop(t, n.word(6, 0) + 0.1, 0.3);
	return (
		<AbsoluteFill>
			<Burst cx={540} cy={800} t={t} color={un > 0 ? '#1f5c3a' : N.tealMid} bg={un > 0 ? '#2f8a57' : N.teal} n={40} spin={6} />
			<LockPhone x={540} y={820} w={400} typed={typed} tries={3} unlocked={un} />
			{un > 0 ? <SfxWord text="CLICK." x={840} y={420} t={t} at={n.word(6, 0) + 0.1} size={110} color={N.white} rot={10} /> : null}
		</AbsoluteFill>
	);
};

/** 7 — 3.4 million leaked codes. */
const Study: React.FC<ShotCtx> = ({t, s}) => (
	<AbsoluteFill>
		<Interrogation t={t} lamp={false} table={false} blinds={0.5} />
		<CaseFile x={90} y={330} w={900} h={760} t={t} at={s + 0.05} title="CASE FILE · PIN CODES" lines={['analysis: DataGenetics (2012)', '3.4 million 4-digit codes', 'source: leaked password lists']}>
			<div style={{position: 'absolute', left: 40, right: 40, top: 300, display: 'flex', flexWrap: 'wrap', gap: 10, fontFamily: fonts.mono, fontSize: 30, color: N.ink, opacity: 0.75}}>
				{new Array(54).fill(0).map((_, i) => (
					<span key={i} style={{opacity: rise(t, n.word(7, 7) + i * 0.03, 0.15)}}>
						{String((i * 7919 + 1234) % 10000).padStart(4, '0')}
					</span>
				))}
			</div>
		</CaseFile>
		<Stamp text="3.4M" x={820} y={420} t={t} at={n.word(7, 6)} size={110} rot={10} />
	</AbsoluteFill>
);

/** 8 — the most common codes. */
const Top: React.FC<ShotCtx> = ({t, s}) => (
	<AbsoluteFill>
		<PaperDesk />
		<div style={{position: 'absolute', left: 120, top: 280, fontFamily: fonts.comic, fontSize: 76, color: N.ink}}>MOST COMMON PINS</div>
		<InkBars x={140} y={420} w={800} h={560} t={t} at={s + 0.1} values={[10.7, 6.0, 1.9, 1.2, 0.7]} labels={['1234', '1111', '0000', '1212', '7777']} hot={0} max={11} />
		<div style={{position: 'absolute', left: 290, top: 400, fontFamily: fonts.hand, fontWeight: 700, fontSize: 62, color: N.red, opacity: rise(t, n.word(8, 7), 0.3)}}>← 10.7 %</div>
		<Stamp text="TOP 20 = ¼ OF ALL" x={640} y={640} t={t} at={n.word(8, 20)} size={84} rot={-8} />
		<div style={{position: 'absolute', left: 140, top: 1110, fontFamily: fonts.mono, fontSize: 22, color: N.ink, opacity: 0.6}}>DataGenetics analysis, 3.4M leaked 4-digit codes</div>
	</AbsoluteFill>
);

/** 9 — then come the dates. */
const Dates: React.FC<ShotCtx> = ({t}) => {
	const cards: [string, string, number][] = [
		['BIRTH YEAR', '19··', n.word(9, 7)],
		['BIRTHDAY', '0312', n.word(9, 9)],
		['ANNIVERSARY', '0614', n.word(9, 10)],
	];
	return (
		<AbsoluteFill>
			<BrandVoid t={t} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', fontFamily: fonts.comic, fontSize: 96, color: N.ink, transform: `scale(${pop(t, n.word(9, 6) - 0.1, 0.3)})`}}>THEN: DATES</div>
			{cards.map(([label, code, at], i) => {
				const p = pop(t, at - 0.1, 0.3);
				if (p <= 0) return null;
				return (
					<div key={label} style={{position: 'absolute', left: 120, top: 450 + i * 210, width: 820, height: 180, transform: `scale(${p}) rotate(${(i - 1) * 2}deg)`}}>
						<div style={{position: 'absolute', inset: 0, background: N.white, border: `8px solid ${N.ink}`, boxShadow: `10px 10px 0 ${N.ink}`}} />
						<div style={{position: 'absolute', left: 36, top: 52, fontFamily: fonts.comic, fontSize: 70, color: N.ink}}>{label}</div>
						<div style={{position: 'absolute', right: 36, top: 30, fontFamily: fonts.comic, fontSize: 110, color: N.red, letterSpacing: 6}}>{code}</div>
					</div>
				);
			})}
		</AbsoluteFill>
	);
};

/** 10 — one code reused everywhere. */
const Reuse: React.FC<ShotCtx> = ({t, s}) => {
	const items: [string, string, number][] = [
		['📱', 'PHONE', n.word(10, 10)],
		['💳', 'BANK CARD', n.word(10, 12)],
		['🚪', 'FRONT DOOR', n.word(10, 16)],
	];
	return (
		<AbsoluteFill>
			<Interrogation t={t} lamp={false} table={false} blinds={0.5} />
			<AbsoluteFill style={{background: 'rgba(14,13,18,0.45)'}} />
			<Panel x={360} y={300} w={360} h={170} t={t} at={s + 0.05} bg={N.mustard}>
				<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.comic, fontSize: 110, color: N.ink, letterSpacing: 6}}>0614</div>
			</Panel>
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
				{items.map(([, , at], i) => {
					const p = rise(t, at - 0.2, 0.3);
					const x2 = 200 + i * 340;
					return <line key={i} x1={540} y1={480} x2={540 + (x2 - 540) * p} y2={480 + 280 * p} stroke={N.mustard} strokeWidth={10} strokeDasharray="20 12" />;
				})}
			</svg>
			{items.map(([icon, label, at], i) => {
				const p = pop(t, at - 0.05, 0.3);
				if (p <= 0) return null;
				return (
					<div key={label} style={{position: 'absolute', left: 200 + i * 340 - 140, top: 760, width: 280, height: 300, transform: `scale(${p})`}}>
						<div style={{position: 'absolute', inset: 0, background: N.paper, border: `8px solid ${N.ink}`, boxShadow: `10px 10px 0 ${N.ink}`}} />
						<div style={{position: 'absolute', left: 0, right: 0, top: 30, textAlign: 'center', fontSize: 130}}>{icon}</div>
						<div style={{position: 'absolute', left: 0, right: 0, bottom: 26, textAlign: 'center', fontFamily: fonts.comic, fontSize: 46, color: N.ink}}>{label}</div>
					</div>
				);
			})}
		</AbsoluteFill>
	);
};

/** 11 — "easy to remember = easy to guess". */
const Equation: React.FC<ShotCtx> = ({t, s, e}) => (
	<AbsoluteFill>
		<Interrogation t={t} table={false} />
		<AbsoluteFill style={{transform: `scale(${push(t, s, e)})`, transformOrigin: '540px 1000px'}}>
			<Bust who="reader" x={540} y={1760} size={1180} t={t} talk={talk(t, 'reader')} smile={0.35} asym={0.4} lookX={0} />
		</AbsoluteFill>
		<Panel x={90} y={320} w={900} h={260} t={t} at={n.word(11, 3) - 0.1} bg={N.white} rot={-2}>
			<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, fontFamily: fonts.comic, fontSize: 76, color: N.ink}}>
				EASY TO REMEMBER
				<span style={{color: N.red, opacity: rise(t, n.word(11, 7), 0.2)}}>=</span>
			</div>
		</Panel>
		<Stamp text="EASY TO GUESS" x={540} y={680} t={t} at={n.word(11, 14) - 0.05} size={96} rot={-6} blend="normal" />
	</AbsoluteFill>
);

/** 12+13 — change it tonight; six digits, random. */
const Rules: React.FC<ShotCtx> = ({t}) => {
	const rows: [string, number, boolean][] = [
		['a date', n.word(12, 6), false],
		['a pattern', n.word(12, 8), false],
		['a repeat', n.word(12, 11), false],
		['6 digits > 4', n.word(13, 0), true],
		['random > meaningful', n.word(13, 4), true],
	];
	return (
		<AbsoluteFill>
			<PaperDesk />
			<div style={{position: 'absolute', left: 120, top: 270, fontFamily: fonts.comic, fontSize: 84, color: N.ink}}>CHANGE IT IF IT'S…</div>
			{rows.map(([text, at, good], i) => (
				<div key={text} style={{position: 'absolute', left: 140, top: 400 + i * 130 + (i > 2 ? 40 : 0), display: 'flex', alignItems: 'center', gap: 28, opacity: rise(t, at - 0.1, 0.2), transform: `translateX(${(1 - rise(t, at - 0.1, 0.3)) * -60}px)`}}>
					<div style={{width: 84, height: 84, border: `7px solid ${N.ink}`, background: good ? '#5fd17a' : N.red, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.comic, fontSize: 70, color: N.white}}>{good ? '✓' : '✗'}</div>
					<div style={{fontFamily: fonts.hand, fontWeight: 700, fontSize: 72, color: N.ink}}>{text}</div>
				</div>
			))}
		</AbsoluteFill>
	);
};

/** 14 — "Send this to the friend whose code is 1234." */
const Cta: React.FC<ShotCtx> = ({t, s}) => {
	const at = n.word(14, 1);
	const p = tween(t, [at, at + 0.5], [0, 1], ease.out);
	return (
		<AbsoluteFill>
			<Interrogation t={t} table={false} />
			<Bust who="reader" x={400} y={1720} size={1300} t={t} talk={talk(t, 'reader')} smile={0.6} asym={0.8} browR={0.8} lookX={0.4} />
			<LockPhone x={790} y={560} w={240} typed="1234" tries={3} rot={8} strike="1234?" />
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
				<path d="M820 900 C910 1000 925 1130 935 1260" stroke={N.mustard} strokeWidth={12} fill="none" strokeLinecap="round" strokeDasharray={400} strokeDashoffset={400 * (1 - p)} />
				{p > 0.95 ? <path d="M905 1232 L937 1270 L957 1220" stroke={N.mustard} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
			</svg>
			<div style={{position: 'absolute', left: 600, top: 830, fontFamily: fonts.hand, fontWeight: 700, fontSize: 54, color: N.mustard, transform: `rotate(-6deg) scale(${pop(t, at, 0.3)})`}}>send it</div>
		</AbsoluteFill>
	);
};

export const episode015: NoirEpisodeDef = {
	id: '015',
	timeline: tl,
	audioDir: 'audio/v015',
	hook: 'HE GUESSED HIS PIN',
	hookUntil: 3.0,
	shots: [
		{at: 0, C: Phone, cut: 'none'},
		{at: n.start(1) - 0.12, C: Smug},
		{at: n.start(2) - 0.12, C: Not1234},
		{at: n.start(3) - 0.12, C: ADate},
		{at: n.start(4) - 0.12, C: Ring},
		{at: n.start(5) - 0.12, C: Crack},
		{at: n.start(6) - 0.45, C: Unlock},
		{at: n.start(7) - 0.12, C: Study},
		{at: n.start(8) - 0.12, C: Top},
		{at: n.start(9) - 0.12, C: Dates},
		{at: n.start(10) - 0.12, C: Reuse},
		{at: n.start(11) - 0.12, C: Equation},
		{at: n.start(12) - 0.12, C: Rules},
		{at: n.start(14) - 0.12, C: Cta},
	],
	sfx: [
		['lamp', 0.0, 0.35],
		['whoosh', n.start(1) - 0.15, 0.25],
		['whoosh', n.start(2) - 0.15, 0.25],
		['scratch', n.word(2, 5), 0.3],
		['pop', n.word(3, 2) - 0.1, 0.3],
		['swish', n.start(4) - 0.12, 0.3],
		['zing', n.word(4, 2), 0.3],
		['tick', n.word(4, 3), 0.5],
		['tick', n.word(4, 4) - 0.1, 0.5],
		['tick', n.word(4, 5), 0.5],
		['tick', n.word(4, 6) - 0.1, 0.5],
		['heart', n.start(5), 0.55],
		['tick', n.start(6) - 0.45, 0.4],
		['tick', n.start(6) - 0.36, 0.4],
		['tick', n.start(6) - 0.27, 0.4],
		['tick', n.start(6) - 0.18, 0.4],
		['ding', n.word(6, 0) + 0.1, 0.45],
		['paper', n.start(7) - 0.1, 0.4],
		['type', n.word(7, 7), 0.25],
		['stamp', n.word(7, 6), 0.5],
		['swish', n.start(8) - 0.12, 0.3],
		['stamp', n.word(8, 20), 0.5],
		['pop', n.word(9, 7) - 0.1, 0.25],
		['pop', n.word(9, 9) - 0.1, 0.25],
		['pop', n.word(9, 10) - 0.1, 0.25],
		['zing', n.word(10, 10), 0.25],
		['zing', n.word(10, 12), 0.25],
		['zing', n.word(10, 16), 0.25],
		['stamp', n.word(11, 14) - 0.05, 0.45],
		['swish', n.start(12) - 0.12, 0.3],
		['pop', n.word(13, 0), 0.25],
		['pop', n.word(13, 4), 0.25],
		['whoosh', n.start(14) - 0.15, 0.3],
	],
	music: 0.28,
};
