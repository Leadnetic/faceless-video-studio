import React from 'react';
import {AbsoluteFill} from 'remotion';
import timelineJson from '../data/timeline-006.json';
import {Bean, Brain, OUT, pop, Punch, Speech} from '../components/Toon';
import {Bg, Cite, Icon, Notif, Phone, Pigeon, Pill, SlotMachine, Stamp, TipCard, type IconKind} from '../components/ToonProps';
import {ease, rise, tween} from '../lib/anim';
import {narration, type Timeline} from '../lib/timeline';
import {Living, walk} from '../scenes/v005/Scenes';
import {fonts} from '../theme';
import type {EpisodeDef, ShotCtx} from '../ToonEpisode';

const T = timelineJson as Timeline;
const N = narration(T);
const W = (l: number, w: number) => N.word(l, w);

/** Phone held by a Bean: up = at the face, down = at the hands. */
const HeldPhone: React.FC<{x: number; y: number; size: number; up: number; children?: React.ReactNode; screen?: string}> = ({x, y, size, up, children, screen}) => {
	const s = size / 300;
	const py = tween(up, [0, 1], [y - 300 * s + 230 * s, y - 300 * s + 120 * s]);
	return (
		<Phone x={x + tween(up, [0, 1], [40, 95]) * s} y={py} w={70 * s * (1 + up * 0.25)} rot={tween(up, [0, 1], [-20, -6])} screen={screen}>
			{children}
		</Phone>
	);
};

const Shot1: React.FC<ShotCtx> = ({t}) => {
	// pick up, check, put down
	const up = rise(t, 0.35, 0.3) * (1 - rise(t, W(0, 7) - 0.1, 0.3));
	return (
		<AbsoluteFill>
			<Living />
			<Bean x={540} y={1360} size={700} shirt="#4f7cff" arms="hold" mouth={up > 0.5 ? 'flat' : 'smile'} look={up > 0.5 ? [0.6, 0.4] : [0, 0]} />
			<HeldPhone x={540} y={1360} size={700} up={up} />
			<Punch text="me every 10 seconds:" y={250} size={70} family="round" stroke={11} />
		</AbsoluteFill>
	);
};

const Shot2: React.FC<ShotCtx> = ({t, s}) => {
	const up = rise(t, W(1, 4) - 0.15, 0.3);
	return (
		<AbsoluteFill>
			<Living />
			<Bean x={540} y={1360} size={700} shirt="#4f7cff" arms="hold" mouth="flat" eyes={1.1} look={[0.6, 0.4]} />
			<HeldPhone x={540} y={1360} size={700} up={up}>
				<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.round, fontWeight: 700, fontSize: 18, color: '#8b84a8', textAlign: 'center'}}>no new notifications</div>
			</HeldPhone>
			<Pill text="+10 SECONDS" x={540} y={330} p={pop(t, s + 0.05, 0.3)} color="#ffe14d" rot={-4} size={56} />
		</AbsoluteFill>
	);
};

const Shot3: React.FC<ShotCtx> = ({t, s}) => {
	const z = tween(t, [s, s + 2.2], [1.0, 1.35], ease.inOut);
	const qs = [0, 1, 2].map((i) => pop(t, W(2, 3) + i * 0.18, 0.3));
	return (
		<AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '540px 820px'}}>
			<Living />
			<Bean x={540} y={1360} size={700} shirt="#4f7cff" arms="hold" mouth="wavy" eyes={1.15} brows={-0.6} />
			<HeldPhone x={540} y={1360} size={700} up={0.2} />
			{qs.map((q, i) => (
				<div key={i} style={{position: 'absolute', left: [380, 540, 700][i], top: [560, 470, 560][i], fontFamily: fonts.punch, fontWeight: 900, fontSize: 110, color: '#ffe14d', WebkitTextStroke: `10px ${OUT}`, paintOrder: 'stroke fill', transform: `translate(-50%,-50%) scale(${q}) rotate(${[-14, 0, 14][i]}deg)`}}>?</div>
			))}
		</AbsoluteFill>
	);
};

const Shot4: React.FC<ShotCtx> = ({t, s}) => (
	<AbsoluteFill>
		<Bg color="#2a2470" pattern="dots" />
		<div style={{position: 'absolute', left: 240, top: -100, width: 600, height: 1400, background: 'linear-gradient(180deg, rgba(255,246,190,0.1), rgba(255,246,190,0.4))', clipPath: 'polygon(40% 0, 60% 0, 100% 100%, 0 100%)'}} />
		<div style={{transform: `scale(${pop(t, s + 0.05, 0.4)})`, position: 'absolute', inset: 0, transformOrigin: '540px 1000px'}}>
			<Pigeon x={540} y={1180} size={560} />
		</div>
		<Stamp text="BLAME A PIGEON" t={t} at={W(3, 2) - 0.1} y={360} />
	</AbsoluteFill>
);

