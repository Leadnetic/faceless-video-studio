import React from 'react';
import {AbsoluteFill} from 'remotion';
import {B, BStamp, Cork, Crack, Cutout, Paper, Polaroid, Thread, Typed, type CamKey} from '../components/Board';
import tlJson from '../data/timeline-017.json';
import {ease, rise, tween} from '../lib/anim';
import {narration, type Timeline} from '../lib/timeline';
import {fonts} from '../theme';
import type {BoardEpisodeDef} from '../BoardEpisode';

const tl = tlJson as Timeline;
const n = narration(tl);
const w = n.word;

const CRACK = w(5, 5);

/** Camera path over the board: each beat lands on its exhibit, big moves happen on the "but" turns. */
const CAM: CamKey[] = [
	[0, 540, 640, 1.45, -2],
	[3.6, 540, 700, 1.15, 0],
	[6.4, 540, 930, 0.9, 1],
	[8.1, 540, 930, 0.9, 1],
	[8.6, 1520, 700, 1.2, 2],
	[13.8, 1520, 880, 0.95, 0],
	[15.9, 1520, 1100, 0.95, 0],
	[16.4, 1520, 1720, 1.15, -1],
	[21.2, 1510, 1730, 1.3, 0],
	[21.7, 560, 1780, 1.2, 1],
	[24.7, 560, 1800, 1.32, 0],
	[25.3, 1000, 2520, 0.82, 0],
	[31.2, 1000, 2500, 1.0, -1],
	[31.7, 1520, 1720, 1.05, 0],
	[33.3, 1520, 1720, 1.15, 0],
	[33.9, 1000, 3230, 0.74, 0],
	[39.6, 1020, 3240, 0.8, 1],
	[40.3, 540, 3930, 1.2, -1],
	[45.7, 540, 3960, 1.35, 0],
	[46.2, 900, 3980, 0.9, 0],
	[49.3, 920, 3990, 0.95, 0],
	[49.9, 1460, 4620, 1.0, 1],
	[56.4, 1460, 4660, 1.12, 0],
	[57.0, 1000, 5220, 0.88, -1],
	[64.9, 1000, 5220, 1.05, 0],
	[66.0, 1000, 3000, 0.2, 0],
	[69.6, 1000, 3000, 0.23, 0],
	[70.3, 1000, 5980, 1.0, 0],
	[77.5, 1000, 5980, 1.3, 0],
];

/** Corridor of cells for the 1971 polaroid. */
const Corridor: React.FC<{s: number}> = ({s}) => (
	<svg width={s} height={s} viewBox="0 0 100 100">
		<rect width={100} height={100} fill="#2a2830" />
		<path d="M0 0 L35 35 L65 35 L100 0 Z" fill="#3a3740" />
		<path d="M0 100 L35 65 L65 65 L100 100 Z" fill="#1a191d" />
		<rect x={35} y={35} width={30} height={30} fill="#0e0d10" />
		{[0, 1, 2].map((i) => (
			<g key={i}>
				<rect x={4 + i * 9} y={12 + i * 7} width={6} height={76 - i * 14} fill="#141316" stroke="#5a5660" strokeWidth={0.6} />
				<rect x={90 - i * 9} y={12 + i * 7} width={6} height={76 - i * 14} fill="#141316" stroke="#5a5660" strokeWidth={0.6} />
			</g>
		))}
		<rect x={38} y={38} width={24} height={6} fill="#efe7d6" />
		<text x={50} y={42.6} fontSize={3.3} textAnchor="middle" fill="#141114" fontFamily="JetBrains Mono">COUNTY JAIL</text>
	</svg>
);

