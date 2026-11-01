import React from 'react';
import {B, BStamp, Cork, Crack, Cutout, Paper, Polaroid, Thread, Typed, type CamKey} from '../components/Board';
import tlJson from '../data/timeline-019.json';
import {ease, rise, tween} from '../lib/anim';
import {narration, type Timeline} from '../lib/timeline';
import {fonts} from '../theme';
import type {BoardEpisodeDef} from '../BoardEpisode';
import {episode018} from './episode018';

const tl = tlJson as Timeline;
const n = narration(tl);
const w = n.word;
const S = (i: number) => n.start(i);
const CRACK = w(3, 4);

/** One camera target per narration line: [x, y, zoomIn, zoomOut]. The camera whips on each line start and drifts within it. */
const BEATS: [number, number, number, number][] = [
	[540, 660, 1.3, 1.05],
	[1500, 660, 1.2, 1.3],
	[1000, 1420, 1.0, 1.12],
	[620, 2160, 1.1, 1.2],
	[1500, 2160, 1.15, 1.25],
	[1000, 2900, 0.9, 1.0],
	[1000, 3620, 1.0, 1.1],
	[560, 4360, 1.1, 1.2],
	[1480, 4360, 1.1, 1.2],
	[1000, 5100, 1.0, 1.12],
	[1000, 5860, 0.92, 1.04],
	[1000, 6620, 1.0, 1.15],
	[1000, 7420, 1.0, 1.25],
];
const WIDE_AT = w(11, 12); // "believe…": pull back over every file on the wall
const CAM: CamKey[] = BEATS.flatMap(([x, y, z0, z1], i): CamKey[] => {
	const s = Math.max(0, S(i) - (i ? 0.3 : 0));
	const e = i + 1 < BEATS.length ? S(i + 1) - 0.35 : tl.duration;
	if (i === 11) return [[s, x, y, z0, 0], [WIDE_AT - 0.2, x, y, z1, 0], [WIDE_AT + 0.6, -2600, 3200, 0.085, 0], [e, -2600, 3200, 0.095, 0]];
	return [[s, x, y, z0, (i % 2 ? 1 : -1) * 1.2], [e, x, y + 20, z1, 0]];
});
const PREV_X = -6000;

const Pct: React.FC<{t: number; at: number; v: number; label: string; col: string}> = ({t, at, v, label, col}) => {
	const k = tween(t, [at, at + 0.7], [0, 1], ease.out);
	return (
		<div style={{position: 'absolute', left: 50, right: 50, bottom: 60}}>
			<div style={{fontFamily: fonts.punch, fontWeight: 900, fontSize: 120, color: col}}>{Math.round(v * k)}%</div>
			<div style={{height: 40, border: `5px solid ${B.ink}`}}>
				<div style={{height: '100%', width: `${v * k}%`, background: col}} />
			</div>
			<div style={{fontFamily: fonts.mono, fontSize: 30, marginTop: 14}}>{label}</div>
		</div>
	);
};

/** Shock generator panel: switches light up to `level` (0..1). */
const Generator: React.FC<{level: number; scale?: number}> = ({level, scale = 1}) => (
	<div style={{position: 'absolute', left: 30, top: 60, width: 740, height: 300, background: '#4a4d52', border: '8px solid #0d0c10', borderRadius: 10, transform: `scale(${scale})`, transformOrigin: 'top left'}}>
		<div style={{position: 'absolute', left: 20, top: 14, fontFamily: fonts.mono, fontSize: 20, color: '#f4efe4', letterSpacing: 4}}>SHOCK GENERATOR · TYPE ZLB</div>
		{new Array(10).fill(0).map((_, i) => {
			const on = i / 9 <= level;
			return (
				<div key={i} style={{position: 'absolute', left: 22 + i * 71, top: 60, width: 56}}>
					<div style={{fontFamily: fonts.mono, fontSize: 16, color: '#f4efe4', textAlign: 'center'}}>{15 + i * 48}V</div>
					<div style={{margin: '8px auto', width: 26, height: 70, background: '#1a1a1d', borderRadius: 6, position: 'relative'}}>
						<div style={{position: 'absolute', left: 3, right: 3, height: 30, background: on ? B.mustard : '#bdbdbd', top: on ? 36 : 4}} />
					</div>
					<div style={{width: 18, height: 18, borderRadius: 9, margin: '0 auto', background: on ? '#ff4d4d' : '#3a1515', boxShadow: on ? '0 0 12px #ff4d4d' : undefined}} />
				</div>
			);
		})}
	</div>
);

