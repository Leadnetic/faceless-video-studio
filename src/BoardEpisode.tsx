import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {ArchiveLight, BoardCam, Headline, TapeCaptions, type CamKey} from './components/Board';
import {Sfx} from './components/Primitives';
import {SafeGuide} from './components/SafeZone';
import {s2f} from './lib/anim';
import type {Timeline} from './lib/timeline';
import {fontsReady, VIDEO} from './theme';
import {BOARD_EPISODES} from './videos/board';

export type BoardEpisodeDef = {
	id: string;
	timeline: Timeline;
	audioDir: string;
	hook: string;
	hookUntil?: number;
	cam: CamKey[];
	World: React.FC<{t: number}>;
	Overlay?: React.FC<{t: number}>;
	shake?: (t: number) => number;
	sfx: [src: string, at: number, volume: number][];
	music?: number;
};

/** "THE ARCHIVE" renderer: one continuous camera move over an evidence wall (no hard cuts), tape captions, documentary bed. */
export const BoardEpisode: React.FC<{epId: string; guides?: boolean}> = ({epId, guides}) => {
	const ep = BOARD_EPISODES[epId];
	const frame = useCurrentFrame();
	const t = frame / VIDEO.fps;
	const [h] = useState(() => delayRender('Loading embedded fonts'));
	useEffect(() => {
		fontsReady.then(() => continueRender(h));
	}, [h]);
	const total = s2f(ep.timeline.duration);
	const vol = ep.music ?? 0.3;
	const musicVol = (f: number) => interpolate(f, [0, 8, total - 25, total], [vol * 0.7, vol, vol, vol * 0.3], {extrapolateRight: 'clamp'});
	const {World, Overlay} = ep;
	return (
		<AbsoluteFill style={{backgroundColor: '#140f0c'}}>
			<BoardCam t={t} keys={ep.cam} shake={ep.shake ? ep.shake(t) : 0}>
				<World t={t} />
			</BoardCam>
			<ArchiveLight t={t} />
			{Overlay ? <Overlay t={t} /> : null}
			<Headline t={t} text={ep.hook} until={ep.hookUntil ?? 3} />
			<TapeCaptions t={t} timeline={ep.timeline} />
			{guides ? <SafeGuide /> : null}
			<Audio src={staticFile(`${ep.audioDir}/voiceover.wav`)} />
			<Audio src={staticFile(`${ep.audioDir}/score.wav`)} volume={musicVol} />
			{ep.sfx.map(([src, at, v], i) => (
				<Sfx key={i} src={src} at={at} volume={v} dir={`${ep.audioDir}/sfx`} />
			))}
		</AbsoluteFill>
	);
};
