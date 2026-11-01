import React from 'react';
import {palette} from '../theme';

/** Silhouette drawn in a 300 × 900 box: a figure in a long coat, arms at rest. */
const HEAD = {cx: 150, cy: 92, rx: 44, ry: 54};
/** Standing body; `s` is the walking stride (0 = the original at-rest silhouette). */
const bodyPath = (s = 0) => {
	const l = s * 30;
	const r = -s * 30;
	return (
		'M131 138 C133 158 124 168 101 177 C72 187 60 204 57 238 L47 468 C46 489 61 494 67 477 L81 302 ' +
		`L84 520 C87 604 ${93 + l * 0.6} 706 ${98 + l} 868 L${141 + l} 868 L148 566 L152 566 L${159 + r} 868 L${202 + r} 868 C${207 + r * 0.6} 706 213 604 216 520 ` +
		'L219 302 L233 477 C239 494 254 489 253 468 L243 238 C240 204 228 187 199 177 C176 168 167 158 169 138 Z'
	);
};
const BODY = bodyPath(0);

/** Seated on an edge, hands resting on the knees, shoulders slightly lowered. Same 300 × 900 box, feet at 868. */
const HEAD_SEATED = {cx: 150, cy: 300, rx: 44, ry: 54};
const BODY_SEATED =
	'M131 346 C133 364 124 374 101 383 C72 393 60 410 57 444 L48 600 C46 628 62 646 84 642 ' +
	'L88 652 C90 720 94 800 98 868 L141 868 L146 680 L154 680 L159 868 L202 868 C206 800 210 720 212 652 ' +
	'L216 642 C238 646 254 628 252 600 L243 444 C240 410 228 393 199 383 C176 374 167 364 169 346 Z';

export type FigureProps = {
	/** Feet position in px. */
	x: number;
	y: number;
	height: number;
	t: number;
	rimColor?: string;
	/** -1 = rim on left, 1 = rim on right, 0 = both sides (balanced, "centred" state). */
	rimSide?: -1 | 0 | 1;
	rimStrength?: number;
	/** Top key light on head/shoulders. */
	keyLight?: number;
	opacity?: number;
	reflection?: boolean;
	/** Optional (video 002+): seated pose, or a walking stride in -1…1 for the standing pose. */
	pose?: 'standing' | 'seated';
	stride?: number;
};