const World: React.FC<{t: number}> = ({t}) => (
	<>
		<Cork x0={-12000} w={17500} />
		{t > WIDE_AT && t < S(12) + 0.5 ? (
			<div style={{position: 'absolute', left: PREV_X, top: 0}}>
				<episode018.World t={999} />
			</div>
		) : null}
		<div style={{position: 'absolute', left: -300, top: -1800, fontFamily: fonts.punch, fontWeight: 900, fontSize: 520, color: B.mustard}}>FILE 019</div>
		{/* A: 1961, 450 volts */}
		<Paper id="ma" x={540} y={660} w={800} h={560} t={t} at={0.1} rot={-2}>
			<Generator level={tween(t, [w(0, 9), w(0, 18)], [0, 1])} />
			<div style={{position: 'absolute', left: 40, bottom: 40, fontFamily: fonts.hand, fontWeight: 700, fontSize: 52, color: B.red, opacity: rise(t, w(0, 17), 0.3)}}>up to 450 V</div>
		</Paper>
		<BStamp text="YALE · 1961" x={700} y={360} t={t} at={w(0, 1)} size={70} rot={8} />
		{/* B: 2 of 3 went all the way */}
		<Paper id="mb" x={1500} y={660} w={640} h={520} t={t} at={S(1) - 0.2} rot={2} color={B.paperOld}>
			<div style={{position: 'absolute', left: 40, top: 50, display: 'flex', gap: 14}}>
				{[0, 1, 2].map((i) => (
					<div key={i} style={{position: 'relative', width: 150, height: 200}}>
						<Cutout x={75} y={200} s={0.75} color={i < 2 ? B.red : '#1a1716'} />
					</div>
				))}
			</div>
			<Pct t={t} at={w(1, 4)} v={65} label="went to 450 V" col={B.red} />
		</Paper>
		<Thread from={[940, 420]} to={[1300, 440]} t={t} at={S(1) - 0.2} />
		{/* C: the famous conclusion */}
		<Paper id="mc" x={1000} y={1420} w={900} h={420} t={t} at={S(2) - 0.2} rot={-1} color={B.paperOld}>
			<div style={{position: 'absolute', left: 40, top: 50, fontFamily: fonts.mono, fontSize: 30, letterSpacing: 6, color: B.redDeep}}>THE CONCLUSION</div>
			<div style={{position: 'absolute', left: 40, top: 110, right: 40, fontFamily: fonts.serif, fontWeight: 900, fontSize: 62, lineHeight: 1.15, opacity: rise(t, w(2, 4), 0.3)}}>
				under orders, <span style={{color: B.red}}>almost anyone</span> will hurt someone.
			</div>
		</Paper>
		<Thread from={[1500, 920]} to={[1200, 1230]} t={t} at={S(2) - 0.2} />
		{/* D: fake shocks, an actor */}
		<Polaroid id="md" x={620} y={2160} w={560} t={t} at={S(3) - 0.2} rot={-3} caption="the 'learner'">
			<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #3d3a44, #17161a)'}} />
			<Cutout x={250} y={500} s={1.5} kind="student" />
		</Polaroid>
		<BStamp text="ACTOR" x={640} y={2140} t={t} at={w(3, 9)} size={110} rot={-12} />
		{/* E: the original tapes */}
		<Paper id="me" x={1500} y={2160} w={680} h={480} t={t} at={S(4) - 0.2} rot={2} color="#b89d72" tape pin={false}>
			<div style={{position: 'absolute', left: 40, top: 40, fontFamily: fonts.mono, fontSize: 30, letterSpacing: 6}}>ORIGINAL RECORDINGS</div>
			{[0, 1, 2].map((i) => (
				<div key={i} style={{position: 'absolute', left: 40 + i * 205, top: 120 + (i % 2) * 40, width: 190, height: 130, background: '#26242a', borderRadius: 12, border: '5px solid #0e0d10', transform: `rotate(${(i - 1) * 6}deg) scale(${rise(t, S(4) + i * 0.15, 0.3)})`}}>
					<div style={{margin: '14px 14px 0', height: 34, background: B.paper, fontFamily: fonts.hand, fontWeight: 700, fontSize: 20, textAlign: 'center', lineHeight: '34px'}}>TAPE {i + 7}</div>
					{[50, 140].map((cx) => (
						<div key={cx} style={{position: 'absolute', left: cx - 20, top: 66, width: 40, height: 40, borderRadius: '50%', border: '7px solid #d9d2c4', borderTopColor: 'transparent', transform: `rotate(${t * 200}deg)`}} />
					))}
				</div>
			))}
		</Paper>
		<Thread from={[900, 2000]} to={[1160, 2000]} t={t} at={S(4) - 0.2} sag={30} />
		{/* F: they had doubts */}
		<Paper id="mf" x={1000} y={2900} w={960} h={520} t={t} at={S(5) - 0.2} rot={-1}>
			<div style={{position: 'absolute', left: 40, top: 40, fontFamily: fonts.mono, fontSize: 30, letterSpacing: 6, color: B.redDeep}}>PARTICIPANTS · AFTERWARDS</div>
			{new Array(6).fill(0).map((_, i) => (
				<div key={i} style={{position: 'absolute', left: 50 + i * 145, top: 170, width: 140, height: 300}}>
					<Cutout x={70} y={300} s={0.7} />
					<div style={{position: 'absolute', left: 50, top: 20, fontFamily: fonts.serif, fontWeight: 900, fontSize: 90, color: B.red, transform: `scale(${rise(t, w(5, 4) + i * 0.1, 0.25)})`}}>{i % 3 === 1 ? '' : '?'}</div>
				</div>
			))}
		</Paper>
		<Thread from={[1500, 2400]} to={[1200, 2640]} t={t} at={S(5) - 0.2} />
		{/* G: off script */}
		<Paper id="mg" x={1000} y={3620} w={900} h={520} t={t} at={S(6) - 0.2} rot={1} color="#f4ecd9">
			<div style={{position: 'absolute', left: 40, top: 40, fontFamily: fonts.mono, fontSize: 30, letterSpacing: 6, color: B.redDeep}}>OFFICIAL SCRIPT · 4 PRODS</div>
			{['1. please continue', '2. the experiment requires…', '3. it is essential…', '4. you have no other choice…'].map((p, i) => (
				<div key={p} style={{position: 'absolute', left: 40, top: 110 + i * 64, fontFamily: fonts.mono, fontSize: 32}}>{p}</div>
			))}
			<div style={{position: 'absolute', left: 300, top: 120, width: 320, height: 300, opacity: rise(t, w(6, 7), 0.2)}}>
				<Cutout x={160} y={300} s={1.1} kind="staff" />
			</div>
			<div style={{position: 'absolute', right: 40, bottom: 30, fontFamily: fonts.hand, fontWeight: 700, fontSize: 58, color: B.red, opacity: rise(t, w(6, 7), 0.3), transform: 'rotate(-4deg)'}}>went off script!</div>
		</Paper>
		<Thread from={[1000, 3160]} to={[1000, 3360]} t={t} at={S(6) - 0.2} sag={10} />
		{/* H + I: the versions you never hear about */}
		<Paper id="mh" x={560} y={4360} w={680} h={560} t={t} at={S(7) - 0.2} rot={-2} color={B.paperOld}>
			<div style={{position: 'absolute', left: 40, top: 40, fontFamily: fonts.mono, fontSize: 30, letterSpacing: 4}}>VARIATION · ORDERS BY PHONE</div>
			<div style={{position: 'absolute', left: 40, top: 100, fontSize: 120}}>☎</div>
			<Pct t={t} at={w(7, 15)} v={20} label="obeyed to the end" col={B.ink} />
		</Paper>
		<Paper id="mi" x={1480} y={4360} w={680} h={560} t={t} at={S(8) - 0.2} rot={2} color={B.paperOld}>
			<div style={{position: 'absolute', left: 40, top: 40, fontFamily: fonts.mono, fontSize: 30, letterSpacing: 4}}>VARIATION · 2 SCIENTISTS DISAGREE</div>
			<div style={{position: 'absolute', left: 60, top: 100, width: 520, height: 220}}>
				<Cutout x={90} y={220} s={0.8} kind="staff" />
				<Cutout x={400} y={220} s={0.8} kind="staff" flip />
				<div style={{position: 'absolute', left: 220, top: 40, fontFamily: fonts.punch, fontWeight: 900, fontSize: 80, color: B.red, opacity: rise(t, w(8, 3), 0.2)}}>≠</div>
			</div>
			<Pct t={t} at={w(8, 4)} v={0} label="went to the end" col={B.red} />
		</Paper>
		<Thread from={[1000, 3880]} to={[700, 4090]} t={t} at={S(7) - 0.2} />
		{/* J: "you have no other choice" → people stopped */}
		<Paper id="mj" x={1000} y={5100} w={900} h={460} t={t} at={S(9) - 0.2} rot={-1}>
			<div style={{position: 'absolute', left: 40, top: 40, fontFamily: fonts.mono, fontSize: 30, letterSpacing: 6, color: B.redDeep}}>LATER REPLICATION · PROD #4</div>
			<div style={{position: 'absolute', left: 40, top: 120, right: 40}}>
				<Typed text={'"you have no other choice."'} t={t} at={w(9, 9)} cps={26} style={{fontSize: 52, fontWeight: 700}} />
			</div>
		</Paper>
		<BStamp text="THEY STOPPED" x={1020} y={5230} t={t} at={w(9, 15)} size={84} rot={-8} />
		{/* K: the real lesson */}
		<Paper id="mk" x={1000} y={5860} w={1000} h={600} t={t} at={S(10) - 0.2} rot={1} color={B.paper}>
			<div style={{position: 'absolute', left: 40, top: 40, fontFamily: fonts.mono, fontSize: 30, letterSpacing: 6, color: B.redDeep}}>THE REAL LESSON</div>
			{[
				['believed in the cause', '→ kept going', w(10, 13), B.red],
				['simply commanded', '→ refused', w(10, 21), '#1f6b3a'],
			].map(([a, b, at, col], i) => (
				<div key={i} style={{position: 'absolute', left: 40, top: 130 + i * 200, opacity: rise(t, (at as number) - 0.1, 0.25)}}>
					<div style={{fontFamily: fonts.serif, fontWeight: 900, fontSize: 60}}>{a as string}</div>
					<div style={{fontFamily: fonts.punch, fontWeight: 900, fontSize: 60, color: col as string}}>{b as string}</div>
				</div>
			))}
		</Paper>
		<Thread from={[1000, 5330]} to={[1000, 5560]} t={t} at={S(10) - 0.2} sag={10} />
		{/* L: the question for you */}
		<Paper id="ml" x={1000} y={6620} w={900} h={480} t={t} at={S(11) - 0.2} rot={-1} color="#1d1b1f" pin={false} tape>
			<div style={{position: 'absolute', left: 50, top: 60, right: 50, fontFamily: fonts.serif, fontWeight: 900, fontSize: 64, lineHeight: 1.2, color: '#f4efe4'}}>
				<span style={{textDecoration: t > w(11, 8) ? 'line-through' : 'none', opacity: 0.7}}>would I obey?</span>
				<br />
				<span style={{color: B.mustard, opacity: rise(t, w(11, 9), 0.3)}}>what do I believe in enough to go too far?</span>
			</div>
		</Paper>
		{/* M: next file */}
		<Paper id="mm" x={1000} y={7420} w={860} h={700} t={t} at={S(12) - 0.3} rot={1} color="#1d1b1f" pin={false} tape>
			<div style={{position: 'absolute', left: 40, top: 40, fontFamily: fonts.mono, fontSize: 32, letterSpacing: 8, color: B.mustard}}>NEXT FILE · 020</div>
			<div style={{position: 'absolute', left: 330, top: 200, width: 200, height: 160, borderRadius: '45% 45% 40% 40%', background: '#f6f1e6', boxShadow: 'inset -14px -18px 0 #ddd4c2', transform: `scale(${rise(t, w(12, 13), 0.4)})`}} />
			<div style={{position: 'absolute', left: 270, top: 330, width: 320, height: 40, borderRadius: '50%', background: '#c9cbd1'}} />
			<div style={{position: 'absolute', left: 0, right: 0, bottom: 70, textAlign: 'center', fontFamily: fonts.serif, fontWeight: 900, fontSize: 64, color: '#f4efe4'}}>your whole future?</div>
		</Paper>
	</>
);

