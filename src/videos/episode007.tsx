import React from 'react';
import {AbsoluteFill} from 'remotion';
import timelineJson from '../data/timeline-007.json';
import {Bean, Brain, OUT, pop, Punch, Speech} from '../components/Toon';
import {Bg, Cite, Desk, Icon, Phone, Pill, Stamp, Timer, TipCard} from '../components/ToonProps';
import {ease, rise, tween} from '../lib/anim';
import {narration, type Timeline} from '../lib/timeline';
import {Living} from '../scenes/v005/Scenes';
import {fonts} from '../theme';
import type {EpisodeDef, ShotCtx} from '../ToonEpisode';

const T = timelineJson as Timeline;
const N = narration(T);
const W = (l: number, w: number) => N.word(l, w);

/** The task: a sheet of paper that turns into a monster as the bad feelings stack up. */
const TaskMonster: React.FC<{x: number; y: number; size: number; t: number; scary: number}> = ({x, y, size, t, scary}) => {
	const s = size / 300;
	const shake = scary > 0.5 ? Math.sin(t * 30) * 3 * scary : 0;
	return (
		<div style={{position: 'absolute', left: x - 150 * s + shake, top: y - 380 * s, width: 300 * s, height: 380 * s}}>
			<svg viewBox="0 0 300 380" width={300 * s} height={380 * s} style={{overflow: 'visible'}}>
				{scary > 0.2 ? [40, 110, 190, 260].map((cx, i) => <path key={cx} d={`M${cx} 360 L${cx + 14} ${380 + scary * 30} L${cx + 28} 360`} fill="#fff" stroke={OUT} strokeWidth={6} strokeLinejoin="round" opacity={scary} key-index={i} />) : null}
				<path d="M20 20 L220 20 L280 80 L280 360 L20 360 Z" fill={scary > 0.5 ? '#ffd9de' : '#fff'} stroke={OUT} strokeWidth={8} strokeLinejoin="round" />
				<path d="M220 20 L220 80 L280 80" fill="#e8e4f7" stroke={OUT} strokeWidth={8} strokeLinejoin="round" />
				<text x={52} y={74} fontFamily={fonts.punch} fontWeight={900} fontSize={34} fill={OUT}>TASK</text>
				{/* eyes */}
				{[100, 200].map((ex) => (
					<g key={ex}>
						<ellipse cx={ex} cy={170} rx={26} ry={30 - scary * 8} fill="#fff" stroke={OUT} strokeWidth={6} />
						<circle cx={ex} cy={176} r={11} fill={OUT} />
					</g>
				))}
				<path d={`M70 ${130 + scary * 8} L130 ${140 - scary * 10} M230 ${130 + scary * 8} L170 ${140 - scary * 10}`} stroke={OUT} strokeWidth={8} strokeLinecap="round" />
				{scary > 0.4 ? (
					<path d="M80 250 Q150 210 220 250 L210 290 L190 262 L170 292 L150 262 L130 292 L110 262 L90 290 Z" fill="#6b1f30" stroke={OUT} strokeWidth={6} strokeLinejoin="round" />
				) : (
					<path d="M110 260 Q150 240 190 260" fill="none" stroke={OUT} strokeWidth={7} strokeLinecap="round" />
				)}
			</svg>
		</div>
	);
};

const Shot1: React.FC<ShotCtx> = ({t, s}) => (
	<AbsoluteFill>
		<Bg color="#ffcf8a" pattern="stripes" />
		<Bean x={540} y={1420} size={640} shirt="#4f7cff" mouth="smile" arms="hold" />
		<Desk />
		<div style={{position: 'absolute', left: 150, top: 960, transform: `rotate(-6deg) scale(${pop(t, W(0, 3), 0.3)})`, background: '#ffe14d', border: `6px solid ${OUT}`, padding: '14px 18px', fontFamily: fonts.round, fontWeight: 700, fontSize: 34, color: OUT, boxShadow: `0 6px 0 ${OUT}`}}>
			TASK
			<br />
			(10 min)
		</div>
		<Punch text="me with a 10-minute task:" y={250} size={66} family="round" stroke={11} />
	</AbsoluteFill>
);

