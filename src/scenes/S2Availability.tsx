import React from 'react';
import {Atmosphere} from '../components/Atmosphere';
import {Figure} from '../components/Figure';
import {Bubble, Presence} from '../components/Messaging';
import {useTime} from '../components/Primitives';
import {rise} from '../lib/anim';
import {camAt, Camera, Layer} from '../lib/camera';
import type {VideoConfig} from '../videos/video001';

/** Always reachable: a quiet figure surrounded by a rhythm of requests and instant yeses. */
export const S2Availability: React.FC<{v: VideoConfig}> = ({v}) => {
	const t = useTime();
	const [s, e] = v.scenes.availability;
	const cam = camAt(t, {zoom: [[s, 1.12], [e, 1.0]], x: [[s, -36], [e, 30]], fy: [[s, 1120]]});

	return (
		<Camera cam={cam}>
			<Atmosphere t={t} sky="#17243f" ground="#0d1628" lightColor="#9fb7dc" lightIntensity={0.55} coneWidth={560} />
			<Layer depth={1}>
				<Figure x={540} y={1540} height={760} t={t} rimColor="#9fb7dc" rimSide={1} keyLight={0.32} />
			</Layer>
			<Layer depth={1.05}>
				<Presence t={t} x={540} y={706} opacity={rise(t, s + 0.4, 0.6) * 0.9} />
			</Layer>
			<Layer depth={1}>
				{v.availability.map((b, i) => (
					<Bubble key={i} t={t} {...b} />
				))}
			</Layer>
		</Camera>
	);
};
