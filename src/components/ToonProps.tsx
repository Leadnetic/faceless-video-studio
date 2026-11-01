import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {fonts} from '../theme';
import {OUT, pop} from './Toon';

/** Prop library for the "your brain" cartoon series (video 006+). Everything uses the same outline weight. */

export const Bg: React.FC<{color: string; pattern?: 'dots' | 'grid' | 'stripes' | 'none'; floor?: string; floorY?: number}> = ({color, pattern = 'none', floor, floorY = 1340}) => (
	<>
		<AbsoluteFill style={{background: color}} />
		{pattern === 'dots' ? <AbsoluteFill style={{backgroundImage: 'radial-gradient(rgba(255,255,255,0.14) 3px, transparent 3px)', backgroundSize: '44px 44px'}} /> : null}
		{pattern === 'grid' ? <AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.12) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.12) 2px, transparent 2px)', backgroundSize: '90px 90px'}} /> : null}
		{pattern === 'stripes' ? <AbsoluteFill style={{background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0 80px, transparent 80px 160px)'}} /> : null}
		{floor ? <div style={{position: 'absolute', left: 0, right: 0, top: floorY, bottom: 0, background: floor, borderTop: `6px solid ${OUT}`}} /> : null}
	</>
);

export const Desk: React.FC<{y?: number; color?: string}> = ({y = 1140, color = '#c47f4a'}) => (
	<>
		<div style={{position: 'absolute', left: -40, top: y, width: 1160, height: 80, background: color, border: `6px solid ${OUT}`, borderRadius: 14}} />
		<div style={{position: 'absolute', left: 80, top: y + 74, width: 60, height: 400, background: '#9c5f33', border: `6px solid ${OUT}`}} />
		<div style={{position: 'absolute', left: 860, top: y + 74, width: 60, height: 400, background: '#9c5f33', border: `6px solid ${OUT}`}} />
	</>
);

/** Phone; children render on the screen (screen is w-24 by h-24 inside). */
export const Phone: React.FC<{x: number; y: number; w: number; rot?: number; screen?: string; gray?: number; children?: React.ReactNode}> = ({x, y, w, rot = 0, screen = '#f4f1ff', gray = 0, children}) => {
	const h = w * 1.95;
	return (
		<div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, borderRadius: w * 0.16, background: '#1f1b2e', border: `6px solid ${OUT}`, transform: `rotate(${rot}deg)`, boxShadow: `0 ${w * 0.04}px 0 ${OUT}`}}>
			<div style={{position: 'absolute', inset: w * 0.05, borderRadius: w * 0.12, background: screen, overflow: 'hidden', filter: gray > 0 ? `grayscale(${gray})` : undefined}}>
				<div style={{position: 'absolute', left: '50%', top: w * 0.03, width: w * 0.3, height: w * 0.06, marginLeft: -w * 0.15, borderRadius: w * 0.03, background: '#1f1b2e'}} />
				{children}
			</div>
		</div>
	);
};

/** Notification banner for inside a Phone. */
export const Notif: React.FC<{p: number; top: number; icon: 'chat' | 'heart' | 'bell'; title: string; sub?: string; scale?: number}> = ({p, top, icon, title, sub, scale = 1}) =>
	p <= 0 ? null : (
		<div style={{position: 'absolute', left: '6%', right: '6%', top, transform: `translateY(${(1 - p) * -40}px) scale(${scale})`, opacity: p, transformOrigin: '50% 0', borderRadius: 22, background: '#fff', border: `4px solid ${OUT}`, padding: '12px 16px', display: 'flex', gap: 14, alignItems: 'center'}}>
			<Icon kind={icon} size={54} />
			<div style={{fontFamily: fonts.round, fontWeight: 700, color: OUT, lineHeight: 1.1}}>
				<div style={{fontSize: 30}}>{title}</div>
				{sub ? <div style={{fontSize: 22, opacity: 0.6}}>{sub}</div> : null}
			</div>
		</div>
	);