const Shot2: React.FC<ShotCtx> = ({t, s}) => {
	const phase = t < W(1, 7) ? 0 : t < W(1, 11) ? 1 : 2;
	return (
		<AbsoluteFill>
			<Bg color={['#bfe9d9', '#9b8cff', '#2a2470'][phase]} pattern="dots" />
			{phase === 0 ? (
				<>
					<Bean x={540} y={1360} size={640} shirt="#4f7cff" mouth="grin" arms="up" rot={Math.sin(t * 10) * 6} />
					<div style={{position: 'absolute', left: 700, top: 820, transform: `rotate(${Math.sin(t * 12) * 30}deg)`}}>
						<Icon kind="broom" size={220} />
					</div>
					{[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: 260 + i * 260, top: 480 + (i % 2) * 90, fontSize: 90, color: '#fff', fontFamily: fonts.punch, fontWeight: 900, WebkitTextStroke: `6px ${OUT}`, paintOrder: 'stroke fill', transform: `scale(${0.6 + 0.4 * Math.abs(Math.sin(t * 6 + i))})`}}>✦</div>)}
				</>
			) : (
				<>
					<Bean x={540} y={1360} size={640} shirt="#4f7cff" mouth="smile" arms="hold" eyes={phase === 2 ? 0.6 : 1} look={[0.6, 0.4]} />
					<Phone x={600} y={1050} w={150} rot={-10} screen={phase === 2 ? '#bfe9f5' : '#ffd36e'}>
						{phase === 2 ? (
							<svg viewBox="0 0 100 120" style={{position: 'absolute', left: '15%', top: '25%', width: '70%'}}>
								<ellipse cx={50} cy={70} rx={30} ry={40} fill="#1f1b2e" />
								<ellipse cx={50} cy={78} rx={20} ry={30} fill="#fff" />
								<path d="M38 52 L46 54 M54 54 L62 52" stroke="#fff" strokeWidth={4} />
								<path d="M46 60 L54 60 L50 66 Z" fill="#ffb547" />
							</svg>
						) : null}
					</Phone>
				</>
			)}
			<Pill text="+3 HOURS" x={540} y={300} p={pop(t, s, 0.3)} color="#ffe14d" size={60} rot={-3} />
			<Pill text="VIDEO #6" x={540} y={430} p={pop(t, W(1, 8), 0.3) * (phase === 1 ? 1 : 0)} color="#ff8fb8" size={44} />
			<Pill text="how penguins sleep" x={540} y={430} p={pop(t, W(1, 13) - 0.2, 0.3) * (phase === 2 ? 1 : 0)} color="#bfe9f5" size={40} />
		</AbsoluteFill>
	);
};

const Shot3: React.FC<ShotCtx> = ({t, s}) => (
	<AbsoluteFill>
		<Bg color="#9aa0b5" pattern="dots" />
		<Desk color="#8a6a50" />
		<TaskMonster x={540} y={1150} size={380} t={t} scary={0} />
		<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
			<path d="M300 760 L420 700 M300 760 L380 640 M300 760 L330 620" stroke="#fff" strokeWidth={4} opacity={rise(t, s + 0.4, 0.5)} />
		</svg>
		<Speech x={720} y={680} text="…still here." p={pop(t, W(2, 3), 0.3)} size={50} tail="left" />
	</AbsoluteFill>
);

const Shot4: React.FC<ShotCtx> = ({t, s}) => (
	<AbsoluteFill>
		<Bg color="#2a2470" pattern="grid" />
		<Bean x={540} y={1300} size={560} shirt="#4f7cff" mouth="flat" eyes={0.4} />
		<Pill text="LAZY?" x={540} y={420} p={pop(t, s + 0.1, 0.3)} color="#fff" size={100} />
		<div style={{position: 'absolute', left: 390, top: 330, transform: `scale(${pop(t, W(3, 5), 0.3)})`}}>
			<Icon kind="cross" size={300} />
		</div>
	</AbsoluteFill>
);

