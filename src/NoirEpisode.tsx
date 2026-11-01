import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {ComicCaptions, HookTitle, N, PaperOverlay} from './components/Noir';
import {Scene, Sfx, useTime} from './components/Primitives';
import {SafeGuide} from './components/SafeZone';
import {s2f} from './lib/anim';
import type {EpisodeDef, ShotDef} from './ToonEpisode';
import {fontsReady, VIDEO} from './theme';
import {NOIR_EPISODES} from './videos/noir';

export type NoirEpisodeDef = EpisodeDef & {hook: string; hookUntil?: number; captionY?: number; hideCaptions?: number[]};

const ShotHost: React.FC<{shot: ShotDef; s: number; e: number}> = ({shot, s, e}) => {
	const t = useTime();
	// comic "panel slam": a 5-frame settle with a tiny rotation
	const k = shot.cut === 'none' ? 0 : interpolate(t, [s, s + 0.17], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const C = shot.C;
	return (
		<AbsoluteFill style={{transform: `scale(${1 + 0.06 * k}) rotate(${k * 1.2}deg)`}}>
			<C t={t} s={s} e={e} />
		</AbsoluteFill>
	);
};

/** Renderer for the noir "Case Files" series: shots, comic lettering, paper texture, jazz bed + SFX. */
export const NoirEpisode: React.FC<{epId: string; guides?: boolean}> = ({epId, guides}) => {
	const ep = NOIR_EPISODES[epId];
	const frame = useCurrentFrame();
	const t = frame / VIDEO.fps;
	const [fontHandle] = useState(() => delayRender('Loading embedded fonts'));
	useEffect(() => {
		fontsReady.then(() => continueRender(fontHandle));
	}, [fontHandle]);
	const total = s2f(ep.timeline.duration);
	const vol = ep.music ?? 0.32;
	const musicVol = (f: number) => interpolate(f, [0, 6, total - 20, total], [vol * 0.8, vol, vol, vol * 0.4], {extrapolateRight: 'clamp'});
	const dir = `${ep.audioDir}/sfx`;
	return (
		<AbsoluteFill style={{backgroundColor: N.ink}}>
			{ep.shots.map((sh, i) => {
				const s = sh.at;
				const e = ep.shots[i + 1]?.at ?? ep.timeline.duration + 1;
				return (
					<Scene key={i} start={s} end={e} fade={0.03}>
						<ShotHost shot={sh} s={s} e={e} />
					</Scene>
				);
			})}
			<PaperOverlay />
			<HookTitle t={t} text={ep.hook} until={ep.hookUntil ?? 2.9} />
			<ComicCaptions t={t} timeline={ep.timeline} y={ep.captionY ?? 1310} hidden={ep.hideCaptions} />
			{guides ? <SafeGuide /> : null}
			<Audio src={staticFile(`${ep.audioDir}/voiceover.wav`)} />
			<Audio src={staticFile(`${ep.audioDir}/score.wav`)} volume={musicVol} />
			{ep.sfx.map(([src, at, v], i) => (
				<Sfx key={i} src={src} at={at} volume={v} dir={dir} />
			))}
		</AbsoluteFill>
	);
};
