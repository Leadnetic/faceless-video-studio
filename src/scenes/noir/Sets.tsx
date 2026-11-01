import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {Dots, N} from '../../components/Noir';
import {pop} from '../../components/Toon';
import {ease, rise, tween} from '../../lib/anim';
import {fonts} from '../../theme';

/* ------------------------------------------------------------------ sets */

/** Interrogation room: teal walls, venetian-blind light, hanging lamp, steel table. */
export const Interrogation: React.FC<{t: number; lamp?: boolean; table?: boolean; blinds?: number; swing?: number; tone?: string}> = ({t, lamp = true, table = true, blinds = 1, swing = 1, tone = N.teal}) => {
	const sw = Math.sin(t * 1.3) * 3 * swing;
	return (
		<AbsoluteFill style={{background: `linear-gradient(180deg, ${tone} 0%, #142728 100%)`}}>
			{/* wall panels */}
			{[0, 1, 2, 3].map((i) => (
				<div key={i} style={{position: 'absolute', left: i * 270, top: 0, width: 270, height: 1500, borderRight: `5px solid rgba(14,13,18,0.5)`}} />
			))}
			{/* blinds light */}
			<div style={{position: 'absolute', left: -200, top: 120, width: 1500, height: 1100, transform: 'skewY(-18deg)', opacity: 0.16 * blinds}}>
				{new Array(8).fill(0).map((_, i) => (
					<div key={i} style={{position: 'absolute', left: 0, right: 0, top: i * 120, height: 64, background: N.paper}} />
				))}
			</div>
			{/* two-way mirror */}
			<div style={{position: 'absolute', left: 620, top: 300, width: 520, height: 520, background: 'linear-gradient(135deg, #0f1c1d 0%, #1b3436 60%, #0f1c1d 100%)', border: `10px solid ${N.ink}`}}>
				<div style={{position: 'absolute', left: 60, top: -20, width: 60, height: 600, background: 'rgba(255,255,255,0.08)', transform: 'rotate(24deg)'}} />
				<div style={{position: 'absolute', left: 150, top: -20, width: 20, height: 600, background: 'rgba(255,255,255,0.06)', transform: 'rotate(24deg)'}} />
			</div>
			<Dots color={N.ink} size={18} opacity={0.35} fade="linear-gradient(180deg, transparent 30%, #000 100%)" />
			{lamp ? (
				<div style={{position: 'absolute', left: 540, top: -40, transform: `rotate(${sw}deg)`, transformOrigin: '0 0'}}>
					<div style={{position: 'absolute', left: -4, top: 0, width: 8, height: 180, background: N.ink}} />
					<svg width={1400} height={1900} style={{position: 'absolute', left: -700, top: 170, overflow: 'visible'}}>
						<defs>
							<linearGradient id="cone" x1="0" y1="0" x2="0" y2="1">
								<stop offset="0" stopColor="#fff3c4" stopOpacity={0.55} />
								<stop offset="1" stopColor="#fff3c4" stopOpacity={0} />
							</linearGradient>
						</defs>
						<path d="M610 60 L790 60 L1240 1500 L160 1500 Z" fill="url(#cone)" />
						<path d="M600 70 Q700 -40 800 70 Z" fill={N.ink} />
						<ellipse cx={700} cy={70} rx={100} ry={18} fill="#fff6d0" stroke={N.ink} strokeWidth={6} />
					</svg>
				</div>
			) : null}
			{table ? (
				<div style={{position: 'absolute', left: -60, right: -60, top: 1500, height: 520}}>
					<svg width={1200} height={520} style={{position: 'absolute', inset: 0}}>
						<path d="M0 60 L1200 60 L1200 520 L0 520 Z" fill="#3a4448" stroke={N.ink} strokeWidth={8} />
						<path d="M0 60 L1200 60 L1200 110 L0 110 Z" fill="#59666b" stroke={N.ink} strokeWidth={6} />
						<path d="M0 110 L1200 110" stroke="rgba(255,255,255,0.25)" strokeWidth={3} />
					</svg>
				</div>
			) : null}
		</AbsoluteFill>
	);
};

