import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Captions} from './components/Captions';
import {Falloff} from './components/Atmosphere';
import {Grain, Scene, Sfx} from './components/Primitives';
import {s2f} from './lib/anim';
import {S1Hook} from './scenes/S1Hook';
import {S2Availability} from './scenes/S2Availability';
import {S3Refusal} from './scenes/S3Refusal';
import {S4Silence} from './scenes/S4Silence';
import {S5Pattern} from './scenes/S5Pattern';
import {S6Respect} from './scenes/S6Respect';
import {fontsReady, palette, VIDEO} from './theme';
import type {VideoConfig} from './videos/video001';

const SoundDesign: React.FC<{v: VideoConfig}> = ({v}) => {
	const {refusal: r, respect: re} = v;
	return (
		<>
			<Sfx src="impact" at={0} volume={0.4} />
			<Sfx src="swell" at={v.hook.impactAt - 1.55} volume={0.28} />
			<Sfx src="impact" at={v.hook.impactAt} volume={0.7} />
			{v.availability.map((b, i) => (
				<Sfx key={`a${i}`} src="pop" at={b.at} volume={b.from === 'them' ? 0.16 : 0.1} />
			))}
			{[0, 0.16, 0.34, 0.48, 0.66, 0.8].map((d, i) => (
				<Sfx key={`k${i}`} src="tick" at={r.typing[0] + 0.1 + d} volume={0.1} />
			))}
			<Sfx src="send" at={r.sendAt - 0.12} volume={0.28} />
			<Sfx src="impact" at={r.sendAt} volume={0.5} />
			{v.silence.map((b, i) => (
				<Sfx key={`s${i}`} src="pop" at={b.at} volume={0.12 - i * 0.025} />
			))}
			<Sfx src="pop" at={v.pattern.reactionAt} volume={0.12} />
			{[0, 1, 2, 3, 4].map((i) => (
				<Sfx key={`p${i}`} src="pop" at={v.pattern.patternAt + i * 0.17} volume={0.06} />
			))}
			<Sfx src="swell" at={re.finalAt - 1.55} volume={0.3} />
			<Sfx src="impact" at={re.finalAt} volume={0.75} />
		</>
	);
};

export const PsychologyShort: React.FC<{v: VideoConfig}> = ({v}) => {
	const frame = useCurrentFrame();
	const t = frame / VIDEO.fps;
	const [fontHandle] = useState(() => delayRender('Loading embedded fonts'));
	useEffect(() => {
		fontsReady.then(() => continueRender(fontHandle));
	}, [fontHandle]);
	const total = s2f(v.timeline.duration);
	const sc = v.scenes;
	// Music sits under the voice, lifts slightly for the final statement.
	const musicVol = (f: number) => interpolate(f, [0, 8, s2f(v.respect.cardAt), s2f(v.respect.finalAt), total], [0, 0.5, 0.5, 0.68, 0.6], {extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill style={{backgroundColor: palette.void}}>
			<Scene start={sc.hook[0]} end={sc.hook[1]}>
				<S1Hook v={v} />
			</Scene>
			<Scene start={sc.availability[0]} end={sc.availability[1]}>
				<S2Availability v={v} />
			</Scene>
			<Scene start={sc.refusal[0]} end={sc.refusal[1]}>
				<S3Refusal v={v} />
			</Scene>
			<Scene start={sc.silence[0]} end={sc.silence[1]}>
				<S4Silence v={v} />
			</Scene>
			<Scene start={sc.pattern[0]} end={sc.pattern[1]}>
				<S5Pattern v={v} />
			</Scene>
			<Scene start={sc.respect[0]} end={sc.respect[1] + 1}>
				<S6Respect v={v} />
			</Scene>

			<Falloff strength={0.45} />
			<Captions t={t} timeline={v.timeline} hidden={v.hiddenCaptions} />
			<Grain />

			<Audio src={staticFile('audio/voiceover.wav')} />
			<Audio src={staticFile('audio/score.wav')} volume={musicVol} />
			<SoundDesign v={v} />
		</AbsoluteFill>
	);
};
