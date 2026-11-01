import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Annot, Burst, Bust, CaseFile, N, Panel, SfxWord, Stamp, talkAmp} from '../components/Noir';
import {pop} from '../components/Toon';
import tlJson from '../data/timeline-009.json';
import {ease, rise, tween} from '../lib/anim';
import {narration, type Timeline} from '../lib/timeline';
import type {NoirEpisodeDef} from '../NoirEpisode';
import {BrandVoid, Coin, Crowd, InkBars, Interrogation, NumCard, PaperDesk} from '../scenes/noir/Sets';
import {fonts} from '../theme';
import type {ShotCtx} from '../ToonEpisode';

const tl = tlJson as Timeline;
const n = narration(tl);
const talk = (t: number, who: string) => talkAmp(tl, t, who);
const push = (t: number, s: number, e: number, a = 1, b = 1.06) => tween(t, [s, e], [a, b], ease.inOut);

/** 0 — "Think of a number between one and ten." Reader to camera, digits orbit his head, a coin toss. */
const Hook: React.FC<ShotCtx> = ({t, s, e}) => {
	const toss = tween(t, [1.3, 2.4], [0, 1], (x) => x);
	const coinY = 1250 - Math.sin(toss * Math.PI) * 520;
	return (
		<AbsoluteFill>
			<Interrogation t={t} table={false} />
			<AbsoluteFill style={{transform: `scale(${push(t, s, e, 1.0, 1.08)})`, transformOrigin: '540px 760px'}}>
				{new Array(10).fill(0).map((_, i) => {
					const a = (i / 10) * Math.PI * 2 + t * 0.35;
					const p = pop(t, n.word(0, 3) + i * 0.06, 0.3);
					return (
						<div key={i} style={{position: 'absolute', left: 540 + Math.cos(a) * 420 - 40, top: 720 + Math.sin(a) * 300 - 50, width: 80, textAlign: 'center', fontFamily: fonts.hand, fontWeight: 700, fontSize: 84, color: N.mustard, opacity: 0.85 * p, transform: `scale(${p})`}}>
							{i + 1}
						</div>
					);
				})}
				<Bust who="reader" x={540} y={1660} size={1450} t={t} talk={talk(t, 'reader')} smile={0.45} asym={0.5} browR={0.5} lookX={Math.sin(t * 0.8) * 0.15} />
				{toss > 0 && toss < 1 ? <Coin x={860} y={coinY} r={46} spin={toss * 4} label="?" /> : null}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

/** 1 — "Don't say it. Just hold it." Extreme close-up on the eyes, a sealed thought. */
const Eyes: React.FC<ShotCtx> = ({t, s}) => (
	<AbsoluteFill>
		<BrandVoid t={t} />
		<Panel x={40} y={380} w={1000} h={420} t={t} at={s} bg={N.teal}>
			<div style={{position: 'absolute', inset: 0, transform: `scale(${tween(t, [s, s + 2], [1, 1.08])})`}}>
				<Bust who="reader" x={500} y={2180} size={3200} t={t + 0.6} lookX={-0.1} lids={tween(t, [s, s + 1.4], [1, 0.75])} browR={0.6} browL={-0.2} blink={false} />
			</div>
		</Panel>
		<Panel x={160} y={860} w={560} h={250} t={t} at={n.word(1, 3) - 0.1} bg={N.white} rot={-2}>
			<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 26}}>
				<div style={{fontFamily: fonts.hand, fontWeight: 700, fontSize: 64, color: N.ink}}>your number:</div>
				<div style={{width: 120, height: 140, background: N.ink, border: `6px solid ${N.ink}`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.comic, fontSize: 110, color: N.mustard}}>?</div>
			</div>
		</Panel>
		<SfxWord text="SHH." x={860} y={940} t={t} at={n.word(1, 0)} size={120} color={N.white} rot={10} />
	</AbsoluteFill>
);

/** 2 — Detective, over the Reader's shoulder: "You can't possibly know that." */
const Doubt: React.FC<ShotCtx> = ({t, s, e}) => (
	<AbsoluteFill>
		<Interrogation t={t} table={false} />
		<AbsoluteFill style={{transform: `scale(${push(t, s, e, 1.02, 1.07)})`, transformOrigin: '620px 800px'}}>
			<Bust who="detective" x={640} y={1580} size={1260} t={t} talk={talk(t, 'detective')} knit={0.7} smile={-0.3} light="right" lookX={-0.45} tilt={-3} />
			<Bust who="reader" x={130} y={2140} size={1500} t={t} solid={N.ink} flip />
		</AbsoluteFill>
	</AbsoluteFill>
);

