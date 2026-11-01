import React from 'react';
import {AbsoluteFill} from 'remotion';
import {B, BStamp, Cork, Crack, Cutout, Paper, Polaroid, Thread, Typed, type CamKey} from '../components/Board';
import tlJson from '../data/timeline-018.json';
import {ease, rise, tween} from '../lib/anim';
import {narration, type Timeline} from '../lib/timeline';
import {fonts} from '../theme';
import type {BoardEpisodeDef} from '../BoardEpisode';
import {episode017} from './episode017';

const tl = tlJson as Timeline;
const n = narration(tl);
const w = n.word;
const CRACK = w(4, 6);
const PREV_X = -4300; // file 017 hangs to the left on the same wall

/** Times below were authored on the first narration take; R() maps them onto whatever take is current. */
const OLD = [0.10, 8.35, 12.21, 19.04, 28.60, 32.30, 37.27, 44.51, 49.53, 54.01, 61.50, 68.60, 76.16, 79.01, 87.39];
const NEW = [...tl.lines.map((l) => l.start), tl.duration];
const R = (x: number) => {
	for (let i = 0; i < OLD.length - 1; i++) {
		if (x <= OLD[i + 1]) return NEW[i] + ((x - OLD[i]) / (OLD[i + 1] - OLD[i])) * (NEW[i + 1] - NEW[i]);
	}
	return NEW[NEW.length - 1] + (x - OLD[OLD.length - 1]);
};

const CAM0: CamKey[] = [
	[0, 540, 640, 1.3, -2],
	[5.5, 560, 700, 1.0, 0],
	[7.4, 1000, 700, 0.62, 0],
	[8.1, 1000, 700, 0.62, 0],
	[8.6, 1000, 1360, 1.15, 1],
	[12.0, 1000, 1380, 1.25, 0],
	[12.5, 1500, 1960, 1.05, -1],
	[18.7, 1500, 1970, 1.15, 0],
	[19.2, 540, 1960, 1.0, 1],
	[28.2, 540, 1990, 1.1, 0],
	[28.8, 1000, 2700, 0.85, 0],
	[36.9, 1000, 2720, 1.0, 0],
	[37.5, 1150, 3450, 0.7, -1],
	[44.2, 1130, 3460, 0.78, 0],
	[44.8, 540, 4200, 1.1, 1],
	[49.2, 560, 4220, 1.2, 0],
	[49.8, 1500, 4200, 1.05, -1],
	[53.8, 1500, 4220, 1.12, 0],
	[54.3, 1000, 4950, 0.8, 0],
	[61.2, 1000, 4960, 0.92, 0],
	[61.7, 1000, 5000, 0.9, 1],
	[68.2, 1000, 5020, 1.0, 0],
	[68.8, 1000, 5700, 0.95, -1],
	[75.8, 1000, 5700, 1.05, 0],
	[76.3, 1000, 5720, 1.15, 0],
	[78.5, 1000, 5720, 1.22, 0],
	[79.2, -1500, 3000, 0.115, 0],
	[81.0, -1500, 3000, 0.13, 0],
	[81.6, 1000, 6520, 1.0, 0],
	[87.4, 1000, 6520, 1.25, 0],
];
const CAM: CamKey[] = CAM0.map(([t, ...rest]) => [R(t), ...rest] as CamKey);

