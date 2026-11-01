import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useTime} from '../../components/Primitives';
import {Bean, Brain, OUT, pop, Punch, Speech} from '../../components/Toon';
import {ease, rise, tween} from '../../lib/anim';
import {fonts} from '../../theme';
import type {Video005} from '../../videos/video005';

export const FLOOR = 1340;

/** Walk cycle: bob + rock, used when a Bean travels. */
export const walk = (t: number, moving: boolean) => (moving ? {bob: Math.abs(Math.sin(t * 11)) * 16, rock: Math.sin(t * 11) * 5} : {bob: 0, rock: 0});

export const Kitchen: React.FC<{fridgeOpen?: number; glow?: number}> = ({fridgeOpen = 0, glow = 0}) => (
	<>
		<AbsoluteFill style={{background: '#bfe9d9'}} />
		<div style={{position: 'absolute', left: 0, right: 0, top: 560, height: 260, backgroundImage: 'linear-gradient(#ffffff 3px, transparent 3px), linear-gradient(90deg, #ffffff 3px, transparent 3px)', backgroundSize: '70px 70px', backgroundColor: '#a6dcc8', borderTop: `6px solid ${OUT}`, borderBottom: `6px solid ${OUT}`}} />
		<div style={{position: 'absolute', left: 0, right: 0, top: FLOOR, bottom: 0, background: '#f2d7a8', borderTop: `6px solid ${OUT}`}} />
		{/* counter (right) */}
		<div style={{position: 'absolute', left: 640, top: 820, width: 500, height: 70, background: '#fff', border: `6px solid ${OUT}`, borderRadius: 10}} />
		<div style={{position: 'absolute', left: 660, top: 884, width: 460, height: FLOOR - 884, background: '#5aa9e6', border: `6px solid ${OUT}`}} />
		{/* fridge (left) */}
		<div style={{position: 'absolute', left: 60, top: 420, width: 330, height: FLOOR - 420, borderRadius: 26, background: '#f5f7ff', border: `6px solid ${OUT}`, overflow: 'hidden'}}>
			<div style={{position: 'absolute', inset: 0, background: '#fff8d6', opacity: glow}} />
			{glow > 0 ? [0, 1, 2].map((s) => <div key={s} style={{position: 'absolute', left: 20, right: 20, top: 140 + s * 220, height: 10, background: OUT, opacity: 0.6}} />) : null}
		</div>
		<div style={{position: 'absolute', left: 60, top: 420, width: 330, height: FLOOR - 420, borderRadius: 26, background: '#e6ebfa', border: `6px solid ${OUT}`, transformOrigin: '0% 50%', transform: `perspective(1400px) rotateY(${-fridgeOpen * 100}deg)`}}>
			<div style={{position: 'absolute', right: 30, top: 160, width: 16, height: 160, borderRadius: 8, background: OUT}} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 360, height: 6, background: OUT}} />
		</div>
		{glow > 0 ? <div style={{position: 'absolute', left: 330, top: 360, width: 560, height: 900, background: 'radial-gradient(closest-side, rgba(255,246,200,0.55), transparent)', opacity: glow}} /> : null}
	</>
);

export const Living: React.FC<{dark?: number}> = ({dark = 0}) => (
	<>
		<AbsoluteFill style={{background: '#ffcf8a'}} />
		<div style={{position: 'absolute', left: 0, right: 0, top: FLOOR, bottom: 0, background: '#c98b52', borderTop: `6px solid ${OUT}`}} />
		<div style={{position: 'absolute', left: 120, top: 1000, width: 520, height: 260, borderRadius: 50, background: '#ff6b8b', border: `6px solid ${OUT}`}} />
		<div style={{position: 'absolute', left: 100, top: 1150, width: 560, height: 200, borderRadius: 40, background: '#e85a7a', border: `6px solid ${OUT}`}} />
		<div style={{position: 'absolute', left: 260, top: 560, width: 220, height: 170, background: '#7c6cff', border: `6px solid ${OUT}`, borderRadius: 10}} />
		<AbsoluteFill style={{background: '#0d0b26', opacity: dark}} />
	</>
);

