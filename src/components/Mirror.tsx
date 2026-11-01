import React from 'react';
import {random} from 'remotion';

export type Crack = {
	/** Impact point, relative 0…1 within the glass. */
	cx: number;
	cy: number;
	/** 0…1 growth. */
	p: number;
	/** Radius in px. */
	r: number;
	seed: string;
	/** 0 = white glass fracture, 1 = blood-red tension. */
	red?: number;
	branches?: number;
};

/** Deterministic radial fracture: jagged branches plus two broken rings. */
export const crackPaths = (c: Crack, w: number, h: number) => {
	const ox = c.cx * w;
	const oy = c.cy * h;
	const n = c.branches ?? 9;
	const branches: string[] = [];
	const tips: [number, number][][] = [];
	for (let i = 0; i < n; i++) {
		const base = (i / n) * Math.PI * 2 + (random(`${c.seed}a${i}`) - 0.5) * 0.5;
		const len = c.r * (0.55 + random(`${c.seed}l${i}`) * 0.55);
		let x = ox;
		let y = oy;
		let a = base;
		const pts: [number, number][] = [[x, y]];
		const segs = 6;
		for (let k = 1; k <= segs; k++) {
			a += (random(`${c.seed}j${i}${k}`) - 0.5) * 0.7;
			x += Math.cos(a) * (len / segs);
			y += Math.sin(a) * (len / segs);
			pts.push([x, y]);
		}
		tips.push(pts);
		branches.push(pts.map(([px, py], k) => `${k ? 'L' : 'M'}${px.toFixed(1)} ${py.toFixed(1)}`).join(' '));
	}
	const rings = [2, 4].map((idx) =>
		tips
			.map((pts, i) => {
				const [x1, y1] = pts[idx];
				const [x2, y2] = tips[(i + 1) % n][idx];
				const mx = (x1 + x2) / 2 + (random(`${c.seed}r${idx}${i}`) - 0.5) * 18;
				const my = (y1 + y2) / 2 + (random(`${c.seed}s${idx}${i}`) - 0.5) * 18;
				return `M${x1.toFixed(1)} ${y1.toFixed(1)} L${mx.toFixed(1)} ${my.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}`;
			})
			.join(' '),
	);
	return {branches, rings, ox, oy};
};

export const Cracks: React.FC<{cracks: Crack[]; w: number; h: number}> = ({cracks, w, h}) => (
	<svg width={w} height={h} style={{position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none'}}>
		{cracks
			.filter((c) => c.p > 0.001)
			.map((c) => {
				const {branches, rings, ox, oy} = crackPaths(c, w, h);
				const red = c.red ?? 0;
				const col = `rgb(${Math.round(245 - red * 60)},${Math.round(240 - red * 190)},${Math.round(232 - red * 185)})`;
				return (
					<g key={c.seed}>
						{branches.map((d, i) => (
							<g key={i}>
								<path d={d} stroke={`rgba(180,30,40,${0.5 * red})`} strokeWidth={6} fill="none" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - c.p} style={{filter: 'blur(3px)'}} />
								<path d={d} stroke={col} strokeOpacity={0.9} strokeWidth={1.6} fill="none" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - c.p} />
							</g>
						))}
						{rings.map((d, i) => (
							<path key={`r${i}`} d={d} stroke={col} strokeOpacity={0.7 * Math.max(0, (c.p - 0.35 - i * 0.2) / 0.45)} strokeWidth={1.2} fill="none" />
						))}
						<circle cx={ox} cy={oy} r={3 + c.p * 5} fill={col} opacity={0.9} />
					</g>
				);
			})}
	</svg>
);

export type MirrorProps = {
	/** Centre x, bottom y. */
	x: number;
	y: number;
	w: number;
	h: number;
	t: number;
	/** 0 = facing camera … 1 = edge-on (reveals thinness). */
	turn?: number;
	frame?: string;
	cracks?: Crack[];
	/** Reflection content, laid out in a w × h box. */
	children?: React.ReactNode;
	glare?: number;
	stand?: boolean;
	style?: React.CSSProperties;
};

/** Arched mirror with brass frame, moving glare, reflections and procedural cracks. */
export const Mirror: React.FC<MirrorProps> = ({x, y, w, h, t, turn = 0, frame = '#c79a5b', cracks = [], children, glare = 1, stand = false, style}) => {
	const sx = Math.max(0.035, Math.cos((turn * Math.PI) / 2));
	const edge = Math.min(1, turn * 1.4);
	const arch = `${w / 2}px ${w / 2}px 10px 10px`;
	const band = ((t * 0.12) % 1.6) - 0.3;
	return (
		<div style={{position: 'absolute', left: x - w / 2, top: y - h, width: w, height: h, transform: `scaleX(${sx})`, ...style}}>
			{stand ? (
				<>
					<div style={{position: 'absolute', left: w * 0.18, bottom: -60, width: 8, height: 90, background: frame, opacity: 0.6, transform: 'rotate(18deg)'}} />
					<div style={{position: 'absolute', right: w * 0.18, bottom: -60, width: 8, height: 90, background: frame, opacity: 0.6, transform: 'rotate(-18deg)'}} />
				</>
			) : null}
			{/* frame */}
			<div style={{position: 'absolute', inset: -14, borderRadius: `${w / 2 + 14}px ${w / 2 + 14}px 16px 16px`, background: `linear-gradient(135deg, #f1d39b 0%, ${frame} 35%, #6d4b25 70%, #e8c487 100%)`, boxShadow: '0 40px 90px rgba(0,0,0,0.6)'}} />
			{/* glass */}
			<div style={{position: 'absolute', inset: 0, borderRadius: arch, overflow: 'hidden', background: 'linear-gradient(180deg, #2b2b31 0%, #1a1a1f 70%, #121216 100%)'}}>
				{children}
				{/* silvering + glare */}
				<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,240,220,0.06), transparent 40%, rgba(0,0,0,0.25))'}} />
				<div
					style={{
						position: 'absolute',
						left: `${band * 100}%`,
						top: '-20%',
						width: '28%',
						height: '140%',
						transform: 'rotate(18deg)',
						background: 'linear-gradient(90deg, transparent, rgba(255,245,225,0.13), transparent)',
						opacity: glare,
					}}
				/>
				<Cracks cracks={cracks} w={w} h={h} />
			</div>
			{/* edge-on: the glass is paper thin */}
			<div style={{position: 'absolute', inset: 0, borderRadius: arch, boxShadow: `inset 0 0 0 ${2 + edge * 3}px rgba(255,236,205,${0.25 + edge * 0.7})`, opacity: edge}} />
		</div>
	);
};
