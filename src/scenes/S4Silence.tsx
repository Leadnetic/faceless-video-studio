import React from 'react';
import {Atmosphere} from '../components/Atmosphere';
import {Figure} from '../components/Figure';
import {Bubble, Typing} from '../components/Messaging';
import {useTime} from '../components/Primitives';
import {keys} from '../lib/anim';
import {camAt, Camera, Layer} from '../lib/camera';
import type {VideoConfig} from '../videos/video001';

/** Replies shrink, gaps widen, a typing indicator gives up. The frame empties out. */
export const S4Silence: React.FC<{v: VideoConfig}> = ({v}) => {
	const t = useTime();
	const [s, e] = v.scenes.silence;
	const cam = camAt(t, {zoom: [[s, 1.38], [e, 0.84]], fy: [[s, 1000], [e, 1150]]}, 0.4);
	const light = keys(t, [[s, 0.6], [e, 0.2]]);
	return (
		<Camera cam={cam}>
			<Atmosphere t={t} sky="#0b1d3a" ground="#081426" lightColor="#86c0ff" lightIntensity={light} coneWidth={400} particles={24} vignette={0.95} />
			<Layer depth={1}>
				<Figure x={540} y={1540} height={760} t={t} rimColor="#86c0ff" rimSide={1} rimStrength={0.6 + light} keyLight={0.25} />
			</Layer>
			<Layer depth={0}>
				{v.silence.map((b, i) => (
					<Bubble key={i} t={t} {...b} />
				))}
				<Typing t={t} from="them" start={v.silenceTyping[0]} end={v.silenceTyping[1]} y={930} inset={150} />
			</Layer>
		</Camera>
	);
};