/** Skinner box: a pigeon, a button and a food tray. */
const SkinnerBox: React.FC<{x: number; y: number; w: number; t: number; rate: number; feed: (k: number) => boolean; crazy?: boolean; label: string; off?: boolean}> = ({x, y, w, t, rate, feed, crazy, label, off}) => {
	const phase = t * rate;
	const peck = Math.max(0, Math.sin(phase * Math.PI * 2));
	const k = Math.floor(phase);
	const pellet = feed(k) && !off ? Math.max(0, 1 - (phase - k) * 2) : 0;
	return (
		<div style={{position: 'absolute', left: x, top: y, width: w, height: 470, borderRadius: 30, background: '#fff6df', border: `7px solid ${OUT}`, overflow: 'hidden'}}>
			<div style={{position: 'absolute', left: 24, top: 18, fontFamily: fonts.punch, fontWeight: 900, fontSize: 38, color: OUT}}>{label}</div>
			<div style={{position: 'absolute', right: 60, top: 150, width: 70, height: 70, borderRadius: 35, background: off ? '#9aa0b5' : '#ff3b5c', border: `6px solid ${OUT}`, transform: `scale(${1 - peck * 0.15})`}} />
			<div style={{position: 'absolute', right: 40, top: 300, width: 110, height: 40, borderRadius: 10, background: '#c98a3d', border: `6px solid ${OUT}`}} />
			{pellet > 0 ? <div style={{position: 'absolute', right: 70, top: 250 + (1 - pellet) * 40, opacity: pellet}}><Icon kind="pellet" size={44} /></div> : null}
			{off ? <div style={{position: 'absolute', right: 20, top: 360, fontFamily: fonts.punch, fontWeight: 900, fontSize: 30, color: '#ff3b5c'}}>FOOD: OFF</div> : null}
			<Pigeon x={w - 320} y={450} size={330} peck={peck} eyes={crazy ? 'crazy' : 'calm'} />
		</div>
	);
};

const Shot5: React.FC<ShotCtx> = ({t, s}) => (
	<AbsoluteFill>
		<Bg color="#e8c98f" pattern="stripes" />
		<Punch text="1950s" y={250} size={96} family="punch" stroke={13} color="#ffe14d" p={pop(t, s, 0.3)} rot={-3} />
		<Cite text="B. F. Skinner · Ferster & Skinner, 1957" p={rise(t, W(4, 3), 0.4)} y={380} color="#1f1b2e" />
		<div style={{transform: `scale(${pop(t, W(4, 3), 0.4)})`, position: 'absolute', inset: 0, transformOrigin: '540px 780px'}}>
			<SkinnerBox x={110} y={560} w={860} t={t} rate={1.2} feed={() => true} label="PECK → FOOD" />
		</div>
	</AbsoluteFill>
);

const Shot6: React.FC<ShotCtx> = ({t, s}) => (
	<AbsoluteFill>
		<Bg color="#2fc0a3" pattern="grid" />
		<Punch text="FOOD EVERY TIME" y={250} size={78} family="punch" stroke={12} p={pop(t, s, 0.3)} />
		<SkinnerBox x={110} y={420} w={860} t={t} rate={0.9} feed={() => true} label="REWARD: ALWAYS" />
		<Pill text="😌 CALM" x={540} y={1000} p={pop(t, W(5, 8) - 0.1, 0.3)} color="#fff" size={52} />
	</AbsoluteFill>
);

const Shot7: React.FC<ShotCtx> = ({t, s}) => {
	const off = t > W(6, 12);
	const pecks = Math.floor(Math.max(0, t - s) * 4.2) * 3 + (off ? Math.floor((t - W(6, 12)) * 40) : 0);
	return (
		<AbsoluteFill>
			<Bg color="#ff7a59" pattern="grid" />
			<Punch text="FOOD AT RANDOM" y={250} size={78} family="punch" stroke={12} p={pop(t, s, 0.3)} />
			<SkinnerBox x={110} y={420} w={860} t={t} rate={4.2} feed={(k) => (k * 2654435761) % 7 === 0} crazy label="REWARD: SOMETIMES" off={off} />
			<Pill text={`PECKS: ${pecks}`} x={540} y={1000} p={pop(t, W(6, 9), 0.3)} color="#ffe14d" size={56} rot={-3} />
		</AbsoluteFill>
	);
};

const Shot8: React.FC<ShotCtx> = ({t, s}) => (
	<AbsoluteFill>
		<Bg color="#7c6cff" pattern="dots" />
		<Brain x={540} y={1060} size={460} mouth="grin" look={[0, 0]} squash={Math.sin(t * 9) * 0.06} />
		<Punch text="UNPREDICTABLE REWARDS" y={250} size={70} family="punch" stroke={12} color="#ffe14d" p={pop(t, s + 0.05, 0.3)} />
		<Stamp text="HARDEST TO QUIT" t={t} at={W(7, 4)} y={500} size={64} />
	</AbsoluteFill>
);