/** Fortune-teller parlour: velvet curtains, stars, candlelight. */
export const Parlor: React.FC<{t: number; ball?: boolean; glow?: number}> = ({t, ball = true, glow = 1}) => (
	<AbsoluteFill style={{background: `linear-gradient(180deg, ${N.redDeep} 0%, #3c0f17 100%)`}}>
		<AbsoluteFill style={{background: `repeating-linear-gradient(90deg, rgba(0,0,0,0.0) 0 40px, rgba(0,0,0,0.35) 40px 70px, rgba(255,255,255,0.05) 70px 90px, rgba(0,0,0,0) 90px 120px)`}} />
		{/* drapes swag */}
		<svg width={1080} height={400} style={{position: 'absolute', top: 0, left: 0}}>
			<path d="M0 0 L1080 0 L1080 120 Q810 300 540 140 Q270 300 0 120 Z" fill="#5b1520" stroke={N.ink} strokeWidth={8} />
			<path d="M0 120 Q270 300 540 140 Q810 300 1080 120" stroke={N.mustard} strokeWidth={10} fill="none" />
		</svg>
		{new Array(14).fill(0).map((_, i) => {
			const x = random(`px${i}`) * 1000 + 40;
			const y = random(`py${i}`) * 900 + 260;
			const tw = 0.4 + 0.6 * Math.abs(Math.sin(t * 2 + i));
			return (
				<div key={i} style={{position: 'absolute', left: x, top: y, fontSize: 30 + random(`ps${i}`) * 30, color: N.mustard, opacity: 0.35 * tw}}>
					✦
				</div>
			);
		})}
		<Dots color={N.ink} size={18} opacity={0.45} fade="linear-gradient(180deg, transparent 20%, #000 100%)" />
		{ball ? <CrystalBall x={540} y={1560} r={190} t={t} glow={glow} /> : null}
	</AbsoluteFill>
);

/** Mustard brand void with halftone and ink burst — for reveals and title cards. */
export const BrandVoid: React.FC<{t: number; color?: string; dots?: string}> = ({t, color = N.mustard, dots = N.mustardDeep}) => (
	<AbsoluteFill style={{background: color}}>
		<Dots color={dots} size={26} opacity={0.6} fade="radial-gradient(circle at 50% 45%, transparent 20%, #000 75%)" />
		<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 8, background: N.ink, opacity: 0.0 * t}} />
	</AbsoluteFill>
);

/** Cream paper desk for diagrams. */
export const PaperDesk: React.FC<{lines?: boolean}> = ({lines = true}) => (
	<AbsoluteFill style={{background: N.paper}}>
		{lines ? <AbsoluteFill style={{background: 'repeating-linear-gradient(180deg, transparent 0 78px, rgba(79,127,124,0.25) 78px 81px)'}} /> : null}
		<div style={{position: 'absolute', left: 110, top: 0, bottom: 0, width: 4, background: 'rgba(200,50,60,0.4)'}} />
		<Dots color={N.ink} size={20} opacity={0.12} fade="radial-gradient(circle at 50% 50%, transparent 40%, #000 100%)" />
	</AbsoluteFill>
);

/* ------------------------------------------------------------------ props */

export const CrystalBall: React.FC<{x: number; y: number; r: number; t: number; glow?: number}> = ({x, y, r, t, glow = 1}) => (
	<div style={{position: 'absolute', left: x - r * 1.6, top: y - r * 2.2, width: r * 3.2, height: r * 3}}>
		<div style={{position: 'absolute', left: r * 0.1, top: -r * 0.3, width: r * 3, height: r * 3, borderRadius: '50%', background: `radial-gradient(circle, rgba(199,155,220,${0.45 * glow}) 0%, transparent 60%)`}} />
		<svg width={r * 3.2} height={r * 3} viewBox="-160 -220 320 300" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
			<defs>
				<radialGradient id="ball" cx="0.4" cy="0.35" r="0.7">
					<stop offset="0" stopColor="#f3e6ff" />
					<stop offset="0.45" stopColor="#a77cc4" />
					<stop offset="1" stopColor="#3b1e4a" />
				</radialGradient>
			</defs>
			<path d="M-90 40 L90 40 L120 80 L-120 80 Z" fill={N.mustardDeep} stroke={N.ink} strokeWidth={7} />
			<circle cx={0} cy={-70} r={100} fill="url(#ball)" stroke={N.ink} strokeWidth={8} />
			{[0, 1, 2].map((i) => (
				<ellipse key={i} cx={Math.sin(t * 1.5 + i * 2) * 30} cy={-70 + Math.cos(t * 1.2 + i) * 25} rx={40 - i * 8} ry={14} fill="#fff" opacity={0.18 * glow} transform={`rotate(${t * 40 + i * 60} 0 -70)`} />
			))}
			<ellipse cx={-38} cy={-112} rx={22} ry={12} fill="#fff" opacity={0.8} transform="rotate(-30 -38 -112)" />
		</svg>
	</div>
);

