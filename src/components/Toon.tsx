import React from 'react';
import {Easing, interpolate} from 'remotion';
import {fonts} from '../theme';

/** Flat 2D cartoon kit (video 004+): thick outlines, bold colour, squash & stretch. */
export const OUT = '#1f1b2e';
const SW = 6;

const back = Easing.bezier(0.34, 1.56, 0.64, 1);
/** 0 → 1 with a springy overshoot. */
export const pop = (t: number, at: number, dur = 0.35) => interpolate(t, [at, at + dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: back});

export type Mouth = 'smile' | 'grin' | 'flat' | 'grimace' | 'o' | 'wavy' | 'smirk';
export type ArmPose = 'rest' | 'wave' | 'hold' | 'up' | 'face' | 'point';

export type BeanProps = {
	x: number;
	/** feet y */
	y: number;
	size: number;
	skin?: string;
	shirt?: string;
	pants?: string;
	hair?: string;
	hairStyle?: 'tuft' | 'bob' | 'spiky' | 'bun' | 'none';
	mouth?: Mouth;
	eyes?: number;
	look?: [number, number];
	brows?: number;
	blush?: number;
	sweat?: number;
	arms?: ArmPose;
	mustache?: boolean;
	bowtie?: boolean;
	pelt?: boolean;
	squash?: number;
	rot?: number;
	flip?: boolean;
	headOnly?: boolean;
	children?: React.ReactNode;
};

const ARMS: Record<ArmPose, [[number, number], [number, number], [number, number], [number, number]]> = {
	rest: [[42, 220], [36, 252], [158, 220], [164, 252]],
	wave: [[42, 220], [36, 252], [176, 160], [182, 112]],
	hold: [[48, 230], [72, 214], [152, 230], [128, 214]],
	up: [[26, 160], [26, 112], [174, 160], [174, 112]],
	face: [[30, 170], [56, 128], [170, 170], [144, 128]],
	point: [[42, 220], [36, 252], [176, 176], [196, 150]],
};

