import React from 'react';
import {AbsoluteFill} from 'remotion';
import timelineJson from '../data/timeline-008.json';
import {Bean, Brain, OUT, pop, Punch, Speech} from '../components/Toon';
import {Bg, Browser, Cite, Icon, Notes, Pill, SongBar, Stamp, TipCard, Worm} from '../components/ToonProps';
import {ease, rise, tween} from '../lib/anim';
import {narration, type Timeline} from '../lib/timeline';
import {BedSet} from '../scenes/v004/Bed';
import {fonts} from '../theme';
import type {EpisodeDef, ShotCtx} from '../ToonEpisode';

const T = timelineJson as Timeline;
const N = narration(T);
const W = (l: number, w: number) => N.word(l, w);

const Shot1: React.FC<ShotCtx> = ({t, s}) => (
	<AbsoluteFill>
		<BedSet t={t} eyes={1.15} mouth="flat" look={[0, -1]} blanket={1} brows={-0.4} clock="2:00" />
		<Notes x={540} y={430} t={t} n={6} r={260} p={pop(t, 0.2, 0.4)} />
		<Punch text="my brain at 2am:" y={250} size={76} family="round" stroke={12} />
		<Pill text="♪ 0:10 · ON REPEAT" x={540} y={1060} p={pop(t, W(0, 11), 0.3)} color="#ffe14d" size={42} />
	</AbsoluteFill>
);

const Shot2: React.FC<ShotCtx> = ({t, s}) => (
	<AbsoluteFill style={{transform: `scale(${tween(t, [s, s + 1.4], [1.1, 1.3])})`, transformOrigin: '540px 700px'}}>
		<BedSet t={t} eyes={1.2} mouth="grimace" look={[0, 0]} blanket={1} brows={-1} blush={0.4} sweat={1} clock="2:00" />
		<Notes x={540} y={420} t={t} n={8} r={300} />
	</AbsoluteFill>
);

const Shot3: React.FC<ShotCtx> = ({t, s}) => {
	const out = pop(t, s + 0.15, 0.45);
	return (
		<AbsoluteFill>
			<Bg color="#9b8cff" pattern="dots" />
			<Bean x={400} y={1360} size={700} shirt="#4f7cff" mouth="o" eyes={1.15} headOnly={false} />
			<div style={{position: 'absolute', left: 0, top: 0, transform: `translate(${tween(out, [0, 1], [-40, 0])}px, 0) scale(${out})`, transformOrigin: '230px 820px'}}>
				<Worm x={300} y={760} size={320} t={t} />
			</div>
			<Stamp text="EARWORM" t={t} at={W(2, 4) - 0.1} y={330} color="#ff3b5c" />
			<Pill text="most people: weekly" x={540} y={500} p={pop(t, W(2, 6), 0.3)} color="#fff" size={44} />
			<Cite text="Liikkanen, 2012" p={rise(t, W(2, 12), 0.3)} y={560} color="#1f1b2e" />
		</AbsoluteFill>
	);
};

const Shot4: React.FC<ShotCtx> = ({t, s}) => (
	<AbsoluteFill>
		<Bg color="#2a2470" pattern="grid" />
		<Punch text="the whole song:" y={300} size={64} family="round" stroke={11} p={pop(t, s, 0.3)} />
		<SongBar x={130} y={480} w={820} t={t} seg={[0.42, 0.5]} />
		<Pill text="your brain:" x={540} y={680} p={pop(t, s + 0.4, 0.3)} color="#fff" size={44} />
		<div style={{position: 'absolute', left: 260, top: 760, width: 560, height: 220, whiteSpace: 'nowrap', borderRadius: 30, background: '#ffe14d', border: `7px solid ${OUT}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${pop(t, s + 0.6, 0.35)})`, fontFamily: fonts.punch, fontWeight: 900, fontSize: 64, color: OUT}}>
			↻ 0:42–0:52
		</div>
	</AbsoluteFill>
);

const Shot5: React.FC<ShotCtx> = ({t, s}) => {
	const blink = Math.sin(t * 10) > 0;
	return (
		<AbsoluteFill>
			<Bg color="#2fc0a3" pattern="dots" />
			<Brain x={540} y={1060} size={420} mouth="flat" brows={-0.8} look={[0.4, -0.6]} glasses />
			<div style={{position: 'absolute', left: 220, top: 300, width: 640, transform: `scale(${pop(t, s + 0.1, 0.35)})`, background: '#fff', border: `7px solid ${OUT}`, borderRadius: 22, padding: '20px 28px', fontFamily: fonts.round, fontWeight: 700, fontSize: 40, color: OUT, lineHeight: 1.5}}>
				<div>✓ brush teeth</div>
				<div>✓ answer email</div>
				<div style={{color: blink ? '#ff3b5c' : OUT}}>☐ finish that song…</div>
			</div>
		</AbsoluteFill>
	);
};

