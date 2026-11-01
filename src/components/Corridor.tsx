import React from 'react';
import {AbsoluteFill} from 'remotion';

export type Projected = {x: number; y: number; k: number};

export type CorridorProps = {
	/** Distance travelled in arch units. Because arches repeat every unit, any travel value loops seamlessly. */
	travel: number;
	/** Number of arches in view (also the loop length). */
	count?: number;
	vp?: {x: number; y: number};
	focal?: number;
	/** Lateral bend per unit² of depth — makes the corridor read as circular. */
	curve?: number;
	halfWidth?: number;
	floor?: number;
	ceil?: number;
	fog?: number;
	color?: string;
	wall?: [number, number, number];
	/** Billboards (memories, clocks) per arch index; rendered depth-sorted with the arches. */
	renderItem?: (index: number, z: number, project: (X: number, Y: number, z: number) => Projected, alpha: number) => React.ReactNode;
};

/** One-point-perspective 2.5D corridor of arches, drawn in SVG with depth fog. */
export const Corridor: React.FC<CorridorProps> = ({
	travel,
	count = 15,
	vp = {x: 540, y: 860},
	focal = 520,
	curve = 0.028,
	halfWidth = 1.05,
	floor = 1.15,
	ceil = -1.5,
	fog = 7.5,
	color = '185,174,230',
	wall = [34, 28, 64],
	renderItem,
}) => {
	const zNear = 0.55;
	const project = (X: number, Y: number, z: number): Projected => {
		const k = focal / z;
		return {x: vp.x + (X + curve * z * z) * k, y: vp.y + Y * k, k};
	};
	const arches = new Array(count)
		.fill(0)
		.map((_, i) => ({i, z: ((((i - travel) % count) + count) % count) + zNear}))
		.sort((a, b) => b.z - a.z);
	const alphaAt = (z: number) => Math.min(1, Math.max(0, (z - zNear) / 0.5)) * Math.exp(-z / fog);
	const shade = (z: number, mult: number) => {
		const f = Math.exp(-z / (fog * 0.8)) * mult;
		return `rgb(${Math.round(wall[0] * f)},${Math.round(wall[1] * f)},${Math.round(wall[2] * f)})`;
	};
	const quad = (pts: Projected[]) => pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

	return (
		<AbsoluteFill>
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
				<defs>
					<radialGradient id="corridor-end" cx="0.5" cy="0.5" r="0.5">
						<stop offset="0%" stopColor={`rgb(${color})`} stopOpacity={0.25} />
						<stop offset="100%" stopColor={`rgb(${color})`} stopOpacity={0} />
					</radialGradient>
				</defs>
				{/* the bend's far glow */}
				{(() => {
					const p = project(0, -0.2, count + zNear);
					return <ellipse cx={p.x} cy={p.y} rx={260} ry={340} fill="url(#corridor-end)" />;
				})()}
				{arches.map(({i, z}) => {
					const z2 = z + 1;
					const a = alphaAt(z);
					const hw = halfWidth;
					const r = hw * 0.9;
					const L = [project(-hw, floor, z), project(-hw, ceil + r, z)];
					const R = [project(hw, ceil + r, z), project(hw, floor, z)];
					const top = project(0, ceil, z);
					const surfaces = z2 <= count + zNear + 1 ? (
						<g>
							<polygon points={quad([project(-hw, floor, z), project(hw, floor, z), project(hw, floor, z2), project(-hw, floor, z2)])} fill={shade(z, 0.9)} />
							<polygon points={quad([project(-hw, floor, z), project(-hw, ceil, z), project(-hw, ceil, z2), project(-hw, floor, z2)])} fill={shade(z, 0.75)} />
							<polygon points={quad([project(hw, floor, z), project(hw, ceil, z), project(hw, ceil, z2), project(hw, floor, z2)])} fill={shade(z, 0.6)} />
							<polygon points={quad([project(-hw, ceil, z), project(hw, ceil, z), project(hw, ceil, z2), project(-hw, ceil, z2)])} fill={shade(z, 0.4)} />
							{/* centre track on the floor */}
							<line x1={project(0, floor, z).x} y1={project(0, floor, z).y} x2={project(0, floor, z2).x} y2={project(0, floor, z2).y} stroke={`rgba(${color},${0.35 * a})`} strokeWidth={Math.max(1, 0.02 * project(0, 0, z).k)} />
						</g>
					) : null;
					const k = project(0, 0, z).k;
					return (
						<g key={i}>
							{surfaces}
							<path
								d={`M${L[0].x} ${L[0].y} L${L[1].x} ${L[1].y} A ${hw * k} ${r * k} 0 0 1 ${R[0].x} ${R[0].y} L${R[1].x} ${R[1].y}`}
								fill="none"
								stroke={`rgba(${color},${0.75 * a})`}
								strokeWidth={Math.max(1, 0.045 * k)}
							/>
							{/* lamp at the keystone */}
							<circle cx={top.x} cy={top.y + 0.08 * k} r={0.07 * k} fill={`rgba(235,228,255,${0.85 * a})`} />
							<circle cx={top.x} cy={top.y + 0.08 * k} r={0.4 * k} fill={`rgba(${color},${0.1 * a})`} />
							{/* floor pool under the lamp */}
							<ellipse cx={project(0, floor, z + 0.3).x} cy={project(0, floor, z + 0.3).y} rx={0.6 * k} ry={0.07 * k} fill={`rgba(${color},${0.12 * a})`} />
						</g>
					);
				})}
			</svg>
			{renderItem
				? arches.map(({i, z}) => (
						<React.Fragment key={`item${i}`}>{renderItem(i, z + 0.5, project, alphaAt(z + 0.5))}</React.Fragment>
					))
				: null}
		</AbsoluteFill>
	);
};
