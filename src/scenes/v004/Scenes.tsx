import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {useTime} from '../../components/Primitives';
import {Bean, Brain, Cloud, OUT, pop, Punch, Speech} from '../../components/Toon';
import {ease, rise, tween} from '../../lib/anim';
import {fonts} from '../../theme';
import type {Video004} from '../../videos/video004';
import {AwakeShot} from './Bed';

const Shake: React.FC<{t: number; at: number; amp?: number; children: React.ReactNode}> = ({t, at, amp = 18, children}) => {
	const d = t - at;
	const s = d > 0 ? Math.exp(-d * 12) * amp : 0;
	return <AbsoluteFill style={{transform: `translate(${Math.sin(d * 90) * s}px, ${Math.cos(d * 70) * s * 0.6}px)`}}>{children}</AbsoluteFill>;
};

/** 3.6–7.2s — the flashback: "Enjoy your meal!" — "You too!" — freeze. */
export const S2Restaurant: React.FC<{v: Video004}> = ({v}) => {
	const t = useTime();
	const k = v.t;
	if (t >= k.awake) return <AwakeShot t={t} at={k.awake} />;
	const cringe = rise(t, k.cringe, 0.12);
	const crash = rise(t, k.cringe, 0.18, ease.out);
	const zoom = tween(t, [v.scenes.restaurant[0], k.cringe], [1.15, 1.0]) * (1 + crash * 1.5);
	return (
		<Shake t={t} at={k.cringe} amp={22}>
			<AbsoluteFill style={{transform: `scale(${zoom})`, transformOrigin: '330px 820px'}}>
				<AbsoluteFill style={{background: 'repeating-linear-gradient(90deg, #ffbf5e 0 90px, #ffb24a 90px 180px)'}} />
				{/* hanging lamps */}
				{[260, 820].map((lx) => (
					<React.Fragment key={lx}>
						<div style={{position: 'absolute', left: lx - 3, top: 0, width: 6, height: 220, background: OUT}} />
						<div style={{position: 'absolute', left: lx - 70, top: 210, width: 140, height: 70, borderRadius: '70px 70px 10px 10px', background: '#2fb39a', border: `6px solid ${OUT}`}} />
					</React.Fragment>
				))}
				<Bean x={330} y={1360} size={700} shirt="#4f7cff" mouth={cringe > 0.5 ? 'grimace' : t > k.youToo ? 'grin' : 'smile'} arms={cringe > 0.5 ? 'face' : 'hold'} blush={cringe} sweat={cringe} brows={cringe > 0.5 ? -1 : 0} look={cringe > 0.5 ? [0, 0] : [1, -0.3]} eyes={cringe > 0.5 ? 1.2 : 1} />
				<Bean x={810} y={1420} size={780} shirt="#ffffff" pants="#222" bowtie mustache hairStyle="none" mouth={cringe > 0.5 ? 'flat' : 'smile'} arms="hold" look={[-1, 0]} brows={cringe > 0.5 ? 0.4 : 0} />
				{/* plate */}
				<div style={{position: 'absolute', left: 620, top: 1060, width: 200, height: 56, borderRadius: '50%', background: '#fff', border: `6px solid ${OUT}`}} />
				<div style={{position: 'absolute', left: 660, top: 1028, width: 120, height: 50, borderRadius: '60px 60px 10px 10px', background: '#ff7a59', border: `6px solid ${OUT}`}} />
				{/* table */}
				<div style={{position: 'absolute', left: -40, top: 1180, width: 1160, height: 120, background: '#ffffff', border: `6px solid ${OUT}`, borderRadius: 18}} />
				<div style={{position: 'absolute', left: -40, top: 1290, width: 1160, height: 700, background: 'repeating-linear-gradient(90deg, #e94b5f 0 70px, #ffffff 70px 140px)', borderTop: `6px solid ${OUT}`}} />
				<Speech x={800} y={420} text="Enjoy your meal!" p={pop(t, k.enjoy, 0.3)} tail="right" size={58} />
				<Speech x={330} y={560} text="You too!" p={pop(t, k.youToo, 0.3)} tail="left" size={70} />
			</AbsoluteFill>
			{/* freeze: colour drains */}
			<AbsoluteFill style={{background: '#7a7a7a', mixBlendMode: 'saturation', opacity: cringe * 0.9}} />
			<Punch text="FLASHBACK · 2019" y={240} size={46} family="round" stroke={9} color="#ffe14d" p={1 - cringe} rot={-3} />
		</Shake>
	);
};

