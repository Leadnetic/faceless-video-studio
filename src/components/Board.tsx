import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {ease, rise, tween} from '../lib/anim';
import type {Timeline} from '../lib/timeline';
import {fonts} from '../theme';
import {Grain} from './Primitives';
import {pop} from './Toon';

/**
 * "THE ARCHIVE" — evidence-board documentary kit (video 017+).
 * One huge cork wall in world space; a camera glides between torn-paper exhibits,
 * polaroids, red string and stamps. Palette: dark cork, paper cream, string red, archive mustard.
 */
export const B = {
	cork: '#3a2c22',
	corkDark: '#2a1f18',
	corkLight: '#4c3a2c',
	paper: '#efe7d6',
	paperOld: '#e2d4b4',
	ink: '#141114',
	red: '#d4252f',
	redDeep: '#8f1b22',
	mustard: '#e2b33c',
	photo: '#1d1b1f',
	photoLight: '#3a3740',
};

/* ------------------------------------------------------------------ camera */

export type CamKey = [t: number, x: number, y: number, zoom: number, rot?: number];

const camAt = (t: number, keys: CamKey[]) => {
	if (t <= keys[0][0]) return keys[0];
	for (let i = 0; i < keys.length - 1; i++) {
		const a = keys[i];
		const b = keys[i + 1];
		if (t <= b[0]) {
			const k = ease.inOut(Math.min(1, Math.max(0, (t - a[0]) / (b[0] - a[0]))));
			// zoom interpolates in log space so pull-backs feel even
			const z = Math.exp(Math.log(a[3]) + (Math.log(b[3]) - Math.log(a[3])) * k);
			return [t, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k, z, (a[4] ?? 0) + ((b[4] ?? 0) - (a[4] ?? 0)) * k] as CamKey;
		}
	}
	return keys[keys.length - 1];
};

/** Renders children in world space through a gliding camera (world point (x,y) lands at screen 540,760). */
export const BoardCam: React.FC<{t: number; keys: CamKey[]; shake?: number; children: React.ReactNode}> = ({t, keys, shake = 0, children}) => {
	const [, x, y, z, r] = camAt(t, keys);
	const dx = Math.sin(t * 0.7) * 6 + Math.sin(t * 41) * shake * 14;
	const dy = Math.cos(t * 0.53) * 5 + Math.cos(t * 37) * shake * 12;
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<div style={{position: 'absolute', left: 0, top: 0, width: 0, height: 0, transform: `translate(${540 + dx}px, ${760 + dy}px) rotate(${r ?? 0}deg) scale(${z}) translate(${-x}px, ${-y}px)`}}>{children}</div>
		</AbsoluteFill>
	);
};

/** Cork wall, sized generously around the world origin. */
export const Cork: React.FC<{x0?: number; y0?: number; w?: number; h?: number}> = ({x0 = -3000, y0 = -3000, w = 8200, h = 13000}) => (
	<div
		style={{
			position: 'absolute',
			left: x0,
			top: y0,
			width: w,
			height: h,
			backgroundColor: B.cork,
			backgroundImage: `radial-gradient(circle, ${B.corkDark} 0 2px, transparent 3px), radial-gradient(circle, ${B.corkLight} 0 1.5px, transparent 2.5px)`,
			backgroundSize: '23px 19px, 31px 27px',
			backgroundPosition: '0 0, 11px 7px',
		}}
	/>
);

/* ------------------------------------------------------------------ exhibits */

const tornPoly = (seed: string, n = 14, amt = 1.4) => {
	const pts: string[] = [];
	const j = (i: number, k: string) => (random(`${seed}${k}${i}`) - 0.5) * amt;
	for (let i = 0; i <= n; i++) pts.push(`${(i / n) * 100}% ${Math.max(0, j(i, 't') + amt / 2)}%`);
	for (let i = 0; i <= n; i++) pts.push(`${100 - Math.max(0, j(i, 'r') + amt / 2)}% ${(i / n) * 100}%`);
	for (let i = n; i >= 0; i--) pts.push(`${(i / n) * 100}% ${100 - Math.max(0, j(i, 'b') + amt / 2)}%`);
	for (let i = n; i >= 0; i--) pts.push(`${Math.max(0, j(i, 'l') + amt / 2)}% ${(i / n) * 100}%`);
	return `polygon(${pts.join(',')})`;
};