export const episode019: BoardEpisodeDef = {
	id: '019',
	timeline: tl,
	audioDir: 'audio/v019',
	hook: 'Would you shock a stranger if someone told you to?',
	hookUntil: 3.6,
	cam: CAM,
	World,
	shake: (t) => (t > CRACK - 0.05 && t < CRACK + 0.6 ? 1 - (t - CRACK) / 0.6 : 0),
	Overlay: ({t}) => <Crack t={t} at={CRACK} x={540} y={700} />,
	sfx: [
		['paper', 0.1, 0.4],
		['stamp', w(0, 1), 0.5],
		['type', w(0, 9), 0.3],
		...[1, 2, 4, 5, 6, 7, 8, 9, 10, 11].map((i): [string, number, number] => ['whoosh', S(i) - 0.3, 0.3]),
		['twang', S(1) - 0.1, 0.3],
		['crack', CRACK - 0.02, 0.8],
		['stamp', w(3, 9), 0.55],
		['tape_rewind', S(4), 0.3],
		['pin', w(7, 15), 0.35],
		['pin', w(8, 4), 0.35],
		['type', w(9, 9), 0.3],
		['stamp', w(9, 15), 0.55],
		['whoosh', WIDE_AT, 0.45],
		['whoosh', S(12) - 0.3, 0.4],
		['shutter', w(12, 13), 0.4],
	],
	music: 0.3,
};