export const Doorway: React.FC<{x: number; color?: string; dark?: boolean}> = ({x, color = '#b9773f', dark = true}) => (
	<div style={{position: 'absolute', left: x - 150, top: 640, width: 300, height: FLOOR - 640, border: `20px solid ${color}`, borderBottom: 'none', borderRadius: '14px 14px 0 0', boxShadow: `0 0 0 6px ${OUT}, inset 0 0 0 6px ${OUT}`, background: dark ? 'rgba(20,18,40,0.25)' : 'transparent'}} />
);

/** Small "quest item" note: the reason you came in. */
export const Quest: React.FC<{x: number; y: number; p: number; sad?: boolean; rot?: number}> = ({x, y, p, sad, rot = 0}) =>
	p <= 0 ? null : (
		<div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${p}) rotate(${rot}deg)`, background: '#fff', border: `6px solid ${OUT}`, borderRadius: 28, padding: '12px 22px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: `0 8px 0 ${OUT}`}}>
			<svg width={56} height={56} viewBox="0 0 60 60">
				<circle cx={16} cy={44} r={10} fill="none" stroke={OUT} strokeWidth={5} />
				<circle cx={44} cy={44} r={10} fill="none" stroke={OUT} strokeWidth={5} />
				<path d="M22 36 L48 6 M38 36 L12 6" stroke="#e23b4e" strokeWidth={6} strokeLinecap="round" />
			</svg>
			<span style={{fontFamily: fonts.round, fontWeight: 700, fontSize: 44, color: OUT}}>scissors</span>
			{sad ? <span style={{fontFamily: fonts.round, fontWeight: 700, fontSize: 40, color: OUT}}>:(</span> : null}
		</div>
	);

/** 0–3.9s — walk in, stop, blank. */
export const S1Kitchen: React.FC<{v: Video005}> = ({v}) => {
	const t = useTime();
	const k = v.t;
	const enter = rise(t, 0, k.stop, ease.out);
	const x = tween(enter, [0, 1], [800, 560]);
	const w = walk(t, t < k.stop);
	const blank = t > k.blank;
	const qs = [0, 1, 2].map((i) => pop(t, k.why + 0.15 + i * 0.22, 0.3));
	return (
		<AbsoluteFill style={{transform: `scale(${tween(t, [k.blank, v.scenes.kitchen[1]], [1, 1.12])})`, transformOrigin: '560px 900px'}}>
			<Kitchen />
			<Bean x={x} y={FLOOR + 20 - w.bob} size={620} shirt="#4f7cff" mouth={blank ? 'flat' : 'smile'} eyes={blank ? 1.15 : 1} look={blank ? [0, 0] : [-1, 0]} rot={w.rock} arms="rest" />
			<Speech x={560} y={600} text="…" p={pop(t, k.blank + 0.2, 0.3) * (1 - rise(t, k.why, 0.1))} size={64} tail="left" />
			{qs.map((q, i) => (
				<div key={i} style={{position: 'absolute', left: [400, 560, 720][i], top: [560, 470, 560][i], fontFamily: fonts.punch, fontWeight: 900, fontSize: 120, color: '#ffe14d', WebkitTextStroke: `10px ${OUT}`, paintOrder: 'stroke fill', transform: `translate(-50%,-50%) scale(${q}) rotate(${[-14, 0, 14][i] + Math.sin(t * 6 + i) * 6}deg)`}}>?</div>
			))}
			<Punch text="me walking into the kitchen:" y={250} size={64} family="round" stroke={11} />
		</AbsoluteFill>
	);
};

/** 3.9–5.0s — Blame the door. */
export const S2Door: React.FC<{v: Video005}> = ({v}) => {
	const t = useTime();
	const k = v.t;
	const [s] = v.scenes.door;
	const z = tween(t, [s, s + 0.25], [1.6, 1.15], ease.out);
	const stamp = pop(t, k.door, 0.25);
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '540px 980px'}}>
				<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, #6b1f3a, #1b0f2b 75%)'}} />
				<div style={{position: 'absolute', left: 340, top: 500, width: 400, height: 860, borderRadius: '18px 18px 0 0', background: '#9c5a2c', border: `8px solid ${OUT}`}}>
					<div style={{position: 'absolute', left: 50, top: 60, width: 300, height: 300, borderRadius: 14, border: `6px solid ${OUT}`, background: '#b5703c'}} />
					<div style={{position: 'absolute', left: 50, top: 420, width: 300, height: 340, borderRadius: 14, border: `6px solid ${OUT}`, background: '#b5703c'}} />
					<div style={{position: 'absolute', right: 34, top: 400, width: 44, height: 44, borderRadius: 22, background: '#ffd36e', border: `6px solid ${OUT}`}} />
					{/* villain face */}
					{[110, 230].map((ex) => (
						<div key={ex} style={{position: 'absolute', left: ex, top: 170, width: 70, height: 40, borderRadius: '50% 50% 50% 50% / 30% 30% 70% 70%', background: '#fff', border: `6px solid ${OUT}`}}>
							<div style={{position: 'absolute', left: 22, top: 8, width: 20, height: 20, borderRadius: 10, background: OUT}} />
						</div>
					))}
					<div style={{position: 'absolute', left: 100, top: 140, width: 90, height: 10, background: OUT, transform: 'rotate(18deg)'}} />
					<div style={{position: 'absolute', left: 210, top: 140, width: 90, height: 10, background: OUT, transform: 'rotate(-18deg)'}} />
					<svg width={200} height={60} style={{position: 'absolute', left: 100, top: 240}}>
						<path d="M10 40 Q100 -10 190 40" stroke={OUT} strokeWidth={8} fill="none" strokeLinecap="round" />
					</svg>
				</div>
			</AbsoluteFill>
			{stamp > 0 ? (
				<div style={{position: 'absolute', left: 540, top: 330, transform: `translate(-50%,-50%) scale(${tween(stamp, [0, 1], [2.2, 1])}) rotate(-6deg)`, border: '10px solid #ff3b5c', borderRadius: 18, padding: '8px 26px', fontFamily: fonts.punch, fontWeight: 900, fontSize: 72, color: '#ff3b5c', background: 'rgba(255,255,255,0.92)', whiteSpace: 'nowrap'}}>
					THE DOORWAY EFFECT
				</div>
			) : null}
		</AbsoluteFill>
	);
};

/** 5.0–8.6s — memories are saved like chapters in a game. */
export const S3Game: React.FC<{v: Video005}> = ({v}) => {
	const t = useTime();
	const k = v.t;
	const slots = ['LIVING ROOM', 'HALLWAY', 'KITCHEN'];
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: '#2a2470'}} />
			<AbsoluteFill style={{backgroundImage: 'radial-gradient(rgba(255,255,255,0.12) 3px, transparent 3px)', backgroundSize: '40px 40px'}} />
			<Brain x={540} y={760} size={380} mouth="grin" look={[0, 0.6]} squash={Math.sin(t * 12) * 0.05} />
			{/* controller */}
			<div style={{position: 'absolute', left: 390, top: 690, width: 300, height: 130, borderRadius: 65, background: '#3b3b4f', border: `6px solid ${OUT}`}}>
				<div style={{position: 'absolute', left: 40, top: 46, width: 50, height: 16, background: '#cfd2e6', borderRadius: 4}} />
				<div style={{position: 'absolute', left: 57, top: 29, width: 16, height: 50, background: '#cfd2e6', borderRadius: 4}} />
				{[0, 1].map((b) => <div key={b} style={{position: 'absolute', left: 190 + b * 44, top: 30 + b * 30, width: 34, height: 34, borderRadius: 17, background: b ? '#ff3b5c' : '#2fc0a3', border: `4px solid ${OUT}`}} />)}
			</div>
			{slots.map((sl, i) => {
				const p = pop(t, k.scenes - 0.1 + i * 0.2, 0.3);
				return (
					<div key={sl} style={{position: 'absolute', left: 130, width: 820, top: 880 + i * 120, height: 100, transform: `scale(${p})`, borderRadius: 18, background: i === 0 ? '#ffe14d' : '#fff', border: `6px solid ${OUT}`, display: 'flex', alignItems: 'center', padding: '0 26px', gap: 20, fontFamily: fonts.punch, fontWeight: 900, fontSize: 40, color: OUT}}>
						<span style={{fontSize: 28, opacity: 0.6}}>SAVE {i + 1}</span>
						<span>CHAPTER {i + 1}: {sl}</span>
					</div>
				);
			})}
			<Punch text="CHAPTERS" y={250} size={110} family="punch" stroke={14} color="#ffe14d" p={pop(t, k.chapters, 0.3)} rot={-3} />
		</AbsoluteFill>
	);
};

/** 8.6–13.1s — through the doorway: new chapter, save and close; the quest stays behind. */
export const S4Pass: React.FC<{v: Video005}> = ({v}) => {
	const t = useTime();
	const k = v.t;
	const [s] = v.scenes.pass;
	const go = rise(t, s + 0.1, k.doorway + 0.7 - s, ease.inOut);
	const x = tween(go, [0, 1], [230, 770]); // living room → kitchen, one static wide shot
	const camX = 0;
	const moving = go > 0 && go < 1;
	const w = walk(t, moving);
	const doorX = 540;
	const questLeft = t > k.doorway - 0.05; // the note hits the frame and drops behind
	const qx = questLeft ? doorX - 120 : x;
	const qy = questLeft ? tween(rise(t, k.doorway - 0.05, 0.6, ease.in), [0, 1], [560, 1180]) : 560 - w.bob;
	const title = pop(t, k.newRoom, 0.35);
	const saving = rise(t, k.save, k.close - k.save + 0.25, ease.inOut);
	const closed = rise(t, k.close + 0.2, 0.4);
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<AbsoluteFill style={{width: 2160, transform: `translateX(${-camX}px)`}}>
				<div style={{position: 'absolute', left: 0, top: 0, width: 540, height: 1920, overflow: 'hidden'}}>
					<Living dark={closed * 0.75} />
				</div>
				<div style={{position: 'absolute', left: 540, top: 0, width: 1620, height: 1920, overflow: 'hidden'}}>
					<div style={{position: 'absolute', left: -540, top: 0, width: 1080, height: 1920}}>
						<Kitchen />
					</div>
					<div style={{position: 'absolute', left: 540, top: 0, width: 1080, height: 1920}}>
						<Kitchen />
					</div>
				</div>
				<div style={{position: 'absolute', left: doorX - 14, top: 0, width: 28, height: FLOOR, background: '#e7d3b0', borderLeft: `6px solid ${OUT}`, borderRight: `6px solid ${OUT}`}} />
				<Doorway x={doorX} dark={false} />
				<Quest x={qx} y={qy} p={pop(t, s, 0.3)} rot={questLeft ? tween(rise(t, k.doorway, 0.6), [0, 1], [0, -25]) : 0} />
				<Bean x={x} y={FLOOR + 20 - w.bob} size={620} shirt="#4f7cff" mouth={t > k.newRoom ? 'flat' : 'smile'} rot={w.rock} look={t > k.newRoom ? [0, 0] : [1, 0]} />
				{closed > 0 ? <div style={{position: 'absolute', left: 120, top: 760, transform: `rotate(-8deg) scale(${pop(t, k.close + 0.2, 0.3)})`, background: '#ff3b5c', border: `6px solid ${OUT}`, borderRadius: 14, padding: '10px 24px', fontFamily: fonts.punch, fontWeight: 900, fontSize: 52, color: '#fff'}}>CLOSED</div> : null}
			</AbsoluteFill>
			{/* game HUD */}
			{title > 0 ? (
				<div style={{position: 'absolute', left: 120, right: 120, top: 260, transform: `scale(${title})`, background: OUT, borderRadius: 20, padding: '18px 24px', textAlign: 'center', fontFamily: fonts.punch, fontWeight: 900, fontSize: 52, color: '#ffe14d', boxShadow: '0 10px 0 rgba(0,0,0,0.25)'}}>
					CHAPTER 2: KITCHEN
				</div>
			) : null}
			{saving > 0 ? (
				<div style={{position: 'absolute', left: 200, right: 200, top: 420, height: 64, borderRadius: 32, border: `6px solid ${OUT}`, background: '#fff', overflow: 'hidden'}}>
					<div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${saving * 100}%`, background: '#2fc0a3'}} />
					<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.punch, fontWeight: 900, fontSize: 34, color: OUT}}>{saving >= 1 ? '✓ SAVED' : 'SAVING…'}</div>
				</div>
			) : null}
		</AbsoluteFill>
	);
};

