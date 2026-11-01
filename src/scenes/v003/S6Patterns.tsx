import React from 'react';
import {AbsoluteFill} from 'remotion';
import {MAIN_LOOK, Person, type Look, type Pose} from '../../components/Person';
import {useTime} from '../../components/Primitives';
import {ease, rise} from '../../lib/anim';
import {camAt, Camera, Layer} from '../../lib/camera';
import {fonts} from '../../theme';
import {cast, look003, type Video003} from '../../videos/video003';
import {MaskWord, Paper} from './Set';

type Member = {x: number; look: Look; pose?: Pose; smile: number; tilt?: number; headDown?: number; tension?: number; label?: number};

const LINEUP: Member[] = [
	{x: 190, look: {...cast.praised, coat: '#3a3a40', hairStyle: 'crop', skin: '#d9b08f'}, pose: 'pockets', smile: 0.55, tilt: 5, label: 0},
	{x: 365, look: cast.quiet, smile: 0, headDown: 0.9, label: 1},
	{x: 540, look: MAIN_LOOK, smile: 0.2},
	{x: 715, look: {...cast.praised, coat: '#c9b79c'}, smile: 0.9, tilt: -4, label: 2},
	{x: 890, look: cast.guest, pose: 'crossed', smile: -0.25, tension: 0.6, label: 3},
];

/** Perspective shift: many people, many styles; the labels come off. */
export const S6Patterns: React.FC<{v: Video003}> = ({v}) => {
	const t = useTime();
	const l = v.lineup;
	const cam = camAt(t, {zoom: [[l.zoom[0], 1.75], [l.zoom[1], 1.0], [v.timeline.duration, 1.04]], fy: [[l.zoom[0], 1000], [l.zoom[1], 980]]}, 0.35);
	const ask = rise(t, l.askAt, 0.6, ease.out);
	const fadePeople = rise(t, l.finalAt[0], 0.8) * 0.25;

	return (
		<AbsoluteFill>
			<Camera cam={cam}>
				<Paper t={t} />
				<Layer depth={0.6}>
					<div style={{position: 'absolute', left: -200, right: -200, top: 1180, height: 2, background: 'rgba(60,50,40,0.12)'}} />
				</Layer>
				<Layer depth={1}>
					{LINEUP.map((m, i) => (
						<Person
							key={i}
							x={m.x}
							y={1210}
							height={470}
							t={t + i * 1.3}
							look={m.look}
							pose={m.pose}
							smile={m.smile}
							tilt={m.tilt}
							headDown={m.headDown}
							tension={m.tension}
							rim={i === 2 ? look003.amber : '#f6e7cf'}
							rimStrength={i === 2 ? 0.8 : 0.4}
							shade={0.35}
							opacity={1 - fadePeople}
						/>
					))}
					{LINEUP.filter((m) => m.label !== undefined).map((m) => {
						const lab = l.labels[m.label!];
						const inP = rise(t, lab.at, 0.35, ease.out);
						const off = rise(t, l.removeAt + m.label! * 0.12, 0.55, ease.in);
						if (inP <= 0 || off >= 1) return null;
						const dir = m.label! % 2 ? 1 : -1;
						return (
							<div
								key={lab.text}
								style={{
									position: 'absolute',
									left: m.x,
									top: 655 - (m.label! % 2) * 62,
									transform: `translate(-50%, ${(1 - inP) * 14 + off * 90}px) rotate(${off * 24 * dir}deg) scale(${0.9 + inP * 0.1})`,
									opacity: inP * (1 - off),
									fontFamily: fonts.sans,
									fontWeight: 700,
									fontSize: 25,
									letterSpacing: '0.12em',
									color: look003.ink,
									background: '#e2d6c2',
									border: '1.5px solid rgba(29,27,31,0.25)',
									padding: '9px 14px 9px 18px',
									borderRadius: 8,
									whiteSpace: 'nowrap',
									boxShadow: '0 8px 20px rgba(60,40,20,0.15)',
								}}
							>
								{lab.text}
							</div>
						);
					})}
				</Layer>
			</Camera>
			<MaskWord text="LOOK FOR" t={t} at={l.finalAt[0]} top={200} size={104} family="serif" weight={900} tracking={0} color={look003.ink} />
			<MaskWord text="PATTERNS." t={t} at={l.finalAt[0] + 0.18} top={316} size={104} family="serif" weight={900} tracking={0} color={look003.ink} />
			<div style={{position: 'absolute', left: 540 - 60, top: 460, width: 120, height: 3, background: look003.red, opacity: rise(t, l.finalAt[1] - 0.1, 0.3)}} />
			<MaskWord text="NOT LABELS" t={t} at={l.finalAt[1]} top={482} size={72} family="sans" weight={800} tracking={0.08} color={look003.ink}>
				<span style={{color: look003.red}}>.</span>
			</MaskWord>
			<div style={{position: 'absolute', top: 1320, left: 80, right: 80, textAlign: 'center', fontFamily: fonts.sans, fontWeight: 600, fontSize: 44, lineHeight: 1.25, color: look003.ink, opacity: ask, transform: `translateY(${(1 - ask) * 18}px)`}}>
				What do you think
				<br />
				narcissism looks like?
			</div>
		</AbsoluteFill>
	);
};