/** All exhibits, laid out in world space. */
const World: React.FC<{t: number}> = ({t}) => (
	<>
		<Cork />
		{/* ---- A: 1971, two dozen students ---- */}
		<Polaroid id="a1" x={540} y={620} w={600} t={t} at={0.15} rot={-3} caption="Stanford · basement · 1971">
			<Corridor s={528} />
		</Polaroid>
		<BStamp text="1971" x={760} y={330} t={t} at={w(0, 1)} size={84} rot={10} />
		<Paper id="a2" x={540} y={1180} w={760} h={330} t={t} at={w(0, 2) - 0.1} rot={1}>
			<div style={{position: 'absolute', left: 30, top: 50, right: 30, display: 'flex', flexWrap: 'wrap', gap: 4}}>
				{new Array(24).fill(0).map((_, i) => (
					<div key={i} style={{width: 52, height: 64, position: 'relative', opacity: rise(t, w(0, 2) + i * 0.03, 0.15)}}>
						<Cutout x={26} y={64} s={0.25} kind="student" />
					</div>
				))}
			</div>
			<div style={{position: 'absolute', right: 30, bottom: 16, fontFamily: fonts.hand, fontWeight: 700, fontSize: 44, color: B.red}}>24 students</div>
		</Paper>
		{/* ---- B: guards turned cruel, shut down after 6 days ---- */}
		<Polaroid id="b1" x={1520} y={640} w={600} t={t} at={w(1, 0) - 0.2} rot={3} caption="guards vs. prisoners">
			<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #34313a, #17161a)'}} />
			<Cutout x={150} y={528} s={1.25} kind="guard" glint={rise(t, w(1, 9), 0.2)} />
			<Cutout x={380} y={528} s={1.05} kind="guard" flip glint={rise(t, w(1, 9) + 0.2, 0.2)} />
			<Cutout x={265} y={540} s={0.8} kind="prisoner" label="#" tilt={tween(t, [w(1, 10), w(1, 11)], [0, 8])} />
		</Polaroid>
		<Paper id="b2" x={1520} y={1170} w={700} h={250} t={t} at={w(1, 12) - 0.3} rot={-2}>
			<div style={{position: 'absolute', left: 30, top: 50, display: 'flex', gap: 14}}>
				{[1, 2, 3, 4, 5, 6].map((d, i) => (
					<div key={d} style={{position: 'relative', width: 90, height: 120, border: `4px solid ${B.ink}`, fontFamily: fonts.mono, fontSize: 30, textAlign: 'center', paddingTop: 10}}>
						DAY
						<br />
						{d}
						<svg width={90} height={120} style={{position: 'absolute', left: -4, top: -4}}>
							<path d="M8 10 L82 110 M82 10 L8 110" stroke={B.red} strokeWidth={6} strokeDasharray={260} strokeDashoffset={260 * (1 - rise(t, w(1, 13) + i * 0.15, 0.2))} />
						</svg>
					</div>
				))}
			</div>
		</Paper>
		<BStamp text="SHUT DOWN" x={1560} y={1200} t={t} at={w(1, 16)} size={78} rot={-8} />
		<Thread from={[540, 360]} to={[1520, 380]} t={t} at={8.3} />
		{/* ---- C: the lesson ---- */}
		<Paper id="c1" x={1520} y={1720} w={780} h={420} t={t} at={w(2, 0) - 0.2} rot={1} color={B.paperOld}>
			<div style={{position: 'absolute', left: 40, top: 60, fontFamily: fonts.mono, fontSize: 28, letterSpacing: 6, color: B.redDeep}}>THE LESSON</div>
			<div style={{position: 'absolute', left: 40, top: 110, right: 40, fontFamily: fonts.serif, fontWeight: 900, fontSize: 56, lineHeight: 1.15, color: B.ink}}>
				<span style={{opacity: rise(t, w(2, 5), 0.2)}}>good people </span>
				<span style={{opacity: rise(t, w(2, 9), 0.2)}}>+ bad system </span>
				<br />
				<span style={{opacity: rise(t, w(2, 14), 0.2), color: B.red}}>= monsters</span>
			</div>
			{t > CRACK ? (
				<svg width={780} height={420} style={{position: 'absolute', inset: 0}}>
					<path d="M380 0 L360 90 L420 160 L370 250 L430 330 L400 420" stroke={B.ink} strokeWidth={8} fill="none" strokeDasharray={600} strokeDashoffset={600 * (1 - rise(t, CRACK, 0.4))} />
				</svg>
			) : null}
		</Paper>
		<Thread from={[1520, 1170]} to={[1520, 1530]} t={t} at={w(2, 0)} sag={20} />
		{/* ---- D: 50 years of textbooks ---- */}
		<Paper id="d1" x={560} y={1800} w={640} h={460} t={t} at={w(3, 0) - 0.2} rot={-2} color="#d8cbb0">
			{[0, 1, 2, 3, 4].map((i) => (
				<div key={i} style={{position: 'absolute', left: 60 + i * 6, top: 300 - i * 52, width: 500, height: 48, background: ['#7d1f2a', '#1f3b3d', '#b8862a', '#3b1e4a', '#2b4a6b'][i], border: `4px solid ${B.ink}`, color: '#f4efe4', fontFamily: fonts.mono, fontSize: 24, lineHeight: '40px', paddingLeft: 16, opacity: rise(t, w(3, 4) + i * 0.1, 0.2)}}>
					PSYCHOLOGY · ED. {1975 + i * 10}
				</div>
			))}
			<div style={{position: 'absolute', right: 30, top: 30, fontFamily: fonts.hand, fontWeight: 700, fontSize: 58, color: B.red, opacity: rise(t, w(3, 2), 0.2)}}>50 yrs</div>
		</Paper>
		<Thread from={[1180, 1740]} to={[860, 1640]} t={t} at={w(3, 0) - 0.2} sag={30} />
		{/* ---- E: 2018, back into the archives ---- */}
		<Paper id="e1" x={1000} y={2520} w={1000} h={720} t={t} at={w(4, 0) - 0.1} rot={0} color="#b89d72" pin={false} tape>
			<div style={{position: 'absolute', left: 40, top: 40, fontFamily: fonts.mono, fontSize: 40, letterSpacing: 10, color: B.ink}}>ARCHIVE · BOX 1971</div>
			{/* tape cassette */}
			<div style={{position: 'absolute', left: 60, top: 140, width: 360, height: 230, background: '#26242a', borderRadius: 18, border: '6px solid #0e0d10', transform: `scale(${rise(t, w(4, 12) - 0.2, 0.3)})`}}>
				<div style={{position: 'absolute', left: 30, top: 24, right: 30, height: 60, background: B.paper, fontFamily: fonts.hand, fontWeight: 700, fontSize: 30, textAlign: 'center', lineHeight: '60px'}}>TAPE · DAY 2</div>
				{[100, 260].map((cx) => (
					<div key={cx} style={{position: 'absolute', left: cx - 40, top: 110, width: 80, height: 80, borderRadius: '50%', border: '10px solid #d9d2c4', transform: `rotate(${t * 180}deg)`, borderTopColor: 'transparent'}} />
				))}
			</div>
			{/* notes */}
			<div style={{position: 'absolute', left: 470, top: 130, width: 460, height: 260, background: '#f4ecd9', transform: `rotate(3deg) scale(${rise(t, w(4, 14) - 0.2, 0.3)})`, padding: 22}}>
				<Typed text={'staff notes:\n– guards too soft?\n– "be tough"\n– day 2 …'} t={t} at={w(4, 14)} style={{fontSize: 30, lineHeight: 1.4}} />
			</div>
			{/* interview */}
			<div style={{position: 'absolute', left: 120, top: 420, width: 760, height: 250, background: '#fbf7ee', transform: `rotate(-2deg) scale(${rise(t, w(4, 16) - 0.2, 0.3)})`, padding: 24}}>
				<div style={{fontFamily: fonts.mono, fontSize: 26, color: B.redDeep, letterSpacing: 4}}>INTERVIEW TRANSCRIPT</div>
				{[0, 1, 2, 3].map((i) => (
					<div key={i} style={{marginTop: 16, height: 18, width: `${90 - i * 12}%`, background: '#141114', opacity: 0.7}} />
				))}
			</div>
		</Paper>
		<BStamp text="2018" x={1360} y={2230} t={t} at={w(4, 2)} size={96} rot={12} />
		<Thread from={[560, 2030]} to={[700, 2190]} t={t} at={w(4, 0)} sag={10} />
		{/* ---- G: the tape — guards were coached ---- */}
		<Paper id="g1" x={700} y={3220} w={760} h={560} t={t} at={w(6, 0) - 0.2} rot={-1}>
			<div style={{position: 'absolute', left: 40, top: 50, fontFamily: fonts.mono, fontSize: 30, letterSpacing: 6, color: B.redDeep}}>RECORDING · STAFF → GUARD</div>
			<svg width={680} height={160} style={{position: 'absolute', left: 40, top: 110}}>
				{new Array(60).fill(0).map((_, i) => {
					const active = t > w(6, 3) && t < w(6, 9) + 0.4;
					const h = 10 + Math.abs(Math.sin(i * 0.7 + t * (active ? 9 : 1))) * (active ? 120 : 20);
					return <rect key={i} x={i * 11} y={80 - h / 2} width={7} height={h} fill={i * 11 < (t - w(6, 0)) * 120 ? B.red : '#8a8070'} />;
				})}
			</svg>
			<div style={{position: 'absolute', left: 60, top: 300, right: 40}}>
				<Typed text={'staff: "be tougher."'} t={t} at={w(6, 9)} style={{fontSize: 46, fontWeight: 700}} />
			</div>
			<div style={{position: 'absolute', left: 60, top: 400, fontFamily: fonts.hand, fontWeight: 700, fontSize: 52, color: B.red, opacity: rise(t, w(6, 15), 0.3)}}>not left alone →</div>
		</Paper>
		<Polaroid id="g2" x={1420} y={3240} w={520} t={t} at={w(6, 5) - 0.2} rot={4} caption="who pushed whom?">
			<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #34313a, #17161a)'}} />
			<Cutout x={300} y={460} s={1.2} kind="guard" glint={0.6} />
			<Cutout x={140} y={460} s={1.05} kind="staff" flip tilt={-6} />
		</Polaroid>
		<BStamp text="COACHED" x={1380} y={3440} t={t} at={w(6, 19)} size={90} rot={-12} />
		<Thread from={[1000, 2880]} to={[700, 2960]} t={t} at={w(6, 0) - 0.3} sag={20} />
		{/* ---- H: the breakdown — "I was faking" ---- */}
		<Polaroid id="h1" x={540} y={3940} w={560} t={t} at={w(7, 1) - 0.2} rot={-4} caption="the famous breakdown">
			<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #3a3740, #141316)'}} />
			<Cutout x={248} y={500} s={1.5} kind="prisoner" label="#" tilt={Math.sin(t * 9) * (t > w(7, 4) && t < w(8, 0) ? 3 : 0)} />
		</Polaroid>
		<BStamp text="FAKED?" x={560} y={3900} t={t} at={w(8, 4)} size={110} rot={-14} />
		<Paper id="h2" x={1260} y={3980} w={560} h={420} t={t} at={w(8, 6) - 0.2} rot={3} color="#f4ecd9">
			<div style={{position: 'absolute', left: 40, top: 60, fontFamily: fonts.mono, fontSize: 30, color: B.ink, letterSpacing: 4}}>WHY HE WANTED OUT:</div>
			<div style={{position: 'absolute', left: 40, top: 130, right: 30, fontFamily: fonts.hand, fontWeight: 700, fontSize: 64, lineHeight: 1.1, color: '#1b3a8a', opacity: rise(t, w(8, 13) - 0.2, 0.3)}}>
				to study for
				<br />
				his exams ✎
			</div>
		</Paper>
		<Thread from={[700, 3500]} to={[540, 3640]} t={t} at={w(7, 0) - 0.3} sag={20} />
		{/* ---- I: not all fake ---- */}
		<Paper id="i1" x={1460} y={4640} w={820} h={560} t={t} at={w(9, 0) - 0.2} rot={-1} color={B.paperOld}>
			<div style={{position: 'absolute', left: 40, top: 50, fontFamily: fonts.mono, fontSize: 32, letterSpacing: 6, color: B.redDeep}}>VERDICT</div>
			{[
				['all fake', w(9, 4), false],
				['some guards really harsh', w(9, 12), true],
				['leader defended it to the end', w(9, 19), true],
			].map(([txt, at, ok], i) => (
				<div key={i} style={{position: 'absolute', left: 40, top: 120 + i * 120, display: 'flex', alignItems: 'center', gap: 22, opacity: rise(t, (at as number) - 0.15, 0.2)}}>
					<div style={{width: 70, height: 70, border: `6px solid ${B.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.punch, fontWeight: 900, fontSize: 52, color: ok ? '#1f6b3a' : B.red}}>{ok ? '✓' : '✗'}</div>
					<div style={{fontFamily: fonts.serif, fontWeight: 900, fontSize: 44, color: B.ink}}>{txt as string}</div>
				</div>
			))}
		</Paper>
		<Thread from={[1260, 4190]} to={[1400, 4380]} t={t} at={w(9, 0) - 0.3} sag={20} />
		{/* ---- J: the darker lesson ---- */}
		<Paper id="j1" x={1000} y={5220} w={1000} h={640} t={t} at={w(10, 0) - 0.2} rot={1} color={B.paper}>
			<div style={{position: 'absolute', left: 40, top: 50, fontFamily: fonts.mono, fontSize: 30, letterSpacing: 8, color: B.redDeep}}>THE REAL LESSON?</div>
			<div style={{position: 'absolute', left: 60, top: 150, opacity: rise(t, w(10, 18) - 0.2, 0.3)}}>
				<Cutout x={110} y={300} s={1.1} kind="staff" />
				<div style={{position: 'absolute', left: 0, top: 310, width: 220, textAlign: 'center', fontFamily: fonts.mono, fontWeight: 700, fontSize: 26}}>IN CHARGE</div>
			</div>
			<svg width={1000} height={640} style={{position: 'absolute', inset: 0}}>
				<path d="M300 330 L600 330" stroke={B.red} strokeWidth={10} strokeDasharray={300} strokeDashoffset={300 * (1 - rise(t, w(10, 21), 0.4))} />
				<path d="M580 310 L612 330 L580 350" stroke={B.red} strokeWidth={10} fill="none" opacity={rise(t, w(10, 21) + 0.3, 0.1)} />
			</svg>
			<div style={{position: 'absolute', left: 620, top: 150, opacity: rise(t, w(10, 21) + 0.2, 0.3)}}>
				<Cutout x={140} y={300} s={1.1} kind="guard" glint={0.5} />
				<div style={{position: 'absolute', left: 0, top: 310, width: 280, textAlign: 'center', fontFamily: fonts.mono, fontWeight: 700, fontSize: 26}}>DOES WHAT'S EXPECTED</div>
			</div>
			<div style={{position: 'absolute', left: 40, bottom: 40, right: 40, textAlign: 'center', fontFamily: fonts.serif, fontWeight: 900, fontSize: 52, color: B.red, opacity: rise(t, w(10, 27), 0.3)}}>expectation, not just power</div>
		</Paper>
		<Thread from={[1460, 4910]} to={[1100, 4950]} t={t} at={w(10, 0) - 0.3} sag={20} />
		{/* ---- K: every famous experiment (seen in the wide shot) ---- */}
		{[
			['MILGRAM · 1961', -500, 900],
			['ASCH · 1951', 2500, 700],
			['LITTLE ALBERT · 1920', -560, 2600],
			['MARSHMALLOW · 1972', 2560, 2400],
			['BYSTANDERS · 1964', -480, 4300],
			['ROSENHAN · 1973', 2520, 4100],
			['ROBBERS CAVE · 1954', -520, 5900],
			['HAWTHORNE · 1924', 2540, 5800],
		].map(([label, x, y], i) => (
			<Paper key={i} id={`k${i}`} x={x as number} y={y as number} w={760} h={460} t={t} at={w(11, 4) + i * 0.08} rot={(i % 2 ? 3 : -3)} color={B.paperOld}>
				<div style={{position: 'absolute', left: 40, top: 70, fontFamily: fonts.mono, fontSize: 52, fontWeight: 700, color: B.ink}}>{label as string}</div>
				<div style={{position: 'absolute', right: 50, bottom: 30, fontFamily: fonts.serif, fontWeight: 900, fontSize: 220, lineHeight: 1, color: B.red, opacity: rise(t, w(11, 5) + i * 0.08, 0.3)}}>?</div>
			</Paper>
		))}
		{/* ---- L: next file ---- */}
		<Paper id="l1" x={1000} y={5980} w={900} h={760} t={t} at={w(12, 0) - 0.3} rot={-1} color="#1d1b1f" pin={false} tape>
			<div style={{position: 'absolute', left: 40, top: 40, fontFamily: fonts.mono, fontSize: 32, letterSpacing: 8, color: B.mustard}}>NEXT FILE</div>
			<svg width={900} height={500} style={{position: 'absolute', left: 0, top: 110}}>
				<rect x={200} y={20} width={500} height={460} fill="#2a2830" />
				{new Array(40).fill(0).map((_, i) => {
					const on = i < 38 && t > w(12, 2) + (i % 13) * 0.05;
					return <rect key={i} x={225 + (i % 8) * 58} y={45 + Math.floor(i / 8) * 85} width={36} height={50} fill={on ? '#ffd27a' : '#141316'} />;
				})}
			</svg>
			<div style={{position: 'absolute', left: 0, right: 0, bottom: 40, textAlign: 'center', fontFamily: fonts.serif, fontWeight: 900, fontSize: 70, color: '#f4efe4'}}>38 witnesses</div>
		</Paper>
		<BStamp text="NOT TRUE?" x={1240} y={6200} t={t} at={w(12, 13)} size={96} rot={-12} />
	</>
);

export const episode017: BoardEpisodeDef = {
	id: '017',
	timeline: tl,
	audioDir: 'audio/v017',
	hook: 'The most famous psychology experiment… was staged?',
	hookUntil: 3.6,
	cam: CAM,
	World,
	shake: (t) => (t > CRACK - 0.05 && t < CRACK + 0.6 ? 1 - (t - CRACK) / 0.6 : 0),
	Overlay: ({t}) => (
		<>
			<Crack t={t} at={CRACK} x={560} y={700} />
			{t > CRACK && t < CRACK + 0.9 ? <AbsoluteFill style={{background: '#fff', opacity: 0.35 * (1 - (t - CRACK) / 0.9)}} /> : null}
		</>
	),
	sfx: [
		['paper', 0.1, 0.4],
		['shutter', 0.2, 0.5],
		['stamp', w(0, 1), 0.5],
		['pin', w(0, 2), 0.4],
		['whoosh', 8.2, 0.35],
		['shutter', w(1, 0) - 0.2, 0.4],
		['twang', 8.4, 0.3],
		['type', w(1, 13), 0.25],
		['stamp', w(1, 16), 0.55],
		['whoosh', 16.0, 0.3],
		['paper', w(2, 0) - 0.2, 0.35],
		['whoosh', 21.4, 0.3],
		['paper', w(3, 0) - 0.2, 0.35],
		['whoosh', 25.0, 0.4],
		['stamp', w(4, 2), 0.5],
		['tape', w(4, 12) - 0.2, 0.4],
		['type', w(4, 14), 0.3],
		['paper', w(4, 16) - 0.2, 0.35],
		['crack', CRACK - 0.02, 0.85],
		['whoosh', 33.6, 0.35],
		['tape_rewind', w(6, 1) - 0.3, 0.3],
		['type', w(6, 9), 0.3],
		['stamp', w(6, 19), 0.55],
		['whoosh', 40.0, 0.35],
		['shutter', w(7, 1) - 0.2, 0.4],
		['heart', w(7, 4), 0.5],
		['stamp', w(8, 4), 0.6],
		['paper', w(8, 6) - 0.2, 0.35],
		['whoosh', 49.6, 0.35],
		['pin', w(9, 4), 0.35],
		['pin', w(9, 12), 0.35],
		['pin', w(9, 19), 0.35],
		['whoosh', 56.7, 0.35],
		['twang', w(10, 21), 0.35],
		['whoosh', 65.5, 0.45],
		['paper', w(11, 4), 0.35],
		['whoosh', 70.0, 0.4],
		['stamp', w(12, 13), 0.55],
	],
	music: 0.3,
};