/** A coin; `spin` 0..1 rotates it about its vertical axis, `face` toggles heads/tails print. */
export const Coin: React.FC<{x: number; y: number; r: number; spin?: number; rot?: number; label?: string; color?: string}> = ({x, y, r, spin = 0, rot = 0, label = '★', color = N.mustard}) => {
	const sx = Math.cos(spin * Math.PI * 2);
	return (
		<div style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, transform: `rotate(${rot}deg) scaleX(${Math.max(0.08, Math.abs(sx))})`}}>
			<div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: sx >= 0 ? color : N.mustardDeep, border: `${r * 0.1}px solid ${N.ink}`, boxShadow: `inset 0 0 0 ${r * 0.12}px ${N.mustardDeep}`}} />
			<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.comic, fontSize: r * 0.9, color: N.ink}}>{label}</div>
		</div>
	);
};

/** Notepad seen from the back (the writer holds it up) or front with handwriting. */
export const Notepad: React.FC<{x: number; y: number; w: number; h: number; side?: 'back' | 'front'; text?: string; reveal?: number; rot?: number}> = ({
	x,
	y,
	w,
	h,
	side = 'back',
	text = '',
	reveal = 1,
	rot = 0,
}) => (
	<div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `rotate(${rot}deg)`}}>
		<div style={{position: 'absolute', inset: 0, background: side === 'back' ? '#8b6a43' : N.white, border: `8px solid ${N.ink}`, boxShadow: `12px 12px 0 ${N.ink}`}}>
			{side === 'front' ? (
				<>
					<AbsoluteFill style={{background: 'repeating-linear-gradient(180deg, transparent 0 58px, rgba(79,127,124,0.35) 58px 61px)'}} />
					<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.hand, fontWeight: 700, fontSize: h * 0.42, color: '#1b3a8a', clipPath: `inset(0 ${100 - reveal * 100}% 0 0)`}}>
						{text}
					</div>
				</>
			) : (
				<div style={{position: 'absolute', left: 20, right: 20, top: 20, height: 26, background: 'rgba(0,0,0,0.25)'}} />
			)}
		</div>
		<div style={{position: 'absolute', left: 0, right: 0, top: -26, height: 30, display: 'flex', justifyContent: 'space-around'}}>
			{new Array(7).fill(0).map((_, i) => (
				<div key={i} style={{width: 18, height: 40, borderRadius: 9, border: `6px solid #8a8f99`}} />
			))}
		</div>
	</div>
);

/** Pen drawn from its tip (x, y) at angle (deg, 0 = pointing down-left writing posture). */
export const Pen: React.FC<{x: number; y: number; len?: number; angle?: number}> = ({x, y, len = 300, angle = -30}) => (
	<div style={{position: 'absolute', left: x, top: y, width: 0, height: 0, transform: `rotate(${angle}deg)`}}>
		<svg width={60} height={len} viewBox={`0 0 60 ${len}`} style={{position: 'absolute', left: -30, top: -len, overflow: 'visible'}}>
			<path d={`M30 ${len} L18 ${len - 40} L42 ${len - 40} Z`} fill={N.paperDark} stroke={N.ink} strokeWidth={5} />
			<rect x={16} y={20} width={28} height={len - 60} rx={8} fill={N.red} stroke={N.ink} strokeWidth={6} />
			<rect x={14} y={6} width={32} height={34} rx={10} fill={N.ink} />
			<rect x={40} y={30} width={10} height={90} rx={4} fill="#c9cbd1" stroke={N.ink} strokeWidth={4} />
		</svg>
	</div>
);