const Shot9: React.FC<ShotCtx> = ({t, s}) => {
	const z = tween(t, [s, s + 1], [0.6, 1], ease.out);
	return (
		<AbsoluteFill>
			<Bg color="#2a2470" pattern="dots" />
			<div style={{position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: '540px 760px'}}>
				<Phone x={540} y={760} w={420} rot={-4} />
			</div>
			<Punch text="your phone:" y={250} size={78} family="round" stroke={12} p={pop(t, s, 0.3)} />
		</AbsoluteFill>
	);
};

const Shot10: React.FC<ShotCtx> = ({t, s}) => {
	const msg = pop(t, W(9, 0), 0.3) * (1 - rise(t, W(9, 4) - 0.05, 0.15));
	const like = pop(t, W(9, 4), 0.3) * (1 - rise(t, W(9, 7) - 0.05, 0.15));
	const none = rise(t, W(9, 9), 0.3);
	return (
		<AbsoluteFill>
			<Bg color="#2a2470" pattern="dots" />
			<Phone x={540} y={760} w={420} rot={-4}>
				<Notif p={msg} top={140} icon="chat" title="Message" sub="hey :)" />
				<Notif p={like} top={140} icon="heart" title="New like" sub="on your post" />
				{none > 0 ? <div style={{position: 'absolute', left: 0, right: 0, top: 320, textAlign: 'center', opacity: none, fontFamily: fonts.round, fontWeight: 700, fontSize: 30, color: '#8b84a8'}}>nothing.</div> : null}
			</Phone>
			<Pill text="SOMETIMES" x={540} y={330} p={pop(t, s, 0.3) * (1 - rise(t, W(9, 7), 0.1))} size={56} />
			<Pill text="MOST OF THE TIME…" x={540} y={330} p={pop(t, W(9, 7), 0.3)} color="#cfd2e6" size={50} />
		</AbsoluteFill>
	);
};

const Shot11: React.FC<ShotCtx> = ({t, s}) => {
	const pull = Math.max(0, Math.sin((t - s) * 5));
	return (
		<AbsoluteFill>
			<Bg color="#9b8cff" pattern="grid" />
			<SlotMachine x={470} y={830} w={520} t={t} spins={[0, 1, 2, 3, 4, 5].map((i) => ({at: s + i * 0.63, result: [i === 1 ? 'chat' : 'empty', i === 4 ? 'heart' : 'empty', 'empty'] as IconKind[]}))} lever={pull} />
			<Brain x={830} y={720} size={260} mouth="grin" look={[-0.6, 0]} squash={pull * 0.15} />
			<Punch text="PULL. PULL. PULL." y={250} size={78} family="punch" stroke={12} color="#ffe14d" p={pop(t, W(10, 10), 0.3)} rot={-2} />
		</AbsoluteFill>
	);
};

const Shot12: React.FC<ShotCtx> = ({t, s}) => {
	const morph = rise(t, s + 0.1, 0.5, ease.inOut);
	return (
		<AbsoluteFill>
			<Bg color="#ffcf8a" pattern="stripes" />
			<div style={{position: 'absolute', inset: 0, opacity: 1 - morph, transform: `scale(${1 - morph * 0.5})`, transformOrigin: '540px 800px'}}>
				<Phone x={540} y={800} w={380} />
			</div>
			<div style={{position: 'absolute', inset: 0, opacity: morph, transform: `scale(${0.6 + morph * 0.4})`, transformOrigin: '540px 800px'}}>
				<SlotMachine x={510} y={820} w={540} t={t} spins={[{at: s + 0.4, result: ['heart', 'chat', 'empty']}]} lever={0} />
			</div>
			<Punch text="A SLOT MACHINE" y={250} size={88} family="punch" stroke={13} color="#ffe14d" p={pop(t, W(11, 4), 0.3)} rot={-3} />
			<Punch text="in your pocket" y={370} size={64} family="round" stroke={11} p={pop(t, W(11, 6), 0.3)} />
		</AbsoluteFill>
	);
};

const Shot13: React.FC<ShotCtx> = ({t, s}) => (
	<AbsoluteFill>
		<Bg color="#2fc0a3" pattern="dots" />
		<SlotMachine x={470} y={830} w={520} t={t} spins={[{at: s - 5, result: ['empty', 'empty', 'empty']}]} />
		<div style={{position: 'absolute', left: 690, top: 520, transform: `scale(${pop(t, W(12, 7), 0.35)})`}}>
			<Icon kind="lock" size={150} />
		</div>
		<Punch text="MAKE IT HARDER" y={250} size={86} family="punch" stroke={13} color="#ffe14d" p={pop(t, W(12, 5), 0.3)} />
	</AbsoluteFill>
);