/** 13.1–16.1s — the reason is still sitting in the old chapter. */
export const S5Old: React.FC<{v: Video005}> = ({v}) => {
	const t = useTime();
	const k = v.t;
	const [s] = v.scenes.old;
	const z = tween(t, [s, s + 1.4], [1.0, 1.25], ease.inOut);
	return (
		<AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '540px 900px'}}>
			<Living dark={0.7} />
			<div style={{position: 'absolute', left: 240, top: 0, width: 600, height: 1400, background: 'linear-gradient(180deg, rgba(255,246,190,0.05), rgba(255,246,190,0.35))', clipPath: 'polygon(42% 0, 58% 0, 100% 100%, 0 100%)'}} />
			<Quest x={540} y={tween(t, [s, s + 3], [1040, 1010]) + Math.sin(t * 3) * 10} p={1} sad={t > k.stayed - 0.2} rot={Math.sin(t * 2) * 4} />
			<Speech x={600} y={900} text="hello??" p={pop(t, k.stayed, 0.3)} size={48} tail="left" />
			<Punch text="OLD CHAPTER" y={250} size={86} family="punch" stroke={12} color="#ffe14d" p={pop(t, s + 0.15, 0.3)} rot={2} />
		</AbsoluteFill>
	);
};

/** 16.1–22.9s — the 2011 study, as a two-lane race. */
export const S6Study: React.FC<{v: Video005}> = ({v}) => {
	const t = useTime();
	const k = v.t;
	const [s] = v.scenes.study;
	const lane = (y: number, door: boolean, label: string, at: number) => {
		const p = rise(t, at, 1.4, ease.inOut);
		const bx = tween(p, [0, 1], [180, 780]);
		const w = walk(t, p > 0 && p < 1);
		const mem = door ? tween(rise(t, at + 0.75, 0.5), [0, 1], [1, 0.35]) : 1;
		return (
			<div key={label} style={{position: 'absolute', left: 90, width: 840, top: y, height: 420, borderRadius: 30, background: door ? '#ffe3e8' : '#e3fff5', border: `6px solid ${OUT}`, overflow: 'hidden', transform: `scale(${pop(t, s + (door ? 0.1 : 0.3), 0.3)})`}}>
				<div style={{position: 'absolute', left: 24, top: 18, fontFamily: fonts.punch, fontWeight: 900, fontSize: 36, color: OUT}}>{label}</div>
				<div style={{position: 'absolute', left: 0, right: 0, top: 360, height: 6, background: OUT}} />
				{door ? <div style={{position: 'absolute', left: 430, top: 120, width: 120, height: 240, border: `14px solid #b9773f`, borderBottom: 'none', boxShadow: `0 0 0 5px ${OUT}`}} /> : null}
				<Bean x={bx} y={366 - w.bob * 0.5} size={250} shirt={door ? '#ff7a59' : '#2fc0a3'} rot={w.rock} mouth={door && mem < 0.6 ? 'flat' : 'smile'} />
				{/* memory meter */}
				<div style={{position: 'absolute', right: 26, top: 22, width: 220, height: 40, borderRadius: 20, border: `5px solid ${OUT}`, background: '#fff', overflow: 'hidden'}}>
					<div style={{width: `${mem * 100}%`, height: '100%', background: mem < 0.6 ? '#ff3b5c' : '#2fc0a3'}} />
				</div>
				<div style={{position: 'absolute', right: 26, top: 70, width: 220, textAlign: 'center', fontFamily: fonts.round, fontWeight: 700, fontSize: 26, color: OUT}}>memory</div>
			</div>
		);
	};
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: '#7c6cff'}} />
			<Punch text="THE STUDY" y={240} size={86} family="punch" stroke={12} color="#ffe14d" p={pop(t, s, 0.3)} />
			<div style={{position: 'absolute', top: 350, left: 0, right: 0, textAlign: 'center', fontFamily: fonts.round, fontWeight: 700, fontSize: 32, color: '#fff', opacity: pop(t, k.study, 0.3)}}>Radvansky, Krawietz & Tamplin, 2011</div>
			{lane(420, true, 'THROUGH A DOOR', k.doorLane - 0.2)}
			{lane(880 - 20, false, 'SAME WALK, ONE ROOM', k.sameWalk - 0.3)}
		</AbsoluteFill>
	);
};

