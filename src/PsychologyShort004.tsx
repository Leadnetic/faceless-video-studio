import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {PopCaptions} from './components/PopCaptions';
import {Scene, Sfx} from './components/Primitives';
import {s2f} from './lib/anim';
import {S1Bed, S5Replay} from './scenes/v004/Bed';
import {S2Restaurant, S3Files, S4Cave, S6Twist, S7Stage, S8City} from './scenes/v004/Scenes';
import {fontsReady, VIDEO} from './theme';
import type {Video004} from './videos/video004';

const SoundDesign004: React.FC<{v: Video004}> = ({v}) => {
	const dir = `${v.audioDir}/sfx`;
	const k = v.t;
	const sc = v.scenes;
	const fx = (src: string, at: number, volume: number) => <Sfx key={`${src}${at}`} src={src} at={at} volume={volume} dir={dir} />;
	return (
		<>
			{fx('pop', 0.02, 0.35)}
			{fx('boing', k.brainPop, 0.4)}
			{fx('pop', k.cloud, 0.3)}
			{fx('whoosh', sc.restaurant[0] - 0.15, 0.35)}
			{fx('pop', k.enjoy, 0.25)}
			{fx('pop', k.youToo, 0.3)}
			{fx('scratch', k.cringe - 0.05, 0.55)}
			{fx('cringe', k.cringe + 0.05, 0.3)}
			{fx('pop', k.awake, 0.3)}
			{fx('whoosh', sc.files[0] - 0.1, 0.3)}
			{fx('pop', k.folder, 0.3)}
			{fx('stamp', k.stamp, 0.6)}
			{fx('whoosh', k.toDrawer, 0.25)}
			{fx('whoosh', sc.cave[0] - 0.1, 0.3)}
			{fx('boing', k.kicked, 0.5)}
			{fx('whoosh', k.kicked + 0.25, 0.3)}
			{fx('gulp', k.threat + 0.05, 0.5)}
			{fx('whoosh', sc.replay[0] - 0.1, 0.3)}
			{fx('pop', k.press, 0.4)}
			{fx('rewind', k.press + 0.85, 0.3)}
			{fx('rewind', k.never, 0.3)}
			{fx('scratch', k.twist - 0.08, 0.35)}
			{fx('pop', k.twist + 0.15, 0.3)}
			{fx('whoosh', k.forgot, 0.3)}
			{fx('ding', k.forgot + 0.45, 0.4)}
			{fx('whoosh', sc.stage[0] - 0.1, 0.3)}
			{fx('stamp', k.spotlight, 0.35)}
			{fx('whoosh', k.people, 0.25)}
			{fx('whoosh', sc.city[0] - 0.1, 0.3)}
			{[0, 1, 2, 3, 4].map((i) => fx('pop', k.own + 0.3 + i * 0.12, 0.18))}
		</>
	);
};

/** Bright cartoon explainer format (video 004+). */
export const PsychologyShort004: React.FC<{v: Video004}> = ({v}) => {
	const frame = useCurrentFrame();
	const t = frame / VIDEO.fps;
	const [fontHandle] = useState(() => delayRender('Loading embedded fonts'));
	useEffect(() => {
		fontsReady.then(() => continueRender(fontHandle));
	}, [fontHandle]);
	const total = s2f(v.timeline.duration);
	const sc = v.scenes;
	const musicVol = (f: number) => interpolate(f, [0, 6, total - 15, total], [0.25, 0.32, 0.32, 0.15], {extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill style={{backgroundColor: '#1d1b52'}}>
			<Scene start={sc.bed[0]} end={sc.bed[1]} fade={0.05}>
				<S1Bed v={v} />
			</Scene>
			<Scene start={sc.restaurant[0]} end={sc.restaurant[1]} fade={0.05}>
				<S2Restaurant v={v} />
			</Scene>
			<Scene start={sc.files[0]} end={sc.files[1]} fade={0.05}>
				<S3Files v={v} />
			</Scene>
			<Scene start={sc.cave[0]} end={sc.cave[1]} fade={0.05}>
				<S4Cave v={v} />
			</Scene>
			<Scene start={sc.replay[0]} end={sc.replay[1]} fade={0.05}>
				<S5Replay v={v} />
			</Scene>
			<Scene start={sc.twist[0]} end={sc.twist[1]} fade={0.05}>
				<S6Twist v={v} />
			</Scene>
			<Scene start={sc.stage[0]} end={sc.stage[1]} fade={0.05}>
				<S7Stage v={v} />
			</Scene>
			<Scene start={sc.city[0]} end={sc.city[1] + 1} fade={0.05}>
				<S8City v={v} />
			</Scene>

			<PopCaptions t={t} timeline={v.timeline} y={1290} />

			<Audio src={staticFile(`${v.audioDir}/voiceover.wav`)} />
			<Audio src={staticFile(`${v.audioDir}/score.wav`)} volume={musicVol} />
			<SoundDesign004 v={v} />
		</AbsoluteFill>
	);
};