/** Torn paper scrap pinned in world space. `at` pops it in; `pin`/`tape` decorate. */
export const Paper: React.FC<{
	id: string;
	x: number;
	y: number;
	w: number;
	h: number;
	t: number;
	at?: number;
	rot?: number;
	color?: string;
	pin?: boolean;
	tape?: boolean;
	children?: React.ReactNode;
	style?: React.CSSProperties;
}> = ({id, x, y, w, h, t, at = -99, rot = 0, color = B.paper, pin = true, tape = false, children, style}) => {
	const p = at < -50 ? 1 : pop(t, at, 0.35);
	if (p <= 0) return null;
	const clip = tornPoly(id);
	return (
		<div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `rotate(${rot}deg) scale(${0.85 + 0.15 * p})`, opacity: Math.min(1, p * 2), ...style}}>
			<div style={{position: 'absolute', inset: 0, transform: 'translate(14px, 18px)', background: 'rgba(0,0,0,0.45)', clipPath: clip}} />
			<div style={{position: 'absolute', inset: 0, background: color, clipPath: clip, overflow: 'hidden'}}>
				<div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.25), transparent 60%), radial-gradient(ellipse at 80% 90%, rgba(120,90,40,0.18), transparent 55%)'}} />
				{children}
			</div>
			{tape ? <div style={{position: 'absolute', left: w / 2 - 70, top: -22, width: 140, height: 44, background: 'rgba(226,179,60,0.75)', transform: `rotate(${(random(`${id}tp`) - 0.5) * 14}deg)`}} /> : null}
			{pin ? <Pin x={w / 2} y={26} /> : null}
		</div>
	);
};

export const Pin: React.FC<{x: number; y: number; color?: string}> = ({x, y, color = B.red}) => (
	<div style={{position: 'absolute', left: x - 16, top: y - 16, width: 32, height: 32, borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, #ff8a8f 0 18%, ${color} 40%, ${B.redDeep} 100%)`, boxShadow: '4px 6px 0 rgba(0,0,0,0.4)'}} />
);

/** Polaroid with a dark "photo" area (children draw into a w×w square) and a handwritten caption. */
export const Polaroid: React.FC<{id: string; x: number; y: number; w: number; t: number; at?: number; rot?: number; caption?: string; children?: React.ReactNode; flash?: number}> = ({
	id,
	x,
	y,
	w,
	t,
	at = -99,
	rot = 0,
	caption,
	children,
	flash = 0,
}) => {
	const pad = w * 0.06;
	const inner = w - pad * 2;
	return (
		<Paper id={id} x={x} y={y} w={w} h={w * 1.2} t={t} at={at} rot={rot} color="#f7f3ea" pin={false} tape>
			<div style={{position: 'absolute', left: pad, top: pad, width: inner, height: inner, background: B.photo, overflow: 'hidden'}}>
				{children}
				<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.08), transparent 40%)'}} />
				{flash > 0 ? <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: flash}} /> : null}
			</div>
			{caption ? <div style={{position: 'absolute', left: 0, right: 0, top: pad + inner + w * 0.02, textAlign: 'center', fontFamily: fonts.hand, fontWeight: 700, fontSize: w * 0.075, color: B.ink}}>{caption}</div> : null}
		</Paper>
	);
};