/** 3 — "Not too small. Not too big. Not the boring middle." The 1–10 cards get struck out. */
const Strike: React.FC<ShotCtx> = ({t, s}) => {
	const small = n.word(3, 3);
	const big = n.word(3, 6);
	const mid = n.word(3, 10);
	const xs = [170, 355, 540, 725, 910];
	const dead = (k: number) => (k <= 2 ? rise(t, small, 0.3) : k >= 9 ? rise(t, big, 0.3) : k === 5 ? rise(t, mid, 0.3) : 0);
	return (
		<AbsoluteFill>
			<BrandVoid t={t} />
			{new Array(10).fill(0).map((_, i) => (
				<NumCard key={i} x={xs[i % 5]} y={i < 5 ? 600 : 930} s={150} n={String(i + 1)} t={t} at={s + 0.05 + i * 0.05} dead={dead(i + 1)} rot={((i * 37) % 7) - 3} />
			))}
			<Annot x={80} y={470} w={400} h={10} t={t} at={small} kind="underline" color={N.ink} label="too small" labelX={60} labelY={-80} />
			<Annot x={620} y={1060} w={400} h={10} t={t} at={big} kind="underline" color={N.ink} label="too big" labelX={110} labelY={20} />
			<Annot x={830} y={470} w={160} h={10} t={t} at={mid} kind="underline" color={N.ink} label="boring" labelX={-60} labelY={-80} />
		</AbsoluteFill>
	);
};

/** 4 — "It's seven." The reveal. */
const Reveal: React.FC<ShotCtx> = ({t, s}) => {
	const at = n.word(4, 1);
	const p = pop(t, at - 0.05, 0.45);
	return (
		<AbsoluteFill>
			<Burst cx={540} cy={760} t={t} color={N.redDeep} bg={N.red} n={40} spin={6} />
			{p > 0 ? <NumCard x={600} y={620} s={440} n="7" t={t} at={at - 0.05} hot rot={tween(t, [at, at + 1.2], [-8, -3])} /> : null}
			<Bust who="reader" x={230} y={1150} size={520} t={t} smile={0.7} asym={0.9} browR={0.8} lookX={0.6} style={{transform: `translateY(${(1 - pop(t, s + 0.1, 0.3)) * 500}px)`}} />
		</AbsoluteFill>
	);
};

/** 5 — Detective: "How?" */
const How: React.FC<ShotCtx> = ({t}) => (
	<AbsoluteFill>
		<Burst cx={540} cy={700} t={t} color={N.tealMid} bg={N.teal} n={48} spin={-10} r0={360} />
		<Bust who="detective" x={540} y={1720} size={1560} t={t} talk={talk(t, 'detective')} open={0.5} smile={-0.3} browL={1} browR={1} lids={1.2} light="right" lookX={0.1} />
		<SfxWord text="?!" x={880} y={420} t={t} at={n.start(5)} size={190} color={N.mustard} rot={12} />
	</AbsoluteFill>
);

/** 6 — 1976 study: case file, 558 people. */
const Study: React.FC<ShotCtx> = ({t, s}) => (
	<AbsoluteFill>
		<Interrogation t={t} lamp={false} table={false} blinds={0.6} />
		<CaseFile x={90} y={330} w={900} h={800} t={t} at={s + 0.05} title="CASE FILE · DIGITS" lines={['Kubovy & Psotka', 'N = 558 people', 'task: pick a digit, 0–9']}>
			<Crowd x={60} y={330} cols={14} rows={5} cell={56} t={t} at={n.word(6, 5) - 0.1} dur={1.2} color={N.tealMid} />
			<div style={{position: 'absolute', left: 60, bottom: 26, fontFamily: fonts.comic, fontSize: 64, color: N.red, opacity: rise(t, n.word(6, 5), 0.3)}}>558</div>
		</CaseFile>
		<Stamp text="1976" x={800} y={420} t={t} at={n.word(6, 1)} size={100} rot={10} />
	</AbsoluteFill>
);

