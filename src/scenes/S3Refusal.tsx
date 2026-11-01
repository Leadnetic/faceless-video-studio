import React from 'react';
import {Atmosphere} from '../components/Atmosphere';
import {Figure} from '../components/Figure';
import {Bubble, Typing} from '../components/Messaging';
import {useTime} from '../components/Primitives';
import {colorKeys, ease, rise, tween} from '../lib/anim';
import {camAt, Camera, Layer} from '../lib/camera';
import {palette} from '../theme';
import type {VideoConfig} from '../videos/video001';

/** The single "No." — sent. The room's light turns colder, the camera closes in. */
export const S3Refusal: React.FC<{v: VideoConfig}> = ({v}) => {
	const t = useTime();
	const [s, e] = v.scenes.refusal;
	const {sendAt, typing} = v.refusal;
	const cold = rise(t, sendAt, 1.4, ease.soft);
	const cam = camAt(t, {zoom: [[s, 1.0], [sendAt, 1.18], [e + 0.4, 1.42]], fy: [[s, 1050], [e, 980]]}, 0.5);
	const sinceSend = t - sendAt;
	const kick = sinceSend > 0 ? Math.exp(-sinceSend * 8) * Math.sin(sinceSend * 60) * 5 : 0;
	cam.y += kick;

	const lightColor = colorKeys(cold, [[0, '#9fb7dc'], [1, '#86c0ff']]);
	return (
		<Camera cam={cam}>
			<Atmosphere
				t={t}
				sky={colorKeys(cold, [[0, '#17243f'], [1, '#0b1d3a']])}
				ground={colorKeys(cold, [[0, '#0d1628'], [1, '#081426']])}
				lightColor={lightColor}
				lightIntensity={tween(cold, [0, 1], [0.55, 0.62])}
				coneWidth={tween(cold, [0, 1], [560, 400])}
				particleColor={palette.ice}
			/>
			<Layer depth={1}>
				<Figure x={540} y={1540} height={760} t={t} rimColor={lightColor} rimSide={1} rimStrength={1 + cold * 0.35} keyLight={0.32 + cold * 0.1} />
			</Layer>
			<Layer depth={0}>
				<Typing t={t} from="me" start={typing[0]} end={typing[1]} y={520} inset={250} />
				<Bubble
					t={t}
					from="me"
					text={v.refusal.text}
					at={sendAt}
					y={470}
					inset={250}
					scale={1.45}
					accent="red"
					time={v.refusal.time}
					status={[
						{text: 'Delivered', at: sendAt + 0.35},
						{text: 'Read', at: sendAt + 1.25},
					]}
				/>
			</Layer>
		</Camera>
	);
};