/** Red string between two world points, drawn on from `at`. */
export const Thread: React.FC<{from: [number, number]; to: [number, number]; t: number; at: number; dur?: number; sag?: number}> = ({from, to, t, at, dur = 0.6, sag = 60}) => {
	const p = tween(t, [at, at + dur], [0, 1], ease.out);
	if (p <= 0) return null;
	const [x1, y1] = from;
	const [x2, y2] = to;
	const mx = (x1 + x2) / 2;
	const my = (y1 + y2) / 2 + sag;
	const len = Math.hypot(x2 - x1, y2 - y1) * 1.1 + sag;
	const minX = Math.min(x1, x2) - 50;
	const minY = Math.min(y1, y2) - 50;
	return (
		<svg style={{position: 'absolute', left: minX, top: minY, overflow: 'visible'}} width={Math.abs(x2 - x1) + 100} height={Math.abs(y2 - y1) + 100 + sag}>
			<path d={`M${x1 - minX} ${y1 - minY} Q${mx - minX} ${my - minY} ${x2 - minX} ${y2 - minY}`} stroke="rgba(0,0,0,0.35)" strokeWidth={9} fill="none" transform="translate(6 10)" strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
			<path d={`M${x1 - minX} ${y1 - minY} Q${mx - minX} ${my - minY} ${x2 - minX} ${y2 - minY}`} stroke={B.red} strokeWidth={7} fill="none" strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
			<circle cx={x1 - minX} cy={y1 - minY} r={13} fill={B.red} stroke={B.redDeep} strokeWidth={4} />
			{p > 0.98 ? <circle cx={x2 - minX} cy={y2 - minY} r={13} fill={B.red} stroke={B.redDeep} strokeWidth={4} /> : null}
		</svg>
	);
};

/** Typed text that reveals character by character from `at`. */
export const Typed: React.FC<{text: string; t: number; at: number; cps?: number; style?: React.CSSProperties}> = ({text, t, at, cps = 38, style}) => {
	const nChars = Math.max(0, Math.floor((t - at) * cps));
	if (t < at) return null;
	const caret = nChars < text.length && Math.floor(t * 4) % 2 === 0;
	return (
		<div style={{fontFamily: fonts.mono, color: B.ink, whiteSpace: 'pre-wrap', ...style}}>
			{text.slice(0, nChars)}
			{caret ? '▌' : ''}
		</div>
	);
};