/** 7 — "Seven won. By a lot." Hand-inked bar chart, seven towers over chance. */
const Chart: React.FC<ShotCtx> = ({t, s}) => (
	<AbsoluteFill>
		<PaperDesk />
		<div style={{position: 'absolute', left: 120, top: 280, fontFamily: fonts.comic, fontSize: 70, color: N.ink, letterSpacing: 2}}>FIRST DIGIT PEOPLE PICK</div>
		<InkBars x={130} y={420} w={820} h={640} t={t} at={s + 0.05} values={[3, 6, 8, 13, 9, 8, 9, 28, 9, 7]} labels={['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']} hot={7} chance={10} chanceLabel="chance 10%" max={30} />
		<Annot x={680} y={380} w={140} h={150} t={t} at={n.word(7, 1)} label="≈28%" labelX={-210} labelY={20} labelSize={60} />
		<SfxWord text="≈3×" x={330} y={650} t={t} at={n.word(7, 6)} size={130} color={N.red} rot={-8} />
		<div style={{position: 'absolute', left: 130, top: 1150, fontFamily: fonts.mono, fontSize: 22, color: N.ink, opacity: 0.55}}>schematic · Kubovy & Psotka (1976)</div>
	</AbsoluteFill>
);

/** 8 — "Edges. Middle. Too neat." Reader explains, cards on the wall get crossed off. */
const Why: React.FC<ShotCtx> = ({t, s, e}) => {
	const g1 = n.word(8, 0);
	const g2 = n.word(8, 6);
	const g3 = n.word(8, 10);
	return (
		<AbsoluteFill>
			<Interrogation t={t} table={false} lamp={false} />
			<NumCard x={140} y={440} s={120} n="1" t={t} at={g1} dead={rise(t, n.word(8, 5), 0.3)} rot={-4} />
			<NumCard x={290} y={440} s={120} n="10" t={t} at={g1 + 0.3} dead={rise(t, n.word(8, 5) + 0.1, 0.3)} rot={3} />
			<Annot x={360} y={420} w={10} h={10} t={t} at={n.word(8, 5)} kind="underline" color={N.mustard} label="edges" labelX={10} labelY={-40} labelSize={64} width={0} />
			<NumCard x={140} y={670} s={120} n="5" t={t} at={g2} dead={rise(t, n.word(8, 9), 0.3)} rot={2} />
			<Annot x={220} y={650} w={10} h={10} t={t} at={n.word(8, 9)} kind="underline" color={N.mustard} label="middle" labelX={10} labelY={-40} labelSize={64} width={0} />
			{['2', '4', '6', '8'].map((d, i) => (
				<NumCard key={d} x={130 + i * 125} y={900} s={105} n={d} t={t} at={g3 + i * 0.1} dead={rise(t, n.word(8, 14) + i * 0.06, 0.3)} rot={i % 2 ? 3 : -3} />
			))}
			<Annot x={80} y={760} w={10} h={10} t={t} at={n.word(8, 14)} kind="underline" color={N.mustard} label="too neat" labelX={0} labelY={-40} labelSize={64} width={0} />
			<AbsoluteFill style={{transform: `scale(${push(t, s, e, 1, 1.04)})`, transformOrigin: '800px 900px'}}>
				<Bust who="reader" x={830} y={1620} size={1120} t={t} talk={talk(t, 'reader')} smile={0.3} asym={0.3} lookX={-0.6} turn={-0.4} browL={0.3} light="right" />
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

/** 9 — "Seven feels random. That's why everyone picks it." Lone 7, then the crowd all thinks 7. */
const Everyone: React.FC<ShotCtx> = ({t, s}) => {
	const crowdAt = n.word(9, 3);
	const shrink = tween(t, [crowdAt - 0.2, crowdAt + 0.3], [1, 0.55], ease.inOut);
	return (
		<AbsoluteFill>
			<Interrogation t={t} table={false} blinds={0.5} />
			<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 33%, rgba(255,243,196,0.4) 0%, transparent 40%)'}} />
			<div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1200, transform: `translateY(${(1 - shrink) * -380}px) scale(${shrink})`, transformOrigin: '540px 560px'}}>
				<NumCard x={540} y={600} s={300} n="7" t={t} at={s + 0.05} hot />
				<SfxWord text="random?" x={540} y={330} t={t} at={n.word(9, 2)} size={90} color={N.white} rot={-4} until={crowdAt} />
			</div>
			<Crowd x={100} y={680} cols={11} rows={6} cell={74} t={t} at={crowdAt} dur={0.9} color={N.paper} mark={() => '7'} markAt={n.word(9, 7) - 0.3} />
		</AbsoluteFill>
	);
};

