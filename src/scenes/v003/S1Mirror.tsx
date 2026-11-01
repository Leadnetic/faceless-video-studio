import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Mirror} from '../../components/Mirror';
import {Person} from '../../components/Person';
import {useTime} from '../../components/Primitives';
import {ease, keys, rise, tween} from '../../lib/anim';
import {camAt, Camera, Layer} from '../../lib/camera';
import {cast, look003, type Video003} from '../../videos/video003';
import {MaskWord, Salon} from './Set';

/** Hook: the reflection is bigger than the person — then the glass cracks. */
export const S1Mirror: React.FC<{v: Video003}> = ({v}) => {
	const t = useTime();
	const {crackAt, crack2At} = v.hook;
	const since = t - crackAt;
	const shake = since > 0 ? Math.exp(-since * 10) * Math.sin(since * 80) * 14 : 0;
	const cam = camAt(t, {zoom: [[0, 1.0], [crackAt, 1.07], [crackAt + 0.25, 1.13], [v.scenes.hook[1] + 0.3, 1.24]], fx: [[0, 640]], fy: [[0, 860]]}, 0.5);
	cam.x += shake;
	const flash = since > 0 ? Math.exp(-since * 9) : 0;
	const W = 520;
	const H = 1090;
	const redPulse = keys(t, [[crackAt, 0], [crackAt + 0.05, 1], [crackAt + 1.2, 0.35]]);

	return (
		<AbsoluteFill>
			<Camera cam={cam}>
				<Salon t={t} lamps={[650]} floorY={1560} />
				<Layer depth={0.95}>
					<Mirror
						x={650}
						y={1560}
						w={W}
						h={H}
						t={t}
						stand
						cracks={[
							{cx: 0.52, cy: 0.3, p: rise(t, crackAt, 0.28, ease.out), r: 420, seed: 'hook', red: redPulse, branches: 11},
							{cx: 0.3, cy: 0.62, p: rise(t, crack2At, 0.22, ease.out), r: 220, seed: 'hook2', red: redPulse * 0.6, branches: 7},
						]}
					>
						{/* the reflection: taller, broader, glowing — almost untouchable */}
						<div style={{position: 'absolute', inset: 0, transform: 'scale(1.12, 1.0)', transformOrigin: '50% 100%'}}>
							<Person x={W / 2} y={H + 40} height={1120} t={t} tilt={5} smile={0.65} glow={0.55 * (1 - rise(t, crackAt, 0.4))} rim={look003.amber} rimStrength={1} look={cast.main} />
						</div>
						<div style={{position: 'absolute', inset: 0, background: 'radial-gradient(60% 40% at 50% 20%, rgba(255,205,140,0.22), transparent)'}} />
					</Mirror>
				</Layer>
				{/* the real person: smaller, seen from behind */}
				<Layer depth={1.12}>
					<Person x={250} y={1760} height={1020} t={t} view="back" look={cast.main} rim={look003.amber} rimStrength={0.6} shade={0.6} />
				</Layer>
			</Camera>
			<AbsoluteFill style={{background: '#fff', opacity: flash * 0.18}} />
			<AbsoluteFill style={{background: `radial-gradient(70% 50% at 60% 40%, rgba(163,36,44,${0.22 * redPulse}), transparent 70%)`}} />
			<MaskWord text={v.hook.title} t={t} at={0.08} top={196} size={150} family="serif" weight={900} tracking={0.01} color={look003.paper} />
			<MaskWord text={v.hook.sub} t={t} at={crackAt + 0.02} top={372} size={40} weight={600} tracking={0.2} color="#d9cdb8" />
			<div style={{position: 'absolute', left: 540 - tween(rise(t, crackAt, 0.5), [0, 1], [0, 160]), width: tween(rise(t, crackAt, 0.5), [0, 1], [0, 320]), top: 452, height: 2, background: look003.red, opacity: 0.9}} />
		</AbsoluteFill>
	);
};
