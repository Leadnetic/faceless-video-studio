import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Annot, Burst, Bust, CaseFile, N, Panel, SfxWord, Stamp, talkAmp} from '../components/Noir';
import {pop} from '../components/Toon';
import tlJson from '../data/timeline-010.json';
import {ease, rise, tween} from '../lib/anim';
import {narration, type Timeline} from '../lib/timeline';
import type {NoirEpisodeDef} from '../NoirEpisode';
import {BrandVoid, Coin, Crowd, CrystalBall, Interrogation, PaperDesk, Parlor, Ticket} from '../scenes/noir/Sets';
import {fonts} from '../theme';
import type {ShotCtx} from '../ToonEpisode';

const tl = tlJson as Timeline;
const n = narration(tl);
const talk = (t: number, who: string) => talkAmp(tl, t, who);
const push = (t: number, s: number, e: number, a = 1, b = 1.06) => tween(t, [s, e], [a, b], ease.inOut);

/** A typed "personality profile" sheet. */
const Sheet: React.FC<{x: number; y: number; w: number; name: string; rot?: number; hi?: number; style?: React.CSSProperties}> = ({x, y, w, name, rot = 0, hi = 0, style}) => (
	<div style={{position: 'absolute', left: x, top: y, width: w, height: w * 1.3, transform: `rotate(${rot}deg)`, ...style}}>
		<div style={{position: 'absolute', inset: 0, background: N.white, border: `6px solid ${N.ink}`, boxShadow: `8px 8px 0 ${N.ink}`}} />
		<div style={{position: 'absolute', left: w * 0.08, top: w * 0.07, fontFamily: fonts.mono, fontSize: w * 0.075, color: N.ink, letterSpacing: 2}}>PROFILE</div>
		<div style={{position: 'absolute', right: w * 0.08, top: w * 0.05, fontFamily: fonts.hand, fontWeight: 700, fontSize: w * 0.11, color: '#1b3a8a'}}>{name}</div>
		{[0, 1, 2, 3, 4, 5, 6].map((i) => (
			<div key={i} style={{position: 'absolute', left: w * 0.08, top: w * (0.28 + i * 0.13), width: w * (i % 3 === 2 ? 0.6 : 0.84), height: w * 0.045, background: N.ink, opacity: 0.75}}>
				{hi > 0 && (i === 1 || i === 4) ? <div style={{position: 'absolute', left: -4, top: -w * 0.02, height: w * 0.085, width: `${hi * 104}%`, background: N.mustard, mixBlendMode: 'multiply', opacity: 0.9}} /> : null}
			</div>
		))}
	</div>
);

/** 0 — the psychic over her crystal ball. */
const Psychic: React.FC<ShotCtx> = ({t, s, e}) => (
	<AbsoluteFill>
		<Parlor t={t} ball={false} />
		<AbsoluteFill style={{transform: `scale(${push(t, s, e, 1, 1.07)})`, transformOrigin: '540px 700px'}}>
			<Bust who="psychic" x={540} y={1360} size={1060} t={t} talk={talk(t, 'psychic')} lids={0.55} smile={0.25} light="right" lookY={-0.3} />
			<CrystalBall x={540} y={1380} r={170} t={t} glow={1 + 0.3 * Math.sin(t * 3)} />
		</AbsoluteFill>
	</AbsoluteFill>
);

/** 1 — the client: "That's... exactly me." */
const Client: React.FC<ShotCtx> = ({t, s}) => (
	<AbsoluteFill>
		<Parlor t={t} ball={false} />
		<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, rgba(199,155,220,0.45), transparent 60%)'}} />
		<Bust who="client" x={540} y={1700} size={1480} t={t} talk={talk(t, 'client')} smile={0.75} blush={0.9} lids={1.15} browL={0.8} browR={0.8} lookY={-0.2} light="right" />
		<SfxWord text="*gasp*" x={830} y={420} t={t} at={s + 0.1} size={80} color={N.white} rot={8} />
	</AbsoluteFill>
);

