import React from 'react';
import {ease, rise, tween} from '../lib/anim';
import {fonts, palette} from '../theme';

export type BubbleSpec = {
	text: string;
	from: 'me' | 'them';
	/** Global seconds the bubble lands. */
	at: number;
	/** Global seconds it dissolves (omit = stays). */
	until?: number;
	y: number;
	/** Horizontal inset from the screen edge for its side. */
	inset?: number;
	time?: string;
	scale?: number;
	accent?: 'red';
	status?: {text: string; at: number}[];
};

const bubbleStyle = (from: BubbleSpec['from'], accent?: 'red'): React.CSSProperties =>
	from === 'me'
		? {
				background: 'linear-gradient(160deg, #2b4b7c 0%, #1b3158 100%)',
				color: '#eef3ff',
				borderRadius: '36px 36px 10px 36px',
				border: `1.5px solid ${accent === 'red' ? 'rgba(220,70,80,0.75)' : 'rgba(160,195,245,0.22)'}`,
				boxShadow: accent === 'red'
					? '0 0 0 1px rgba(200,50,60,0.25), 0 20px 60px rgba(150,20,35,0.35), inset 0 1px 0 rgba(255,255,255,0.12)'
					: '0 20px 50px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.12)',
			}
		: {
				background: 'linear-gradient(160deg, rgba(30,40,62,0.92) 0%, rgba(17,24,40,0.92) 100%)',
				color: '#dfe6f3',
				borderRadius: '36px 36px 36px 10px',
				border: '1.5px solid rgba(143,180,232,0.14)',
				boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
			};

/** A floating chat bubble with spring-like arrival and a soft dissolve exit. */
export const Bubble: React.FC<BubbleSpec & {t: number}> = ({t, text, from, at, until, y, inset = 96, time, scale = 1, accent, status}) => {
	const inP = rise(t, at, 0.5, ease.out);
	const outP = until === undefined ? 0 : rise(t, until, 0.6, ease.in);
	if (inP <= 0 || outP >= 1) return null;
	// Gentle overshoot without a physics spring, keeps it deterministic per-second.
	const pop = inP < 1 ? 0.86 + 0.14 * inP + Math.sin(inP * Math.PI) * 0.04 : 1;
	const side: React.CSSProperties = from === 'me' ? {right: inset, alignItems: 'flex-end'} : {left: inset, alignItems: 'flex-start'};
	const float = Math.sin((t - at) * 1.1 + y) * 4;
	return (
		<div
			style={{
				position: 'absolute',
				top: y,
				display: 'flex',
				flexDirection: 'column',
				gap: 12,
				...side,
				opacity: inP * (1 - outP),
				filter: `blur(${(1 - inP) * 8 + outP * 12}px)`,
				transformOrigin: from === 'me' ? '100% 100%' : '0% 100%',
				transform: `translateY(${(1 - inP) * 34 - outP * 40 + float}px) scale(${pop * scale})`,
			}}
		>
			<div
				style={{
					...bubbleStyle(from, accent),
					fontFamily: fonts.sans,
					fontWeight: 500,
					fontSize: 42,
					letterSpacing: '-0.01em',
					padding: '24px 36px',
					maxWidth: 560,
					lineHeight: 1.22,
					whiteSpace: 'nowrap',
				}}
			>
				{text}
			</div>
			{time || status ? (
				<div style={{fontFamily: fonts.mono, fontSize: 22, color: palette.dim, letterSpacing: '0.06em', padding: '0 14px', display: 'flex', gap: 16}}>
					{time ? <span>{time}</span> : null}
					{(() => {
						const cur = status?.filter((s) => t >= s.at).pop();
						if (!cur || !status) return null;
						const last = cur === status[status.length - 1];
						return (
							<span style={{opacity: rise(t, cur.at, 0.3), color: last ? palette.cold : palette.dim}}>{cur.text}</span>
						);
					})()}
				</div>
			) : null}
		</div>
	);
};

/** Three-dot typing indicator. */
export const Typing: React.FC<{t: number; from: 'me' | 'them'; start: number; end: number; y: number; inset?: number}> = ({
	t,
	from,
	start,
	end,
	y,
	inset = 96,
}) => {
	const vis = Math.min(rise(t, start, 0.3), 1 - rise(t, end - 0.25, 0.25, ease.in));
	if (vis <= 0) return null;
	return (
		<div
			style={{
				position: 'absolute',
				top: y,
				[from === 'me' ? 'right' : 'left']: inset,
				...bubbleStyle(from),
				padding: '30px 34px',
				display: 'flex',
				gap: 12,
				opacity: vis,
				transform: `scale(${0.9 + 0.1 * vis})`,
			}}
		>
			{[0, 1, 2].map((i) => (
				<div
					key={i}
					style={{
						width: 14,
						height: 14,
						borderRadius: 7,
						background: palette.ice,
						opacity: 0.3 + 0.7 * Math.max(0, Math.sin((t - start) * 7 - i * 0.9)),
						transform: `translateY(${-Math.max(0, Math.sin((t - start) * 7 - i * 0.9)) * 5}px)`,
					}}
				/>
			))}
		</div>
	);
};

/** Small "● online" presence pill. */
export const Presence: React.FC<{t: number; x: number; y: number; opacity: number; label?: string}> = ({t, x, y, opacity, label = 'online'}) => (
	<div
		style={{
			position: 'absolute',
			left: x,
			top: y,
			transform: 'translateX(-50%)',
			display: 'flex',
			alignItems: 'center',
			gap: 12,
			fontFamily: fonts.mono,
			fontSize: 24,
			letterSpacing: '0.14em',
			color: palette.ice,
			opacity,
			padding: '10px 20px',
			borderRadius: 30,
			background: 'rgba(14,22,38,0.7)',
			border: '1px solid rgba(143,180,232,0.18)',
		}}
	>
		<div style={{width: 10, height: 10, borderRadius: 5, background: '#7fb0ff', boxShadow: `0 0 ${8 + tween(Math.sin(t * 3), [-1, 1], [0, 10])}px #7fb0ff`}} />
		{label.toUpperCase()}
	</div>
);