/** A grid of tiny head icons that fill in over time (crowd of study participants). */
export const Crowd: React.FC<{x: number; y: number; cols: number; rows: number; cell: number; t: number; at: number; dur?: number; color?: string; mark?: (i: number) => string | null; markAt?: number}> = ({
	x,
	y,
	cols,
	rows,
	cell,
	t,
	at,
	dur = 1.6,
	color = N.ink,
	mark,
	markAt = 99,
}) => {
	const n = cols * rows;
	return (
		<div style={{position: 'absolute', left: x, top: y, width: cols * cell, height: rows * cell}}>
			{new Array(n).fill(0).map((_, i) => {
				const order = random(`cr${i}`);
				const p = pop(t, at + order * dur, 0.25);
				if (p <= 0) return null;
				const cx = (i % cols) * cell + cell / 2;
				const cy = Math.floor(i / cols) * cell + cell / 2;
				const m = mark ? mark(i) : null;
				const mp = m ? pop(t, markAt + order * 0.8, 0.25) : 0;
				const hot = m && mp > 0;
				return (
					<div key={i} style={{position: 'absolute', left: cx - cell * 0.35, top: cy - cell * 0.4, width: cell * 0.7, height: cell * 0.8, transform: `scale(${p})`}}>
						<div style={{position: 'absolute', left: '25%', width: '50%', height: '45%', borderRadius: '50%', background: hot ? N.red : color}} />
						<div style={{position: 'absolute', left: '5%', right: '5%', top: '50%', bottom: 0, borderRadius: '50% 50% 8% 8%', background: hot ? N.red : color}} />
						{hot ? (
							<div style={{position: 'absolute', left: '50%', top: -cell * 0.55, transform: `translateX(-50%) scale(${mp})`, fontFamily: fonts.comic, fontSize: cell * 0.55, color: N.ink, background: N.white, border: `3px solid ${N.ink}`, borderRadius: 10, padding: '0 6px'}}>
								{m}
							</div>
						) : null}
					</div>
				);
			})}
		</div>
	);
};

/** Hand-inked bar chart. */
export const InkBars: React.FC<{x: number; y: number; w: number; h: number; t: number; at: number; values: number[]; labels: string[]; hot?: number; color?: string; hotColor?: string; chance?: number; chanceLabel?: string; max?: number}> = ({
	x,
	y,
	w,
	h,
	t,
	at,
	values,
	labels,
	hot = -1,
	color = N.tealMid,
	hotColor = N.red,
	chance,
	chanceLabel,
	max = Math.max(...values),
}) => {
	const bw = w / values.length;
	return (
		<div style={{position: 'absolute', left: x, top: y, width: w, height: h}}>
			<div style={{position: 'absolute', left: -10, right: -10, bottom: 0, height: 8, background: N.ink}} />
			{values.map((v, i) => {
				const g = tween(t, [at + i * 0.07, at + i * 0.07 + (i === hot ? 0.9 : 0.5)], [0, 1], ease.out);
				const bh = (v / max) * (h - 40) * g;
				return (
					<div key={i}>
						<div style={{position: 'absolute', left: i * bw + bw * 0.14, width: bw * 0.72, bottom: 8, height: bh, background: i === hot ? hotColor : color, border: `6px solid ${N.ink}`, borderBottom: 'none'}} />
						<div style={{position: 'absolute', left: i * bw, width: bw, bottom: -76, textAlign: 'center', fontFamily: fonts.comic, fontSize: 60, color: i === hot ? hotColor : N.ink}}>{labels[i]}</div>
					</div>
				);
			})}
			{chance !== undefined ? (
				<div style={{position: 'absolute', left: -20, right: -20, bottom: 8 + (chance / max) * (h - 40), height: 0, borderTop: `6px dashed ${N.ink}`, opacity: rise(t, at + 1.2, 0.4)}}>
					<div style={{position: 'absolute', right: 0, top: -64, fontFamily: fonts.hand, fontWeight: 700, fontSize: 44, color: N.ink}}>{chanceLabel}</div>
				</div>
			) : null}
		</div>
	);
};