export const Bean: React.FC<BeanProps> = ({
	x,
	y,
	size,
	skin = '#ffcfa6',
	shirt = '#4f7cff',
	pants = '#2f3a66',
	hair = '#3b2418',
	hairStyle = 'tuft',
	mouth = 'smile',
	eyes = 1,
	look = [0, 0],
	brows = 0,
	blush = 0,
	sweat = 0,
	arms = 'rest',
	mustache,
	bowtie,
	pelt,
	squash = 0,
	rot = 0,
	flip,
	headOnly,
	children,
}) => {
	const s = size / 300;
	const [le, lh, re, rh] = ARMS[arms];
	const arm = (sx: number, e: [number, number], h: [number, number], k: string) => (
		<g key={k}>
			<path d={`M${sx} 184 Q${e[0]} ${e[1]} ${h[0]} ${h[1]}`} stroke={OUT} strokeWidth={26} fill="none" strokeLinecap="round" />
			<path d={`M${sx} 184 Q${e[0]} ${e[1]} ${h[0]} ${h[1]}`} stroke={shirt} strokeWidth={14} fill="none" strokeLinecap="round" />
			<circle cx={h[0]} cy={h[1]} r={13} fill={skin} stroke={OUT} strokeWidth={SW} />
		</g>
	);
	const eye = (cx: number) => (
		<g key={cx}>
			{eyes > 0.15 ? (
				<>
					<ellipse cx={cx} cy={92} rx={14} ry={16 * eyes} fill="#fff" stroke={OUT} strokeWidth={4} />
					<circle cx={cx + look[0] * 5} cy={92 + look[1] * 5} r={Math.min(7, 7 * eyes + 1)} fill={OUT} />
				</>
			) : (
				<path d={`M${cx - 13} 94 Q${cx} 102 ${cx + 13} 94`} stroke={OUT} strokeWidth={4.5} fill="none" strokeLinecap="round" />
			)}
		</g>
	);
	const mouths: Record<Mouth, React.ReactNode> = {
		smile: <path d="M82 122 Q100 140 118 122" stroke={OUT} strokeWidth={5} fill="none" strokeLinecap="round" />,
		grin: <path d="M76 116 Q100 152 124 116 Z" fill="#6b1f30" stroke={OUT} strokeWidth={5} strokeLinejoin="round" />,
		flat: <path d="M86 128 L114 128" stroke={OUT} strokeWidth={5} strokeLinecap="round" />,
		grimace: (
			<g>
				<rect x={72} y={114} width={56} height={24} rx={9} fill="#fff" stroke={OUT} strokeWidth={5} />
				{[86, 100, 114].map((lx) => (
					<line key={lx} x1={lx} y1={116} x2={lx} y2={136} stroke={OUT} strokeWidth={3} />
				))}
				<line x1={74} y1={126} x2={126} y2={126} stroke={OUT} strokeWidth={3} />
			</g>
		),
		o: <ellipse cx={100} cy={128} rx={10} ry={14} fill="#6b1f30" stroke={OUT} strokeWidth={5} />,
		wavy: <path d="M78 128 q5.5 -7 11 0 t11 0 t11 0 t11 0" stroke={OUT} strokeWidth={5} fill="none" strokeLinecap="round" />,
		smirk: <path d="M84 126 Q104 134 120 118" stroke={OUT} strokeWidth={5} fill="none" strokeLinecap="round" />,
	};
	const hairs: Record<string, React.ReactNode> = {
		tuft: <path d="M60 52 Q80 18 112 28 Q104 10 132 22 Q150 32 142 52 Q120 40 96 46 Q76 50 60 52 Z" fill={hair} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />,
		bob: <path d="M36 104 Q30 30 100 26 Q170 30 164 104 L150 104 Q146 60 100 56 Q54 60 50 104 Z" fill={hair} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />,
		spiky: <path d="M48 70 L56 34 L72 54 L84 22 L100 50 L116 20 L128 52 L146 32 L152 70 Q100 50 48 70 Z" fill={hair} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />,
		bun: (
			<g>
				<circle cx={100} cy={26} r={20} fill={hair} stroke={OUT} strokeWidth={SW} />
				<path d="M42 84 Q44 34 100 32 Q156 34 158 84 Q130 56 100 58 Q70 56 42 84 Z" fill={hair} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
			</g>
		),
		none: null,
	};
	return (
		<div style={{position: 'absolute', left: x - (200 * s) / 2, top: y - 300 * s, width: 200 * s, height: 300 * s, transformOrigin: '50% 100%', transform: `rotate(${rot}deg) scale(${(1 + squash * 0.12) * (flip ? -1 : 1)}, ${1 - squash * 0.12})`}}>
			<svg viewBox="0 0 200 300" width={200 * s} height={300 * s} style={{overflow: 'visible', display: 'block'}}>
				{!headOnly ? (
					<g>
						{[68, 106].map((lx) => (
							<rect key={lx} x={lx} y={258} width={26} height={32} rx={10} fill={pants} stroke={OUT} strokeWidth={SW} />
						))}
						<ellipse cx={80} cy={294} rx={21} ry={9} fill={OUT} />
						<ellipse cx={120} cy={294} rx={21} ry={9} fill={OUT} />
						{arms === 'face' || arms === 'up' ? null : [arm(52, le, lh, 'l'), arm(148, re, rh, 'r')]}
						<path d="M46 178 Q46 150 72 148 L128 148 Q154 150 154 178 L162 260 Q162 272 150 272 L50 272 Q38 272 38 260 Z" fill={shirt} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
						{pelt ? <path d="M46 180 L154 230 L160 262 L40 262 Z" fill="#c98a3d" stroke={OUT} strokeWidth={5} strokeLinejoin="round" /> : null}
						{pelt ? [70, 110, 140].map((px) => <circle key={px} cx={px} cy={px === 110 ? 246 : 236} r={6} fill="#7a4a1c" />) : null}
						{bowtie ? <path d="M84 156 L100 166 L116 156 L116 176 L100 166 L84 176 Z" fill="#e23b4e" stroke={OUT} strokeWidth={4} strokeLinejoin="round" /> : null}
					</g>
				) : null}
				<circle cx={36} cy={96} r={12} fill={skin} stroke={OUT} strokeWidth={SW} />
				<circle cx={164} cy={96} r={12} fill={skin} stroke={OUT} strokeWidth={SW} />
				<circle cx={100} cy={92} r={64} fill={skin} stroke={OUT} strokeWidth={SW} />
				{hairs[hairStyle]}
				{blush > 0 ? (
					<g opacity={blush}>
						<ellipse cx={62} cy={116} rx={15} ry={8} fill="#ff5d7e" />
						<ellipse cx={138} cy={116} rx={15} ry={8} fill="#ff5d7e" />
					</g>
				) : null}
				<path d={`M66 ${70 - brows * 4} L90 ${70 + brows * 5}`} stroke={OUT} strokeWidth={5} strokeLinecap="round" />
				<path d={`M134 ${70 - brows * 4} L110 ${70 + brows * 5}`} stroke={OUT} strokeWidth={5} strokeLinecap="round" />
				{eye(78)}
				{eye(122)}
				{mustache ? <path d="M70 116 Q86 104 100 114 Q114 104 130 116 Q116 124 100 118 Q84 124 70 116 Z" fill={hair} stroke={OUT} strokeWidth={4} /> : null}
				{mouths[mouth]}
				{sweat > 0 ? <path d="M166 40 Q178 62 166 70 Q154 62 166 40 Z" fill="#7fd3ff" stroke={OUT} strokeWidth={4} opacity={sweat} transform={`translate(0 ${sweat * 6})`} /> : null}
				{!headOnly && (arms === 'face' || arms === 'up') ? [arm(52, le, lh, 'l'), arm(148, re, rh, 'r')] : null}
				{children}
			</svg>
		</div>
	);
};