export type IconKind = 'chat' | 'heart' | 'bell' | 'bellOff' | 'empty' | 'seven' | 'moon' | 'gum' | 'puzzle' | 'note' | 'check' | 'cross' | 'clock' | 'lock' | 'doc' | 'snack' | 'broom' | 'pellet';

export const Icon: React.FC<{kind: IconKind; size: number; color?: string}> = ({kind, size, color}) => {
	const st = {stroke: OUT, strokeWidth: 6, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};
	const shapes: Record<IconKind, React.ReactNode> = {
		chat: <path d="M14 22 Q14 12 26 12 L74 12 Q86 12 86 22 L86 56 Q86 66 74 66 L40 66 L22 82 L26 66 Q14 66 14 56 Z" fill={color ?? '#4f7cff'} {...st} />,
		heart: <path d="M50 84 L16 48 Q4 32 18 20 Q34 8 50 28 Q66 8 82 20 Q96 32 84 48 Z" fill={color ?? '#ff3b5c'} {...st} />,
		bell: <path d="M50 12 Q24 14 24 44 L24 62 L14 74 L86 74 L76 62 L76 44 Q76 14 50 12 Z M40 80 Q50 92 60 80" fill={color ?? '#ffd36e'} {...st} />,
		bellOff: (
			<g>
				<path d="M50 12 Q24 14 24 44 L24 62 L14 74 L86 74 L76 62 L76 44 Q76 14 50 12 Z" fill={color ?? '#cfd2e6'} {...st} />
				<path d="M12 12 L88 88" {...st} stroke="#ff3b5c" strokeWidth={9} />
			</g>
		),
		empty: <path d="M24 50 L76 50" {...st} strokeWidth={10} />,
		seven: <path d="M24 18 L78 18 L46 86" fill="none" {...st} stroke="#ff3b5c" strokeWidth={12} />,
		moon: <path d="M62 12 Q30 22 32 52 Q34 82 66 88 Q30 96 16 66 Q4 34 32 16 Q46 8 62 12 Z" fill={color ?? '#ffe14d'} {...st} />,
		gum: (
			<g>
				<rect x={14} y={26} width={72} height={48} rx={10} fill={color ?? '#ff8fb8'} {...st} />
				<path d="M14 40 L86 40 M14 60 L86 60" {...st} strokeWidth={4} />
			</g>
		),
		puzzle: <path d="M18 18 L42 18 Q42 6 52 6 Q62 6 62 18 L82 18 L82 40 Q94 40 94 50 Q94 60 82 60 L82 82 L60 82 Q60 70 50 70 Q40 70 40 82 L18 82 Z" fill={color ?? '#2fc0a3'} {...st} />,
		note: <path d="M36 72 Q36 60 50 60 Q58 60 60 64 L60 14 L84 22 L84 34 L64 28 L64 74 Q64 86 50 86 Q36 86 36 72 Z" fill={color ?? '#1f1b2e'} {...st} strokeWidth={4} />,
		check: <path d="M16 52 L40 76 L86 22" fill="none" {...st} stroke={color ?? '#2fc0a3'} strokeWidth={12} />,
		cross: <path d="M20 20 L80 80 M80 20 L20 80" {...st} stroke={color ?? '#ff3b5c'} strokeWidth={12} />,
		clock: (
			<g>
				<circle cx={50} cy={50} r={38} fill={color ?? '#fff'} {...st} />
				<path d="M50 26 L50 52 L66 60" fill="none" {...st} />
			</g>
		),
		lock: (
			<g>
				<path d="M30 44 L30 30 Q30 12 50 12 Q70 12 70 30 L70 44" fill="none" {...st} strokeWidth={8} />
				<rect x={20} y={42} width={60} height={46} rx={8} fill={color ?? '#ffd36e'} {...st} />
			</g>
		),
		doc: (
			<g>
				<path d="M20 8 L64 8 L82 26 L82 92 L20 92 Z" fill={color ?? '#fff'} {...st} />
				<path d="M32 40 L70 40 M32 54 L70 54 M32 68 L58 68" {...st} strokeWidth={4} />
			</g>
		),
		snack: <path d="M22 16 L78 16 L72 88 L28 88 Z M22 16 Q50 26 78 16" fill={color ?? '#ff7a59'} {...st} />,
		broom: <path d="M70 8 L48 56 M30 52 L66 62 L58 92 L18 82 Z" fill={color ?? '#ffd36e'} {...st} />,
		pellet: <circle cx={50} cy={50} r={22} fill={color ?? '#c98a3d'} {...st} />,
	};
	return (
		<svg width={size} height={size} viewBox="0 0 100 100" style={{overflow: 'visible', display: 'block', flex: 'none'}}>
			{shapes[kind]}
		</svg>
	);
};