/** A cog with an inked label. */
export const Gear: React.FC<{x: number; y: number; r: number; t: number; speed?: number; color?: string; label?: string; p?: number}> = ({x, y, r, t, speed = 30, color = N.mustard, label, p = 1}) => {
	const teeth = 10;
	let d = '';
	for (let i = 0; i < teeth * 2; i++) {
		const a0 = (i / (teeth * 2)) * Math.PI * 2;
		const a1 = ((i + 1) / (teeth * 2)) * Math.PI * 2;
		const R = i % 2 === 0 ? r : r * 0.8;
		d += `${i === 0 ? 'M' : 'L'}${Math.cos(a0) * R} ${Math.sin(a0) * R} L${Math.cos(a1) * R} ${Math.sin(a1) * R} `;
	}
	return (
		<div style={{position: 'absolute', left: x, top: y, width: 0, height: 0, transform: `scale(${p})`}}>
			<svg width={r * 2.4} height={r * 2.4} viewBox={`${-r * 1.2} ${-r * 1.2} ${r * 2.4} ${r * 2.4}`} style={{position: 'absolute', left: -r * 1.2, top: -r * 1.2}}>
				<g transform={`rotate(${t * speed})`}>
					<path d={d + 'Z'} fill={color} stroke={N.ink} strokeWidth={8} strokeLinejoin="round" />
					<circle r={r * 0.28} fill={N.paper} stroke={N.ink} strokeWidth={8} />
				</g>
			</svg>
			{label ? (
				<div style={{position: 'absolute', left: -r, width: r * 2, top: r * 0.95, textAlign: 'center', fontFamily: fonts.comic, fontSize: r * 0.42, color: N.ink, background: N.white, border: `5px solid ${N.ink}`, padding: '2px 0 0'}}>
					{label}
				</div>
			) : null}
		</div>
	);
};

/** Vertical load meter (brain capacity). */
export const LoadBar: React.FC<{x: number; y: number; w: number; h: number; v: number; label: string; color?: string; over?: boolean; t: number}> = ({x, y, w, h, v, label, color = N.tealMid, over = false, t}) => (
	<div style={{position: 'absolute', left: x, top: y, width: w, height: h}}>
		<div style={{position: 'absolute', inset: 0, background: N.white, border: `8px solid ${N.ink}`, boxShadow: `10px 10px 0 ${N.ink}`, overflow: 'hidden'}}>
			<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: `${Math.min(1, v) * 100}%`, background: over ? N.red : color, transform: over ? `translateX(${Math.sin(t * 50) * 3}px)` : undefined}} />
			{[0.25, 0.5, 0.75].map((k) => (
				<div key={k} style={{position: 'absolute', left: 0, width: '30%', bottom: `${k * 100}%`, height: 5, background: N.ink}} />
			))}
		</div>
		<div style={{position: 'absolute', left: -40, right: -40, top: h + 26, textAlign: 'center', fontFamily: fonts.comic, fontSize: 58, color: N.ink}}>{label}</div>
	</div>
);

/** Circus admission ticket (Barnum). */
export const Ticket: React.FC<{x: number; y: number; w: number; t: number; at: number; title: string; sub?: string; rot?: number}> = ({x, y, w, t, at, title, sub, rot = -6}) => {
	const p = pop(t, at, 0.4);
	if (p <= 0) return null;
	const h = w * 0.46;
	return (
		<div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `rotate(${rot}deg) scale(${p})`}}>
			<svg width={w} height={h} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				<path
					d={`M30 0 H${w - 30} A30 30 0 0 0 ${w} 30 V${h / 2 - 30} A30 30 0 0 0 ${w} ${h / 2 + 30} V${h - 30} A30 30 0 0 0 ${w - 30} ${h} H30 A30 30 0 0 0 0 ${h - 30} V${h / 2 + 30} A30 30 0 0 0 0 ${h / 2 - 30} V30 A30 30 0 0 0 30 0 Z`}
					fill={N.red}
					stroke={N.ink}
					strokeWidth={10}
				/>
				<rect x={40} y={36} width={w - 80} height={h - 72} fill="none" stroke={N.mustard} strokeWidth={6} strokeDasharray="18 12" />
			</svg>
			<div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
				{sub ? <div style={{fontFamily: fonts.mono, fontSize: w * 0.04, letterSpacing: 6, color: N.paper}}>{sub}</div> : null}
				<div style={{fontFamily: fonts.comic, fontSize: w * 0.12, lineHeight: 1, color: N.mustard, WebkitTextStroke: `6px ${N.ink}`, paintOrder: 'stroke fill', textAlign: 'center', whiteSpace: 'pre-line'}}>{title}</div>
			</div>
		</div>
	);
};