const Shot5: React.FC<ShotCtx> = ({t, s}) => (
	<AbsoluteFill>
		<Bg color="#7c6cff" pattern="dots" />
		<Brain x={540} y={1120} size={460} mouth="flat" look={[0, 0.4]} brows={-0.4} />
		<Stamp text="A MOOD PROBLEM" t={t} at={W(4, 3) - 0.05} y={360} />
	</AbsoluteFill>
);

const Shot6: React.FC<ShotCtx> = ({t, s}) => {
	const scary = rise(t, W(5, 6), W(5, 19) - W(5, 6), ease.in);
	const alarm = t > W(5, 19) - 0.1;
	const labels: [string, number, number, number][] = [
		['BORED', W(5, 6), 250, 520],
		['ANXIOUS', W(5, 7), 830, 480],
		['NOT GOOD ENOUGH', W(5, 9), 540, 380],
	];
	return (
		<AbsoluteFill>
			<Bg color={alarm ? '#ff6b6b' : '#ffcf8a'} pattern="stripes" />
			{alarm ? <AbsoluteFill style={{background: `rgba(255,0,40,${0.15 + 0.15 * Math.abs(Math.sin(t * 10))})`}} /> : null}
			<TaskMonster x={540} y={1250} size={tween(scary, [0, 1], [380, 560])} t={t} scary={scary} />
			{labels.map(([txt, at, x, y]) => (
				<Pill key={txt} text={txt} x={x} y={y + Math.sin(t * 3 + x) * 10} p={pop(t, at, 0.3)} color="#fff" size={44} rot={x > 540 ? 6 : x < 540 ? -6 : 0} />
			))}
			<Punch text="THREAT!" y={240} size={110} family="punch" stroke={14} color="#ffe14d" p={pop(t, W(5, 19) - 0.1, 0.25)} rot={-4} />
		</AbsoluteFill>
	);
};

const Shot7: React.FC<ShotCtx> = ({t, s}) => {
	const items: [string, number, React.ReactNode][] = [
		['phone', W(6, 11), <Phone key="p" x={0} y={0} w={110} rot={-12} screen="#ffd36e" />],
		['snack', W(6, 13), <Icon key="s" kind="snack" size={170} />],
		['else', W(6, 14), <Icon key="e" kind="broom" size={170} />],
	];
	return (
		<AbsoluteFill>
			<Bg color="#2fc0a3" pattern="grid" />
			<Bean x={360} y={1360} size={620} shirt="#4f7cff" mouth="grin" arms="up" eyes={1.1} />
			<Brain x={800} y={820} size={280} mouth="grin" look={[-0.8, 0.2]} />
			{items.map(([k, at, node], i) => {
				const p = pop(t, at, 0.35);
				return p > 0 ? (
					<div key={k} style={{position: 'absolute', left: tween(p, [0, 1], [780, 220 + i * 140]), top: tween(p, [0, 1], [820, 640 - i * 30]), transform: `scale(${p}) rotate(${i * 12 - 10}deg)`}}>
						{node}
					</div>
				) : null;
			})}
			<Punch text="FEEL BETTER NOW" y={250} size={84} family="punch" stroke={13} color="#ffe14d" p={pop(t, W(6, 6), 0.3)} rot={-2} />
		</AbsoluteFill>
	);
};