/** 22.9–25.1s — go back; the thought comes back. */
export const S7Fix: React.FC<{v: Video005}> = ({v}) => {
	const t = useTime();
	const k = v.t;
	const [s] = v.scenes.fix;
	const go = rise(t, s + 0.1, k.back + 0.9 - s, ease.inOut);
	const x = tween(go, [0, 1], [860, 330]);
	const w = walk(t, go > 0 && go < 1);
	const idea = pop(t, k.thought, 0.35);
	return (
		<AbsoluteFill>
			<Living />
			<div style={{position: 'absolute', left: 800, top: 0, width: 280, height: 1920, overflow: 'hidden'}}>
				<div style={{position: 'absolute', left: -800, top: 0, width: 1080, height: 1920}}>
					<Kitchen />
				</div>
			</div>
			<div style={{position: 'absolute', left: 786, top: 0, width: 28, height: FLOOR, background: '#e7d3b0', borderLeft: `6px solid ${OUT}`, borderRight: `6px solid ${OUT}`}} />
			<Doorway x={800} dark={false} />
			<Quest x={430} y={tween(idea, [0, 1], [1180, 560])} p={idea > 0 ? 1 : 0.0001} />
			<Bean x={x} y={FLOOR + 20 - w.bob} size={620} shirt="#4f7cff" rot={w.rock} flip mouth={idea > 0.5 ? 'grin' : 'flat'} eyes={idea > 0.5 ? 1.2 : 1} arms={idea > 0.5 ? 'up' : 'rest'} />
			{idea > 0 ? <div style={{position: 'absolute', left: 520, top: 360, fontSize: 0, transform: `scale(${idea})`}}>
				<svg width={140} height={170} viewBox="0 0 70 85">
					<path d="M35 5 C15 5 6 22 12 36 C16 46 24 50 24 60 L46 60 C46 50 54 46 58 36 C64 22 55 5 35 5 Z" fill="#ffe14d" stroke={OUT} strokeWidth={4} />
					<rect x={24} y={60} width={22} height={16} rx={4} fill="#cfd2e6" stroke={OUT} strokeWidth={4} />
				</svg>
			</div> : null}
			<Punch text="GO BACK" y={250} size={96} family="punch" stroke={13} color="#ffe14d" p={pop(t, s + 0.1, 0.3)} rot={-3} />
		</AbsoluteFill>
	);
};

