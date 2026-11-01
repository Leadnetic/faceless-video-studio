import React from 'react';
import {AbsoluteFill} from 'remotion';
import {ease, rise} from '../lib/anim';
import {fonts, palette} from '../theme';
import type {Timeline} from '../lib/timeline';

const clean = (w: string) => w.toLowerCase().replace(/[^a-z']/g, '');

/** Split words into balanced rows of at most `max` characters. */
const rows = <T extends {word: string}>(words: T[], max = 20): T[][] => {
	const total = words.reduce((n, w) => n + w.word.length + 1, 0);
	const target = total <= max ? total : Math.ceil(total / Math.ceil(total / max));
	const out: T[][] = [[]];
	let len = 0;
	for (const w of words) {
		if (len > 0 && len + w.word.length > target + 3) {
			out.push([]);
			len = 0;
		}
		out[out.length - 1].push(w);
		len += w.word.length + 1;
	}
	return out;
};

export type CaptionsProps = {
	t: number;
	timeline: Timeline;
	/** Line indices that are carried by on-screen typography instead. */
	hidden?: number[];
	/** Vertical centre of the caption block. */
	y?: number;
	/** Optional (video 003+): page long lines into chunks of at most N words. */
	maxWords?: number;
	/** Optional: 'light' for off-white backgrounds. */
	theme?: 'dark' | 'light';
	/** Optional emphasis colour. */
	accent?: string;
	/** Optional characters per row (default 20). */
	rowChars?: number;
};

/** Split a line's words into pages, preferring breaks after punctuation. */
const pages = <T extends {word: string}>(words: T[], max: number): T[][] => {
	const out: T[][] = [[]];
	for (const w of words) {
		const cur = out[out.length - 1];
		cur.push(w);
		const remaining = words.length - words.indexOf(w) - 1;
		if ((cur.length >= max || (cur.length >= 3 && /[,.…?!]$/.test(w.word))) && remaining > 1) out.push([]);
	}
	return out.filter((p) => p.length);
};

/** Word-by-word captions with emphasis colouring; stays inside the platform safe zone. */
export const Captions: React.FC<CaptionsProps> = ({t, timeline, hidden = [], y = 1300, maxWords, theme = 'dark', accent, rowChars = 20}) => {
	const lines = timeline.lines;
	const idx = lines.findIndex((l, i) => t >= l.start - 0.12 && t < (lines[i + 1]?.start ?? Infinity) - 0.12);
	if (idx < 0 || hidden.includes(idx)) return null;
	const line = lines[idx];
	const nextStart = lines[idx + 1]?.start ?? timeline.duration;
	const exitAt = Math.min(line.end + 0.55, nextStart - 0.2);
	const out = rise(t, exitAt, 0.25, ease.in);
	if (out >= 1) return null;

	const emph = new Set(line.emphasis.flatMap((p) => p.split(' ').map(clean)));
	const isNo = (w: string) => ['no', 'yes'].includes(clean(w)) && emph.has(clean(w));
	const light = theme === 'light';
	const paged = maxWords ? pages(line.words, maxWords) : [line.words];
	const page = paged.filter((pg) => t >= pg[0].start - 0.12).pop() ?? paged[0];

	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<div
				style={{
					position: 'absolute',
					left: 120,
					right: 150,
					top: y,
					transform: `translateY(-50%) translateY(${-out * 14}px)`,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 6,
					opacity: 1 - out,
					filter: `blur(${out * 6}px)`,
				}}
			>
				{/* soft legibility plate */}
				<div
					style={{
						position: 'absolute',
						inset: '-60px -40px',
						background: light ? 'radial-gradient(closest-side, rgba(239,233,223,0.75), transparent)' : 'radial-gradient(closest-side, rgba(3,5,10,0.55), transparent)',
						zIndex: -1,
					}}
				/>
				{rows(page, rowChars).map((row, r) => (
					<div key={r} style={{display: 'flex', gap: 18, justifyContent: 'center', flexWrap: 'nowrap'}}>
						{row.map((w, i) => {
							const p = rise(t, w.start - 0.06, 0.28, ease.out);
							const active = t >= w.start && t < w.end + 0.08;
							const em = emph.has(clean(w.word));
							const color = accent ? (em ? accent : light ? '#1d1b1f' : palette.text) : isNo(w.word) ? (clean(w.word) === 'no' ? '#ff5a63' : palette.ice) : em ? palette.cold : palette.text;
							return (
								<span
									key={i}
									style={{
										fontFamily: fonts.sans,
										fontWeight: em ? 800 : 600,
										fontSize: 66,
										lineHeight: 1.16,
										letterSpacing: '-0.015em',
										color,
										opacity: p,
										transform: `translateY(${(1 - p) * 16}px) scale(${active && em ? 1.05 : 1})`,
										filter: `blur(${(1 - p) * 5}px)`,
										textShadow: light ? 'none' : '0 2px 2px rgba(0,0,0,0.6), 0 8px 32px rgba(0,0,0,0.75)',
										display: 'inline-block',
									}}
								>
									{w.word}
								</span>
							);
						})}
					</div>
				))}
			</div>
		</AbsoluteFill>
	);
};