/** Cartoon pigeon. peck: 0…1 head-down amount. */
export const Pigeon: React.FC<{x: number; y: number; size: number; peck?: number; eyes?: 'calm' | 'crazy'; flip?: boolean}> = ({x, y, size, peck = 0, eyes = 'calm', flip}) => {
	const s = size / 200;
	return (
		<div style={{position: 'absolute', left: x - 100 * s, top: y - 200 * s, width: 200 * s, height: 200 * s, transform: flip ? 'scaleX(-1)' : undefined}}>
			<svg viewBox="0 0 200 200" width={200 * s} height={200 * s} style={{overflow: 'visible'}}>
				<path d="M40 150 L20 120 L58 132 Z" fill="#7b8499" stroke={OUT} strokeWidth={6} strokeLinejoin="round" />
				<ellipse cx={92} cy={130} rx={62} ry={44} fill="#a9b2c6" stroke={OUT} strokeWidth={6} />
				<path d="M70 120 Q92 150 128 124" fill="none" stroke="#7b8499" strokeWidth={6} />
				<path d="M80 172 L80 192 M110 172 L110 192" stroke="#ff8a4c" strokeWidth={7} strokeLinecap="round" />
				<g transform={`rotate(${peck * 55} 130 108)`}>
					<path d="M118 112 Q122 84 138 76" fill="none" stroke="#7fb59f" strokeWidth={22} strokeLinecap="round" />
					<circle cx={146} cy={66} r={28} fill="#a9b2c6" stroke={OUT} strokeWidth={6} />
					<path d="M170 64 L192 72 L170 78 Z" fill="#ffb547" stroke={OUT} strokeWidth={5} strokeLinejoin="round" />
					<circle cx={152} cy={58} r={eyes === 'crazy' ? 11 : 8} fill="#fff" stroke={OUT} strokeWidth={4} />
					<circle cx={eyes === 'crazy' ? 155 : 153} cy={eyes === 'crazy' ? 56 : 59} r={eyes === 'crazy' ? 3 : 4.5} fill={OUT} />
				</g>
			</svg>
		</div>
	);
};