const Bars: React.FC<{t: number; items: [string, number, number, string][]}> = ({t, items}) => (
	<div style={{position: 'absolute', left: 50, right: 50, top: 150, height: 330, display: 'flex', alignItems: 'flex-end', gap: 60}}>
		{items.map(([label, v, at, col]) => (
			<div key={label} style={{flex: 1, position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
				<div style={{fontFamily: fonts.punch, fontWeight: 900, fontSize: 64, textAlign: 'center', color: col, opacity: rise(t, at + 0.4, 0.2)}}>{Math.round(v * tween(t, [at, at + 0.6], [0, 1], ease.out))}%</div>
				<div style={{height: `${v * 2.4 * tween(t, [at, at + 0.6], [0, 1], ease.out)}px`, background: col, border: `5px solid ${B.ink}`}} />
				<div style={{position: 'absolute', bottom: -60, left: 0, right: 0, textAlign: 'center', fontFamily: fonts.mono, fontSize: 30, fontWeight: 700}}>{label}</div>
			</div>
		))}
	</div>
);

const World: React.FC<{t: number}> = ({t}) => (
	<>
		<Cork x0={-8000} w={13500} />
		{/* the previous file stays pinned to the wall (series continuity) */}
		{t > R(78.6) && t < R(81.6) ? (
			<div style={{position: 'absolute', left: PREV_X, top: 0}}>
				<episode017.World t={999} />
			</div>
		) : null}
		<div style={{position: 'absolute', left: PREV_X - 600, top: -1800, fontFamily: fonts.punch, fontWeight: 900, fontSize: 520, color: B.paper, opacity: 0.85}}>FILE 017</div>
		<div style={{position: 'absolute', left: -300, top: -1800, fontFamily: fonts.punch, fontWeight: 900, fontSize: 520, color: B.mustard}}>FILE 018</div>
		{/* ---- A: the 1964 report ---- */}
		<Paper id="na" x={540} y={650} w={760} h={720} t={t} at={0.1} rot={-2} color="#e9e0cc">
			<div style={{position: 'absolute', left: 40, top: 40, right: 40, borderBottom: `4px double ${B.ink}`, fontFamily: fonts.serif, fontWeight: 900, fontSize: 40, textAlign: 'center', paddingBottom: 8}}>THE MORNING PAPER · 1964</div>
			<div style={{position: 'absolute', left: 40, top: 130, right: 40, fontFamily: fonts.serif, fontWeight: 900, fontSize: 82, lineHeight: 1.0, color: B.ink}}>
				38 WATCHED.
				<br />
				<span style={{opacity: rise(t, w(0, 17), 0.2)}}>NOBODY HELPED.</span>
			</div>
			{[0, 1, 2, 3, 4, 5, 6].map((i) => (
				<div key={i} style={{position: 'absolute', left: 40 + (i % 2) * 345, top: 380 + Math.floor(i / 2) * 70, width: 300, height: 14, background: B.ink, opacity: 0.55}} />
			))}
		</Paper>
		<BStamp text="1964" x={800} y={360} t={t} at={w(0, 1)} size={84} rot={10} />
		<Polaroid id="nb" x={1500} y={660} w={600} t={t} at={w(0, 6) - 0.2} rot={3} caption="Queens, New York">
			<svg width={528} height={528} viewBox="0 0 100 100">
				<rect width={100} height={100} fill="#15141a" />
				<rect x={12} y={10} width={76} height={90} fill="#26242c" />
				{new Array(42).fill(0).map((_, i) => {
					const on = i < 38 && t > w(0, 6) + (i % 9) * 0.04;
					return <rect key={i} x={16 + (i % 6) * 12} y={14 + Math.floor(i / 6) * 12} width={7} height={8} fill={on ? '#ffd27a' : '#0d0c10'} />;
				})}
			</svg>
		</Polaroid>
		<Thread from={[900, 420]} to={[1300, 420]} t={t} at={w(0, 6)} sag={30} />
		{/* ---- B: Kitty Genovese ---- */}
		<Polaroid id="nc" x={1000} y={1360} w={520} t={t} at={w(1, 0) - 0.3} rot={-2} caption="Kitty Genovese, 28">
			<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #3d3a44, #17161a)'}} />
			<Cutout x={230} y={470} s={1.5} kind="woman" />
		</Polaroid>
		<Thread from={[1000, 1000]} to={[1000, 1100]} t={t} at={w(1, 0) - 0.2} sag={5} />
		{/* ---- C: the theory ---- */}
		<Paper id="nd" x={1500} y={1960} w={760} h={460} t={t} at={w(2, 0) - 0.2} rot={1} color={B.paperOld}>
			<div style={{position: 'absolute', left: 40, top: 50, fontFamily: fonts.mono, fontSize: 30, letterSpacing: 6, color: B.redDeep}}>THEORY</div>
			<div style={{position: 'absolute', left: 40, top: 100, fontFamily: fonts.serif, fontWeight: 900, fontSize: 64, color: B.ink, opacity: rise(t, w(2, 8), 0.2)}}>“bystander effect”</div>
			<div style={{position: 'absolute', left: 40, top: 220, display: 'flex', alignItems: 'flex-end', gap: 10, opacity: rise(t, w(2, 11), 0.3)}}>
				{new Array(7).fill(0).map((_, i) => (
					<div key={i} style={{width: 60, height: 90, position: 'relative'}}>
						<Cutout x={30} y={90} s={0.34} />
					</div>
				))}
				<div style={{fontFamily: fonts.hand, fontWeight: 700, fontSize: 52, color: B.red, marginLeft: 20, opacity: rise(t, w(2, 15), 0.3)}}>→ less help</div>
			</div>
		</Paper>
		<Thread from={[1260, 1450]} to={[1500, 1740]} t={t} at={w(2, 0) - 0.2} sag={20} />
		{/* ---- D: the lab study ---- */}
		<Paper id="ne" x={540} y={1980} w={780} h={600} t={t} at={w(3, 0) - 0.2} rot={-1}>
			<div style={{position: 'absolute', left: 40, top: 50, fontFamily: fonts.mono, fontSize: 30, letterSpacing: 6, color: B.redDeep}}>LAB · SEIZURE STUDY</div>
			<Bars t={t} items={[['ALONE', 85, w(3, 12) - 0.1, '#1f6b3a'], ['GROUP OF 5', 31, w(3, 23) - 0.1, B.red]]} />
		</Paper>
		<Thread from={[1120, 1960]} to={[930, 1980]} t={t} at={w(3, 0) - 0.2} sag={10} />
		{/* ---- E: 38? ---- */}
		<Paper id="nf" x={1000} y={2700} w={980} h={720} t={t} at={w(4, 0) - 0.2} rot={0} color="#1d1b1f" tape pin={false}>
			<div style={{position: 'absolute', left: 40, top: 40, fontFamily: fonts.mono, fontSize: 32, letterSpacing: 8, color: B.mustard}}>THE 38 WITNESSES</div>
			<div style={{position: 'absolute', left: 60, top: 110, display: 'grid', gridTemplateColumns: 'repeat(10, 78px)', gap: 10}}>
				{new Array(38).fill(0).map((_, i) => {
					const heard = t > w(5, 3) + (i % 10) * 0.03;
					const saw = t > w(5, 11) && i % 13 === 0;
					return (
						<div key={i} style={{height: 90, background: saw ? B.red : heard ? '#3a3740' : '#ffd27a', border: '3px solid #0d0c10', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40}}>
							{saw ? '👁' : heard ? '👂' : ''}
						</div>
					);
				})}
			</div>
			<div style={{position: 'absolute', left: 60, bottom: 40, display: 'flex', gap: 40, fontFamily: fonts.mono, fontSize: 30, color: '#f4efe4', opacity: rise(t, w(5, 3), 0.3)}}>
				<span>👂 only heard</span>
				<span style={{opacity: rise(t, w(5, 11), 0.3)}}>👁 actually saw</span>
			</div>
		</Paper>
		<BStamp text="38?" x={1380} y={2420} t={t} at={w(4, 2)} size={120} rot={12} />
		<Thread from={[540, 2280]} to={[700, 2360]} t={t} at={w(4, 0) - 0.2} sag={10} />
		{/* ---- F: someone called; someone ran outside ---- */}
		<Paper id="ng" x={1560} y={3450} w={520} h={420} t={t} at={w(6, 3) - 0.2} rot={3}>
			<div style={{position: 'absolute', left: 0, right: 0, top: 50, textAlign: 'center', fontSize: 140}}>☎</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 240, textAlign: 'center', fontFamily: fonts.serif, fontWeight: 900, fontSize: 48}}>called the police</div>
			<div style={{position: 'absolute', right: 40, top: 40, fontFamily: fonts.punch, fontWeight: 900, fontSize: 80, color: '#1f6b3a', opacity: rise(t, w(6, 4), 0.2)}}>✓</div>
		</Paper>
		<Polaroid id="nh" x={760} y={3460} w={600} t={t} at={w(6, 8) - 0.2} rot={-3} caption="Sophia Farrar ran outside">
			<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #403c46, #1a191d)'}} />
			<div style={{position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 70%, rgba(255,210,122,${0.35 * rise(t, w(6, 15), 0.6)}), transparent 60%)`}} />
			<Cutout x={200} y={540} s={1.25} kind="woman" tilt={tween(t, [w(6, 12), w(6, 15)], [0, 18])} />
			<Cutout x={330} y={560} s={1.1} kind="woman" tilt={-24} />
		</Polaroid>
		<Thread from={[1000, 3060]} to={[1000, 3150]} t={t} at={w(6, 0) - 0.2} sag={5} />
		{/* ---- G: the paper admits it ---- */}
		<Paper id="ni" x={540} y={4200} w={720} h={480} t={t} at={w(7, 0) - 0.2} rot={-2} color="#e9e0cc">
			<div style={{position: 'absolute', left: 40, top: 40, fontFamily: fonts.mono, fontSize: 28, letterSpacing: 6, color: B.redDeep}}>DECADES LATER · CORRECTION</div>
			<div style={{position: 'absolute', left: 40, top: 110, right: 40}}>
				<Typed text={'the paper admits:\nthe 38-witness story\nwas badly exaggerated.'} t={t} at={w(7, 3)} style={{fontSize: 42, lineHeight: 1.35, fontWeight: 700}} />
			</div>
		</Paper>
		<BStamp text="EXAGGERATED" x={560} y={4330} t={t} at={w(7, 10)} size={80} rot={-10} />
		{/* ---- H: not quite ---- */}
		<Paper id="nj" x={1500} y={4200} w={700} h={460} t={t} at={w(8, 0) - 0.2} rot={2} color={B.paperOld}>
			<div style={{position: 'absolute', left: 40, top: 50, fontFamily: fonts.mono, fontSize: 30, letterSpacing: 6, color: B.redDeep}}>VERDICT</div>
			{[
				['bystander effect = fake', w(8, 5), false],
				['in the lab: real', w(8, 12), true],
			].map(([txt, at, ok], i) => (
				<div key={i} style={{position: 'absolute', left: 40, top: 130 + i * 130, display: 'flex', alignItems: 'center', gap: 22, opacity: rise(t, (at as number) - 0.15, 0.2)}}>
					<div style={{width: 72, height: 72, border: `6px solid ${B.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.punch, fontWeight: 900, fontSize: 52, color: ok ? '#1f6b3a' : B.red}}>{ok ? '✓' : '✗'}</div>
					<div style={{fontFamily: fonts.serif, fontWeight: 900, fontSize: 46}}>{txt as string}</div>
				</div>
			))}
		</Paper>
		<Thread from={[900, 4150]} to={[1150, 4150]} t={t} at={w(8, 0)} sag={30} />
		{/* ---- I: real CCTV footage, 2019 ---- */}
		<Paper id="nk" x={1000} y={4980} w={1040} h={760} t={t} at={w(9, 0) - 0.2} rot={0} color="#1d1b1f" tape pin={false}>
			<div style={{position: 'absolute', left: 40, top: 36, fontFamily: fonts.mono, fontSize: 30, letterSpacing: 6, color: B.mustard}}>REAL CCTV · 219 PUBLIC FIGHTS · UK · NL · ZA</div>
			<div style={{position: 'absolute', left: 40, top: 100, display: 'grid', gridTemplateColumns: 'repeat(3, 304px)', gap: 14}}>
				{new Array(6).fill(0).map((_, i) => {
					const step = t > w(10, 9) && i !== 4;
					return (
						<div key={i} style={{height: 200, background: '#2c3a33', position: 'relative', overflow: 'hidden', opacity: rise(t, w(9, 5) + i * 0.12, 0.2), filter: 'saturate(0.4)'}}>
							<div style={{position: 'absolute', left: 10, top: 8, fontFamily: fonts.mono, fontSize: 18, color: '#ff4d4d'}}>● REC CAM {i + 1}</div>
							<div style={{position: 'absolute', left: 40, top: 30}}>
								<Cutout x={20} y={170} s={0.55} color="#0f1512" />
								<Cutout x={85} y={170} s={0.55} color="#0f1512" flip />
								<div style={{position: 'absolute', left: step ? 110 : 150, top: 0}}>
									<Cutout x={40} y={170} s={0.55} color={step ? '#1f6b3a' : '#0f1512'} />
								</div>
							</div>
							<div style={{position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 5px)'}} />
						</div>
					);
				})}
			</div>
			<div style={{position: 'absolute', left: 40, right: 40, bottom: 40, height: 80, border: '5px solid #f4efe4', opacity: rise(t, w(10, 1), 0.2)}}>
				<div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${90 * tween(t, [w(10, 1), w(10, 4) + 0.3], [0, 1], ease.out)}%`, background: '#1f6b3a'}} />
				<div style={{position: 'absolute', inset: 0, textAlign: 'center', fontFamily: fonts.punch, fontWeight: 900, fontSize: 48, lineHeight: '70px', color: '#f4efe4'}}>9 / 10: SOMEONE STEPPED IN</div>
			</div>
		</Paper>
		<BStamp text="2019" x={1400} y={4640} t={t} at={w(9, 2)} size={90} rot={10} />
		<Thread from={[1500, 4430]} to={[1300, 4600]} t={t} at={w(9, 0) - 0.2} sag={10} />
		{/* ---- J: be the first ---- */}
		<Paper id="nl" x={1000} y={5720} w={980} h={640} t={t} at={w(11, 0) - 0.2} rot={1}>
			<div style={{position: 'absolute', left: 40, top: 50, fontFamily: fonts.mono, fontSize: 30, letterSpacing: 6, color: B.redDeep}}>THE REAL DANGER</div>
			<div style={{position: 'absolute', left: 40, top: 100, fontFamily: fonts.serif, fontWeight: 900, fontSize: 60, opacity: rise(t, w(11, 10), 0.3)}}>
				the first few seconds <span style={{color: B.red}}>⏱</span>
			</div>
			<div style={{position: 'absolute', left: 60, top: 200, width: 860, height: 300}}>
				{new Array(6).fill(0).map((_, i) => {
					const first = n.word(12, 3);
					const go = i === 0 ? rise(t, first, 0.4) : rise(t, n.word(12, 6) + i * 0.12, 0.4);
					return (
						<div key={i} style={{position: 'absolute', left: i * 140, top: 0, transform: `translateY(${-go * 60}px)`}}>
							<Cutout x={60} y={280} s={0.9} color={go > 0.5 ? (i === 0 ? B.red : '#1f6b3a') : '#1a1716'} />
						</div>
					);
				})}
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, bottom: 40, textAlign: 'center', fontFamily: fonts.punch, fontWeight: 900, fontSize: 70, color: B.red, opacity: rise(t, w(12, 3), 0.3)}}>BE THE FIRST.</div>
		</Paper>
		<Thread from={[1000, 5360]} to={[1000, 5420]} t={t} at={w(11, 0) - 0.2} sag={5} />
		{/* ---- L: next file ---- */}
		<Paper id="nm" x={1000} y={6520} w={900} h={760} t={t} at={w(13, 0) - 0.3} rot={-1} color="#1d1b1f" pin={false} tape>
			<div style={{position: 'absolute', left: 40, top: 40, fontFamily: fonts.mono, fontSize: 32, letterSpacing: 8, color: B.mustard}}>NEXT FILE · 019</div>
			<div style={{position: 'absolute', left: 60, top: 130, width: 780, height: 360, background: '#4a4d52', border: '8px solid #0d0c10', borderRadius: 10}}>
				{new Array(10).fill(0).map((_, i) => (
					<div key={i} style={{position: 'absolute', left: 24 + i * 74, top: 60, width: 56, height: 200}}>
						<div style={{fontFamily: fonts.mono, fontSize: 18, color: '#f4efe4', textAlign: 'center'}}>{15 + i * 48}V</div>
						<div style={{margin: '10px auto', width: 26, height: 70, background: '#1a1a1d', borderRadius: 6, position: 'relative'}}>
							<div style={{position: 'absolute', left: 3, right: 3, height: 30, background: i <= Math.floor((t - w(13, 6)) * 4) ? '#e2b33c' : '#bdbdbd', top: i <= Math.floor((t - w(13, 6)) * 4) ? 36 : 4}} />
						</div>
						<div style={{width: 18, height: 18, borderRadius: 9, margin: '0 auto', background: i <= Math.floor((t - w(13, 6)) * 4) ? '#ff4d4d' : '#3a1515'}} />
					</div>
				))}
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, bottom: 60, textAlign: 'center', fontFamily: fonts.serif, fontWeight: 900, fontSize: 70, color: '#f4efe4'}}>“just obeying”</div>
		</Paper>
		<BStamp text="REAL?" x={1330} y={6230} t={t} at={w(13, 17)} size={100} rot={-12} />
	</>
);

export const episode018: BoardEpisodeDef = {
	id: '018',
	timeline: tl,
	audioDir: 'audio/v018',
	hook: '38 people watched… and nobody helped?',
	hookUntil: 3.4,
	cam: CAM,
	World,
	shake: (t) => (t > CRACK - 0.05 && t < CRACK + 0.6 ? 1 - (t - CRACK) / 0.6 : 0),
	Overlay: ({t}) => <Crack t={t} at={CRACK} x={520} y={680} />,
	sfx: [
		['paper', 0.1, 0.4],
		['stamp', w(0, 1), 0.5],
		['shutter', w(0, 6) - 0.2, 0.4],
		['twang', w(0, 6), 0.3],
		['whoosh', R(8.3), 0.3],
		['shutter', w(1, 0) - 0.3, 0.35],
		['whoosh', R(12.3), 0.3],
		['paper', w(2, 0) - 0.2, 0.35],
		['whoosh', R(19.0), 0.3],
		['pin', w(3, 12), 0.35],
		['pin', w(3, 23), 0.35],
		['whoosh', R(28.6), 0.4],
		['stamp', w(4, 2), 0.5],
		['crack', CRACK - 0.02, 0.8],
		['paper', w(5, 3), 0.3],
		['whoosh', R(37.3), 0.3],
		['pin', w(6, 4), 0.35],
		['shutter', w(6, 8) - 0.2, 0.35],
		['whoosh', R(44.6), 0.3],
		['type', w(7, 3), 0.3],
		['stamp', w(7, 10), 0.55],
		['whoosh', R(49.6), 0.3],
		['pin', w(8, 5), 0.35],
		['pin', w(8, 12), 0.35],
		['whoosh', R(54.1), 0.4],
		['stamp', w(9, 2), 0.5],
		['shutter', w(9, 5), 0.3],
		['twang', w(10, 1), 0.3],
		['whoosh', R(68.6), 0.3],
		['heart', w(11, 10), 0.4],
		['pin', w(12, 3), 0.4],
		['whoosh', R(78.9), 0.45],
		['whoosh', R(81.3), 0.4],
		['stamp', w(13, 17), 0.55],
	],
	music: 0.3,
};
