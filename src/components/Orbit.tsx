import React from 'react';
import {fonts} from '../theme';

export type Fragment = {
	ring: number;
	phase: number;
	kind: 'bubble' | 'shard' | 'dot';
	text?: string;
	size?: number;
};

export type Ring = {cy: number; rx: number; ry: number; speed: number};

type Placed = {f: Fragment; x: number; y: number; depth: number};

/** Positions fragments on tilted elliptical orbits; depth ∈ [-1 back … 1 front]. */
export const placeFragments = (fragments: Fragment[], rings: Ring[], t: number, cx: number, squeeze = 1): Placed[] =>
	fragments.map((f) => {
		const r = rings[f.ring];
		const a = f.phase + t * r.speed;
		return {f, x: cx + Math.cos(a) * r.rx * squeeze, y: r.cy + Math.sin(a) * r.ry * squeeze, depth: Math.sin(a)};
	});

const FragmentView: React.FC<{p: Placed; frozen?: number; tint?: string}> = ({p, tint = '185,174,230'}) => {
	const s = 0.62 + 0.38 * ((p.depth + 1) / 2);
	const o = 0.28 + 0.72 * ((p.depth + 1) / 2);
	const base: React.CSSProperties = {position: 'absolute', left: p.x, top: p.y, transform: `translate(-50%,-50%) scale(${s * (p.f.size ?? 1)})`, opacity: o};
	if (p.f.kind === 'dot') {
		return <div style={{...base, width: 10, height: 10, borderRadius: 5, background: `rgb(${tint})`, boxShadow: `0 0 14px rgb(${tint})`}} />;
	}
	if (p.f.kind === 'shard') {
		return (
			<div
				style={{
					...base,
					width: 120,
					height: 22,
					borderRadius: 6,
					background: `linear-gradient(90deg, rgba(${tint},0.05), rgba(${tint},0.45), rgba(${tint},0.05))`,
					border: `1px solid rgba(${tint},0.3)`,
					transform: `${base.transform} rotate(${p.f.phase * 57}deg)`,
				}}
			/>
		);
	}
	return (
		<div
			style={{
				...base,
				fontFamily: fonts.sans,
				fontWeight: 500,
				fontSize: 32,
				whiteSpace: 'nowrap',
				color: '#e6e1f7',
				padding: '12px 22px',
				borderRadius: 24,
				background: 'linear-gradient(160deg, rgba(58,48,104,0.85), rgba(24,20,48,0.85))',
				border: `1px solid rgba(${tint},0.25)`,
				boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
			}}
		>
			{p.f.text}
		</div>
	);
};

/** Back half of the orbit (render before the character). */
export const OrbitBack: React.FC<{placed: Placed[]; tint?: string}> = ({placed, tint}) => (
	<>
		{placed
			.filter((p) => p.depth < 0)
			.sort((a, b) => a.depth - b.depth)
			.map((p, i) => (
				<FragmentView key={i} p={p} tint={tint} />
			))}
	</>
);

/** Front half of the orbit (render after the character). */
export const OrbitFront: React.FC<{placed: Placed[]; tint?: string}> = ({placed, tint}) => (
	<>
		{placed
			.filter((p) => p.depth >= 0)
			.sort((a, b) => a.depth - b.depth)
			.map((p, i) => (
				<FragmentView key={i} p={p} tint={tint} />
			))}
	</>
);

/** Thin orbit guide ellipses. */
export const OrbitRings: React.FC<{rings: Ring[]; cx: number; squeeze?: number; opacity?: number; tint?: string}> = ({rings, cx, squeeze = 1, opacity = 1, tint = '185,174,230'}) => (
	<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
		{rings.map((r, i) => (
			<ellipse key={i} cx={cx} cy={r.cy} rx={r.rx * squeeze} ry={r.ry * squeeze} fill="none" stroke={`rgba(${tint},${0.16 * opacity})`} strokeWidth={1.5} />
		))}
	</svg>
);
