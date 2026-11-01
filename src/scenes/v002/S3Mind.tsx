import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Atmosphere} from '../../components/Atmosphere';
import {Figure} from '../../components/Figure';
import {OrbitBack, OrbitFront, OrbitRings, placeFragments} from '../../components/Orbit';
import {useTime} from '../../components/Primitives';
import {ease, envelope, rise, tween} from '../../lib/anim';
import {camAt, Camera, Layer} from '../../lib/camera';
import {fonts} from '../../theme';
import type {Video002} from '../../videos/video002';

/** A thought that won't leave: the line plus two fading echoes of itself. */
const Thought: React.FC<{text: string; t: number; at: number; until: number}> = ({text, t, at, until}) => {
	const o = envelope(t, at, until, 0.3, 0.3);
	if (o <= 0) return null;
	const p = rise(t, at, 0.5, ease.out);
	const style: React.CSSProperties = {
		position: 'absolute',
		top: 360,
		left: 90,
		right: 90,
		textAlign: 'center',
		fontFamily: fonts.sans,
		fontWeight: 800,
		fontSize: text.length > 20 ? 64 : 96,
		lineHeight: 1.08,
		letterSpacing: '0.01em',
		color: '#efeaff',
	};
	return (
		<>
			{[2, 1].map((echo) => (
				<div
					key={echo}
					style={{
						...style,
						opacity: o * (0.13 / echo) * p,
						transform: `translateY(${echo * 14 * p}px) scale(${1 + echo * 0.06 * p})`,
						filter: `blur(${echo * 2.5}px)`,
						color: '#b9aee6',
					}}
				>
					{text}
				</div>
			))}
			<div style={{...style, opacity: o, transform: `translateY(${(1 - p) * 20}px)`, filter: `blur(${(1 - p) * 8}px)`, textShadow: '0 0 30px rgba(150,130,255,0.45)'}}>{text}</div>
		</>
	);
};

/** Inside the head: thought fragments orbit tighter and faster around the character. */
export const S3Mind: React.FC<{v: Video002}> = ({v}) => {
	const t = useTime();
	const [s, e] = v.scenes.mind;
	const local = t - s;
	const span = e - s;
	// time-warp: the orbit accelerates as the loop tightens
	const orbitT = local * (1 + 0.45 * (local / span));
	const squeeze = tween(t, [s, e], [1.18, 0.74], ease.inOut);
	const cam = camAt(t, {zoom: [[s, 1.9], [s + 0.7, 1.02], [e, 1.14]], fy: [[s, 1000]], rot: [[s, -2.5], [s + 0.7, 0], [e, 1.6]]}, 0.25);
	const placed = placeFragments(v.mind.fragments, v.mind.rings, orbitT, 540, squeeze);
	const closing = tween(t, [s, e], [0, 1], ease.in);

	return (
		<AbsoluteFill>
			<Camera cam={cam}>
				<Atmosphere t={t} sky="#2b1d5a" ground="#0d0a22" lightX={540} lightColor="#b9aee6" lightIntensity={0.42} coneWidth={520} floorY={1480} particles={40} particleColor="#c9bfff" vignette={0.85} />
				<Layer depth={0.9}>
					<OrbitRings rings={v.mind.rings} cx={540} squeeze={squeeze} />
					<OrbitBack placed={placed} />
				</Layer>
				<Layer depth={1}>
					<Figure x={540} y={1480} height={600} t={t} rimColor="#b9aee6" rimSide={0} rimStrength={1} keyLight={0.4} />
				</Layer>
				<Layer depth={1.1}>
					<OrbitFront placed={placed} />
				</Layer>
			</Camera>
			{/* claustrophobia: the frame closes in */}
			<AbsoluteFill style={{background: `radial-gradient(${tween(closing, [0, 1], [95, 62])}% ${tween(closing, [0, 1], [70, 46])}% at 50% 52%, transparent 40%, rgba(4,3,10,0.92) 100%)`}} />
			{v.mind.questions.map((q) => (
				<Thought key={q.text} text={q.text} t={t} at={q.at} until={q.until} />
			))}
		</AbsoluteFill>
	);
};