export const Figure: React.FC<FigureProps> = ({
	x,
	y,
	height,
	t,
	rimColor = palette.cold,
	rimSide = 1,
	rimStrength = 1,
	keyLight = 0.35,
	opacity = 1,
	reflection = true,
	pose = 'standing',
	stride = 0,
}) => {
	const head = pose === 'seated' ? HEAD_SEATED : HEAD;
	const body = pose === 'seated' ? BODY_SEATED : stride === 0 ? BODY : bodyPath(stride);
	const uid = React.useId().replace(/:/g, '');
	const scale = height / 900;
	const width = 300 * scale;
	const breathe = 1 + Math.sin(t * 1.6) * 0.0045;
	const sway = Math.sin(t * 0.55) * 0.35;
	const offset = 4.5;
	const sides = rimSide === 0 ? [-1, 1] : [rimSide];

	const shape = (fill: string, dx = 0) => (
		<g transform={`translate(${dx} 0)`}>
			<ellipse {...head} fill={fill} />
			<path d={body} fill={fill} />
		</g>
	);

	const silhouette = (
		<svg viewBox="0 0 300 900" width={width} height={height} style={{overflow: 'visible', display: 'block'}}>
			<defs>
				<linearGradient id={`body${uid}`} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#0e1422" />
					<stop offset="40%" stopColor="#080c15" />
					<stop offset="100%" stopColor="#04060a" />
				</linearGradient>
				{/* Side shading for volume: shadow side falls off, lit side picks up the rim colour */}
				<linearGradient id={`side${uid}`} x1="0" y1="0" x2="1" y2="0">
					<stop offset="0%" stopColor={rimSide === 1 ? '#000' : rimColor} stopOpacity={rimSide === 1 ? 0.45 : 0.16} />
					<stop offset="50%" stopColor="#000" stopOpacity={rimSide === 0 ? 0.2 : 0.1} />
					<stop offset="100%" stopColor={rimSide === -1 ? '#000' : rimColor} stopOpacity={rimSide === -1 ? 0.45 : 0.2} />
				</linearGradient>
				{/* Top-down light: rim strongest on head and shoulders, fading toward the feet */}
				<linearGradient id={`fadeG${uid}`} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#fff" />
					<stop offset="35%" stopColor="#fff" stopOpacity={0.75} />
					<stop offset="100%" stopColor="#fff" stopOpacity={0.18} />
				</linearGradient>
				<mask id={`fade${uid}`} maskUnits="userSpaceOnUse" x="0" y="0" width="300" height="900">
					<rect x="0" y="0" width="300" height="900" fill={`url(#fadeG${uid})`} />
				</mask>
				<radialGradient id={`key${uid}`} cx="0.5" cy={pose === 'seated' ? 0.25 : 0.02} r="0.32">
					<stop offset="0%" stopColor={palette.ice} stopOpacity={keyLight} />
					<stop offset="100%" stopColor={palette.ice} stopOpacity={0} />
				</radialGradient>
				<clipPath id={`clip${uid}`}>
					<ellipse {...head} />
					<path d={body} />
				</clipPath>
				<filter id={`soft${uid}`} x="-20%" y="-20%" width="140%" height="140%">
					<feGaussianBlur stdDeviation="1.6" />
				</filter>
				<filter id={`halo${uid}`} x="-50%" y="-20%" width="200%" height="140%">
					<feGaussianBlur stdDeviation="14" />
				</filter>
			</defs>

			{/* Back-scatter halo so the dark figure separates from a dark room */}
			<g opacity={0.16 * rimStrength} filter={`url(#halo${uid})`}>
				{shape(rimColor)}
			</g>

			<g clipPath={`url(#clip${uid})`}>
				{/* Rim light: bright silhouette, masked by an offset dark one → thin lit edge */}
				<g filter={`url(#soft${uid})`} opacity={Math.min(1, rimStrength * 0.85)} mask={`url(#fade${uid})`}>
					{shape(rimColor)}
				</g>
				{sides.length === 2 ? (
					<g transform="translate(150 0) scale(0.955 1) translate(-150 0)">{shape(`url(#body${uid})`)}</g>
				) : (
					shape(`url(#body${uid})`, -offset * sides[0])
				)}
				<rect x="0" y="0" width="300" height="900" fill={`url(#side${uid})`} />
				{/* Soft key light from above on head and shoulders */}
				<rect x="0" y="0" width="300" height="900" fill={`url(#key${uid})`} />
			</g>
		</svg>
	);

	return (
		<div style={{position: 'absolute', left: x - width / 2, top: y - height, width, height, opacity}}>
			{/* Contact shadow */}
			<div
				style={{
					position: 'absolute',
					left: -width * 0.35,
					width: width * 1.7,
					top: height - 18,
					height: 36,
					borderRadius: '50%',
					background: 'radial-gradient(closest-side, rgba(0,0,0,0.85), transparent)',
				}}
			/>
			<div
				style={{
					transformOrigin: '50% 100%',
					transform: `rotate(${sway}deg) scale(${1 + (breathe - 1) * 0.4}, ${breathe})`,
				}}
			>
				{silhouette}
			</div>
			{reflection ? (
				<div
					style={{
						position: 'absolute',
						top: height,
						left: 0,
						transformOrigin: '50% 0%',
						transform: `scaleY(-0.55) rotate(${-sway}deg)`,
						opacity: 0.16,
						filter: 'blur(6px)',
						WebkitMaskImage: 'linear-gradient(0deg, rgba(0,0,0,0.9), transparent 55%)',
						maskImage: 'linear-gradient(0deg, rgba(0,0,0,0.9), transparent 55%)',
					}}
				>
					{silhouette}
				</div>
			) : null}
		</div>
	);
};
