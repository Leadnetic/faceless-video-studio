import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {PopCaptions} from './components/PopCaptions';
import {Scene, Sfx} from './components/Primitives';
import {SafeGuide} from './components/SafeZone';
import {s2f} from './lib/anim';
import {S1Kitchen, S2Door, S3Game, S4Pass, S5Old, S6Study, S7Fix, S8Fridge} from './scenes/v005/Scenes';
import {fontsReady, VIDEO} from './theme';
import type {Video005} from './videos/video005';

const SoundDesign005: React.FC<{v: Video005}> = ({v}) => {
	const dir = `${v.audioDir}/sfx`;
	const k = v.t;
	const sc = v.scenes;
	const fx = (src: string, at: number, volume: number) => <Sfx key={`${src}${at}`} src={src} at={at} volume={volume} dir={dir} />;
	return (
		<>
			{fx('whoosh', 0, 0.3)}
			{fx('cricket', k.crickets, 0.35)}
			{[0, 1, 2].map((i) => fx('pop', k.why + 0.15 + i * 0.22, 0.25))}
			{fx('creak', sc.door[0], 0.45)}
			{fx('stamp', k.door, 0.55)}
			{fx('whoosh', sc.game[0] - 0.1, 0.3)}
			{[0, 1, 2].map((i) => fx('pop', k.scenes - 0.1 + i * 0.2, 0.22))}
			{fx('ding', k.chapters, 0.3)}
			{fx('whoosh', k.doorway - 0.1, 0.3)}
			{fx('boing', k.doorway, 0.3)}
			{fx('pop', k.newRoom, 0.3)}
			{fx('save', k.close - 0.05, 0.4)}
			{fx('stamp', k.close + 0.2, 0.35)}
			{fx('whoosh', sc.old[0] - 0.1, 0.25)}
			{fx('pop', k.stayed, 0.25)}
			{fx('whoosh', sc.study[0] - 0.1, 0.3)}
			{fx('gulp', k.forget, 0.35)}
			{fx('whoosh', sc.fix[0] - 0.1, 0.3)}
			{fx('idea', k.thought, 0.45)}
			{fx('whoosh', sc.fridge[0] - 0.1, 0.3)}
			{fx('fridge', k.open, 0.5)}
			{fx('ding', k.plan, 0.35)}
		</>
	);
};

/** Bright cartoon explainer (series "your brain", ep. 2). `guides` draws the platform safe zone for QA stills only. */
export const PsychologyShort005: React.FC<{v: Video005; guides?: boolean}> = ({v, guides}) => {
	const frame = useCurrentFrame();
	const t = frame / VIDEO.fps;
	const [fontHandle] = useState(() => delayRender('Loading embedded fonts'));
	useEffect(() => {
		fontsReady.then(() => continueRender(fontHandle));
	}, [fontHandle]);
	const total = s2f(v.timeline.duration);
	const sc = v.scenes;
	const musicVol = (f: number) => interpolate(f, [0, 6, total - 15, total], [0.25, 0.32, 0.32, 0.15], {extrapolateRight: 'clamp'});
	const order: [keyof typeof sc, React.FC<{v: Video005}>][] = [
		['kitchen', S1Kitchen],
		['door', S2Door],
		['game', S3Game],
		['pass', S4Pass],
		['old', S5Old],
		['study', S6Study],
		['fix', S7Fix],
		['fridge', S8Fridge],
	];
	return (
		<AbsoluteFill style={{backgroundColor: '#2a2470'}}>
			{order.map(([key, Comp], i) => (
				<Scene key={key} start={sc[key][0]} end={sc[key][1] + (i === order.length - 1 ? 1 : 0)} fade={0.05}>
					<Comp v={v} />
				</Scene>
			))}
			<PopCaptions t={t} timeline={v.timeline} y={1300} right={170} />
			{guides ? <SafeGuide /> : null}
			<Audio src={staticFile(`${v.audioDir}/voiceover.wav`)} />
			<Audio src={staticFile(`${v.audioDir}/score.wav`)} volume={musicVol} />
			<SoundDesign005 v={v} />
		</AbsoluteFill>
	);
};