/** The mischievous brain. */
export const Brain: React.FC<{x: number; y: number; size: number; mouth?: Mouth; look?: [number, number]; brows?: number; eyes?: number; glasses?: boolean; rot?: number; squash?: number}> = ({
	x,
	y,
	size,
	mouth = 'grin',
	look = [0, 0],
	brows = 0.6,
	eyes = 1,
	glasses,
	rot = 0,
	squash = 0,
}) => {
	const blobs: [number, number, number][] = [
		[52, 104, 44],
		[88, 70, 50],
		[152, 70, 50],
		[188, 104, 44],
		[84, 134, 44],
		[156, 134, 44],
		[120, 120, 50],
	];
	const s = size / 240;
	const M: Record<string, React.ReactNode> = {
		grin: <path d="M96 140 Q120 170 144 140 Z" fill="#6b1f30" stroke={OUT} strokeWidth={5} strokeLinejoin="round" />,
		smirk: <path d="M100 146 Q124 154 144 136" stroke={OUT} strokeWidth={5} fill="none" strokeLinecap="round" />,
		o: <ellipse cx={120} cy={146} rx={9} ry={12} fill="#6b1f30" stroke={OUT} strokeWidth={5} />,
		flat: <path d="M106 146 L134 146" stroke={OUT} strokeWidth={5} strokeLinecap="round" />,
		smile: <path d="M102 140 Q120 158 138 140" stroke={OUT} strokeWidth={5} fill="none" strokeLinecap="round" />,
	};
	return (
		<div style={{position: 'absolute', left: x - (240 * s) / 2, top: y - 200 * s, width: 240 * s, height: 200 * s, transformOrigin: '50% 100%', transform: `rotate(${rot}deg) scale(${1 + squash * 0.12}, ${1 - squash * 0.12})`}}>
			<svg viewBox="0 0 240 200" width={240 * s} height={200 * s} style={{overflow: 'visible', display: 'block'}}>
				{blobs.map(([cx, cy, r], i) => (
					<circle key={`o${i}`} cx={cx} cy={cy} r={r + SW / 2} fill={OUT} />
				))}
				{blobs.map(([cx, cy, r], i) => (
					<circle key={`f${i}`} cx={cx} cy={cy} r={r - SW / 2} fill="#ff9fb8" />
				))}
				{['M120 30 Q110 52 122 70', 'M62 62 Q76 50 92 60', 'M150 58 Q166 48 182 62', 'M30 104 Q42 94 56 104', 'M186 98 Q200 92 210 104', 'M60 150 Q72 142 84 154', 'M160 154 Q172 142 186 150'].map((d) => (
					<path key={d} d={d} stroke="#e0607f" strokeWidth={5} fill="none" strokeLinecap="round" />
				))}
				<path d={`M84 ${88 - brows * 6} L110 ${92 + brows * 4}`} stroke={OUT} strokeWidth={5} strokeLinecap="round" />
				<path d={`M156 ${88 - brows * 6} L130 ${92 + brows * 4}`} stroke={OUT} strokeWidth={5} strokeLinecap="round" />
				{[100, 140].map((cx) => (
					<g key={cx}>
						<ellipse cx={cx} cy={112} rx={15} ry={17 * eyes} fill="#fff" stroke={OUT} strokeWidth={4} />
						<circle cx={cx + look[0] * 5} cy={112 + look[1] * 5} r={7} fill={OUT} />
					</g>
				))}
				{glasses ? (
					<g fill="none" stroke={OUT} strokeWidth={4}>
						<circle cx={100} cy={112} r={21} />
						<circle cx={140} cy={112} r={21} />
						<path d="M121 112 L119 112" />
					</g>
				) : null}
				{M[mouth] ?? M.grin}
			</svg>
		</div>
	);
};