/** 2 — the Reader leans out of the dark: "That's everyone." */
const Everyone: React.FC<ShotCtx> = ({t, s}) => {
	const at = n.word(2, 1);
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: N.ink}} />
			<Crowd x={60} y={250} cols={8} rows={6} cell={120} t={t} at={at - 0.1} dur={0.5} color={N.tealMid} mark={() => 'me!'} markAt={at + 0.1} />
			<AbsoluteFill style={{background: 'linear-gradient(180deg, transparent 40%, rgba(14,13,18,0.9) 75%)'}} />
			<Bust who="reader" x={560} y={1760} size={1350} t={t} talk={talk(t, 'reader')} smile={0.5} asym={0.85} browR={0.9} lookX={-0.2} rim={N.mustard} style={{transform: `translateX(${(1 - rise(t, s, 0.35)) * 400}px)`}} />
		</AbsoluteFill>
	);
};

/** 3 — 1948: Forer's classroom. */
const Classroom: React.FC<ShotCtx> = ({t, s}) => (
	<AbsoluteFill>
		<Interrogation t={t} lamp={false} table={false} blinds={0.4} tone={N.tealMid} />
		<Panel x={80} y={300} w={920} h={420} t={t} at={s + 0.05} bg="#163032">
			<div style={{position: 'absolute', left: 40, top: 30, fontFamily: fonts.hand, fontWeight: 700, fontSize: 70, color: N.paper, lineHeight: 1.2}}>
				Personality test
				<br />
				<span style={{fontSize: 52, opacity: rise(t, n.word(3, 6), 0.4)}}>— Prof. B. R. Forer</span>
			</div>
			<div style={{position: 'absolute', left: 40, top: 270, display: 'flex', gap: 20, opacity: rise(t, n.word(3, 10), 0.4)}}>
				{['☐ a', '☐ b', '☐ c', '☐ d'].map((q) => (
					<div key={q} style={{fontFamily: fonts.hand, fontWeight: 700, fontSize: 50, color: N.mustard}}>
						{q}
					</div>
				))}
			</div>
		</Panel>
		<Crowd x={130} y={800} cols={9} rows={4} cell={88} t={t} at={n.word(3, 9) - 0.2} dur={1.0} color={N.paper} />
		<Stamp text="1948" x={840} y={330} t={t} at={n.word(3, 1)} size={96} rot={10} />
	</AbsoluteFill>
);

/** 4 — personal profiles; rated 4.3 / 5. */
const Profiles: React.FC<ShotCtx> = ({t, s}) => {
	const names = ['Anna', 'Ben', 'Chloe', 'Dev', 'Ella'];
	const rateAt = n.word(4, 9);
	const stars = tween(t, [rateAt, rateAt + 1.0], [0, 4.3], ease.out);
	return (
		<AbsoluteFill>
			<PaperDesk lines={false} />
			{names.map((nm, i) => {
				const p = pop(t, n.word(4, 7) - 0.4 + i * 0.12, 0.35);
				return <Sheet key={nm} x={90 + i * 150} y={330 + (i % 2) * 40} w={300} name={nm} rot={-10 + i * 5} style={{transform: `translateY(${(1 - p) * 900}px) rotate(${-10 + i * 5}deg)`, opacity: Math.min(1, p * 3)}} />;
			})}
			<div style={{position: 'absolute', left: 90, top: 870, width: 860, height: 230, opacity: rise(t, rateAt - 0.2, 0.3), transform: `scale(${pop(t, rateAt - 0.2, 0.35)})`}}>
				<div style={{position: 'absolute', inset: 0, background: N.ink, border: `7px solid ${N.ink}`, boxShadow: `10px 10px 0 ${N.mustardDeep}`}} />
				<div style={{position: 'absolute', left: 30, top: 34, display: 'flex', gap: 10}}>
					{[0, 1, 2, 3, 4].map((i) => {
						const f = Math.max(0, Math.min(1, stars - i));
						return (
							<div key={i} style={{position: 'relative', width: 96, height: 96, fontSize: 96, lineHeight: '96px', fontFamily: fonts.sans}}>
								<span style={{position: 'absolute', color: '#3a3a44'}}>★</span>
								<span style={{position: 'absolute', color: N.mustard, clipPath: `inset(0 ${100 - f * 100}% 0 0)`}}>★</span>
							</div>
						);
					})}
				</div>
				<div style={{position: 'absolute', right: 36, top: 20, fontFamily: fonts.comic, fontSize: 140, lineHeight: 1, color: N.mustard}}>{stars.toFixed(1)}</div>
				<div style={{position: 'absolute', left: 36, bottom: 16, fontFamily: fonts.mono, fontSize: 30, color: N.paper, letterSpacing: 3}}>“HOW ACCURATE IS THIS?” · MEAN /5</div>
			</div>
		</AbsoluteFill>
	);
};