/** 10 — "Wasn't seven? Comment your number. I'll wait." Arrow to the comment button. */
const Cta: React.FC<ShotCtx> = ({t, s}) => {
	const at = n.word(10, 2);
	const p = tween(t, [at, at + 0.5], [0, 1], ease.out);
	const tick = Math.floor(Math.max(0, t - n.word(10, 5)) * 2);
	return (
		<AbsoluteFill>
			<Interrogation t={t} table={false} />
			<Bust who="reader" x={400} y={1720} size={1300} t={t} talk={talk(t, 'reader')} smile={0.6} asym={0.7} browR={0.7} lookX={t > n.word(10, 5) ? 0.6 : 0.1} lookY={t > n.word(10, 5) ? -0.6 : 0} tilt={tween(t, [s, s + 1], [0, 4])} />
			<div style={{position: 'absolute', left: 600, top: 640, fontFamily: fonts.hand, fontWeight: 700, fontSize: 70, lineHeight: 1.0, color: N.mustard, transform: `rotate(-6deg) scale(${pop(t, at, 0.3)})`, textAlign: 'center'}}>
				your
				<br />
				number?
			</div>
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
				<path d="M760 820 C880 900 900 1000 935 1110" stroke={N.mustard} strokeWidth={12} fill="none" strokeLinecap="round" strokeDasharray={360} strokeDashoffset={360 * (1 - p)} />
				{p > 0.95 ? <path d="M905 1085 L938 1120 L955 1070" stroke={N.mustard} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
			</svg>
			{t > n.word(10, 5) ? <SfxWord text={['TICK', 'TOCK'][tick % 2]} x={800} y={430} t={t} at={n.word(10, 5)} size={100} color={N.white} rot={tick % 2 ? 8 : -8} /> : null}
		</AbsoluteFill>
	);
};

export const episode009: NoirEpisodeDef = {
	id: '009',
	timeline: tl,
	audioDir: 'audio/v009',
	hook: 'PICK A NUMBER: 1–10',
	hookUntil: 3.3,
	shots: [
		{at: 0, C: Hook, cut: 'none'},
		{at: n.start(1) - 0.12, C: Eyes},
		{at: n.start(2) - 0.12, C: Doubt},
		{at: n.start(3) - 0.12, C: Strike},
		{at: n.start(4) - 0.2, C: Reveal},
		{at: n.start(5) - 0.12, C: How},
		{at: n.start(6) - 0.12, C: Study},
		{at: n.start(7) - 0.1, C: Chart},
		{at: n.start(8) - 0.12, C: Why},
		{at: n.start(9) - 0.12, C: Everyone},
		{at: n.start(10) - 0.12, C: Cta},
	],
	sfx: [
		['coin', 1.3, 0.45],
		['whoosh', n.start(1) - 0.15, 0.3],
		['whoosh', n.start(2) - 0.15, 0.25],
		['pop', n.start(3) - 0.05, 0.3],
		['zing', n.word(3, 3), 0.35],
		['zing', n.word(3, 6), 0.35],
		['zing', n.word(3, 10), 0.35],
		['whoosh', n.start(4) - 0.25, 0.35],
		['zing', n.start(5), 0.3],
		['paper', n.start(6) - 0.05, 0.4],
		['stamp', n.word(6, 1), 0.5],
		['type', n.start(6) + 0.35, 0.25],
		['pop', n.word(6, 5), 0.3],
		['swish', n.start(7) - 0.1, 0.35],
		['ding', n.word(7, 1), 0.3],
		['zing', n.word(7, 6), 0.3],
		['whoosh', n.start(8) - 0.15, 0.25],
		['scratch', n.word(8, 5), 0.25],
		['scratch', n.word(8, 9), 0.25],
		['scratch', n.word(8, 14), 0.25],
		['ding', n.start(9), 0.3],
		['pop', n.word(9, 3), 0.3],
		['coin', n.start(10) - 0.05, 0.35],
		['tick', n.word(10, 5), 0.45],
		['tick', n.word(10, 5) + 0.5, 0.45],
		['tick', n.word(10, 5) + 1.0, 0.45],
		['tick', n.word(10, 5) + 1.5, 0.45],
	],
	music: 0.3,
};