/** Comic speech bubble (tail points down-left or down-right). */
export const Speech: React.FC<{x: number; y: number; text: string; p: number; tail?: 'left' | 'right' | 'none'; size?: number; color?: string; maxWidth?: number; rot?: number}> = ({
	x,
	y,
	text,
	p,
	tail = 'left',
	size = 52,
	color = '#fff',
	maxWidth = 640,
	rot = 0,
}) => {
	if (p <= 0) return null;
	return (
		<div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -100%) scale(${p}) rotate(${rot}deg)`, transformOrigin: tail === 'right' ? '80% 120%' : '20% 120%'}}>
			<div style={{position: 'relative', background: color, border: `6px solid ${OUT}`, borderRadius: 40, padding: '18px 34px', fontFamily: fonts.round, fontWeight: 700, fontSize: size, color: OUT, lineHeight: 1.12, maxWidth, textAlign: 'center', boxShadow: `0 8px 0 ${OUT}`}}>
				{text}
				{tail !== 'none' ? (
					<svg width={60} height={50} style={{position: 'absolute', bottom: -44, [tail]: 50, overflow: 'visible'}}>
						<path d={tail === 'left' ? 'M4 0 L10 44 L44 0' : 'M56 0 L50 44 L16 0'} fill={color} stroke={OUT} strokeWidth={6} strokeLinejoin="round" />
						<rect x={tail === 'left' ? 8 : 20} y={-8} width={32} height={10} fill={color} />
					</svg>
				) : null}
			</div>
		</div>
	);
};

/** Thought cloud. */
export const Cloud: React.FC<{x: number; y: number; w: number; h: number; p: number; children?: React.ReactNode; tailTo?: [number, number]}> = ({x, y, w, h, p, children, tailTo}) => {
	if (p <= 0) return null;
	const puffs: [number, number, number][] = [
		[0.2, 0.5, 0.26],
		[0.42, 0.3, 0.3],
		[0.66, 0.32, 0.28],
		[0.82, 0.55, 0.24],
		[0.6, 0.72, 0.28],
		[0.34, 0.72, 0.26],
	];
	const R = Math.min(w, h);
	return (
		<>
			{tailTo
				? [0.25, 0.5, 0.72].map((f, i) => (
						<div key={i} style={{position: 'absolute', left: tailTo[0] + (x - tailTo[0]) * f, top: tailTo[1] + (y + h / 2 - tailTo[1]) * f, width: 18 + i * 12, height: 18 + i * 12, marginLeft: -(9 + i * 6), borderRadius: '50%', background: '#fff', border: `5px solid ${OUT}`, transform: `scale(${p})`}} />
					))
				: null}
			<div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `scale(${p})`}}>
				<svg width={w} height={h} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
					{puffs.map(([px, py, pr], i) => (
						<circle key={`o${i}`} cx={px * w} cy={py * h} r={pr * R + 6} fill={OUT} />
					))}
					{puffs.map(([px, py, pr], i) => (
						<circle key={`f${i}`} cx={px * w} cy={py * h} r={pr * R - 1} fill="#fff" />
					))}
					<ellipse cx={w / 2} cy={h / 2} rx={w * 0.36} ry={h * 0.3} fill="#fff" />
				</svg>
				<div style={{position: 'absolute', inset: '14% 12%', overflow: 'hidden', borderRadius: 30}}>{children}</div>
			</div>
		</>
	);
};

/** Big outlined label (stamp / meme text). */
export const Punch: React.FC<{text: string; x?: number; y: number; size: number; color?: string; stroke?: number; p?: number; rot?: number; family?: 'punch' | 'round'; width?: number}> = ({
	text,
	x = 540,
	y,
	size,
	color = '#fff',
	stroke = 12,
	p = 1,
	rot = 0,
	family = 'punch',
	width = 960,
}) =>
	p <= 0 ? null : (
		<div
			style={{
				position: 'absolute',
				left: x - width / 2,
				width,
				top: y,
				textAlign: 'center',
				fontFamily: family === 'punch' ? fonts.punch : fonts.round,
				fontWeight: family === 'punch' ? 900 : 700,
				fontSize: size,
				lineHeight: 1.02,
				color,
				WebkitTextStroke: `${stroke}px ${OUT}`,
				paintOrder: 'stroke fill',
				textShadow: `0 ${stroke * 0.7}px 0 ${OUT}`,
				transform: `scale(${p}) rotate(${rot}deg)`,
				transformOrigin: '50% 50%',
				letterSpacing: '0.01em',
			}}
		>
			{text}
		</div>
	);