/** Inked number card (for the "pick a number" grid). */
export const NumCard: React.FC<{x: number; y: number; s: number; n: string; t: number; at?: number; dead?: number; hot?: boolean; rot?: number}> = ({x, y, s, n, t, at = -1, dead = 0, hot = false, rot = 0}) => {
	const p = at < 0 ? 1 : pop(t, at, 0.3);
	if (p <= 0) return null;
	return (
		<div style={{position: 'absolute', left: x - s / 2, top: y - s * 0.62, width: s, height: s * 1.24, transform: `rotate(${rot}deg) scale(${p * (hot ? 1.06 : 1)})`, opacity: 1 - dead * 0.55}}>
			<div style={{position: 'absolute', inset: 0, background: hot ? N.red : N.white, border: `7px solid ${N.ink}`, borderRadius: 14, boxShadow: `8px 8px 0 ${N.ink}`}} />
			<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.comic, fontSize: s * 0.82, color: hot ? N.white : N.ink, WebkitTextStroke: hot ? `5px ${N.ink}` : undefined, paintOrder: 'stroke fill'}}>
				{n}
			</div>
			{dead > 0 ? (
				<svg width={s} height={s * 1.24} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
					<path d={`M${s * 0.1} ${s * 0.15} L${s * 0.9} ${s * 1.1}`} stroke={N.red} strokeWidth={14} strokeLinecap="round" strokeDasharray={s * 1.3} strokeDashoffset={s * 1.3 * (1 - Math.min(1, dead))} />
				</svg>
			) : null}
		</div>
	);
};

/** Clock card (alibi times). */
export const ClockCard: React.FC<{x: number; y: number; s: number; time: string; label: string; t: number; at: number; rot?: number; fall?: number}> = ({x, y, s, time, label, t, at, rot = 0, fall = 0}) => {
	const p = pop(t, at, 0.3);
	if (p <= 0) return null;
	const [hh, mm] = time.split(':').map(Number);
	const ha = ((hh % 12) / 12) * 360 + (mm / 60) * 30;
	const ma = (mm / 60) * 360;
	const fy = fall * fall * 1600;
	return (
		<div style={{position: 'absolute', left: x - s / 2, top: y - s / 2 + fy, width: s, height: s * 1.35, transform: `rotate(${rot + fall * 80}deg) scale(${p})`}}>
			<div style={{position: 'absolute', inset: 0, background: N.white, border: `7px solid ${N.ink}`, boxShadow: `8px 8px 0 ${N.ink}`}} />
			<svg width={s} height={s} viewBox="-60 -60 120 120" style={{position: 'absolute', left: 0, top: 0}}>
				<circle r={44} fill={N.paper} stroke={N.ink} strokeWidth={6} />
				<line x1={0} y1={0} x2={Math.sin((ha * Math.PI) / 180) * 24} y2={-Math.cos((ha * Math.PI) / 180) * 24} stroke={N.ink} strokeWidth={7} strokeLinecap="round" />
				<line x1={0} y1={0} x2={Math.sin((ma * Math.PI) / 180) * 34} y2={-Math.cos((ma * Math.PI) / 180) * 34} stroke={N.red} strokeWidth={5} strokeLinecap="round" />
			</svg>
			<div style={{position: 'absolute', left: 0, right: 0, top: s * 0.92, textAlign: 'center', fontFamily: fonts.comic, fontSize: s * 0.26, color: N.ink}}>{label}</div>
		</div>
	);
};