/** 7.2–11.3s — the brain files the moment under SOCIAL DANGER. */
export const S3Files: React.FC<{v: Video004}> = ({v}) => {
	const t = useTime();
	const k = v.t;
	const folder = pop(t, k.folder, 0.4);
	const stamp = rise(t, k.stamp, 0.1, ease.in);
	const toDrawer = rise(t, k.toDrawer, 0.35, ease.in);
	const fx = tween(toDrawer, [0, 1], [430, 830]);
	const fy = tween(toDrawer, [0, 1], [560, 1190]);
	const fs = tween(toDrawer, [0, 1], [1, 0.25]);
	return (
		<Shake t={t} at={k.stamp} amp={16}>
			<AbsoluteFill style={{background: '#2fc0a3'}} />
			<AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.12) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.12) 2px, transparent 2px)', backgroundSize: '90px 90px'}} />
			{/* filing cabinet */}
			<div style={{position: 'absolute', left: 690, top: 780, width: 330, height: 760, borderRadius: 22, background: '#8a94a6', border: `6px solid ${OUT}`}}>
				{['BIRTHDAYS', 'IMPORTANT', 'CRINGE ∞'].map((lab, i) => (
					<div key={lab} style={{position: 'absolute', left: 22, right: 22, top: 30 + i * 240, height: 210, borderRadius: 16, background: i === 2 ? '#ff6b8b' : '#b8c0cf', border: `5px solid ${OUT}`, transform: i === 2 ? `translateX(${-toDrawer * 30}px) scaleY(${1 + Math.sin(t * 8) * 0.02})` : undefined}}>
						<div style={{position: 'absolute', left: '50%', top: 22, transform: 'translateX(-50%)', background: '#fff', border: `4px solid ${OUT}`, borderRadius: 8, padding: '4px 12px', fontFamily: fonts.round, fontWeight: 700, fontSize: 30, color: OUT, whiteSpace: 'nowrap'}}>{lab}</div>
						<div style={{position: 'absolute', left: '50%', top: 120, width: 90, height: 22, marginLeft: -45, borderRadius: 11, background: OUT}} />
					</div>
				))}
			</div>
			{/* desk + brain clerk */}
			<Brain x={300} y={1240} size={380} glasses mouth={t > k.stamp ? 'grin' : 'smirk'} look={t < k.folder ? [0.4, 0.2] : [0.6, -0.6]} squash={rise(t, k.stamp - 0.08, 0.08) * (1 - rise(t, k.stamp + 0.05, 0.2))} />
			<div style={{position: 'absolute', left: -40, top: 1230, width: 720, height: 90, borderRadius: 16, background: '#c47f4a', border: `6px solid ${OUT}`}} />
			<div style={{position: 'absolute', left: 40, top: 1316, width: 560, height: 600, background: '#a8643a', borderLeft: `6px solid ${OUT}`, borderRight: `6px solid ${OUT}`}} />
			{/* the folder */}
			{folder > 0 && toDrawer < 1 ? (
				<div style={{position: 'absolute', left: fx - 230, top: fy - 160, width: 460, height: 330, transform: `scale(${folder * fs}) rotate(${-4 + toDrawer * 20}deg)`}}>
					<div style={{position: 'absolute', left: 0, top: -40, width: 200, height: 60, borderRadius: '16px 16px 0 0', background: '#ffd36e', border: `6px solid ${OUT}`}} />
					<div style={{position: 'absolute', inset: 0, borderRadius: 18, background: '#ffd36e', border: `6px solid ${OUT}`, padding: 24}}>
						<div style={{fontFamily: fonts.round, fontWeight: 700, fontSize: 40, color: OUT}}>“YOU TOO” (2019)</div>
						<div style={{position: 'absolute', left: 30, top: 90, width: 250, height: 200, background: '#ffb547', border: `5px solid ${OUT}`, transform: 'rotate(-3deg)', overflow: 'hidden'}}>
							<Bean x={80} y={230} size={190} mouth="grin" />
							<Bean x={180} y={235} size={200} shirt="#fff" bowtie mustache hairStyle="none" arms="hold" />
						</div>
					</div>
					{stamp > 0 ? (
						<div style={{position: 'absolute', left: 120, top: 140, transform: `scale(${tween(stamp, [0, 1], [2.4, 1])}) rotate(-12deg)`, opacity: stamp, border: '9px solid #e0263f', borderRadius: 16, padding: '6px 18px', fontFamily: fonts.punch, fontWeight: 900, fontSize: 56, lineHeight: 1, color: '#e0263f', background: 'rgba(255,255,255,0.75)', textAlign: 'center'}}>
							SOCIAL
							<br />
							DANGER
						</div>
					) : null}
				</div>
			) : null}
		</Shake>
	);
};