/** Ink stamp in world space (rubber-stamp slam). */
export const BStamp: React.FC<{text: string; x: number; y: number; t: number; at: number; size?: number; rot?: number; color?: string}> = ({text, x, y, t, at, size = 90, rot = -10, color = B.red}) => {
	const p = tween(t, [at, at + 0.14], [0, 1], ease.in);
	if (p <= 0) return null;
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${2 - p})`,
				opacity: 0.9 * p,
				fontFamily: fonts.punch,
				fontWeight: 900,
				fontSize: size,
				letterSpacing: 6,
				color,
				border: `${size * 0.08}px solid ${color}`,
				padding: `0 ${size * 0.25}px`,
				borderRadius: size * 0.1,
				whiteSpace: 'nowrap',
				mixBlendMode: 'multiply',
			}}
		>
			{text}
		</div>
	);
};

/* ------------------------------------------------------------------ cut-out people */

export type CutKind = 'student' | 'guard' | 'prisoner' | 'staff' | 'woman';

/** Paper-cut silhouette (head + shoulders, ~ 200×260 box), white cut edge, a few iconic details. */
export const Cutout: React.FC<{x: number; y: number; s?: number; kind?: CutKind; color?: string; flip?: boolean; glint?: number; label?: string; tilt?: number}> = ({
	x,
	y,
	s = 1,
	kind = 'student',
	color = '#1a1716',
	flip = false,
	glint = 0,
	label,
	tilt = 0,
}) => (
	<div style={{position: 'absolute', left: x - 100 * s, top: y - 260 * s, width: 200 * s, height: 260 * s, transform: `${flip ? 'scaleX(-1) ' : ''}rotate(${tilt}deg)`, transformOrigin: 'bottom center'}}>
		<svg width={200 * s} height={260 * s} viewBox="0 0 200 260" style={{overflow: 'visible'}}>
			<g stroke="#f4efe4" strokeWidth={7} strokeLinejoin="round" fill={color}>
				<path d="M20 260 C22 200 50 170 100 168 C150 170 178 200 180 260 Z" />
				<ellipse cx={100} cy={110} rx={46} ry={56} />
			</g>
			{kind === 'guard' ? (
				<g>
					<path d="M50 78 Q100 36 150 78 L158 92 L42 92 Z" fill={color} stroke="#f4efe4" strokeWidth={6} />
					<rect x={64} y={100} width={30} height={18} rx={6} fill="#9fb7c4" />
					<rect x={106} y={100} width={30} height={18} rx={6} fill="#9fb7c4" />
					<rect x={92} y={106} width={16} height={4} fill="#9fb7c4" />
					{glint > 0 ? <path d="M70 104 l10 0 M112 104 l10 0" stroke="#fff" strokeWidth={4} opacity={glint} /> : null}
					<path d="M60 200 l20 60 M140 200 l-20 60" stroke="#f4efe4" strokeWidth={3} opacity={0.5} />
				</g>
			) : null}
			{kind === 'prisoner' ? (
				<g>
					<path d="M58 80 Q100 48 142 80 L142 92 L58 92 Z" fill="#3b3a40" stroke="#f4efe4" strokeWidth={5} />
					<rect x={70} y={205} width={60} height={30} fill="#f4efe4" />
				</g>
			) : null}
			{kind === 'staff' ? (
				<g>
					<path d="M60 210 L100 250 L140 210" fill="none" stroke="#f4efe4" strokeWidth={5} />
					<rect x={66} y={104} width={28} height={16} rx={8} fill="none" stroke="#f4efe4" strokeWidth={4} />
					<rect x={106} y={104} width={28} height={16} rx={8} fill="none" stroke="#f4efe4" strokeWidth={4} />
				</g>
			) : null}
			{kind === 'woman' ? <path d="M52 112 C48 60 152 60 148 112 L156 170 L44 170 Z" fill={color} stroke="#f4efe4" strokeWidth={6} /> : null}
		</svg>
		{label ? <div style={{position: 'absolute', left: 70 * s, top: 207 * s, width: 60 * s, textAlign: 'center', fontFamily: fonts.mono, fontWeight: 700, fontSize: 18 * s, color: B.ink, transform: flip ? 'scaleX(-1)' : undefined}}>{label}</div> : null}
	</div>
);

/* ------------------------------------------------------------------ screen-space chrome */

/** Torn headline strip for the first seconds. */
export const Headline: React.FC<{t: number; text: string; until?: number}> = ({t, text, until = 3}) => {
	const p = pop(t, 0.05, 0.4);
	const out = rise(t, until, 0.3, ease.in);
	if (out >= 1) return null;
	return (
		<div style={{position: 'absolute', left: 60, right: 60, top: 250, transform: `translateY(${-out * 400}px) rotate(-2deg) scale(${p})`}}>
			<div style={{position: 'absolute', inset: 0, transform: 'translate(12px, 14px)', background: 'rgba(0,0,0,0.5)', clipPath: tornPoly('hl', 18, 3)}} />
			<div style={{position: 'relative', background: B.paper, clipPath: tornPoly('hl', 18, 3), padding: '30px 40px 26px', textAlign: 'center'}}>
				<div style={{fontFamily: fonts.mono, fontSize: 26, letterSpacing: 8, color: B.red, marginBottom: 6}}>THE ARCHIVE · FILE</div>
				<div style={{fontFamily: fonts.serif, fontWeight: 900, fontSize: 78, lineHeight: 1.02, color: B.ink}}>{text}</div>
			</div>
		</div>
	);
};

/** Captions as embossed label-maker tape: one strip per phrase, words punch in as spoken. */
export const TapeCaptions: React.FC<{t: number; timeline: Timeline; y?: number; maxWords?: number}> = ({t, timeline, y = 1320, maxWords = 4}) => {
	const clean = (w: string) => w.toLowerCase().replace(/[^a-z0-9']/g, '');
	type W = {word: string; start: number; end: number; em: boolean; line: number};
	const words: W[] = timeline.lines.flatMap((l) => l.words.map((w) => ({...w, em: l.emphasis.some((e) => clean(e) === clean(w.word)), line: l.index})));
	const pages: W[][] = [];
	let cur: W[] = [];
	words.forEach((w, i) => {
		cur.push(w);
		const nx = words[i + 1];
		if (!nx || cur.length >= maxWords || (/[,.?!:]$/.test(w.word) && cur.length >= 2) || nx.line !== w.line || nx.start - w.end > 0.35) {
			pages.push(cur);
			cur = [];
		}
	});
	const idx = pages.findIndex((p, i) => t >= p[0].start - 0.05 && t < (pages[i + 1]?.[0].start ?? p[p.length - 1].end + 0.6) - 0.05 && t < p[p.length - 1].end + 0.7);
	if (idx < 0) return null;
	const page = pages[idx];
	const rot = (random(`cap${idx}`) - 0.5) * 3;
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<div style={{position: 'absolute', left: 70, right: 160, top: y, display: 'flex', justifyContent: 'center', transform: `translateY(-50%) rotate(${rot}deg)`}}>
				<div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10}}>
					{page.map((w, i) => {
						const on = t >= w.start - 0.04;
						if (!on) return null;
						const hot = t < w.end + 0.05;
						const p = pop(t, w.start - 0.04, 0.18);
						return (
							<span
								key={i}
								style={{
									display: 'inline-block',
									background: w.em ? B.red : '#151316',
									color: hot && !w.em ? B.mustard : '#f4efe4',
									fontFamily: fonts.sans,
									fontWeight: 800,
									fontSize: 66,
									letterSpacing: 3,
									textTransform: 'uppercase',
									padding: '6px 18px 4px',
									borderRadius: 6,
									boxShadow: '6px 8px 0 rgba(0,0,0,0.45), inset 0 3px 0 rgba(255,255,255,0.18), inset 0 -4px 0 rgba(0,0,0,0.4)',
									textShadow: '0 -2px 0 rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.25)',
									transform: `scale(${0.6 + 0.4 * p})`,
								}}
							>
								{w.word}
							</span>
						);
					})}
				</div>
			</div>
		</AbsoluteFill>
	);
};

/** Flashlight vignette + grain: the "searching the archive at night" mood. */
export const ArchiveLight: React.FC<{t: number; strength?: number}> = ({t, strength = 1}) => (
	<>
		<AbsoluteFill style={{pointerEvents: 'none', background: `radial-gradient(ellipse 70% 55% at ${50 + Math.sin(t * 0.4) * 6}% ${42 + Math.cos(t * 0.33) * 5}%, transparent 35%, rgba(8,6,6,${0.78 * strength}) 100%)`}} />
		<Grain opacity={0.1} />
	</>
);

/** Screen-space crack lines that spread from a point. */
export const Crack: React.FC<{t: number; at: number; x?: number; y?: number}> = ({t, at, x = 540, y = 760}) => {
	const p = tween(t, [at, at + 0.5], [0, 1], ease.out);
	const fade = 1 - rise(t, at + 1.3, 0.6);
	if (p <= 0 || fade <= 0) return null;
	const lines = new Array(9).fill(0).map((_, i) => {
		const a = (i / 9) * Math.PI * 2 + random(`ca${i}`) * 0.5;
		let d = `M${x} ${y}`;
		let cx = x;
		let cy = y;
		for (let k = 0; k < 6; k++) {
			const r = 90 + random(`cr${i}${k}`) * 120;
			const aa = a + (random(`cj${i}${k}`) - 0.5) * 0.8;
			cx += Math.cos(aa) * r;
			cy += Math.sin(aa) * r;
			d += ` L${cx} ${cy}`;
		}
		return d;
	});
	return (
		<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, pointerEvents: 'none', opacity: fade}}>
			{lines.map((d, i) => (
				<g key={i}>
					<path d={d} stroke="rgba(0,0,0,0.6)" strokeWidth={10} fill="none" strokeDasharray={1200} strokeDashoffset={1200 * (1 - p)} />
					<path d={d} stroke="rgba(255,255,255,0.85)" strokeWidth={3} fill="none" strokeDasharray={1200} strokeDashoffset={1200 * (1 - p)} />
				</g>
			))}
		</svg>
	);
};
