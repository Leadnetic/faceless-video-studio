import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Atmosphere} from '../components/Atmosphere';
import {Figure} from '../components/Figure';
import {Reveal, useTime} from '../components/Primitives';
import {colorKeys, ease, keys, rise, tween} from '../lib/anim';
import {camAt, Camera, Layer} from '../lib/camera';
import {fonts, palette} from '../theme';
import type {VideoConfig} from '../videos/video001';

/** "yes" and "no" weighed on one line; then the closing statement, bookending the hook. */
export const S6Respect: React.FC<{v: VideoConfig}> = ({v}) => {
	const t = useTime();
	const [s] = v.scenes.respect;
	const r = v.respect;
	const end = v.timeline.duration;
	const cam = camAt(t, {zoom: [[s, 1.0], [r.cardAt + 0.4, 1.14]], fy: [[s, 1000]]}, 0.3);

	const yes = rise(t, r.yesAt, 0.8, ease.out);
	const no = rise(t, r.noAt, 0.8, ease.out);
	const yesGlow = keys(t, [[r.yesGlowAt, 0], [r.yesGlowAt + 0.3, 1], [r.shiftAt + 0.2, 0.25]]);
	const slide = rise(t, r.shiftAt, 0.55, ease.inOut);
	const noRed = rise(t, r.shiftAt + 0.25, 0.4);
	const card = rise(t, r.cardAt, 0.6, ease.soft);

	const sinceFinal = t - r.finalAt;
	const final = rise(t, r.finalAt, 0.55, ease.out);
	const flash = sinceFinal > 0 ? Math.exp(-sinceFinal * 3.5) : 0;
	const hold = tween(t, [r.finalAt, end], [1, 1.05], ease.soft);
	const underline = keys(t, [[r.finalAt + 0.1, 0], [r.finalAt + 0.9, 360]], ease.out);

	const word = (text: string, x: number, o: number, color: string, glow: number): React.ReactNode => (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: 380,
				transform: `translateX(-50%) translateY(${(1 - o) * 20}px)`,
				fontFamily: fonts.serifItalic,
				fontStyle: 'italic',
				fontSize: 118,
				color,
				opacity: o,
				filter: `blur(${(1 - o) * 10}px)`,
				textShadow: `0 0 ${20 + glow * 50}px rgba(214,228,251,${glow * 0.45})`,
			}}
		>
			{text}
		</div>
	);

	return (
		<AbsoluteFill>
			<Camera cam={cam}>
				<Atmosphere t={t} sky="#18202f" ground="#121824" lightColor="#cfc7bb" lightIntensity={0.6} coneWidth={660} vignette={0.72} particleColor={palette.warm} particles={36} />
				<Layer depth={1}>
					<Figure x={540} y={1540} height={760} t={t} rimColor="#cfc7bb" rimSide={0} rimStrength={0.9} keyLight={0.5} />
				</Layer>
				<Layer depth={0.55}>
					{word('yes', 300, yes, colorKeys(yesGlow, [[0, '#aab4c6'], [1, palette.ice]]), yesGlow)}
					{word('no', 780, no * (1 - card), colorKeys(noRed, [[0, '#6c7588'], [1, '#ff5a63']]), 0)}
					<div style={{position: 'absolute', top: 545, left: 390, width: 300 * no, height: 2, background: 'rgba(143,180,232,0.3)'}} />
					<div
						style={{
							position: 'absolute',
							top: 538,
							left: tween(slide, [0, 1], [374, 690]),
							width: 16,
							height: 16,
							borderRadius: 8,
							background: colorKeys(slide, [[0, palette.ice], [1, palette.red]]),
							opacity: yes,
							boxShadow: `0 0 18px ${slide > 0.5 ? palette.redGlow : 'rgba(214,228,251,0.6)'}`,
						}}
					/>
				</Layer>
			</Camera>

			{/* Closing card */}
			<AbsoluteFill style={{opacity: card}}>
				<AbsoluteFill style={{background: 'radial-gradient(90% 60% at 50% 52%, #0d1220 0%, #04060b 75%)'}} />
				<div
					style={{
						position: 'absolute',
						left: 40,
						right: 40,
						top: 1060,
						height: 600,
						borderRadius: '50%',
						background: `radial-gradient(closest-side, ${palette.redGlow}, transparent)`,
						opacity: final * (0.35 + flash * 0.35),
					}}
				/>
				<AbsoluteFill style={{transform: `scale(${hold})`, transformOrigin: '50% 55%'}}>
					<div style={{position: 'absolute', top: 690, left: 60, right: 60}}>
						{r.lines.map((l, i) => (
							<Reveal
								key={l}
								text={l}
								t={t}
								at={r.lineAt[i]}
								stagger={0.1}
								style={{fontFamily: fonts.sans, fontWeight: 600, fontSize: 70, letterSpacing: '-0.01em', color: '#c9d3e6', lineHeight: 1.25}}
							/>
						))}
					</div>
					<div
						style={{
							position: 'absolute',
							top: 900,
							left: 0,
							right: 0,
							textAlign: 'center',
							fontFamily: fonts.serif,
							fontWeight: 900,
							fontSize: 390,
							lineHeight: 1,
							color: palette.red,
							opacity: final,
							letterSpacing: `${tween(final, [0, 1], [0.25, -0.02])}em`,
							transform: `scale(${1.08 - final * 0.08 + flash * 0.02})`,
							filter: `blur(${(1 - final) * 18}px) brightness(${1 + flash * 0.35}) drop-shadow(0 0 ${30 + flash * 40}px rgba(214,52,66,${0.35 + flash * 0.3}))`,
							background: 'linear-gradient(180deg, #e0505a 0%, #b8262f 70%, #8e1e27 100%)',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
						}}
					>
						NO.
					</div>
					<div
						style={{
							position: 'absolute',
							top: 1330,
							left: 540 - underline / 2,
							width: underline,
							height: 3,
							background: `linear-gradient(90deg, transparent, ${palette.red}, transparent)`,
							boxShadow: `0 0 20px ${palette.redGlow}`,
						}}
					/>
				</AbsoluteFill>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