/** 5 — the catch: every sheet was the same. */
const Same: React.FC<ShotCtx> = ({t, s}) => {
	const merge = tween(t, [n.word(5, 4), n.word(5, 4) + 0.7], [0, 1], ease.inOut);
	const names = ['Anna', 'Ben', 'Chloe', 'Dev', 'Ella'];
	return (
		<AbsoluteFill>
			<PaperDesk lines={false} />
			{names.map((nm, i) => {
				const x0 = 90 + i * 150;
				const r0 = -10 + i * 5;
				return <Sheet key={nm} x={x0 + (300 - x0) * merge + i * 18 * merge} y={360 + (i % 2) * 40 * (1 - merge) + i * 14 * merge} w={360 - 60 * (1 - merge)} name={nm} rot={r0 * (1 - merge)} hi={rise(t, n.word(5, 9), 0.5)} />;
			})}
			<Stamp text="SAME TEXT" x={540} y={760} t={t} at={n.word(5, 10)} size={120} rot={-14} />
			<Annot x={240} y={1000} w={600} h={10} t={t} at={n.word(5, 9)} kind="underline" color={N.red} label="word for word." labelX={130} labelY={18} labelSize={60} />
		</AbsoluteFill>
	);
};

/** 6 — copied from a horoscope book. */
const Horoscope: React.FC<ShotCtx> = ({t, s}) => {
	const open = tween(t, [s + 0.1, s + 0.7], [0, 1], ease.out);
	const signs = '♈♉♊♋♌♍♎♏♐♑♒♓';
	return (
		<AbsoluteFill>
			<BrandVoid t={t} color={N.plum} dots="#24112e" />
			<div style={{position: 'absolute', left: 90, top: 380, width: 900, height: 600, transform: `scale(${0.7 + 0.3 * open}) rotate(-3deg)`}}>
				<div style={{position: 'absolute', inset: -20, background: N.redDeep, border: `8px solid ${N.ink}`, borderRadius: 18, boxShadow: `14px 14px 0 ${N.ink}`}} />
				<div style={{position: 'absolute', left: 0, top: 0, width: 450, height: 600, background: N.paper, border: `6px solid ${N.ink}`, transformOrigin: 'right center', transform: `perspective(1600px) rotateY(${(1 - open) * 170}deg)`}}>
					<svg width={450} height={600} viewBox="-225 -300 450 600">
						<circle r={170} fill="none" stroke={N.ink} strokeWidth={6} />
						<circle r={110} fill="none" stroke={N.ink} strokeWidth={4} />
						{signs.split('').map((g, i) => {
							const a = (i / 12) * Math.PI * 2 + t * 0.2;
							return (
								<text key={i} x={Math.cos(a) * 140} y={Math.sin(a) * 140 + 14} fontSize={38} textAnchor="middle" fill={N.redDeep}>
									{g}
								</text>
							);
						})}
						<line x1={-170} y1={0} x2={170} y2={0} stroke={N.ink} strokeWidth={3} />
						<line x1={0} y1={-170} x2={0} y2={170} stroke={N.ink} strokeWidth={3} />
					</svg>
				</div>
				<div style={{position: 'absolute', left: 450, top: 0, width: 450, height: 600, background: N.paper, border: `6px solid ${N.ink}`}}>
					<div style={{position: 'absolute', left: 30, top: 30, fontFamily: fonts.comic, fontSize: 56, color: N.redDeep}}>YOUR STARS</div>
					{[0, 1, 2, 3, 4, 5, 6].map((i) => (
						<div key={i} style={{position: 'absolute', left: 30, top: 120 + i * 62, width: i % 3 === 2 ? 260 : 380, height: 18, background: N.ink, opacity: 0.7}}>
							{i === 1 || i === 4 ? <div style={{position: 'absolute', inset: -8, background: N.mustard, mixBlendMode: 'multiply', clipPath: `inset(0 ${100 - rise(t, n.word(6, 7), 0.5) * 100}% 0 0)`}} /> : null}
						</div>
					))}
				</div>
			</div>
			<SfxWord text="SNIP!" x={800} y={1100} t={t} at={n.word(6, 1)} size={120} color={N.mustard} rot={-10} />
		</AbsoluteFill>
	);
};