/** 25.1–end — or open the fridge and act like that was the plan. */
export const S8Fridge: React.FC<{v: Video005}> = ({v}) => {
	const t = useTime();
	const k = v.t;
	const open = rise(t, k.open, 0.35, ease.out);
	const glow = rise(t, k.open + 0.1, 0.3);
	const nod = t > k.act ? Math.sin((t - k.act) * 9) * 0.08 * Math.max(0, 1 - (t - k.act) * 0.6) : 0;
	return (
		<AbsoluteFill style={{transform: `scale(${tween(t, [k.open, k.plan], [1.0, 1.1])})`, transformOrigin: '420px 900px'}}>
			<Kitchen fridgeOpen={open} glow={glow} />
			<Bean x={560} y={FLOOR + 20} size={620} shirt="#4f7cff" look={[-1, 0]} mouth={t > k.act ? 'smirk' : 'flat'} brows={t > k.act ? 0.5 : 0} arms={t > k.open - 0.2 && t < k.act ? 'point' : 'rest'} flip squash={nod} />
			<Punch text="everyone, every time:" y={250} size={68} family="round" stroke={11} p={pop(t, k.everyone - 0.15, 0.3)} />
			<Punch text="TOTALLY THE PLAN." y={400} size={74} family="punch" stroke={12} color="#ffe14d" p={pop(t, k.plan, 0.3)} rot={-3} />
		</AbsoluteFill>
	);
};
