import React from 'react';

/**
 * Editorial 2.5D character (300 × 900 box, feet at y≈880). Minimal but expressive:
 * clothing, hair and skin are flat-shaded with a soft key/fill split and a rim light;
 * the face is reduced to brows, eyes, a nose shadow and a mouth curve.
 */
export type Look = {
	skin: string;
	hair: string;
	coat: string;
	inner: string;
	trousers: string;
	hairStyle: 'swept' | 'long' | 'bun' | 'crop';
};

export const MAIN_LOOK: Look = {skin: '#c99a7c', hair: '#1c1714', coat: '#bfa98a', inner: '#232226', trousers: '#2a2a30', hairStyle: 'swept'};

export type Pose = 'down' | 'crossed' | 'phone' | 'pockets';

export type PersonProps = {
	x: number;
	/** Feet y. */
	y: number;
	height: number;
	t: number;
	look?: Look;
	view?: 'front' | 'back';
	pose?: Pose;
	stride?: number;
	/** -1 frown … 0 neutral … 1 smile. */
	smile?: number;
	/** 0 relaxed … 1 tense brows. */
	tension?: number;
	/** Head tilt in degrees (+ = chin up/right). */
	tilt?: number;
	/** 0 … 1 head lowered. */
	headDown?: number;
	/** Eye direction -1 … 1. */
	look_x?: number;
	features?: boolean;
	rim?: string;
	rimStrength?: number;
	/** Warm outline glow (attention). */
	glow?: number;
	glowColor?: string;
	shade?: number;
	opacity?: number;
	blur?: number;
	shadow?: boolean;
	style?: React.CSSProperties;
};

const HAIR: Record<Look['hairStyle'], {front: string; back: string}> = {
	swept: {
		front: 'M106 92 C100 46 128 22 160 25 C192 28 204 56 196 96 C192 76 186 64 168 60 C146 56 128 50 118 66 C112 74 108 82 106 92 Z',
		back: 'M104 96 C98 46 128 22 160 25 C194 28 206 58 196 100 C196 124 186 140 150 142 C116 140 104 124 104 96 Z',
	},
	long: {
		front: 'M104 100 C96 44 128 22 152 24 C182 24 206 46 198 100 L204 200 C196 210 188 206 186 196 L184 92 C176 70 160 62 140 62 C124 64 118 76 116 96 L114 196 C112 208 102 210 96 200 Z',
		back: 'M100 100 C94 44 128 22 152 24 C184 24 208 46 200 100 L206 205 C180 216 120 216 94 205 Z',
	},
	bun: {
		front: 'M106 94 C102 52 126 32 152 32 C180 32 200 52 194 94 C188 74 176 62 150 62 C126 62 112 74 106 94 Z M134 30 C134 8 166 8 166 30 C166 42 134 42 134 30 Z',
		back: 'M104 98 C100 50 126 32 152 32 C180 32 202 52 196 98 C194 128 180 140 150 140 C120 140 106 128 104 98 Z M134 30 C134 8 166 8 166 30 C166 42 134 42 134 30 Z',
	},
	crop: {
		front: 'M108 86 C104 50 128 34 152 34 C178 34 198 50 194 86 C186 70 170 62 150 62 C130 62 114 70 108 86 Z',
		back: 'M106 92 C102 50 128 34 152 34 C178 34 200 50 196 92 C196 120 184 134 150 134 C118 134 106 120 106 92 Z',
	},
};

const ARMS: Record<Pose, {sleeves: string[]; hands: [number, number][]}> = {
	down: {
		sleeves: ['M72 196 C56 206 52 232 52 254 L44 470 C44 490 66 494 70 476 L86 300 Z', 'M228 196 C244 206 248 232 248 254 L256 470 C256 490 234 494 230 476 L214 300 Z'],
		hands: [[56, 490], [244, 490]],
	},
	pockets: {
		sleeves: ['M72 196 C56 206 52 232 52 254 L50 418 C54 436 74 436 78 422 L86 300 Z', 'M228 196 C244 206 248 232 248 254 L250 418 C246 436 226 436 222 422 L214 300 Z'],
		hands: [],
	},
	crossed: {
		sleeves: [
			'M72 196 C54 214 52 262 58 326 L88 330 L90 240 Z',
			'M228 196 C246 214 248 262 242 326 L212 330 L210 240 Z',
			'M60 300 C60 286 76 282 92 284 L222 300 C238 302 244 316 240 330 C236 344 222 348 208 346 L80 332 C66 330 60 316 60 300 Z',
		],
		hands: [[84, 300], [226, 336]],
	},
	phone: {
		sleeves: ['M72 196 C56 206 52 232 52 254 L44 470 C44 490 66 494 70 476 L86 300 Z', 'M228 196 C246 220 250 276 242 330 L216 334 L212 240 Z', 'M244 318 C248 336 236 348 222 344 L170 304 C162 294 172 280 184 286 Z'],
		hands: [[56, 490], [172, 294]],
	},
};

