import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Falloff} from './components/Atmosphere';
import {Captions} from './components/Captions';
import {Grain, Scene, Sfx} from './components/Primitives';
import {rise, s2f} from './lib/anim';
import {S1Night} from './scenes/v002/S1Night';
import {S2Memories} from './scenes/v002/S2Memories';
import {S3Mind} from './scenes/v002/S3Mind';
import {S4Corridor} from './scenes/v002/S4Corridor';
import {S5Ring} from './scenes/v002/S5Ring';
import {fontsReady, VIDEO} from './theme';
import type {Video002} from './videos/video002';

const SoundDesign002: React.FC<{v: Video002}> = ({v}) => {
	const dir = `${v.audioDir}/sfx`;
	const m = v.memory;
	const fx = (src: string, at: number, volume: number, key?: string) => <Sfx key={key ?? `${src}${at}`} src={src} at={at} volume={volume} dir={dir} />;
	const ticks: React.ReactNode[] = [];
	// bedroom clock: steady, fading as the memories take over
	for (let s = 0.15, i = 0; s < 7.2; s += 1, i++) ticks.push(fx(i % 2 ? 'tock' : 'tick', s, 0.24 * (s > 5 ? 0.5 : 1)));
	// corridor: the clock is everywhere now — faster, hypnotic
	const [c0] = v.scenes.corridor;
	for (let s = c0 + 0.4, i = 0; s < v.corridor.freezeAt - 0.1; s += 0.5, i++) ticks.push(fx(i % 2 ? 'tock' : 'tick', s, 0.13));
	return (
		<>
			{ticks}
			{fx('notify', v.hook.notifyAt, 0.4)}
			{fx('notify', m.word.at + 0.5, 0.16)}
			{fx('rewind', m.rewind[0], 0.42)}
			{fx('rew_short', m.repeats[0] - 0.08, 0.24)}
			{fx('rew_short', m.repeats[1] - 0.08, 0.2)}
			{fx('thud', m.dive + 0.15, 0.5)}
			{v.mind.questions.map((q) => fx('tock', q.at, 0.3, `q${q.at}`))}
			{fx('breath', v.scenes.corridor[0] - 0.2, 0.28)}
			{fx('tapestop', v.corridor.freezeAt - 0.12, 0.55)}
			{fx('breath', v.ring.dissolveAt, 0.16)}
			{fx('breath', v.ring.calmAt - 0.3, 0.3)}
			{fx('thud', v.ring.rewindAt, 0.22)}
		</>
	);
};

export const PsychologyShort002: React.FC<{v: Video002}> = ({v}) => {
	const frame = useCurrentFrame();
	const t = frame / VIDEO.fps;
	const [fontHandle] = useState(() => delayRender('Loading embedded fonts'));
	useEffect(() => {
		fontsReady.then(() => continueRender(fontHandle));
	}, [fontHandle]);
	const total = s2f(v.timeline.duration);
	const sc = v.scenes;
	const musicVol = (f: number) => interpolate(f, [0, 10, total - 25, total], [0, 0.55, 0.55, 0], {extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill style={{backgroundColor: '#05050d'}}>
			<Scene start={sc.bedroom[0]} end={sc.bedroom[1]}>
				<S1Night v={v} />
			</Scene>
			<Scene start={sc.memory[0]} end={sc.memory[1]} fade={0.35}>
				<S2Memories v={v} />
			</Scene>
			<Scene start={sc.mind[0]} end={sc.mind[1]} fade={0.35}>
				<S3Mind v={v} />
			</Scene>
			<Scene start={sc.corridor[0]} end={sc.corridor[1]} fade={0.35}>
				<S4Corridor v={v} />
			</Scene>
			<Scene start={sc.ring[0]} end={sc.ring[1] + 1} fade={0.4}>
				<S5Ring v={v} />
			</Scene>

			<Falloff strength={0.45} />
			<Captions t={t} timeline={v.timeline} hidden={v.hiddenCaptions} />
			<Grain />
			{/* elegant fade to black */}
			<AbsoluteFill style={{backgroundColor: '#000', opacity: rise(t, v.ring.fadeOut, 0.7)}} />

			<Audio src={staticFile(`${v.audioDir}/voiceover.wav`)} />
			<Audio src={staticFile(`${v.audioDir}/score.wav`)} volume={musicVol} />
			<SoundDesign002 v={v} />
		</AbsoluteFill>
	);
};
