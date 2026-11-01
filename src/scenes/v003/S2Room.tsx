import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Mirror} from '../../components/Mirror';
import {Person} from '../../components/Person';
import {useTime} from '../../components/Primitives';
import {ease, rise, tween} from '../../lib/anim';
import {camAt, Camera, Layer} from '../../lib/camera';
import {fonts} from '../../theme';
import {cast, look003, type Video003} from '../../videos/video003';
import {MaskWord, Salon} from './Set';

/** Entrance: attention flows toward the character — until someone else is praised. */
export const S2Room: React.FC<{v: Video003}> = ({v}) => {
	const t = useTime();
	const r = v.room;
	const [e0, e1] = r.enter;
	const walk = rise(t, e0, e1 - e0, ease.out);
	const walking = t < e1 ? Math.sin((t - e0) * 9) : 0;
	const mainX = tween(walk, [0, 1], [-60, 380]);
	const praised = rise(t, r.praiseAt, 0.5, ease.inOut);
	const attention = rise(t, e1 - 0.3, 0.6) * (1 - praised);
	const cam = camAt(t, {zoom: [[e0, 1.04], [v.scenes.room[1], 1.12]], x: [[e0, -50], [r.praiseAt, -10], [v.scenes.room[1], 60]], fy: [[e0, 1000]]}, 0.7);
	const spotX = tween(praised, [0, 1], [380, 760]);
	const mirrorScale = tween(praised, [0, 1], [1, 0.7]);
	const lookAt = (x: number) => (praised > 0.5 ? (760 > x ? 1 : -1) : mainX > x ? 1 : -1);

	return (
		<AbsoluteFill>
			<Camera cam={cam}>
				<Salon t={t} spot={{x: spotX, w: 520, o: 0.4 + 0.6 * Math.max(attention, praised)}} />
				{/* a wall mirror keeps an eye on the character's size */}
				<Layer depth={0.85}>
					<Mirror x={590} y={930} w={210} h={430} t={t}>
						<div style={{position: 'absolute', inset: 0, transform: `scale(${mirrorScale})`, transformOrigin: '50% 100%'}}>
							<Person x={105} y={560} height={620} t={t} look={cast.main} smile={0.6 - praised * 0.55} shadow={false} rimStrength={0.6} />
						</div>
					</Mirror>
				</Layer>
				<Layer depth={0.95}>
					<Person x={160} y={1440} height={700} t={t + 3} look={cast.guest} look_x={lookAt(160)} smile={0.5 * Math.max(attention, praised * 0.8)} rimStrength={0.5} />
					<Person x={760} y={1420} height={690} t={t + 7} look={cast.praised} look_x={-0.4} smile={0.4 + praised * 0.5} glow={praised * 0.9} rimStrength={0.6} />
					<Person x={950} y={1400} height={660} t={t + 11} look={cast.colleague} look_x={lookAt(950)} smile={0.45 * Math.max(attention, praised * 0.8)} rimStrength={0.5} />
					{/* praise tag */}
					<div style={{position: 'absolute', left: 760, top: 640, transform: `translate(-50%, ${(1 - praised) * 20}px)`, opacity: praised, fontFamily: fonts.sans, fontWeight: 600, fontSize: 30, color: look003.charcoal, background: '#e8d9bd', padding: '12px 24px', borderRadius: 26, whiteSpace: 'nowrap', boxShadow: '0 12px 30px rgba(0,0,0,0.4)'}}>
						✦ great work
					</div>
				</Layer>
				<Layer depth={1.05}>
					<Person x={mainX} y={1520} height={780} t={t} look={cast.main} stride={walking * 0.7} smile={0.7 - praised * 0.62} tension={praised * 0.35} look_x={praised > 0.5 ? 1 : 0} glow={attention} rim={look003.amber} rimStrength={0.9} />
				</Layer>
			</Camera>
			{r.words.map((w, i) => (
				<MaskWord key={w.text} text={w.text} t={t} at={w.at} until={r.words[i + 1]?.at ?? v.scenes.room[1] - 0.1} top={300} size={118} weight={800} tracking={0.06} color={i === 2 ? '#e8d9bd' : look003.paper} />
			))}
		</AbsoluteFill>
	);
};