const Shot8: React.FC<ShotCtx> = ({t, s}) => {
	const relief = pop(t, W(7, 9), 0.35);
	const stress = pop(t, W(7, 16), 0.35);
	return (
		<AbsoluteFill>
			<Bg color="#9b8cff" pattern="dots" />
			<Punch text="SHORT-TERM MOOD REPAIR" y={240} size={66} family="punch" stroke={11} color="#ffe14d" p={pop(t, W(7, 3), 0.3)} />
			<Cite text="Sirois & Pychyl, 2013" p={rise(t, W(7, 5), 0.3)} y={420} />
			{/* the receipt */}
			<div style={{position: 'absolute', left: 190, top: 500, width: 700, transform: `scale(${pop(t, W(7, 7), 0.35)})`, background: '#fff', border: `7px solid ${OUT}`, borderRadius: 14, padding: '26px 34px', fontFamily: fonts.punch, fontWeight: 900, color: OUT}}>
				<div style={{fontSize: 34, textAlign: 'center', marginBottom: 18}}>RECEIPT</div>
				<div style={{display: 'flex', justifyContent: 'space-between', fontSize: 44, opacity: relief}}>
					<span>RELIEF (today)</span>
					<span style={{color: '#2fc0a3'}}>+1</span>
				</div>
				<div style={{display: 'flex', justifyContent: 'space-between', fontSize: 44, marginTop: 14, opacity: stress}}>
					<span>STRESS (tomorrow)</span>
					<span style={{color: '#ff3b5c'}}>−10</span>
				</div>
				<div style={{borderTop: `5px dashed ${OUT}`, marginTop: 20, paddingTop: 14, fontSize: 40, textAlign: 'right', opacity: stress}}>TOTAL: NOT GREAT</div>
			</div>
		</AbsoluteFill>
	);
};

const Shot9: React.FC<ShotCtx> = ({t, s}) => {
	const dodges = [W(8, 4), W(8, 8), W(8, 11)];
	const grow = dodges.filter((d) => t > d).length;
	const size = 300 + grow * 110 + (t > dodges[0] ? Math.sin((t - dodges[0]) * 12) * 6 : 0);
	return (
		<AbsoluteFill>
			<Bg color="#2a2470" pattern="dots" floor="#1d1b52" />
			<TaskMonster x={640} y={1360} size={size} t={t} scary={0.2 + grow * 0.27} />
			<Bean x={230} y={1360} size={440} shirt="#4f7cff" mouth="grimace" sweat={grow / 3} eyes={1.15} brows={-0.8} />
			<Pill text={`DODGED ×${grow}`} x={540} y={320} p={pop(t, dodges[0], 0.3)} color="#ff8fb8" size={56} />
		</AbsoluteFill>
	);
};

const Shot10: React.FC<ShotCtx> = ({t, s}) => (
	<AbsoluteFill>
		<Bg color="#ffcf8a" pattern="stripes" />
		<Bean x={540} y={1360} size={640} shirt="#4f7cff" mouth="smirk" brows={0.8} arms="up" />
		<Punch text="HOW TO BREAK IT" y={260} size={96} family="punch" stroke={13} color="#ffe14d" p={pop(t, s + 0.05, 0.3)} rot={-3} />
	</AbsoluteFill>
);

const Shot11: React.FC<ShotCtx> = ({t, s}) => {
	const shrink = rise(t, W(10, 3), 1.0, ease.inOut);
	return (
		<AbsoluteFill>
			<Bg color="#7c6cff" pattern="grid" />
			<TipCard n={1} title="Shrink it until it feels silly" p={pop(t, s, 0.35)} y={250} />
			<TaskMonster x={540} y={1160} size={tween(shrink, [0, 1], [460, 170])} t={t} scary={0.6 * (1 - shrink)} />
			<Pill text={'"write the essay"'} x={540} y={620} p={pop(t, W(10, 8), 0.3) * (1 - rise(t, W(10, 12), 0.2))} color="#fff" size={48} />
			<Pill text={'"open the document" ✓'} x={540} y={620} p={pop(t, W(10, 12), 0.3)} color="#2fc0a3" size={48} />
		</AbsoluteFill>
	);
};

const Shot12: React.FC<ShotCtx> = ({t, s}) => {
	const prog = rise(t, W(11, 5), 4.0, (x) => x);
	return (
		<AbsoluteFill>
			<Bg color="#2fc0a3" pattern="dots" />
			<TipCard n={2} title="5-minute timer" p={pop(t, s, 0.35)} y={250} color="#ff8fb8" />
			<Timer x={540} y={640} size={260} progress={prog} label={`${Math.max(0, 5 - Math.floor(prog * 5))}:00`} />
			<Bean x={540} y={1400} size={520} shirt="#4f7cff" mouth="smile" arms="hold" squash={Math.sin(t * 14) * 0.03} />
			<Desk y={1150} />
		</AbsoluteFill>
	);
};

