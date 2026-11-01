import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {PopCaptions} from './components/PopCaptions';
import {Scene, Sfx, useTime} from './components/Primitives';
import {SafeGuide} from './components/SafeZone';
import {s2f} from './lib/anim';
import type {Timeline} from './lib/timeline';
import {fontsReady, VIDEO} from './theme';
import {EPISODES} from './videos/episodes';

/** A shot gets global time t plus its own start/end. */
export type ShotCtx = {t: number; s: number; e: number};
export type ShotDef = {at: number; C: React.FC<ShotCtx>; cut?: 'pop' | 'none'};
export type EpisodeDef = {
	id: string;
	timeline: Timeline;
	audioDir: string;
	shots: ShotDef[];
	sfx: [src: string, at: number, volume: number][];
	music?: number;
};

const ShotHost: React.FC<{shot: ShotDef; s: number; e: number}> = ({shot, s, e}) => {
	const t = useTime();
	// snappy cut: a 4-frame settle from 1.05 to 1.0
	const k = shot.cut === 'none' ? 1 : interpolate(t, [s, s + 0.14], [1.05, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const C = shot.C;
	return (
		<AbsoluteFill style={{transform: `scale(${k})`}}>
			<C t={t} s={s} e={e} />
		</AbsoluteFill>
	);
};

/**
 * Generic renderer for the "your brain" cartoon series: consecutive shots anchored to narration,
 * TikTok captions inside the platform safe zone, music bed + per-cue SFX, optional safe-zone guides.
 */
export const ToonEpisode: React.FC<{epId: string; guides?: boolean}> = ({epId, guides}) => {
	const ep = EPISODES[epId];
	const frame = useCurrentFrame();
	const t = frame / VIDEO.fps;
	const [fontHandle] = useState(() => delayRender('Loading embedded fonts'));
	useEffect(() => {
		fontsReady.then(() => continueRender(fontHandle));
	}, [fontHandle]);
	const total = s2f(ep.timeline.duration);
	const vol = ep.music ?? 0.3;
	const musicVol = (f: number) => interpolate(f, [0, 6, total - 20, total], [vol * 0.8, vol, vol, vol * 0.4], {extrapolateRight: 'clamp'});
	const dir = `${ep.audioDir}/sfx`;
	return (
		<AbsoluteFill style={{backgroundColor: '#2a2470'}}>
			{ep.shots.map((sh, i) => {
				const s = sh.at;
				const e = ep.shots[i + 1]?.at ?? ep.timeline.duration + 1;
				return (
					<Scene key={i} start={s} end={e} fade={0.04}>
						<ShotHost shot={sh} s={s} e={e} />
					</Scene>
				);
			})}
			<PopCaptions t={t} timeline={ep.timeline} y={1300} right={170} />
			{guides ? <SafeGuide /> : null}
			<Audio src={staticFile(`${ep.audioDir}/voiceover.wav`)} />
			<Audio src={staticFile(`${ep.audioDir}/score.wav`)} volume={musicVol} />
			{ep.sfx.map(([src, at, v], i) => (
				<Sfx key={i} src={src} at={at} volume={v} dir={dir} />
			))}
		</AbsoluteFill>
	);
};
