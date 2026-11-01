import React, {createContext, useContext} from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {ease, rise, s2f} from '../lib/anim';
import {fonts, VIDEO} from '../theme';

const SceneCtx = createContext(0);

/** Current global time (seconds) inside a Scene. */
export const useTime = () => (useCurrentFrame() + useContext(SceneCtx)) / VIDEO.fps;

/**
 * Mounts a scene between global [start, end] seconds with a dissolve-through-dark
 * at both edges. Scenes may overlap by the fade length for continuous transitions.
 */
export const Scene: React.FC<{start: number; end: number; fade?: number; children: React.ReactNode}> = ({start, end, fade = 0.4, children}) => {
	const from = s2f(start);
	return (
		<Sequence from={from} durationInFrames={s2f(end) - from}>
			<SceneCtx.Provider value={from}>
				<SceneFader start={start} end={end} fade={fade}>
					{children}
				</SceneFader>
			</SceneCtx.Provider>
		</Sequence>
	);
};

const SceneFader: React.FC<{start: number; end: number; fade: number; children: React.ReactNode}> = ({start, end, fade, children}) => {
	const t = useTime();
	const o = Math.min(start === 0 ? 1 : rise(t, start, fade, ease.soft), 1 - rise(t, end - fade, fade, ease.soft));
	return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

/** One-shot sound effect at global time `at`. */
export const Sfx: React.FC<{src: string; at: number; volume?: number; dir?: string}> = ({src, at, volume = 0.5, dir = 'audio/sfx'}) => (
	<Sequence from={Math.max(0, s2f(at))} layout="none">
		<Audio src={staticFile(`${dir}/${src}.wav`)} volume={volume} />
	</Sequence>
);

/** Animated film grain from pre-rendered noise tiles (cheap vs. per-frame feTurbulence). */
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.06}) => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill
			style={{
				opacity,
				mixBlendMode: 'overlay',
				pointerEvents: 'none',
				backgroundImage: `url(${staticFile(`textures/grain${frame % 6}.png`)})`,
				backgroundSize: '512px 512px',
				backgroundPosition: `${(frame * 137) % 512}px ${(frame * 291) % 512}px`,
			}}
		/>
	);
};

/** Tracked, small-caps label (chapter marks, series titles). */
export const Kicker: React.FC<{text: string; t: number; at: number; y: number; color?: string; until?: number}> = ({text, t, at, y, color = '#8590a6', until}) => {
	const p = rise(t, at, 1.2, ease.out);
	const out = until ? rise(t, until, 0.5, ease.in) : 0;
	return (
		<div
			style={{
				position: 'absolute',
				top: y,
				left: 0,
				right: 0,
				textAlign: 'center',
				fontFamily: fonts.sans,
				fontWeight: 600,
				fontSize: 26,
				letterSpacing: `${0.28 + (1 - p) * 0.25}em`,
				color,
				opacity: p * (1 - out),
				textTransform: 'uppercase',
				paddingLeft: '0.3em',
			}}
		>
			{text}
		</div>
	);
};

/** Word-staggered headline reveal (blur + rise), reusable for statements. */
export const Reveal: React.FC<{
	text: string;
	t: number;
	at: number;
	stagger?: number;
	style?: React.CSSProperties;
	wordStyle?: (word: string, i: number) => React.CSSProperties | undefined;
}> = ({text, t, at, stagger = 0.12, style, wordStyle}) => (
	<div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 0.28em', ...style}}>
		{text.split(' ').map((w, i) => {
			const p = rise(t, at + i * stagger, 0.7, ease.out);
			return (
				<span
					key={i}
					style={{
						display: 'inline-block',
						opacity: p,
						transform: `translateY(${(1 - p) * 26}px)`,
						filter: `blur(${(1 - p) * 10}px)`,
						...wordStyle?.(w, i),
					}}
				>
					{w}
				</span>
			);
		})}
	</div>
);
