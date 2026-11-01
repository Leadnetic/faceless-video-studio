import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {SevenSeg} from '../../components/SevenSeg';
import {Bean, Brain, Cloud, OUT, pop, Punch, Speech, type Mouth} from '../../components/Toon';
import {useTime} from '../../components/Primitives';
import {ease, rise, tween} from '../../lib/anim';
import {fonts} from '../../theme';
import type {Video004} from '../../videos/video004';

/** Top-down bed at night. Shared by the hook, the "awake" beat and the replay scene. */
export const BedSet: React.FC<{t: number; eyes: number; mouth: Mouth; look?: [number, number]; blush?: number; sweat?: number; blanket?: number; brows?: number; clock?: string}> = ({
	t,
	eyes,
	mouth,
	look = [0, 0],
	blush = 0,
	sweat = 0,
	blanket = 0,
	brows = 0,
	clock = '3:07',
}) => (
	<>
		<AbsoluteFill style={{background: 'linear-gradient(180deg, #2c2a78 0%, #1d1b52 100%)'}} />
		{new Array(26).fill(0).map((_, i) => (
			<div key={i} style={{position: 'absolute', left: random(`sx${i}`) * 1080, top: random(`sy${i}`) * 1920, width: 6, height: 6, borderRadius: 3, background: '#fff6c9', opacity: 0.3 + 0.5 * Math.abs(Math.sin(t * 2 + i))}} />
		))}
		{/* floor rug */}
		<div style={{position: 'absolute', left: 110, top: 1540, width: 860, height: 260, borderRadius: 130, background: '#3d3a99', border: `6px solid ${OUT}`}} />
		{/* nightstand with clock */}
		<div style={{position: 'absolute', left: 30, top: 560, width: 190, height: 190, borderRadius: 24, background: '#c47f4a', border: `6px solid ${OUT}`}} />
		<div style={{position: 'absolute', left: 48, top: 610, width: 154, height: 82, borderRadius: 14, background: '#1b1830', border: `5px solid ${OUT}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
			<SevenSeg text={clock} height={52} color="#ff4d6d" t={t} glow={0.6} />
		</div>
		{/* bed */}
		<div style={{position: 'absolute', left: 230, top: 470, width: 620, height: 1180, borderRadius: 46, background: '#a86b3c', border: `6px solid ${OUT}`}} />
		<div style={{position: 'absolute', left: 258, top: 500, width: 564, height: 1120, borderRadius: 34, background: '#f3efff', border: `5px solid ${OUT}`}} />
		<div style={{position: 'absolute', left: 330, top: 540, width: 420, height: 200, borderRadius: 80, background: '#ffffff', border: `6px solid ${OUT}`, boxShadow: `inset 0 -16px 0 #e3defa`}} />
		<Bean x={540} y={1060} size={560} headOnly mouth={mouth} eyes={eyes} look={look} blush={blush} sweat={sweat} brows={brows} hairStyle="tuft" />
		{/* blanket (pulled up to the eyes when mortified) */}
		<div style={{position: 'absolute', left: 250, top: 780 - blanket * 26, width: 580, height: 880 + blanket * 26, borderRadius: '40px 40px 34px 34px', background: 'repeating-linear-gradient(135deg, #ff9f43 0 46px, #ffb766 46px 92px)', border: `6px solid ${OUT}`}}>
			<div style={{position: 'absolute', left: -6, right: -6, top: -6, height: 70, borderRadius: '40px 40px 0 0', background: '#fff', border: `6px solid ${OUT}`}} />
		</div>
	</>
);

/** 0–3.6s — "your brain at 3am:" — falling asleep; the brain pops up with an idea. */
export const S1Bed: React.FC<{v: Video004}> = ({v}) => {
	const t = useTime();
	const k = v.t;
	const eyes = t < k.hey ? tween(t, [0.2, k.sleepy], [1, 0.05], ease.inOut) : 1;
	const brain = pop(t, k.brainPop, 0.4);
	const cloud = pop(t, k.cloud, 0.45);
	const dive = rise(t, v.scenes.bed[1] - 0.35, 0.35, ease.in);
	const zoom = tween(t, [0, k.cloud], [1.0, 1.08]) * (1 + dive * 2.4);
	return (
		<AbsoluteFill style={{transform: `scale(${zoom})`, transformOrigin: `${tween(dive, [0, 1], [540, 700])}px ${tween(dive, [0, 1], [900, 300])}px`}}>
			<BedSet t={t} eyes={eyes} mouth={t < k.hey ? 'smile' : 'o'} look={t < k.hey ? [0, 0] : [0.3, -1]} />
			{brain > 0 ? <Brain x={540} y={tween(brain, [0, 1], [720, 560])} size={300} look={[0, 1]} squash={Math.sin(t * 10) * 0.15 * (1 - rise(t, k.brainPop + 0.6, 0.3))} /> : null}
			<Speech x={470} y={360} text="psst…" p={pop(t, k.brainPop + 0.15, 0.3) * (1 - rise(t, k.cloud, 0.15))} tail="right" size={56} />
			<Cloud x={700} y={300} w={560} h={380} p={cloud} tailTo={[600, 470]}>
				<div style={{position: 'absolute', inset: 0, background: '#ffb547', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
					<Bean x={150} y={300} size={240} shirt="#4f7cff" mouth="smile" />
					<Bean x={300} y={300} size={260} shirt="#fff" bowtie mustache hairStyle="none" mouth="smile" arms="hold" />
				</div>
			</Cloud>
			<Punch text="your brain at 3am:" y={140} size={86} family="round" stroke={13} p={1 - dive} />
		</AbsoluteFill>
	);
};

/** Back in bed after the flashback: wide awake. */
export const AwakeShot: React.FC<{t: number; at: number}> = ({t, at}) => {
	const p = pop(t, at, 0.25);
	return (
		<AbsoluteFill style={{transform: `scale(${1.25 - 0.1 * p})`, transformOrigin: '540px 760px'}}>
			<BedSet t={t} eyes={1.25} mouth="flat" look={[0, 0]} blush={0.6} blanket={1} brows={-0.6} />
			<div style={{position: 'absolute', left: 640, top: 520, fontFamily: fonts.round, fontWeight: 700, fontSize: 90, color: '#fff', WebkitTextStroke: `8px ${OUT}`, paintOrder: 'stroke fill', transform: `scale(${p}) rotate(10deg)`}}>!!</div>
		</AbsoluteFill>
	);
};

/** 14.7–18.1s — the brain presses REPLAY; the memory plays on the ceiling, again and again. */
export const S5Replay: React.FC<{v: Video004}> = ({v}) => {
	const t = useTime();
	const k = v.t;
	const [s] = v.scenes.replay;
	const press = rise(t, k.press, 0.12) * (1 - rise(t, k.press + 0.18, 0.15));
	const screen = pop(t, k.press + 0.1, 0.4);
	const count = t < k.never - 0.2 ? 1 : Math.min(847, Math.floor(Math.pow(t - (k.never - 0.2), 2.6) * 220) + 2);
	const loop = ((t - k.press) % 1.1) / 1.1;
	const rewinding = loop > 0.82;
	return (
		<AbsoluteFill style={{transform: `scale(${tween(t, [s, s + 3], [1.05, 1.0])})`}}>
			<BedSet t={t} eyes={1.15} mouth="grimace" blush={0.8} sweat={rise(t, k.never, 0.3)} blanket={1} brows={-0.8} look={[0, -1]} />
			<Brain x={830} y={760} size={250} glasses={false} look={[-0.6, -0.4]} mouth="grin" squash={press} />
			{/* remote */}
			<div style={{position: 'absolute', left: 860, top: 640, width: 120, height: 200, borderRadius: 24, background: '#2b2b38', border: `6px solid ${OUT}`, transform: 'rotate(14deg)'}}>
				<div style={{position: 'absolute', left: 24, top: 26, width: 60, height: 60, borderRadius: 30, background: '#ff3b5c', border: `5px solid ${OUT}`, transform: `scale(${1 - press * 0.2})`}} />
				<div style={{position: 'absolute', left: 0, right: 0, top: 110, textAlign: 'center', color: '#fff', fontFamily: fonts.round, fontWeight: 700, fontSize: 24}}>REPLAY</div>
			</div>
			{/* ceiling projection */}
			{screen > 0 ? (
				<div style={{position: 'absolute', left: 120, top: 150, width: 840, height: 420, transform: `scale(${screen})`, borderRadius: 30, border: `8px solid ${OUT}`, background: '#ffb547', overflow: 'hidden', boxShadow: `0 10px 0 ${OUT}`}}>
					<div style={{position: 'absolute', inset: 0, transform: rewinding ? `translateX(${Math.sin(t * 90) * 10}px)` : undefined, filter: rewinding ? 'hue-rotate(40deg) saturate(1.4)' : undefined}}>
						<Bean x={260} y={470} size={360} mouth="smile" shirt="#4f7cff" />
						<Bean x={590} y={480} size={380} shirt="#fff" bowtie mustache hairStyle="none" arms="hold" />
						<Speech x={260} y={150} text="You too!" p={loop > 0.3 ? 1 : 0} size={44} tail="left" />
					</div>
					{rewinding ? <div style={{position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.18) 0 4px, transparent 4px 14px)'}} /> : null}
					<div style={{position: 'absolute', left: 22, top: 18, fontFamily: fonts.punch, fontWeight: 900, fontSize: 40, color: '#fff', WebkitTextStroke: `7px ${OUT}`, paintOrder: 'stroke fill'}}>
						{rewinding ? '◀◀ REWIND' : '▶ REPLAY'}
					</div>
					<div style={{position: 'absolute', right: 22, top: 18, fontFamily: fonts.punch, fontWeight: 900, fontSize: 40, color: '#ffe14d', WebkitTextStroke: `7px ${OUT}`, paintOrder: 'stroke fill'}}>#{count}</div>
				</div>
			) : null}
			<div style={{position: 'absolute', left: 540, top: 570, width: 0, height: 0, opacity: screen * 0.5}}>
				<div style={{position: 'absolute', left: -380, top: -10, width: 760, height: 40, background: 'radial-gradient(closest-side, rgba(255,240,180,0.6), transparent)'}} />
			</div>
		</AbsoluteFill>
	);
};