export const Person: React.FC<PersonProps> = ({
	x,
	y,
	height,
	t,
	look = MAIN_LOOK,
	view = 'front',
	pose = 'down',
	stride = 0,
	smile = 0.2,
	tension = 0,
	tilt = 0,
	headDown = 0,
	look_x = 0,
	features = true,
	rim = '#e8b877',
	rimStrength = 0.8,
	glow = 0,
	glowColor = '#e0a957',
	shade = 0.5,
	opacity = 1,
	blur = 0,
	shadow = true,
	style,
}) => {
	const uid = React.useId().replace(/:/g, '');
	const s = height / 900;
	const w = 300 * s;
	const breathe = Math.sin(t * 1.7) * 1.4;
	const l = stride * 34;
	const r = -stride * 34;
	const back = view === 'back';
	const arms = ARMS[back && pose === 'phone' ? 'down' : pose];

	const legs = [
		`M86 556 L148 556 L${146 + l * 0.9} 862 L${110 + l} 862 Z`,
		`M152 556 L214 556 L${190 + r} 862 L${154 + r * 0.9} 862 Z`,
	];
	const shoes = [`M${104 + l} 856 h46 v14 q0 10 -10 10 h-40 q-10 0 -6 -12 Z`, `M${150 + r} 856 h46 v14 q0 10 -10 10 h-40 q-10 0 -6 -12 Z`];
	const torso = 'M118 168 L182 168 C214 180 228 196 230 230 L222 560 L78 560 L70 230 C72 196 86 180 118 168 Z';
	const coatL = 'M114 170 C84 180 66 196 64 236 L56 604 C80 612 110 612 132 604 L134 332 L122 222 Z';
	const coatR = 'M186 170 C216 180 234 196 236 236 L244 604 C220 612 190 612 168 604 L166 332 L178 222 Z';
	const coatBack = 'M114 170 C84 180 66 196 64 236 L56 604 C120 618 180 618 244 604 L236 236 C234 196 216 180 186 170 Z';
	const headRot = tilt + headDown * 14;

	const headGroup = (fill?: string) => (
		<g transform={`translate(150 ${150 + headDown * 6}) rotate(${-headRot * 0.4}) translate(-150 -150)`}>
			<rect x={134} y={120} width={32} height={56} rx={10} fill={fill ?? look.skin} />
			<ellipse cx={108} cy={104} rx={8} ry={13} fill={fill ?? look.skin} />
			<ellipse cx={192} cy={104} rx={8} ry={13} fill={fill ?? look.skin} />
			<ellipse cx={150} cy={98} rx={42} ry={54} fill={fill ?? look.skin} />
			<path d={HAIR[look.hairStyle][back ? 'back' : 'front']} fill={fill ?? look.hair} />
			{!fill && !back && features ? (
				<g>
					{/* brows */}
					<path d={`M126 ${84 + tension * 2} Q135 ${79 + tension * 3} 143 ${82 + tension * 4}`} stroke={look.hair} strokeWidth={3.2} fill="none" strokeLinecap="round" />
					<path d={`M157 ${82 + tension * 4} Q165 ${79 + tension * 3} 174 ${84 + tension * 2}`} stroke={look.hair} strokeWidth={3.2} fill="none" strokeLinecap="round" />
					{/* eyes */}
					<ellipse cx={135 + look_x * 3} cy={97} rx={4.6} ry={3.1 - tension * 0.6} fill="#1a1412" />
					<ellipse cx={165 + look_x * 3} cy={97} rx={4.6} ry={3.1 - tension * 0.6} fill="#1a1412" />
					{/* nose shadow */}
					<path d="M151 102 L147 120 Q151 123 156 120" stroke="rgba(80,45,30,0.35)" strokeWidth={2.2} fill="none" strokeLinecap="round" />
					{/* mouth */}
					<path d={`M${139 - smile * 2} 133 Q150 ${133 + smile * 7} ${161 + smile * 2} 133`} stroke="#6e3b30" strokeWidth={2.8} fill="none" strokeLinecap="round" />
				</g>
			) : null}
		</g>
	);

	const body = (fill?: string) => (
		<g>
			{legs.map((d, i) => (
				<path key={`l${i}`} d={d} fill={fill ?? look.trousers} />
			))}
			{shoes.map((d, i) => (
				<path key={`s${i}`} d={d} fill={fill ?? '#141316'} />
			))}
			<path d={torso} fill={fill ?? look.inner} />
			{back ? <path d={coatBack} fill={fill ?? look.coat} /> : (
				<>
					<path d={coatL} fill={fill ?? look.coat} />
					<path d={coatR} fill={fill ?? look.coat} />
				</>
			)}
			{!back && !fill ? (
				<g>
					<path d="M122 222 L134 332 L132 604" stroke="rgba(0,0,0,0.28)" strokeWidth={5} fill="none" />
					<path d="M178 222 L166 332 L168 604" stroke="rgba(0,0,0,0.28)" strokeWidth={5} fill="none" />
					<path d="M114 172 L124 224 L136 330" stroke="rgba(255,240,220,0.22)" strokeWidth={2} fill="none" />
					<path d="M186 172 L176 224 L164 330" stroke="rgba(255,240,220,0.22)" strokeWidth={2} fill="none" />
				</g>
			) : null}
			{!back ? <rect x={124} y={150} width={52} height={30} rx={12} fill={fill ?? look.inner} /> : null}
			{(pose === 'phone' && !back ? [...arms.sleeves].reverse() : arms.sleeves).map((d, i) => (
				<path key={`a${i}`} d={d} fill={fill ?? look.coat} stroke={fill ? undefined : 'rgba(0,0,0,0.12)'} strokeWidth={1} />
			))}
			{arms.hands.map(([hx, hy], i) => (
				<ellipse key={`h${i}`} cx={hx} cy={hy} rx={11} ry={16} fill={fill ?? look.skin} />
			))}
			{pose === 'phone' && !back && !fill ? (
				<g transform="rotate(-18 176 268)">
					<rect x={160} y={236} width={34} height={62} rx={6} fill="#0d0d10" />
					<rect x={163} y={240} width={28} height={54} rx={4} fill="#dfe6ff" opacity={0.85} />
				</g>
			) : null}
			{headGroup(fill)}
		</g>
	);

	return (
		<div style={{position: 'absolute', left: x - w / 2, top: y - height, width: w, height, opacity, filter: blur ? `blur(${blur}px)` : undefined, ...style}}>
			{shadow ? <div style={{position: 'absolute', left: -w * 0.25, width: w * 1.5, top: height - 30, height: 40, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(0,0,0,0.55), transparent)'}} /> : null}
			<svg
				viewBox="0 0 300 900"
				width={w}
				height={height}
				style={{
					overflow: 'visible',
					display: 'block',
					filter: glow > 0.01 ? `drop-shadow(0 0 ${6 * glow}px ${glowColor}) drop-shadow(0 0 ${22 * glow}px ${glowColor})` : undefined,
				}}
			>
				<defs>
					<mask id={`pc${uid}`} maskUnits="userSpaceOnUse" x={-200} y={-200} width={700} height={1300}>{body('#fff')}</mask>
					<mask id={`pr${uid}`} maskUnits="userSpaceOnUse" x={-200} y={-200} width={700} height={1300}>
						{body('#fff')}
						<g transform="translate(-5 2)">{body('#000')}</g>
					</mask>
					<linearGradient id={`ps${uid}`} x1="0" y1="0" x2="1" y2="0">
						<stop offset="0%" stopColor="#000" stopOpacity={shade} />
						<stop offset="55%" stopColor="#000" stopOpacity={shade * 0.15} />
						<stop offset="100%" stopColor="#000" stopOpacity={0} />
					</linearGradient>
					<linearGradient id={`pv${uid}`} x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor="#fff" stopOpacity={0.08} />
						<stop offset="60%" stopColor="#000" stopOpacity={0} />
						<stop offset="100%" stopColor="#000" stopOpacity={0.35} />
					</linearGradient>
				</defs>
				<g transform={`translate(0 ${breathe * 0.4})`}>
					{body()}
					<g mask={`url(#pc${uid})`}>
						<rect x={0} y={0} width={300} height={900} fill={`url(#ps${uid})`} />
						<rect x={0} y={0} width={300} height={900} fill={`url(#pv${uid})`} />
					</g>
					{/* rim light on the lit (right) edge: silhouette minus an offset silhouette */}
					<g mask={`url(#pr${uid})`} opacity={rimStrength}>
						{body(rim)}
					</g>
				</g>
			</svg>
		</div>
	);
};
