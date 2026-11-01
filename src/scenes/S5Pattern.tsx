import React from 'react';
import {Atmosphere} from '../components/Atmosphere';
import {Figure} from '../components/Figure';
import {useTime} from '../components/Primitives';
import {colorKeys, ease, rise, tween} from '../lib/anim';
import {camAt, Camera, Layer} from '../lib/camera';
import {fonts, palette} from '../theme';
import type {VideoConfig} from '../videos/video001';

const TICKS = 9;
const X0 = 150;
const X1 = 930;
const LINE_Y = 500;
const PATTERN = [0, 2, 4, 6, 8];
const REACTION = 4;

const Label: React.FC<{text: string; opacity: number; color?: string}> = ({text, opacity, color = palette.dim}) => (
	<div
		style={{
			position: 'absolute',
			top: LINE_Y + 70,
			left: 0,
			right: 0,
			textAlign: 'center',
			fontFamily: fonts.mono,
			fontSize: 26,
			letterSpacing: '0.32em',
			color,
			opacity,
			filter: `blur(${(1 - opacity) * 6}px)`,
		}}
	>
		{text}
	</div>
);

/** One event is noise; a recurring one is a pattern. The room settles into calm, even light. */
export const S5Pattern: React.FC<{v: VideoConfig}> = ({v}) => {
	const t = useTime();
	const [s, e] = v.scenes.pattern;
	const {reactionAt, patternAt} = v.pattern;
	const calm = rise(t, s, 4.2, ease.soft);
	const cam = camAt(t, {zoom: [[s, 0.92], [e, 1.04]], fy: [[s, 1100]], y: [[s, 20], [e, -10]]}, 0.3);
	const lightColor = colorKeys(calm, [[0, '#86c0ff'], [1, '#cfc7bb']]);
	const xs = new Array(TICKS).fill(0).map((_, i) => X0 + ((X1 - X0) / (TICKS - 1)) * i);

	const lineIn = rise(t, s + 0.25, 0.9);
	const react = rise(t, reactionAt, 0.5, ease.out);
	const litAt = (i: number) => patternAt + PATTERN.indexOf(i) * 0.17;
	const isLit = (i: number) => (i === REACTION ? react : PATTERN.includes(i) ? rise(t, litAt(i), 0.35, ease.out) : 0);
	const arcs = rise(t, patternAt + 0.15, 1.0, ease.inOut);
	const arcPath = PATTERN.slice(0, -1)
		.map((p, k) => {
			const a = xs[p];
			const b = xs[PATTERN[k + 1]];
			return `${k === 0 ? `M${a} ${LINE_Y}` : ''} Q${(a + b) / 2} ${LINE_Y - 120} ${b} ${LINE_Y}`;
		})
		.join(' ');

	return (
		<Camera cam={cam}>
			<Atmosphere
				t={t}
				sky={colorKeys(calm, [[0, '#0b1d3a'], [1, '#18202f']])}
				ground={colorKeys(calm, [[0, '#081426'], [1, '#121824']])}
				lightColor={lightColor}
				lightIntensity={tween(calm, [0, 1], [0.25, 0.6])}
				coneWidth={tween(calm, [0, 1], [400, 660])}
				vignette={tween(calm, [0, 1], [0.95, 0.72])}
				particleColor={palette.warm}
				particles={36}
			/>
			<Layer depth={1}>
				<Figure x={540} y={1540} height={760} t={t} rimColor={lightColor} rimSide={0} rimStrength={0.55 + calm * 0.35} keyLight={0.25 + calm * 0.25} />
			</Layer>

			<Layer depth={0.55}>
				<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
					<line x1={X0 - 40} x2={X0 - 40 + (X1 - X0 + 80) * lineIn} y1={LINE_Y} y2={LINE_Y} stroke="rgba(143,180,232,0.28)" strokeWidth={2} />
					<path
						d={arcPath}
						fill="none"
						stroke={palette.red}
						strokeOpacity={0.75}
						strokeWidth={2.5}
						pathLength={1}
						strokeDasharray="1 1"
						strokeDashoffset={1 - arcs}
						style={{filter: `drop-shadow(0 0 8px ${palette.redGlow})`}}
					/>
					{xs.map((x, i) => {
						const lit = isLit(i);
						const appear = rise(t, s + 0.35 + i * 0.05, 0.5);
						const ringAge = i === REACTION ? t - reactionAt : -1;
						return (
							<g key={i} opacity={appear}>
								{ringAge > 0 && ringAge < 1.4 ? (
									<circle cx={x} cy={LINE_Y} r={12 + ringAge * 40} fill="none" stroke={palette.red} strokeOpacity={0.6 * (1 - ringAge / 1.4)} strokeWidth={2} />
								) : null}
								<circle cx={x} cy={LINE_Y} r={7 + lit * 7} fill={lit > 0.01 ? palette.red : 'rgba(143,180,232,0.45)'} style={{filter: lit > 0.01 ? `drop-shadow(0 0 ${12 * lit}px ${palette.redGlow})` : undefined}} />
							</g>
						);
					})}
				</svg>
				<Label text="ONE REACTION" opacity={react * (1 - rise(t, patternAt - 0.2, 0.3))} />
				<Label text="A PATTERN" color={palette.ice} opacity={rise(t, patternAt + 0.6, 0.5)} />
			</Layer>
		</Camera>
	);
};