const Shot6: React.FC<ShotCtx> = ({t, s}) => {
	const done = pop(t, W(5, 11), 0.35);
	const open = pop(t, W(5, 8), 0.35);
	return (
		<AbsoluteFill>
			<Bg color="#7c6cff" pattern="grid" />
			<Stamp text="ZEIGARNIK EFFECT" t={t} at={s + 0.1} y={300} color="#ff3b5c" size={66} />
			<Cite text="Bluma Zeigarnik, 1927" p={rise(t, s + 0.4, 0.3)} y={400} />
			<div style={{position: 'absolute', left: 110, top: 520, width: 400, height: 380, transform: `scale(${open}) rotate(-3deg)`, borderRadius: 26, background: '#ffe14d', border: `7px solid ${OUT}`, boxShadow: '0 0 60px rgba(255,225,77,0.8)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: fonts.punch, fontWeight: 900, fontSize: 40, color: OUT}}>
				<div style={{fontSize: 90}}>⏸</div>
				INTERRUPTED
				<div style={{fontSize: 30, fontFamily: fonts.round}}>remembered!</div>
			</div>
			<div style={{position: 'absolute', left: 570, top: 560, width: 380, height: 340, transform: `scale(${done}) rotate(3deg)`, borderRadius: 26, background: '#fff', border: `7px solid ${OUT}`, opacity: 1 - rise(t, W(5, 12) + 0.5, 0.8) * 0.6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: fonts.punch, fontWeight: 900, fontSize: 40, color: OUT}}>
				<Icon kind="check" size={90} />
				FINISHED
				<div style={{fontSize: 30, fontFamily: fonts.round}}>forgotten…</div>
			</div>
		</AbsoluteFill>
	);
};

const Shot7: React.FC<ShotCtx> = ({t, s}) => {
	const tries = [W(6, 19), W(6, 19) + 0.55];
	const bounce = tries.reduce((a, at) => a + Math.max(0, 1 - Math.abs(t - at - 0.1) * 6), 0);
	return (
		<AbsoluteFill>
			<Bg color="#2a2470" pattern="dots" />
			<Browser x={110} y={420} w={860} h={640} t={t} hot={2} tabs={['email', 'news', '♪ chorus.mp3', 'recipe']}>
				<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
					<Notes x={430} y={260} t={t} n={5} r={200} />
				</div>
			</Browser>
			{/* cursor going for the X */}
			<svg width={80} height={100} viewBox="0 0 40 50" style={{position: 'absolute', left: tween(rise(t, W(6, 16), 0.5), [0, 1], [880, 556]) + bounce * 30, top: tween(rise(t, W(6, 16), 0.5), [0, 1], [1040, 470]) + bounce * 20}}>
				<path d="M2 2 L2 40 L12 30 L20 48 L28 44 L20 27 L34 27 Z" fill="#fff" stroke={OUT} strokeWidth={3} strokeLinejoin="round" />
			</svg>
			<Pill text="CAN'T CLOSE IT" x={540} y={300} p={pop(t, W(6, 19), 0.3)} color="#ff8fb8" size={60} rot={-3} />
		</AbsoluteFill>
	);
};

const Shot8: React.FC<ShotCtx> = ({t, s}) => {
	const steps = [0, 0, 1, 0, 0, 1, 0, 3];
	return (
		<AbsoluteFill>
			<Bg color="#ff7a59" pattern="stripes" />
			<Punch text="CATCHY = STICKY" y={250} size={86} family="punch" stroke={13} color="#ffe14d" p={pop(t, s + 0.05, 0.3)} />
			{/* staff */}
			<div style={{position: 'absolute', left: 110, top: 560, width: 860, height: 300, transform: `scale(${pop(t, W(7, 5), 0.35)})`, borderRadius: 26, background: '#fff', border: `7px solid ${OUT}`, overflow: 'hidden'}}>
				{[0, 1, 2, 3, 4].map((i) => <div key={i} style={{position: 'absolute', left: 30, right: 30, top: 60 + i * 44, height: 4, background: OUT, opacity: 0.35}} />)}
				{steps.map((st, i) => {
					const jump = i === 7;
					const on = t > W(7, 5) + i * 0.25 || (jump && t > W(7, 12));
					return on ? (
						<div key={i} style={{position: 'absolute', left: 60 + i * 100, top: 190 - st * 44 - (jump ? Math.abs(Math.sin(t * 6)) * 10 : 0), transform: `scale(${jump ? 1.3 : 1})`}}>
							<Icon kind="note" size={80} color={jump ? '#ff3b5c' : OUT} />
						</div>
					) : null;
				})}
			</div>
			<Pill text="SIMPLE" x={260} y={980} p={pop(t, W(7, 5), 0.3)} color="#fff" size={44} />
			<Pill text="REPEAT ×4" x={540} y={1080} p={pop(t, W(7, 9), 0.3)} color="#fff" size={44} />
			<Pill text="JUMP!" x={820} y={980} p={pop(t, W(7, 12), 0.3)} color="#ffe14d" size={48} rot={6} />
		</AbsoluteFill>
	);
};

const Shot9: React.FC<ShotCtx> = ({t, s}) => (
	<AbsoluteFill>
		<Bg color="#2fc0a3" pattern="dots" />
		<Bean x={540} y={1360} size={660} shirt="#4f7cff" mouth="grin" arms="up" />
		<Punch text="THE FIXES" y={260} size={110} family="punch" stroke={14} color="#ffe14d" p={pop(t, W(8, 3), 0.3)} rot={-3} />
	</AbsoluteFill>
);

const Shot10: React.FC<ShotCtx> = ({t, s}) => {
	const chew = Math.sin(t * 9) > 0;
	return (
		<AbsoluteFill>
			<Bg color="#ff8fb8" pattern="dots" />
			<TipCard n={1} title="Chew gum" p={pop(t, s, 0.35)} y={250}>
				<Icon kind="gum" size={100} />
			</TipCard>
			<Bean x={420} y={1360} size={640} shirt="#4f7cff" mouth={chew ? 'flat' : 'smirk'} squash={chew ? 0.04 : 0} />
			<Worm x={790} y={1060} size={300} t={t} tired={rise(t, W(9, 15), 2)} />
			<Cite text="Beaman et al., 2015 · University of Reading" p={rise(t, W(9, 7), 0.3)} y={510} color="#1f1b2e" />
			<Pill text="mouth busy = no singing" x={540} y={620} p={pop(t, W(9, 19), 0.3)} color="#fff" size={40} />
		</AbsoluteFill>
	);
};

const Shot11: React.FC<ShotCtx> = ({t, s}) => {
	const fill = rise(t, W(10, 1), N.end(10) - W(10, 1), (x) => x);
	return (
		<AbsoluteFill>
			<Bg color="#7c6cff" pattern="grid" />
			<TipCard n={2} title="Play the whole song" p={pop(t, s, 0.35)} y={250} color="#2fc0a3" />
			<SongBar x={130} y={620} w={820} t={t} seg={[0.42, 0.5]} fill={fill} />
			<div style={{position: 'absolute', left: 440, top: 760, transform: `scale(${pop(t, W(10, 10), 0.35)})`}}>
				<Icon kind="check" size={200} />
			</div>
			<Pill text="ending: delivered" x={540} y={1060} p={pop(t, W(10, 11), 0.3)} color="#fff" size={44} />
		</AbsoluteFill>
	);
};

const Shot12: React.FC<ShotCtx> = ({t, s}) => {
	const pick = t < W(11, 6) ? 1 : t < W(11, 9) ? 0 : t < N.end(11) ? 2 : 1;
	return (
		<AbsoluteFill>
			<Bg color="#ffcf8a" pattern="stripes" />
			<TipCard n={3} title="Do a puzzle" p={pop(t, s, 0.35)} y={250} color="#ff8fb8">
				<Icon kind="puzzle" size={100} />
			</TipCard>
			<Cite text="Hyman et al., 2013" p={rise(t, W(11, 5), 0.3)} y={500} color="#1f1b2e" />
			{['TOO EASY', 'JUST RIGHT', 'TOO HARD'].map((lab, i) => (
				<div key={lab} style={{position: 'absolute', left: 110 + i * 290, top: 640, width: 270, height: 220, borderRadius: 24, background: i === 1 ? '#2fc0a3' : '#fff', border: `7px solid ${OUT}`, transform: `scale(${pop(t, W(11, 6) + i * 0.15, 0.3) * (pick === i ? 1.08 : 0.92)})`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: fonts.punch, fontWeight: 900, fontSize: 34, color: OUT, opacity: pick === i ? 1 : 0.6}}>
					<Icon kind="puzzle" size={90} color={['#cfd2e6', '#ffe14d', '#ff3b5c'][i]} />
					{lab}
				</div>
			))}
		</AbsoluteFill>
	);
};

const Shot13: React.FC<ShotCtx> = ({t, s}) => {
	const burst = rise(t, W(12, 6), 0.6, ease.out);
	return (
		<AbsoluteFill>
			<Bg color="#2a2470" pattern="dots" floor="#1d1b52" />
			{/* the door being held shut */}
			<div style={{position: 'absolute', left: 420, top: 640, width: 300, height: 720, borderRadius: '14px 14px 0 0', background: '#9c5a2c', border: `8px solid ${OUT}`, transformOrigin: '0% 50%', transform: `perspective(1200px) rotateY(${burst * -70}deg)`}} />
			<Bean x={360} y={1360} size={560} shirt="#4f7cff" mouth="grimace" arms="point" rot={-8 - burst * 10} sweat={1} brows={-1} />
			<Notes x={640} y={tween(burst, [0, 1], [960, 700])} t={t} n={tween(burst, [0, 1], [3, 10])} r={tween(burst, [0, 1], [90, 360])} />
			<Punch text="DON'T FIGHT IT" y={250} size={90} family="punch" stroke={13} color="#ffe14d" p={pop(t, W(12, 4), 0.3)} rot={-3} />
		</AbsoluteFill>
	);
};

const Shot14: React.FC<ShotCtx> = ({t, s}) => (
	<AbsoluteFill>
		<BedSet t={t} eyes={1.2} mouth="grimace" blanket={1} brows={-1} clock="2:01" />
		<Notes x={540} y={430} t={t} n={8} r={280} />
		<Worm x={760} y={760} size={260} t={t} wink={t > W(13, 2)} />
		<Punch text="good luck." y={250} size={96} family="round" stroke={14} color="#ffe14d" p={pop(t, W(13, 1), 0.3)} rot={-3} />
	</AbsoluteFill>
);

export const episode008: EpisodeDef = {
	id: 'psychology-video-008',
	timeline: T,
	audioDir: 'audio/v008',
	music: 0.26,
	shots: [
		{at: 0, C: Shot1, cut: 'none'},
		{at: N.start(1), C: Shot2},
		{at: N.start(2), C: Shot3},
		{at: N.start(3), C: Shot4},
		{at: N.start(4), C: Shot5},
		{at: N.start(5), C: Shot6},
		{at: N.start(6), C: Shot7},
		{at: N.start(7), C: Shot8},
		{at: N.start(8), C: Shot9},
		{at: N.start(9), C: Shot10},
		{at: N.start(10), C: Shot11},
		{at: N.start(11), C: Shot12},
		{at: N.start(12), C: Shot13},
		{at: N.start(13), C: Shot14},
	],
	sfx: [
		['jingle', 0.15, 0.16],
		['pop', W(0, 11), 0.25],
		['scratch', N.start(1), 0.3],
		['boing', N.start(2) + 0.15, 0.4],
		['stamp', W(2, 4) - 0.1, 0.45],
		['rewind', W(3, 6), 0.3],
		['ding', N.start(4) + 0.1, 0.25],
		['stamp', N.start(5) + 0.1, 0.45],
		['pop', W(5, 8), 0.25],
		['pop', W(5, 11), 0.25],
		['jingle', N.start(6) + 0.2, 0.12],
		['pop', W(6, 19), 0.3],
		['boing', W(6, 19) + 0.55, 0.3],
		['pop', W(7, 5), 0.25],
		['pop', W(7, 9), 0.25],
		['boing', W(7, 12), 0.35],
		['ding', W(8, 3), 0.3],
		['chew', N.start(9) + 0.3, 0.4],
		['chew', N.start(9) + 2.0, 0.35],
		['save', N.end(10) - 0.2, 0.35],
		['pop', W(11, 6), 0.25],
		['pop', W(11, 9), 0.25],
		['creak', W(12, 4), 0.35],
		['scratch', W(12, 6), 0.3],
		['jingle', W(13, 1), 0.42],
	],
};