/** 11.3–14.7s — getting kicked out of the group used to be dangerous. */
export const S4Cave: React.FC<{v: Video004}> = ({v}) => {
	const t = useTime();
	const k = v.t;
	const fly = rise(t, k.kicked, 0.75, ease.inOut);
	const pan = rise(t, k.kicked + 0.25, 0.7, ease.inOut);
	const cx = tween(fly, [0, 1], [760, 1640]);
	const cy = tween(fly, [0, 1], [1380, 1420]) - Math.sin(fly * Math.PI) * 520;
	const eyes = pop(t, k.threat, 0.25);
	const tribe = [
		{x: 180, shirt: '#a8743a', hair: 'spiky' as const},
		{x: 360, shirt: '#8d5a2b', hair: 'bob' as const},
		{x: 560, shirt: '#b98445', hair: 'bun' as const},
	];
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<AbsoluteFill style={{width: 2160, transform: `translateX(${-pan * 1080}px)`}}>
				{/* warm side */}
				<div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, background: 'linear-gradient(180deg, #ff8a4c 0%, #ffbe6b 60%, #e8a35a 100%)'}} />
				<div style={{position: 'absolute', left: 0, top: 1380, width: 1080, height: 540, background: '#c97d3f', borderTop: `6px solid ${OUT}`}} />
				{/* cold, dark side */}
				<div style={{position: 'absolute', left: 1080, top: 0, width: 1080, height: 1920, background: 'linear-gradient(180deg, #1b2148 0%, #26305e 100%)'}} />
				<div style={{position: 'absolute', left: 1080, top: 1430, width: 1080, height: 500, background: '#1a2240', borderTop: `6px solid ${OUT}`}} />
				{[1200, 1460, 1800, 2020].map((bx, i) => (
					<div key={bx} style={{position: 'absolute', left: bx - 150, top: 1160 + (i % 2) * 60, width: 300, height: 300, borderRadius: '50%', background: '#16523f', border: `6px solid ${OUT}`}}>
						{eyes > 0 ? (
							<div style={{position: 'absolute', left: 110, top: 110, display: 'flex', gap: 22, transform: `scale(${eyes})`}}>
								{[0, 1].map((e) => (
									<div key={e} style={{width: 34, height: 22, borderRadius: '50%', background: '#ffe14d', boxShadow: '0 0 18px #ffe14d', border: `4px solid ${OUT}`}} />
								))}
							</div>
						) : null}
					</div>
				))}
				{/* campfire */}
				<div style={{position: 'absolute', left: 350, top: 1250, width: 160, height: 150}}>
					{[0, 1, 2].map((f) => (
						<div key={f} style={{position: 'absolute', left: 30 + f * 30, bottom: 30, width: 60 - f * 10, height: (110 - f * 25) * (0.85 + 0.15 * Math.sin(t * 14 + f)), borderRadius: '50% 50% 40% 40%', background: ['#ff4d2e', '#ff9b2e', '#ffe14d'][f], border: `5px solid ${OUT}`}} />
					))}
					<div style={{position: 'absolute', left: 0, bottom: 0, width: 160, height: 40, borderRadius: 20, background: '#6b3e1f', border: `5px solid ${OUT}`}} />
				</div>
				{tribe.map((m, i) => (
					<Bean key={i} x={m.x} y={1450} size={400} pelt shirt={m.shirt} hairStyle={m.hair} mouth={t > k.kicked ? 'grin' : 'smile'} look={[1, 0]} arms={i === 2 && t > k.kicked - 0.15 && t < k.kicked + 0.4 ? 'point' : 'rest'} />
				))}
				<Bean x={cx} y={cy} size={420} pelt shirt="#c4935a" hairStyle="tuft" mouth={fly > 0.05 ? 'o' : 'smile'} arms={fly > 0.05 && fly < 1 ? 'up' : 'rest'} rot={fly < 1 ? fly * 340 : 0} sweat={rise(t, k.threat, 0.3)} eyes={fly >= 1 ? 1.2 : 1} look={fly >= 1 ? [-1, 0] : [0, 0]} squash={fly >= 1 ? Math.max(0, 1 - (t - k.kicked - 0.75) * 4) : 0} />
			</AbsoluteFill>
			<Punch text="10,000 YEARS AGO" y={250} size={64} family="round" stroke={11} color="#ffe14d" p={1 - pan} rot={-2} />
		</AbsoluteFill>
	);
};

