import React from 'react';
import {random} from 'remotion';
import {ease, rise, tween} from '../lib/anim';
import {fonts} from '../theme';
import {Figure} from './Figure';

export const memoryTint = {
	glass: 'linear-gradient(160deg, rgba(52,42,92,0.55) 0%, rgba(16,15,34,0.82) 100%)',
	edge: 'rgba(190,178,240,0.24)',
	lilac: '#b9aee6',
	violet: '#7d6bc4',
	text: '#e6e1f7',
	dim: '#8b84a8',
};

export type MemoryCardProps = {
	x: number;
	y: number;
	w: number;
	h: number;
	t: number;
	/** 0→1 arrival, 0→1 departure. */
	appear: number;
	exit?: number;
	/** 0→1 VHS/RGB glitch strength (rewind). */
	glitch?: number;
	label?: string;
	tilt?: number;
	children: React.ReactNode;
};

/** A floating fragment of memory: violet glass, scanlines, a clip label. */
export const MemoryCard: React.FC<MemoryCardProps> = ({x, y, w, h, t, appear, exit = 0, glitch = 0, label, tilt = 0, children}) => {
	if (appear <= 0 || exit >= 1) return null;
	const jitter = glitch > 0 ? (random(`j${Math.floor(t * 30)}${x}`) - 0.5) * 26 * glitch : 0;
	const split = 3 + glitch * 9;
	const float = Math.sin(t * 0.9 + x * 0.01) * 6;
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				width: w,
				height: h,
				borderRadius: 30,
				overflow: 'hidden',
				background: memoryTint.glass,
				border: `1.5px solid ${memoryTint.edge}`,
				boxShadow: '0 30px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)',
				opacity: appear * (1 - exit),
				transform: `translate(${jitter}px, ${(1 - appear) * 40 - exit * 30 + float}px) scale(${0.9 + 0.1 * appear}) rotate(${tilt}deg)`,
				filter: `blur(${(1 - appear) * 10 + exit * 10}px) drop-shadow(${-split}px 0 0 rgba(255,70,120,${0.18 + glitch * 0.35})) drop-shadow(${split}px 0 0 rgba(80,190,255,${0.18 + glitch * 0.35}))`,
			}}
		>
			{children}
			{/* scanlines */}
			<div style={{position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.035) 0 2px, transparent 2px 5px)', pointerEvents: 'none'}} />
			{label ? (
				<div style={{position: 'absolute', left: 24, top: 18, fontFamily: fonts.mono, fontSize: 19, letterSpacing: '0.18em', color: memoryTint.dim, display: 'flex', alignItems: 'center', gap: 10}}>
					<span style={{width: 9, height: 9, borderRadius: 5, background: '#c56a8a', opacity: 0.5 + 0.5 * Math.sin(t * 6)}} />
					{label}
				</div>
			) : null}
		</div>
	);
};

/** Chat fragment: one word in the reply is the one that keeps coming back. */
export const ChatMemory: React.FC<{t: number; at: number; them: string; me: string; word: string}> = ({t, at, them, me, word}) => {
	const a = rise(t, at + 0.15, 0.45, ease.out);
	const b = rise(t, at + 0.55, 0.45, ease.out);
	const hl = rise(t, at + 0.9, 0.6, ease.out);
	const [pre, post] = me.split(word);
	const bubble: React.CSSProperties = {fontFamily: fonts.sans, fontWeight: 500, fontSize: 34, padding: '16px 26px', lineHeight: 1.2, whiteSpace: 'nowrap'};
	return (
		<div style={{position: 'absolute', inset: '62px 26px 26px', display: 'flex', flexDirection: 'column', gap: 16}}>
			<div style={{...bubble, alignSelf: 'flex-start', background: 'rgba(30,30,58,0.9)', color: memoryTint.text, borderRadius: '28px 28px 28px 8px', opacity: a, transform: `translateY(${(1 - a) * 14}px)`}}>
				{them}
			</div>
			<div style={{...bubble, alignSelf: 'flex-end', background: 'linear-gradient(160deg,#3b3170,#272052)', color: '#f0ecff', borderRadius: '28px 28px 8px 28px', opacity: b, transform: `translateY(${(1 - b) * 14}px)`}}>
				{pre}
				<span style={{position: 'relative', color: tween(hl, [0, 1], [0, 1]) > 0.5 ? '#ffffff' : undefined, textShadow: `0 0 ${18 * hl}px rgba(200,180,255,${hl})`}}>
					{word}
					<span style={{position: 'absolute', left: 0, bottom: -4, height: 3, width: `${hl * 100}%`, background: memoryTint.lilac, borderRadius: 2, boxShadow: `0 0 12px ${memoryTint.lilac}`}} />
				</span>
				{post}
			</div>
		</div>
	);
};

/** Two-voice waveform with a flat-lined gap: the awkward pause. */
export const PauseMemory: React.FC<{t: number; at: number}> = ({t, at}) => {
	const bars = 34;
	const head = tween(t, [at + 0.1, at + 1.6], [0, 1], ease.inOut);
	return (
		<div style={{position: 'absolute', inset: '64px 30px 30px'}}>
			<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', gap: 6}}>
				{new Array(bars).fill(0).map((_, i) => {
					const inGap = i >= 13 && i <= 21;
					const base = 0.25 + random(`bar${i}`) * 0.75;
					const live = (i / bars) <= head + 0.02;
					const hgt = inGap ? 0.04 : base * (0.65 + 0.35 * Math.sin(t * 9 + i * 1.7)) * (live ? 1 : 0.35);
					return <div key={i} style={{flex: 1, height: `${Math.max(4, hgt * 100)}%`, borderRadius: 4, background: i < 13 ? 'rgba(140,128,200,0.85)' : inGap ? 'rgba(185,174,230,0.35)' : 'rgba(110,150,220,0.85)'}} />;
				})}
			</div>
			<div style={{position: 'absolute', left: `${head * 100}%`, top: -10, bottom: -10, width: 2, background: memoryTint.lilac, boxShadow: `0 0 10px ${memoryTint.lilac}`}} />
			<div style={{position: 'absolute', left: '38%', right: '38%', bottom: -6, textAlign: 'center', fontFamily: fonts.mono, fontSize: 22, letterSpacing: '0.3em', color: memoryTint.dim, opacity: rise(t, at + 0.8, 0.4)}}>
				· · ·
			</div>
		</div>
	);
};

/** The other person, faceless, slightly turned: the look on their face. */
export const FaceMemory: React.FC<{t: number; at: number; w: number; h: number}> = ({t, at, w, h}) => {
	const turn = tween(t, [at + 0.3, at + 1.4], [0, 1], ease.inOut);
	return (
		<div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
			<div style={{position: 'absolute', inset: 0, background: 'radial-gradient(70% 60% at 65% 35%, rgba(150,130,220,0.35), transparent 70%)'}} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 40, transform: `skewX(${-turn * 6}deg) translateX(${-turn * 14}px)`, filter: 'blur(1.4px)'}}>
				<Figure x={w / 2} y={h * 2.55} height={h * 2.5} t={t} rimColor={memoryTint.lilac} rimSide={1} rimStrength={1.2} keyLight={0.5} reflection={false} />
			</div>
		</div>
	);
};
