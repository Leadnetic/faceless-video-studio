import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Captions} from './components/Captions';
import {Grain, Scene, Sfx} from './components/Primitives';
import {s2f} from './lib/anim';
import {S1Mirror} from './scenes/v003/S1Mirror';
import {S2Room} from './scenes/v003/S2Room';
import {S3Critique} from './scenes/v003/S3Critique';
import {S4Examples} from './scenes/v003/S4Examples';
import {S5Fragile} from './scenes/v003/S5Fragile';
import {S6Patterns} from './scenes/v003/S6Patterns';
import {fontsReady, VIDEO} from './theme';
import {look003, type Video003} from './videos/video003';

const SoundDesign003: React.FC<{v: Video003}> = ({v}) => {
	const dir = `${v.audioDir}/sfx`;
	const fx = (src: string, at: number, volume: number) => <Sfx key={`${src}${at}`} src={src} at={at} volume={volume} dir={dir} />;
	const c = v.critique;
	const [c0, c1, c2] = v.examples.cuts;
	const m = v.mirror;
	return (
		<>
			{fx('lowhit', 0, 0.45)}
			{fx('crack', v.hook.crackAt, 0.75)}
			{fx('crack_small', v.hook.crack2At, 0.3)}
			{fx('whoosh', v.scenes.room[0], 0.22)}
			{fx('lowhit', v.room.praiseAt, 0.22)}
			{fx('whoosh', v.scenes.critique[0], 0.18)}
			{fx('heartbeat', c.freezeAt, 0.5)}
			{fx('whoosh', c.arrowAt + 0.1, 0.14)}
			{fx('heartbeat', c.insideAt, 0.45)}
			{fx('glass', c.strikeAt - 0.55, 0.22)}
			{fx('crack', c.strikeAt, 0.55)}
			{fx('lowhit', c.strikeAt, 0.3)}
			{fx('whoosh', c0, 0.3)}
			{fx('whoosh', c1 - 0.1, 0.3)}
			{fx('heartbeat', c1 + 0.6, 0.3)}
			{fx('whoosh', c2 - 0.1, 0.3)}
			{[0.18, 0.48, 0.76].map((f) => fx('flick', c2 + (v.examples.cuts[3] - c2) * f, 0.35))}
			{fx('lowhit', v.scenes.mirror[0] + 0.1, 0.3)}
			{m.cracks.map((at) => fx('crack_small', at, 0.32))}
			{fx('whoosh', m.orbit[0], 0.15)}
			{fx('glass', m.tensionAt, 0.3)}
			{fx('crack', m.fragileAt, 0.5)}
			{fx('release', v.scenes.lineup[0], 0.45)}
			{fx('whoosh', v.lineup.removeAt, 0.1)}
			{fx('lowhit', v.lineup.finalAt[0], 0.16)}
		</>
	);
};

export const PsychologyShort003: React.FC<{v: Video003}> = ({v}) => {
	const frame = useCurrentFrame();
	const t = frame / VIDEO.fps;
	const [fontHandle] = useState(() => delayRender('Loading embedded fonts'));
	useEffect(() => {
		fontsReady.then(() => continueRender(fontHandle));
	}, [fontHandle]);
	const total = s2f(v.timeline.duration);
	const sc = v.scenes;
	const light = v.lightWindows.some(([a, b]) => t >= a && t < b);
	// Music always sits well under the voice.
	const musicVol = (f: number) => interpolate(f, [0, 4, total - 20, total], [0.3, 0.45, 0.45, 0.2], {extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill style={{backgroundColor: look003.charcoal}}>
			<Scene start={sc.hook[0]} end={sc.hook[1]} fade={0.15}>
				<S1Mirror v={v} />
			</Scene>
			<Scene start={sc.room[0]} end={sc.room[1]} fade={0.15}>
				<S2Room v={v} />
			</Scene>
			<Scene start={sc.critique[0]} end={sc.critique[1]} fade={0.15}>
				<S3Critique v={v} />
			</Scene>
			<Scene start={sc.examples[0]} end={sc.examples[1]} fade={0.12}>
				<S4Examples v={v} />
			</Scene>
			<Scene start={sc.mirror[0]} end={sc.mirror[1]} fade={0.2}>
				<S5Fragile v={v} />
			</Scene>
			<Scene start={sc.lineup[0]} end={sc.lineup[1] + 1} fade={0.45}>
				<S6Patterns v={v} />
			</Scene>

			<Captions t={t} timeline={v.timeline} hidden={v.hiddenCaptions} y={1330} maxWords={5} rowChars={18} theme={light ? 'light' : 'dark'} accent={light ? look003.red : look003.amber} />
			<Grain opacity={0.07} />

			<Audio src={staticFile(`${v.audioDir}/voiceover.wav`)} />
			<Audio src={staticFile(`${v.audioDir}/score.wav`)} volume={musicVol} />
			<SoundDesign003 v={v} />
		</AbsoluteFill>
	);
};