/** 18.1–21.3s — the twist: the waiter forgot it the same day. */
export const S6Twist: React.FC<{v: Video004}> = ({v}) => {
	const t = useTime();
	const k = v.t;
	const intro = pop(t, k.twist, 0.3);
	const memory = pop(t, k.forgot - 0.55, 0.3);
	const toss = rise(t, k.forgot, 0.5, ease.in);
	const forgotten = pop(t, k.forgot + 0.45, 0.3);
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: '#79d26a'}} />
			<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.35), transparent 60%)'}} />
			{/* couch */}
			<div style={{position: 'absolute', left: 120, top: 1080, width: 840, height: 330, borderRadius: 60, background: '#7c6cff', border: `6px solid ${OUT}`}} />
			<Bean x={540} y={1400} size={680} shirt="#fff" pants="#222" bowtie mustache hairStyle="none" mouth="grin" eyes={0.05} arms="hold" squash={Math.sin(t * 6) * 0.06} />
			<div style={{position: 'absolute', left: 120, top: 1300, width: 840, height: 220, borderRadius: 40, background: '#6a5be6', border: `6px solid ${OUT}`}} />
			{/* noodles */}
			<div style={{position: 'absolute', left: 470, top: 1120, width: 150, height: 90, borderRadius: '0 0 75px 75px', background: '#ff7a59', border: `6px solid ${OUT}`}} />
			<Cloud x={780} y={420} w={420} h={300} p={pop(t, k.twist + 0.15, 0.4)} tailTo={[620, 760]}>
				<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 0}}>
					{/* pizza */}
					<svg width={170} height={170} viewBox="0 0 100 100">
						<path d="M50 95 L10 15 Q50 0 90 15 Z" fill="#ffd36e" stroke={OUT} strokeWidth={5} strokeLinejoin="round" />
						<path d="M10 15 Q50 0 90 15 L86 24 Q50 10 14 24 Z" fill="#d98b3a" stroke={OUT} strokeWidth={4} />
						{[[40, 40], [58, 50], [48, 68]].map(([px, py]) => (
							<circle key={px} cx={px} cy={py} r={7} fill="#e23b4e" stroke={OUT} strokeWidth={3} />
						))}
					</svg>
				</div>
			</Cloud>
			{/* the "you too" memory gets crumpled and tossed */}
			{memory > 0 && toss < 1 ? (
				<div style={{position: 'absolute', left: tween(toss, [0, 1], [260, 140]), top: tween(toss, [0, 1], [520, 1500]) - Math.sin(toss * Math.PI) * 200, transform: `scale(${memory * (1 - toss * 0.7)}) rotate(${toss * 400}deg)`, borderRadius: toss > 0.2 ? '40%' : 18, background: '#fff', border: `6px solid ${OUT}`, padding: '16px 24px', fontFamily: fonts.round, fontWeight: 700, fontSize: 44, color: OUT, whiteSpace: 'nowrap'}}>
					“you too!”
				</div>
			) : null}
			{/* bin */}
			<div style={{position: 'absolute', left: 60, top: 1500, width: 170, height: 210, borderRadius: '10px 10px 30px 30px', background: '#5c6b7a', border: `6px solid ${OUT}`}} />
			<Punch text="FORGOTTEN ✓" y={250} size={86} family="punch" stroke={13} color="#ffffff" p={forgotten} rot={-4} />
			<Punch text="PLOT TWIST" y={250} size={86} family="punch" stroke={13} color="#ffe14d" p={intro * (1 - forgotten)} rot={3} />
		</AbsoluteFill>
	);
};

