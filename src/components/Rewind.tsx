import React from 'react';
import {AbsoluteFill, random, staticFile, useCurrentFrame} from 'remotion';
import {fonts} from '../theme';

const tc = (s: number) => {
	const v = Math.max(0, s);
	const f = Math.floor((v % 1) * 30);
	const sec = Math.floor(v) % 60;
	const min = Math.floor(v / 60);
	return `00:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}:${String(f).padStart(2, '0')}`;
};

/**
 * Screen-space VHS rewind overlay. `strength` 0→1 drives tracking bands, noise and the REW HUD;
 * `clock` is the tape position shown in the timecode (pass a value that runs backwards while rewinding).
 */
export const RewindOverlay: React.FC<{strength: number; clock: number; label?: string}> = ({strength, clock, label = 'REW'}) => {
	const frame = useCurrentFrame();
	if (strength <= 0.001) return null;
	const bands = [0, 1, 2, 3].map((i) => {
		const speed = 900 + random(`bs${i}`) * 700;
		const y = ((random(`by${i}`) * 1920 + frame * speed / 30) % 2100) - 90;
		const h = 18 + random(`bh${i}`) * 70;
		return {y, h};
	});
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<AbsoluteFill style={{background: 'rgba(60,40,110,0.16)', opacity: strength, mixBlendMode: 'screen'}} />
			{bands.map((b, i) => (
				<div
					key={i}
					style={{
						position: 'absolute',
						left: 0,
						right: 0,
						top: b.y,
						height: b.h,
						opacity: 0.5 * strength,
						backgroundImage: `linear-gradient(180deg, transparent, rgba(220,210,255,0.22), transparent), url(${staticFile(`textures/grain${(frame + i) % 6}.png`)})`,
						backgroundSize: `100% 100%, 256px 256px`,
						mixBlendMode: 'screen',
					}}
				/>
			))}
			{/* tracking noise at the bottom edge */}
			<div style={{position: 'absolute', left: 0, right: 0, top: 1700, height: 36, opacity: 0.45 * strength, backgroundImage: `url(${staticFile(`textures/grain${frame % 6}.png`)})`, backgroundSize: '200px 36px', mixBlendMode: 'screen'}} />
			<div style={{position: 'absolute', left: 96, top: 236, fontFamily: fonts.mono, color: '#e6e1f7', opacity: strength, display: 'flex', flexDirection: 'column', gap: 8, textShadow: '0 0 12px rgba(185,174,230,0.8)'}}>
				<div style={{fontSize: 40, letterSpacing: '0.12em'}}>◀◀ {label}</div>
				<div style={{fontSize: 24, letterSpacing: '0.18em', color: '#b9aee6'}}>{tc(clock)}</div>
			</div>
		</AbsoluteFill>
	);
};

/** Wraps scene content with horizontal tape-jitter while rewinding. */
export const TapeJitter: React.FC<{strength: number; children: React.ReactNode}> = ({strength, children}) => {
	const frame = useCurrentFrame();
	const dx = strength > 0 ? (random(`tj${frame}`) - 0.5) * 22 * strength : 0;
	const skew = strength > 0 ? (random(`tk${frame}`) - 0.5) * 1.2 * strength : 0;
	return <AbsoluteFill style={{transform: `translateX(${dx}px) skewX(${skew}deg)`}}>{children}</AbsoluteFill>;
};