/** 7 — "Vague. Flattering. And it covers both sides." */
const Recipe: React.FC<ShotCtx> = ({t, s, e}) => {
	const card = (label: string, at: number, y: number, rot: number, extra?: React.ReactNode) => {
		const p = pop(t, at, 0.3);
		if (p <= 0) return null;
		return (
			<div style={{position: 'absolute', left: 520, top: y, width: 440, height: 170, transform: `scale(${p}) rotate(${rot}deg)`}}>
				<div style={{position: 'absolute', inset: 0, background: N.mustard, border: `7px solid ${N.ink}`, boxShadow: `10px 10px 0 ${N.ink}`}} />
				<div style={{position: 'absolute', left: 30, top: 34, fontFamily: fonts.comic, fontSize: 92, color: N.ink, letterSpacing: 2}}>{label}</div>
				{extra}
			</div>
		);
	};
	const flip = tween(t, [n.word(7, 4), n.word(7, 6) + 0.4], [0, 3], (x) => x);
	return (
		<AbsoluteFill>
			<Interrogation t={t} table={false} lamp={false} tone="#2a1f2e" />
			<AbsoluteFill style={{transform: `scale(${push(t, s, e, 1, 1.04)})`, transformOrigin: '300px 900px'}}>
				<Bust who="reader" x={300} y={1700} size={1150} t={t} talk={talk(t, 'reader')} smile={0.35} asym={0.4} lookX={0.6} turn={0.4} browL={0.4} />
			</AbsoluteFill>
			{card('1 · VAGUE', n.word(7, 0), 330, -4)}
			{card('2 · FLATTERY', n.word(7, 1), 560, 3)}
			{card('3 · BOTH', n.word(7, 4), 790, -2, <Coin x={360} y={85} r={56} spin={flip} label={Math.cos(flip * Math.PI * 2) >= 0 ? 'A' : 'B'} />)}
		</AbsoluteFill>
	);
};

/** 8 — "Sometimes you're outgoing, but other times you need to be alone." */
const BothSides: React.FC<ShotCtx> = ({t, s}) => {
	const a1 = n.word(8, 3) - 0.2;
	const a2 = n.word(8, 5);
	return (
		<AbsoluteFill>
			<Interrogation t={t} table={false} lamp={false} tone="#2a1f2e" />
			<Bust who="reader" x={540} y={1760} size={1180} t={t} talk={talk(t, 'reader')} smile={0.4} asym={0.4} browR={0.5} lookX={0} light="right" />
			<Panel x={60} y={300} w={460} h={500} t={t} at={a1} bg={N.mustard} rot={-2} from="left">
				{new Array(16).fill(0).map((_, i) => (
					<div key={i} style={{position: 'absolute', left: (i * 97) % 440, top: (i * 61 + t * 160) % 520 - 20, width: 18, height: 30, background: [N.red, N.teal, N.white][i % 3], transform: `rotate(${i * 40 + t * 200}deg)`}} />
				))}
				<Crowd x={40} y={250} cols={4} rows={2} cell={95} t={t} at={a1} dur={0.2} color={N.ink} />
				<div style={{position: 'absolute', left: 24, top: 20, fontFamily: fonts.comic, fontSize: 76, color: N.ink}}>OUTGOING</div>
			</Panel>
			<Panel x={560} y={300} w={460} h={500} t={t} at={a2} bg="#1b2d33" rot={2} from="right">
				{new Array(24).fill(0).map((_, i) => (
					<div key={i} style={{position: 'absolute', left: (i * 53) % 460, top: ((i * 89 + t * 900) % 560) - 40, width: 4, height: 40, background: 'rgba(200,230,240,0.45)', transform: 'rotate(12deg)'}} />
				))}
				<Crowd x={180} y={290} cols={1} rows={1} cell={110} t={t} at={a2} dur={0.1} color={N.paper} />
				<div style={{position: 'absolute', left: 24, top: 20, fontFamily: fonts.comic, fontSize: 76, color: N.paper}}>ALONE</div>
			</Panel>
		</AbsoluteFill>
	);
};