/** 21.3–25.2s — the spotlight effect: you feel watched; nobody is watching. */
export const S7Stage: React.FC<{v: Video004}> = ({v}) => {
	const t = useTime();
	const k = v.t;
	const [s] = v.scenes.stage;
	const label = pop(t, k.spotlight, 0.35);
	const pull = rise(t, k.people - 0.1, 0.9, ease.inOut);
	const zoom = tween(pull, [0, 1], [1.45, 1.0]);
	const crowd = ['#ff7a59', '#4f7cff', '#ffd36e', '#2fc0a3', '#ff6b8b', '#9b8cff', '#79d26a', '#ffb547'];
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{transform: `scale(${zoom})`, transformOrigin: '540px 900px'}}>
				<AbsoluteFill style={{background: '#241a45'}} />
				{/* curtains */}
				<div style={{position: 'absolute', left: -60, top: 0, width: 240, height: 1300, background: 'repeating-linear-gradient(90deg, #c9264a 0 40px, #a81d3d 40px 80px)', borderRight: `6px solid ${OUT}`}} />
				<div style={{position: 'absolute', right: -60, top: 0, width: 240, height: 1300, background: 'repeating-linear-gradient(90deg, #c9264a 0 40px, #a81d3d 40px 80px)', borderLeft: `6px solid ${OUT}`}} />
				{/* spotlight */}
				<div style={{position: 'absolute', left: 240, top: -100, width: 600, height: 1300, background: 'linear-gradient(180deg, rgba(255,246,190,0.1), rgba(255,246,190,0.45))', clipPath: 'polygon(40% 0, 60% 0, 100% 100%, 0 100%)'}} />
				<div style={{position: 'absolute', left: 260, top: 1110, width: 560, height: 110, borderRadius: '50%', background: 'rgba(255,246,190,0.6)'}} />
				{/* stage */}
				<div style={{position: 'absolute', left: -40, top: 1160, width: 1160, height: 150, background: '#8b5a34', border: `6px solid ${OUT}`}} />
				<Bean x={540} y={1170} size={560} shirt="#4f7cff" mouth="grimace" blush={0.8} sweat={1} arms="face" brows={-1} eyes={1.15} squash={Math.sin(t * 22) * 0.04} />
				{/* audience: nobody is looking */}
				{crowd.map((c, i) => {
					const row = Math.floor(i / 4);
					const x = 140 + (i % 4) * 270 + row * 90;
					const y = 1640 + row * 260;
					return (
						<React.Fragment key={i}>
							<Bean x={x} y={y} size={360} shirt={c} hairStyle={(['tuft', 'bob', 'spiky', 'bun'] as const)[i % 4]} hair={random(`h${i}`) > 0.5 ? '#3b2418' : '#1f1b2e'} skin={(['#ffcfa6', '#c98b62', '#8d5a3c', '#f2c29b'] as const)[i % 4]} mouth={i % 3 === 0 ? 'flat' : 'smile'} arms="hold" eyes={i % 2 ? 0.05 : 1} look={[0, 1]} />
							<div style={{position: 'absolute', left: x - 30, top: y - 155, width: 60, height: 90, borderRadius: 10, background: '#1b1830', border: `5px solid ${OUT}`, boxShadow: '0 0 30px rgba(140,200,255,0.6)'}} />
						</React.Fragment>
					);
				})}
			</AbsoluteFill>
			<Punch text="THE SPOTLIGHT EFFECT" y={230} size={78} family="punch" stroke={12} color="#ffe14d" p={label} rot={-2} />
			<div style={{position: 'absolute', top: 432, left: 0, right: 0, textAlign: 'center', fontFamily: fonts.round, fontWeight: 700, fontSize: 32, color: '#fff', opacity: label * 0.85}}>Gilovich et al., 2000</div>
		</AbsoluteFill>
	);
};