/** Slot machine; reels: per-reel final symbol; spinning while t in [spinAt, spinAt + 0.6 + i*0.25]. */
export const SlotMachine: React.FC<{x: number; y: number; w: number; t: number; spins: {at: number; result: IconKind[]}[]; gray?: number; lever?: number}> = ({x, y, w, t, spins, gray = 0, lever = 0}) => {
	const h = w * 1.25;
	const cur = [...spins].reverse().find((s) => t >= s.at) ?? spins[0];
	const pool: IconKind[] = ['heart', 'chat', 'empty', 'bell', 'seven', 'empty'];
	return (
		<div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, filter: gray > 0 ? `grayscale(${gray}) brightness(${1 - gray * 0.25})` : undefined}}>
			<div style={{position: 'absolute', inset: 0, borderRadius: w * 0.1, background: '#ff3b5c', border: `7px solid ${OUT}`, boxShadow: `0 12px 0 ${OUT}`}} />
			<div style={{position: 'absolute', left: w * 0.08, right: w * 0.08, top: w * 0.06, height: w * 0.16, borderRadius: w * 0.05, background: '#ffe14d', border: `6px solid ${OUT}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.punch, fontWeight: 900, fontSize: w * 0.09, color: OUT}}>
				{gray > 0.5 ? 'zzz…' : 'JACKPOT?'}
			</div>
			<div style={{position: 'absolute', left: w * 0.08, right: w * 0.08, top: w * 0.3, height: w * 0.42, display: 'flex', gap: w * 0.03}}>
				{[0, 1, 2].map((i) => {
					const spinning = cur && t >= cur.at && t < cur.at + 0.6 + i * 0.25;
					const k: IconKind = spinning ? pool[Math.floor(t * 18 + i * 2) % pool.length] : cur?.result[i] ?? 'empty';
					return (
						<div key={i} style={{flex: 1, borderRadius: w * 0.04, background: '#fff', border: `6px solid ${OUT}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
							<div style={{transform: spinning ? `translateY(${Math.sin(t * 60 + i) * 10}px)` : undefined, filter: spinning ? 'blur(2px)' : undefined}}>
								<Icon kind={k} size={w * 0.2} />
							</div>
						</div>
					);
				})}
			</div>
			{/* lever */}
			<div style={{position: 'absolute', left: w * 0.99, top: w * 0.3, width: w * 0.08, height: w * 0.5, transformOrigin: '50% 100%', transform: `rotate(${lever * 70}deg)`}}>
				<div style={{position: 'absolute', left: '50%', top: w * 0.05, width: w * 0.035, height: w * 0.45, marginLeft: -w * 0.0175, background: '#cfd2e6', border: `4px solid ${OUT}`}} />
				<div style={{position: 'absolute', left: '50%', top: -w * 0.03, width: w * 0.11, height: w * 0.11, marginLeft: -w * 0.055, borderRadius: '50%', background: '#ffe14d', border: `5px solid ${OUT}`}} />
			</div>
		</div>
	);
};

