import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Atmosphere} from '../components/Atmosphere';
import {Kicker, useTime} from '../components/Primitives';
import {colorKeys, ease, keys, rise, tween} from '../lib/anim';
import {camAt, Camera, Layer} from '../lib/camera';
import {fonts, palette} from '../theme';
import type {VideoConfig} from '../videos/video001';

/** 0–5s: darkness, a single word, a slow push. The word turns at the spoken "No." */
export const S1Hook: React.FC<{v: VideoConfig}> = ({v}) => {
	const t = useTime();
	const hit = v.hook.impactAt;
	const sinceHit = Math.max(0, t - hit);
	const shake = t >= hit ? Math.exp(-sinceHit * 9) * Math.sin(sinceHit * 70) * 9 : 0;
	const cam = camAt(t, {zoom: [[0, 1.0], [hit, 1.14], [5.6, 1.2]], fy: [[0, 900]]}, 0.6);
	cam.x += shake;
	cam.y += shake * 0.4;

	const intro = rise(t, -0.25, 0.9, ease.out);
	const flash = t >= hit ? Math.exp(-sinceHit * 4) : 0;
	const redGlow = keys(t, [[0.3, 0], [hit - 0.05, 0.16], [hit + 0.08, 0.55], [hit + 1.2, 0.32]]);
	const dotColor = colorKeys(t, [[0.4, palette.text], [hit - 0.4, '#e2a1a5'], [hit, palette.red]]);
	const line = keys(t, [[0.9, 0], [hit - 0.1, 150], [hit + 0.25, 300], [5.6, 320]], ease.out);
	const light = keys(t, [[0, 0.12], [hit, 0.32], [hit + 0.1, 0.55], [5.5, 0.4]]);

	return (
		<Camera cam={cam}>
			<Atmosphere t={t} sky="#0e1729" ground="#0a1220" lightIntensity={light} coneWidth={420} particles={30} vignette={0.92} floorSheen={0.15} />

			<Layer depth={1}>
				{/* red bloom behind the word */}
				<div
					style={{
						position: 'absolute',
						left: 540 - 520,
						top: 900 - 300,
						width: 1040,
						height: 600,
						borderRadius: '50%',
						background: `radial-gradient(closest-side, ${palette.redGlow}, transparent)`,
						opacity: redGlow,
					}}
				/>
				<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', top: -60}}>
					<div
						style={{
							fontFamily: fonts.serif,
							fontWeight: 900,
							fontSize: 400,
							lineHeight: 1,
							color: palette.text,
							letterSpacing: `${tween(intro, [0, 1], [0.35, -0.02])}em`,
							opacity: intro,
							filter: `blur(${(1 - intro) * 22}px) brightness(${1 + flash * 0.5})`,
							textShadow: `0 0 ${40 + flash * 60}px rgba(214,228,251,${0.12 + flash * 0.25})`,
							transform: `scale(${1 + flash * 0.03})`,
						}}
					>
						{v.hook.word}
						<span style={{color: dotColor, textShadow: `0 0 ${30 + redGlow * 60}px ${palette.redGlow}`}}>.</span>
					</div>
				</AbsoluteFill>
				<div
					style={{
						position: 'absolute',
						left: 540 - line / 2,
						width: line,
						top: 1090,
						height: 3,
						borderRadius: 2,
						background: `linear-gradient(90deg, transparent, ${palette.red}, transparent)`,
						boxShadow: `0 0 ${16 + flash * 30}px ${palette.redGlow}`,
						opacity: 0.85,
					}}
				/>
			</Layer>

			<Layer depth={0.4}>
				<Kicker text={v.kicker} t={t} at={0.45} y={330} />
			</Layer>
		</Camera>
	);
};