const Cringes = ['“you too!”', '“love you” to the boss', 'waved back… at nobody', 'called teacher “mom”', 'tripped on flat ground', '“you too!”'];

/** 25.2–28.3s — everyone's brain at 3am: the whole building is replaying its own cringe. */
export const S8City: React.FC<{v: Video004}> = ({v}) => {
	const t = useTime();
	const k = v.t;
	const out = rise(t, k.own + 0.2, 1.2, ease.inOut);
	const zoom = tween(out, [0, 1], [2.3, 1.15]);
	const W = 290;
	const H = 300;
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{transform: `scale(${zoom})`, transformOrigin: `${tween(out, [0, 1], [725, 540])}px ${tween(out, [0, 1], [1010, 880])}px`}}>
				<AbsoluteFill style={{background: 'linear-gradient(180deg, #1c1a4a 0%, #2c2a78 100%)'}} />
				{new Array(30).fill(0).map((_, i) => (
					<div key={i} style={{position: 'absolute', left: random(`cx${i}`) * 1080, top: random(`cy${i}`) * 600, width: 6, height: 6, borderRadius: 3, background: '#fff6c9', opacity: 0.4 + 0.5 * Math.abs(Math.sin(t * 2 + i))}} />
				))}
				<div style={{position: 'absolute', left: 900, top: 140, width: 110, height: 110, borderRadius: '50%', background: '#fff3c4', border: `6px solid ${OUT}`}} />
				{/* building */}
				<div style={{position: 'absolute', left: 80, top: 520, width: 920, height: 1500, background: '#4b4f8f', border: `6px solid ${OUT}`, borderRadius: '20px 20px 0 0'}} />
				{[0, 1, 2, 3, 4, 5].map((i) => {
					const col = i % 3;
					const row = Math.floor(i / 3);
					const x = 115 + col * (W + 10);
					const y = 600 + row * (H + 110);
					const waiter = i === 5;
					const lit = pop(t, k.own + 0.3 + i * 0.12, 0.3);
					return (
						<div key={i} style={{position: 'absolute', left: x, top: y, width: W, height: H, borderRadius: 14, background: lit > 0.1 || waiter ? '#ffd98a' : '#2b2d5c', border: `6px solid ${OUT}`, overflow: 'hidden'}}>
							<div style={{position: 'absolute', left: 40, top: 150, width: 210, height: 160, borderRadius: 24, background: '#fff', border: `5px solid ${OUT}`}} />
							<Bean x={145} y={270} size={190} headOnly hairStyle={waiter ? 'none' : (['tuft', 'bob', 'spiky', 'bun', 'tuft'] as const)[i % 5]} mustache={waiter} mouth="grimace" blush={0.8} eyes={1.2} skin={(['#ffcfa6', '#c98b62', '#8d5a3c', '#f2c29b', '#ffcfa6', '#ffcfa6'] as const)[i]} />
							<div style={{position: 'absolute', left: 30, top: 200, width: 230, height: 110, borderRadius: 18, background: '#ff9f43', border: `5px solid ${OUT}`}} />
							<div style={{position: 'absolute', left: 10, right: 10, top: 14, transform: `scale(${waiter ? 1 : lit})`, background: '#fff', border: `4px solid ${OUT}`, borderRadius: 16, padding: '6px 8px', fontFamily: fonts.round, fontWeight: 700, fontSize: 25, color: OUT, textAlign: 'center', lineHeight: 1.1}}>
								{Cringes[i]}
							</div>
						</div>
					);
				})}
			</AbsoluteFill>
			<Punch text="everyone's brain at 3am:" y={150} size={78} family="round" stroke={12} p={pop(t, k.own + 0.4, 0.35)} />
		</AbsoluteFill>
	);
};