const Shot13: React.FC<ShotCtx> = ({t, s}) => (
	<AbsoluteFill>
		<Bg color="#ff8fb8" pattern="dots" />
		<TipCard n={3} title="Forgive yourself" p={pop(t, s, 0.35)} y={250} color="#ffe14d" />
		<Bean x={360} y={1300} size={520} shirt="#4f7cff" mouth="smile" arms="point" />
		<Bean x={720} y={1300} size={460} shirt="#9aa0b5" mouth="wavy" blush={0.6} look={[-0.6, 0]} />
		<Pill text="past you" x={720} y={760} p={pop(t, W(12, 3), 0.3)} color="#fff" size={36} />
		<Speech x={420} y={700} text="it's okay." p={pop(t, W(12, 4), 0.3)} size={48} tail="left" />
		<Cite text="Wohl, Pychyl & Bennett, 2010" p={rise(t, W(12, 8), 0.3)} y={470} color="#1f1b2e" />
	</AbsoluteFill>
);

const Shot14: React.FC<ShotCtx> = ({t, s}) => {
	const press = pop(t, W(13, 0), 0.3);
	return (
		<AbsoluteFill>
			<Bg color="#ffe14d" pattern="stripes" />
			<div style={{position: 'absolute', left: 290, top: 620, width: 500, height: 500, borderRadius: 250, background: '#ff3b5c', border: `10px solid ${OUT}`, boxShadow: `0 ${24 * (1 - press * 0.7)}px 0 ${OUT}`, transform: `translateY(${press * 16}px)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.punch, fontWeight: 900, fontSize: 110, color: '#fff', WebkitTextStroke: `8px ${OUT}`, paintOrder: 'stroke fill'}}>
				START
			</div>
			<Punch text="the hardest part" y={300} size={76} family="round" stroke={12} p={pop(t, W(13, 3), 0.3)} />
		</AbsoluteFill>
	);
};

const Shot15: React.FC<ShotCtx> = ({t, s}) => (
	<AbsoluteFill style={{transform: `scale(${tween(t, [s, s + 1.6], [1, 1.2], ease.inOut)})`, transformOrigin: '540px 800px'}}>
		<Living />
		<Bean x={540} y={1360} size={700} shirt="#4f7cff" arms="point" mouth="smirk" brows={0.7} eyes={0.8} />
		<Speech x={600} y={470} text="what are YOU avoiding?" p={pop(t, W(14, 1), 0.3)} size={50} tail="left" />
	</AbsoluteFill>
);

export const episode007: EpisodeDef = {
	id: 'psychology-video-007',
	timeline: T,
	audioDir: 'audio/v007',
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
		{at: N.start(14), C: Shot15},
	],
	sfx: [
		['pop', W(0, 3), 0.3],
		['fastfwd', N.start(1), 0.4],
		['whoosh', W(1, 7) - 0.05, 0.3],
		['whoosh', W(1, 11) - 0.05, 0.3],
		['cricket', N.start(2) + 0.2, 0.3],
		['pop', W(2, 3), 0.25],
		['boing', N.start(3) + 0.1, 0.3],
		['scratch', W(3, 5), 0.35],
		['stamp', W(4, 3) - 0.05, 0.5],
		['pop', W(5, 6), 0.25],
		['pop', W(5, 7), 0.25],
		['pop', W(5, 9), 0.25],
		['siren', W(5, 19) - 0.1, 0.4],
		['pop', W(6, 11), 0.3],
		['pop', W(6, 13), 0.3],
		['pop', W(6, 14), 0.3],
		['ding', W(7, 9), 0.25],
		['sad', W(7, 16), 0.35],
		['boing', W(8, 4), 0.3],
		['boing', W(8, 8), 0.3],
		['gulp', W(8, 11), 0.4],
		['whoosh', N.start(9) - 0.05, 0.3],
		['pop', N.start(10), 0.3],
		['pop', N.start(11), 0.3],
		['pop', N.start(12), 0.3],
		['stamp', W(13, 0), 0.4],
		['ding', W(14, 1), 0.3],
	],
};