/** Numbered tip card. */
export const TipCard: React.FC<{n: number; title: string; p: number; y: number; color?: string; children?: React.ReactNode}> = ({n, title, p, y, color = '#ffe14d', children}) =>
	p <= 0 ? null : (
		<div style={{position: 'absolute', left: 100, right: 170, top: y, transform: `scale(${p}) rotate(${(1 - p) * -6}deg)`, borderRadius: 28, background: '#fff', border: `7px solid ${OUT}`, boxShadow: `0 12px 0 ${OUT}`, padding: '22px 26px', display: 'flex', alignItems: 'center', gap: 22}}>
			<div style={{width: 92, height: 92, flex: 'none', borderRadius: 46, background: color, border: `6px solid ${OUT}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.punch, fontWeight: 900, fontSize: 56, color: OUT}}>{n}</div>
			<div style={{fontFamily: fonts.punch, fontWeight: 900, fontSize: 50, lineHeight: 1.05, color: OUT, flex: 1}}>{title}</div>
			{children}
		</div>
	);

/** Small source tag for credibility. */
export const Cite: React.FC<{text: string; p: number; y: number; color?: string}> = ({text, p, y, color = '#ffffff'}) =>
	p <= 0 ? null : <div style={{position: 'absolute', left: 0, right: 0, top: y, textAlign: 'center', fontFamily: fonts.round, fontWeight: 700, fontSize: 32, color, opacity: p}}>{text}</div>;

/** Horizontal meter with label. */
export const Meter: React.FC<{x: number; y: number; w: number; value: number; label: string; color?: string}> = ({x, y, w, value, label, color = '#2fc0a3'}) => (
	<div style={{position: 'absolute', left: x, top: y, width: w}}>
		<div style={{fontFamily: fonts.punch, fontWeight: 900, fontSize: 34, color: '#fff', WebkitTextStroke: `6px ${OUT}`, paintOrder: 'stroke fill', marginBottom: 8}}>{label}</div>
		<div style={{height: 54, borderRadius: 27, background: '#fff', border: `6px solid ${OUT}`, overflow: 'hidden'}}>
			<div style={{width: `${Math.max(0, Math.min(1, value)) * 100}%`, height: '100%', background: color}} />
		</div>
	</div>
);

/** Circular countdown timer. */
export const Timer: React.FC<{x: number; y: number; size: number; progress: number; label: string}> = ({x, y, size, progress, label}) => {
	const r = size / 2 - 14;
	const c = 2 * Math.PI * r;
	return (
		<div style={{position: 'absolute', left: x - size / 2, top: y - size / 2, width: size, height: size}}>
			<svg width={size} height={size} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				<circle cx={size / 2} cy={size / 2} r={r + 8} fill="#fff" stroke={OUT} strokeWidth={7} />
				<circle cx={size / 2} cy={size / 2} r={r - 8} fill="none" stroke="#ff7a59" strokeWidth={24} strokeDasharray={`${c * (1 - progress)} ${c}`} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
			</svg>
			<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.punch, fontWeight: 900, fontSize: size * 0.2, color: OUT}}>{label}</div>
		</div>
	);
};

/** Floating music notes swirling around a point. */
export const Notes: React.FC<{x: number; y: number; t: number; n?: number; r?: number; p?: number}> = ({x, y, t, n = 6, r = 200, p = 1}) => (
	<>
		{new Array(Math.max(0, Math.round(n))).fill(0).map((_, i) => {
			const a = t * 1.6 + (i / n) * Math.PI * 2;
			const nx = x + Math.cos(a) * r * (0.8 + 0.2 * Math.sin(t * 3 + i));
			const ny = y + Math.sin(a) * r * 0.45 - Math.sin(t * 4 + i) * 20;
			return (
				<div key={i} style={{position: 'absolute', left: nx - 40, top: ny - 40, transform: `scale(${p * (0.8 + 0.3 * random(`ns${i}`))}) rotate(${Math.sin(t * 5 + i) * 14}deg)`}}>
					<Icon kind="note" size={80} color={['#ff3b5c', '#4f7cff', '#ffe14d', '#2fc0a3', '#9b8cff', '#ff7a59'][i % 6]} />
				</div>
			);
		})}
	</>
);

/** Cute earworm with headphones. */
export const Worm: React.FC<{x: number; y: number; size: number; t: number; tired?: number; wink?: boolean}> = ({x, y, size, t, tired = 0, wink}) => {
	const s = size / 240;
	const wig = Math.sin(t * 8) * 8 * (1 - tired);
	return (
		<div style={{position: 'absolute', left: x - 120 * s, top: y - 160 * s, width: 240 * s, height: 160 * s}}>
			<svg viewBox="0 0 240 160" width={240 * s} height={160 * s} style={{overflow: 'visible'}}>
				<path d={`M20 130 Q60 ${100 + wig} 100 130 Q140 ${160 - wig} 170 110`} fill="none" stroke={OUT} strokeWidth={46} strokeLinecap="round" />
				<path d={`M20 130 Q60 ${100 + wig} 100 130 Q140 ${160 - wig} 170 110`} fill="none" stroke="#ff8fb8" strokeWidth={34} strokeLinecap="round" />
				<circle cx={182} cy={84} r={42} fill="#ff8fb8" stroke={OUT} strokeWidth={6} />
				<path d="M144 70 Q182 22 220 70" fill="none" stroke={OUT} strokeWidth={9} />
				<rect x={132} y={62} width={20} height={34} rx={8} fill="#4f7cff" stroke={OUT} strokeWidth={5} />
				<rect x={212} y={62} width={20} height={34} rx={8} fill="#4f7cff" stroke={OUT} strokeWidth={5} />
				<circle cx={172} cy={84} r={7} fill={OUT} />
				{wink ? <path d="M188 84 L202 84" stroke={OUT} strokeWidth={5} strokeLinecap="round" /> : <circle cx={196} cy={84 + tired * 2} r={7} fill={OUT} />}
				<path d={tired > 0.5 ? 'M172 104 L194 104' : 'M170 100 Q184 114 198 100'} fill="none" stroke={OUT} strokeWidth={5} strokeLinecap="round" />
			</svg>
		</div>
	);
};

/** Browser window with tabs; one tab refuses to close. */
export const Browser: React.FC<{x: number; y: number; w: number; h: number; tabs: string[]; hot: number; t: number; closed?: boolean; children?: React.ReactNode}> = ({x, y, w, h, tabs, hot, t, closed, children}) => (
	<div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 24, background: '#fff', border: `7px solid ${OUT}`, overflow: 'hidden', boxShadow: `0 12px 0 ${OUT}`}}>
		<div style={{height: 86, background: '#d9dcf0', borderBottom: `6px solid ${OUT}`, display: 'flex', alignItems: 'flex-end', gap: 6, padding: '0 10px'}}>
			{tabs.map((tb, i) =>
				closed && i === hot ? null : (
					<div key={i} style={{height: 62, flex: i === hot ? 2.2 : 1, minWidth: 0, borderRadius: '16px 16px 0 0', background: i === hot ? '#fff' : '#eceef9', border: `5px solid ${OUT}`, borderBottom: 'none', display: 'flex', alignItems: 'center', gap: 6, padding: '0 10px', fontFamily: fonts.round, fontWeight: 700, fontSize: 24, color: OUT, whiteSpace: 'nowrap', overflow: 'hidden', transform: i === hot ? `translateY(${Math.abs(Math.sin(t * 9)) * -4}px)` : undefined}}>
						<span style={{overflow: 'hidden', textOverflow: 'ellipsis', flex: 1}}>{tb}</span>
						<span style={{fontSize: 22}}>✕</span>
					</div>
				),
			)}
		</div>
		<div style={{position: 'absolute', left: 0, right: 0, top: 92, bottom: 0}}>{children}</div>
	</div>
);

/** Retro "loading" song timeline bar with a looping highlighted segment. */
export const SongBar: React.FC<{x: number; y: number; w: number; t: number; seg: [number, number]; fill?: number}> = ({x, y, w, t, seg, fill}) => {
	const head = fill !== undefined ? fill : seg[0] + ((t * 0.35) % 1) * (seg[1] - seg[0]);
	return (
		<div style={{position: 'absolute', left: x, top: y, width: w}}>
			<div style={{height: 40, borderRadius: 20, background: '#fff', border: `6px solid ${OUT}`, position: 'relative', overflow: 'hidden'}}>
				<div style={{position: 'absolute', left: `${seg[0] * 100}%`, width: `${(seg[1] - seg[0]) * 100}%`, top: 0, bottom: 0, background: '#ffe14d'}} />
				{fill !== undefined ? <div style={{position: 'absolute', left: 0, width: `${fill * 100}%`, top: 0, bottom: 0, background: '#2fc0a3'}} /> : null}
			</div>
			<div style={{position: 'absolute', left: `calc(${head * 100}% - 18px)`, top: -6, width: 36, height: 52, borderRadius: 18, background: '#ff3b5c', border: `5px solid ${OUT}`}} />
		</div>
	);
};

/** Text label pill that pops in. */
export const Pill: React.FC<{text: string; x: number; y: number; p: number; color?: string; rot?: number; size?: number}> = ({text, x, y, p, color = '#ffe14d', rot = 0, size = 42}) =>
	p <= 0 ? null : (
		<div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${p}) rotate(${rot}deg)`, background: color, border: `6px solid ${OUT}`, borderRadius: 999, padding: '10px 26px', fontFamily: fonts.punch, fontWeight: 900, fontSize: size, color: OUT, whiteSpace: 'nowrap', boxShadow: `0 8px 0 ${OUT}`}}>{text}</div>
	);

/** Stamp that slams in. */
export const Stamp: React.FC<{text: string; t: number; at: number; y: number; color?: string; size?: number; rot?: number}> = ({text, t, at, y, color = '#ff3b5c', size = 72, rot = -6}) => {
	const p = pop(t, at, 0.25);
	if (p <= 0) return null;
	return (
		<div style={{position: 'absolute', left: 540, top: y, transform: `translate(-50%,-50%) scale(${2.1 - 1.1 * Math.min(1, p)}) rotate(${rot}deg)`, opacity: Math.min(1, p * 1.5), border: `10px solid ${color}`, borderRadius: 18, padding: '8px 26px', fontFamily: fonts.punch, fontWeight: 900, fontSize: size, color, background: 'rgba(255,255,255,0.94)', whiteSpace: 'nowrap', textAlign: 'center', lineHeight: 1.05}}>
			{text}
		</div>
	);
};
