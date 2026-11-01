import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {Layer} from '../../lib/camera';
import {fonts} from '../../theme';

/** Warm charcoal interior: panelled wall, pendant lamps with light pools, polished floor. */
export const Salon: React.FC<{t: number; floorY?: number; spot?: {x: number; w: number; o: number}; dim?: number; lamps?: number[]}> = ({
	t,
	floorY = 1420,
	spot,
	dim = 0,
	lamps = [230, 540, 850],
}) => {
	const l = 1 - dim * 0.6;
	return (
		<>
			<Layer depth={0.4}>
				<AbsoluteFill style={{background: `linear-gradient(180deg, #17161a 0%, #24211f ${(floorY / 1920) * 100 - 8}%, #2b2622 ${(floorY / 1920) * 100}%, #141315 100%)`, transform: 'scale(1.25)'}} />
				{/* wall panels */}
				<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible', opacity: 0.5 * l}}>
					{[-200, 60, 320, 580, 840, 1100].map((x) => (
						<rect key={x} x={x + 20} y={240} width={220} height={floorY - 340} rx={4} fill="none" stroke="rgba(255,230,200,0.05)" strokeWidth={2} />
					))}
				</svg>
			</Layer>
			<Layer depth={0.7}>
				{lamps.map((x, i) => (
					<React.Fragment key={x}>
						<div style={{position: 'absolute', left: x - 1, top: -40, width: 2, height: 260, background: 'rgba(0,0,0,0.6)'}} />
						<div style={{position: 'absolute', left: x - 34, top: 218, width: 68, height: 30, borderRadius: '34px 34px 6px 6px', background: 'linear-gradient(180deg,#2a2723,#0f0e10)'}} />
						<div style={{position: 'absolute', left: x - 20, top: 244, width: 40, height: 10, borderRadius: 6, background: '#ffd9a0', opacity: l * (0.85 + 0.15 * Math.sin(t * 3 + i)), boxShadow: '0 0 30px #ffb866'}} />
						<div style={{position: 'absolute', left: x - 300, top: 250, width: 600, height: floorY - 200, background: 'radial-gradient(50% 60% at 50% 0%, rgba(255,200,130,0.13), transparent 70%)', opacity: l}} />
					</React.Fragment>
				))}
			</Layer>
			<Layer depth={0.9}>
				<div style={{position: 'absolute', left: -300, right: -300, top: floorY, height: 2, background: 'rgba(255,220,180,0.08)'}} />
				{spot ? (
					<>
						<div style={{position: 'absolute', left: spot.x - spot.w / 2, top: -100, width: spot.w, height: floorY + 140, background: 'linear-gradient(180deg, rgba(255,205,140,0.0), rgba(255,205,140,0.16) 60%, rgba(255,205,140,0.05))', clipPath: 'polygon(42% 0, 58% 0, 100% 100%, 0 100%)', opacity: spot.o}} />
						<div style={{position: 'absolute', left: spot.x - spot.w * 0.6, top: floorY - 50, width: spot.w * 1.2, height: 110, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(255,205,140,0.35), transparent)', opacity: spot.o}} />
					</>
				) : null}
			</Layer>
			<AbsoluteFill style={{background: 'radial-gradient(90% 65% at 50% 45%, transparent 45%, rgba(6,5,8,0.85) 100%)'}} />
		</>
	);
};

/** Off-white editorial paper with soft warm light. */
export const Paper: React.FC<{t: number}> = ({t}) => (
	<AbsoluteFill style={{background: 'radial-gradient(100% 70% at 50% 35%, #f4efe6 0%, #ece5d9 55%, #d9d0c2 100%)'}}>
		{new Array(18).fill(0).map((_, i) => (
			<div
				key={i}
				style={{
					position: 'absolute',
					left: random(`px${i}`) * 1080,
					top: ((random(`py${i}`) * 1920 - t * 12 * (1 + random(`pv${i}`))) % 1920 + 1920) % 1920,
					width: 3,
					height: 3,
					borderRadius: 2,
					background: 'rgba(160,120,70,0.25)',
				}}
			/>
		))}
	</AbsoluteFill>
);

/** Editorial headline that reveals through a rising mask, with gentle tracking. */
export const MaskWord: React.FC<{
	text: string;
	t: number;
	at: number;
	until?: number;
	top: number;
	size: number;
	color?: string;
	family?: 'serif' | 'sans';
	weight?: number;
	tracking?: number;
	children?: React.ReactNode;
}> = ({text, t, at, until, top, size, color = '#efe9df', family = 'sans', weight = 800, tracking = 0.04, children}) => {
	const p = Math.min(1, Math.max(0, (t - at) / 0.42));
	const e = 1 - Math.pow(1 - p, 3);
	const out = until ? Math.min(1, Math.max(0, (t - until) / 0.25)) : 0;
	if (p <= 0 || out >= 1) return null;
	return (
		<div style={{position: 'absolute', top, left: 40, right: 40, textAlign: 'center', overflow: 'hidden', paddingBottom: size * 0.12}}>
			<div
				style={{
					fontFamily: family === 'serif' ? fonts.serif : fonts.sans,
					fontWeight: weight,
					fontSize: size,
					lineHeight: 1.05,
					color,
					letterSpacing: `${tracking + (1 - e) * 0.12}em`,
					transform: `translateY(${(1 - e) * 105 + out * -40}%)`,
					opacity: 1 - out,
					paddingLeft: `${tracking}em`,
				}}
			>
				{text}
				{children}
			</div>
		</div>
	);
};