const Shot14: React.FC<ShotCtx> = ({t, s}) => {
	const gray = rise(t, W(13, 13), 0.6);
	return (
		<AbsoluteFill>
			<Bg color="#7c6cff" pattern="grid" />
			<Punch text="3 FIXES" y={240} size={90} family="punch" stroke={13} color="#ffe14d" p={pop(t, s, 0.3)} />
			<TipCard n={1} title="Notifications off" p={pop(t, W(13, 0), 0.35)} y={380}>
				<Icon kind="bellOff" size={90} />
			</TipCard>
			<TipCard n={2} title="Charge it in another room" p={pop(t, W(13, 6), 0.35)} y={600} color="#2fc0a3" />
			<TipCard n={3} title="Grayscale mode" p={pop(t, W(13, 12), 0.35)} y={820} color="#ff8fb8">
				<Phone x={60} y={50} w={60} gray={gray} screen="#ff7a59" />
			</TipCard>
		</AbsoluteFill>
	);
};

const Shot15: React.FC<ShotCtx> = ({t, s}) => {
	const go = rise(t, s + 0.3, 1.2, ease.inOut);
	const w = walk(t, go > 0 && go < 1);
	return (
		<AbsoluteFill>
			<Bg color="#cfd2e6" pattern="dots" floor="#9aa0b5" />
			<SlotMachine x={330} y={900} w={420} t={t} spins={[{at: s - 5, result: ['empty', 'empty', 'empty']}]} gray={1} />
			<Bean x={tween(go, [0, 1], [700, 820])} y={1360 - w.bob} size={520} shirt="#4f7cff" mouth="grin" rot={w.rock} />
			<Punch text="BORING SLOT MACHINES LOSE." y={250} size={66} family="punch" stroke={11} color="#ffe14d" p={pop(t, W(14, 2), 0.3)} rot={-2} />
		</AbsoluteFill>
	);
};

const Shot16: React.FC<ShotCtx> = ({t, s}) => {
	const z = tween(t, [s, s + 1.6], [1, 1.25], ease.inOut);
	return (
		<AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '540px 760px'}}>
			<Living />
			<Bean x={540} y={1360} size={700} shirt="#4f7cff" arms="point" mouth="smirk" brows={0.7} eyes={0.75} look={[0, 0]} />
			<Speech x={600} y={470} text="be honest…" p={pop(t, W(15, 1), 0.3)} size={56} tail="left" />
		</AbsoluteFill>
	);
};

export const episode006: EpisodeDef = {
	id: 'psychology-video-006',
	timeline: T,
	audioDir: 'audio/v006',
	shots: [
		{at: 0, C: Shot1, cut: 'none'},
		{at: N.start(1), C: Shot2},
		{at: N.start(2), C: Shot3},
		{at: N.start(3) - 0.05, C: Shot4},
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
		{at: N.start(15), C: Shot16},
	],
	sfx: [
		['whoosh', 0.3, 0.25],
		['buzz', N.start(1) - 0.3, 0.4],
		['pop', N.start(1) + 0.05, 0.3],
		...[0, 1, 2].map((i) => ['pop', W(2, 3) + i * 0.18, 0.22] as [string, number, number]),
		['scratch', N.start(3) - 0.05, 0.4],
		['coo', N.start(3) + 0.1, 0.5],
		['stamp', W(3, 2) - 0.1, 0.5],
		['whoosh', N.start(4) - 0.05, 0.3],
		['ding', W(4, 13), 0.3],
		['whoosh', N.start(5) - 0.05, 0.3],
		['whoosh', N.start(6) - 0.05, 0.3],
		['peck', N.start(6) + 0.2, 0.35],
		['scratch', W(6, 12), 0.25],
		['whoosh', N.start(7) - 0.05, 0.3],
		['stamp', W(7, 4), 0.5],
		['whoosh', N.start(8) - 0.05, 0.3],
		['buzz', W(9, 0), 0.4],
		['buzz', W(9, 4), 0.35],
		['gulp', W(9, 11), 0.35],
		['lever', N.start(10) + 0.1, 0.4],
		['lever', N.start(10) + 1.36, 0.35],
		['lever', N.start(10) + 2.6, 0.35],
		['coin', W(11, 4), 0.45],
		['whoosh', N.start(12) - 0.05, 0.3],
		['stamp', W(12, 7), 0.4],
		['pop', W(13, 0), 0.3],
		['pop', W(13, 6), 0.3],
		['pop', W(13, 12), 0.3],
		['sad', W(14, 0), 0.4],
		['ding', W(15, 1), 0.3],
	],
};