/** 9 — "Felt personal, didn't it?" */
const Personal: React.FC<ShotCtx> = ({t, s}) => (
	<AbsoluteFill>
		<Burst cx={540} cy={760} t={t} color={N.mustardDeep} bg={N.mustard} n={40} spin={5} r0={300} />
		<Bust who="reader" x={540} y={1840} size={1750} t={t} talk={talk(t, 'reader')} smile={0.65} asym={0.9} browR={1} browL={-0.1} lookX={0.05} tilt={tween(t, [s, s + 1], [0, -4])} />
	</AbsoluteFill>
);

/** 10 — "It's called the Barnum effect. Now you can't unsee it." */
const Barnum: React.FC<ShotCtx> = ({t, s}) => {
	const eyeAt = n.word(10, 7);
	const ep = pop(t, eyeAt - 0.1, 0.3);
	return (
		<AbsoluteFill>
			<Burst cx={540} cy={640} t={t} color={N.redDeep} bg={N.red} n={36} spin={4} />
			<Ticket x={540} y={620} w={900} t={t} at={n.word(10, 2) - 0.2} title={'THE BARNUM\nEFFECT'} sub="ADMIT ONE · EVERYONE" rot={-5} />
			{ep > 0 ? (
				<div style={{position: 'absolute', left: 540 - 160, top: 900, width: 320, height: 180, transform: `scale(${ep})`}}>
					<svg width={320} height={180} viewBox="-160 -90 320 180">
						<path d="M-150 0 Q0 -110 150 0 Q0 110 -150 0 Z" fill={N.white} stroke={N.ink} strokeWidth={10} />
						<circle r={52} fill={N.tealMid} stroke={N.ink} strokeWidth={8} />
						<circle r={24} fill={N.ink} />
						<circle cx={16} cy={-18} r={10} fill="#fff" />
					</svg>
				</div>
			) : null}
			<SfxWord text="CAN'T UNSEE" x={540} y={1130} t={t} at={eyeAt} size={92} color={N.mustard} rot={-3} />
		</AbsoluteFill>
	);
};

export const episode010: NoirEpisodeDef = {
	id: '010',
	timeline: tl,
	audioDir: 'audio/v010',
	hook: "PSYCHIC'S #1 TRICK",
	hookUntil: 3.8,
	shots: [
		{at: 0, C: Psychic, cut: 'none'},
		{at: n.start(1) - 0.12, C: Client},
		{at: n.start(2) - 0.15, C: Everyone},
		{at: n.start(3) - 0.15, C: Classroom},
		{at: n.start(4) - 0.12, C: Profiles},
		{at: n.start(5) - 0.12, C: Same},
		{at: n.start(6) - 0.12, C: Horoscope},
		{at: n.start(7) - 0.15, C: Recipe},
		{at: n.start(8) - 0.12, C: BothSides},
		{at: n.start(9) - 0.12, C: Personal},
		{at: n.start(10) - 0.15, C: Barnum},
	],
	sfx: [
		['shimmer', 0.05, 0.35],
		['shimmer', n.start(1) - 0.1, 0.2],
		['whoosh', n.start(2) - 0.2, 0.35],
		['pop', n.word(2, 1), 0.3],
		['swish', n.start(3) - 0.15, 0.3],
		['stamp', n.word(3, 1), 0.5],
		['pop', n.word(3, 9) - 0.2, 0.25],
		['paper', n.word(4, 7) - 0.4, 0.45],
		['paper', n.word(4, 7) - 0.1, 0.35],
		['ding', n.word(4, 9), 0.3],
		['swish', n.word(5, 4), 0.35],
		['stamp', n.word(5, 10), 0.55],
		['swish', n.start(6) - 0.05, 0.35],
		['scratch', n.word(6, 1), 0.3],
		['pop', n.word(7, 0), 0.3],
		['pop', n.word(7, 1), 0.3],
		['coin', n.word(7, 4), 0.35],
		['whoosh', n.word(8, 3) - 0.25, 0.3],
		['whoosh', n.word(8, 5) - 0.05, 0.3],
		['ding', n.start(9) - 0.05, 0.3],
		['whoosh', n.start(10) - 0.2, 0.35],
		['zing', n.word(10, 7), 0.35],
	],
	music: 0.3,
};
