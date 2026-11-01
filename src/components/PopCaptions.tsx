import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {Timeline} from '../lib/timeline';
import {fonts} from '../theme';
import {OUT, pop} from './Toon';

const clean = (w: string) => w.toLowerCase().replace(/[^a-z']/g, '');

/**
 * TikTok-native captions: 1–3 words at a time, heavy outlined type, the spoken word
 * highlighted and popped. Pages break on punctuation so phrases stay intact.
 */
export const PopCaptions: React.FC<{t: number; timeline: Timeline; y?: number; maxWords?: number; highlight?: string; hidden?: number[]; right?: number}> = ({
	t,
	timeline,
	y = 1250,
	maxWords = 3,
	highlight = '#ffe14d',
	hidden = [],
	right = 130,
}) => {
	const words = timeline.lines.flatMap((l) => (hidden.includes(l.index) ? [] : l.words.map((w) => ({...w, em: l.emphasis.some((e) => clean(e) === clean(w.word)), line: l.index}))));
	const pages: (typeof words)[] = [];
	let cur: typeof words = [];
	words.forEach((w, i) => {
		cur.push(w);
		const next = words[i + 1];
		if (!next || cur.length >= maxWords || /[,.…?!:]$/.test(w.word) || next.line !== w.line || next.start - w.end > 0.35) {
			pages.push(cur);
			cur = [];
		}
	});
	const page = pages.find((p, i) => t >= p[0].start - 0.05 && t < (pages[i + 1]?.[0].start ?? p[p.length - 1].end + 0.5) - 0.05 && t < p[p.length - 1].end + 0.6);
	if (!page) return null;
	const enter = pop(t, page[0].start - 0.05, 0.22);
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<div style={{position: 'absolute', left: 90, right, top: y, transform: `translateY(-50%) scale(${0.85 + 0.15 * enter})`, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 22px'}}>
				{page.map((w, i) => {
					const active = t >= w.start - 0.03;
					const hot = t >= w.start - 0.03 && t < w.end + 0.05;
					const wp = pop(t, w.start - 0.04, 0.2);
					return (
						<span
							key={i}
							style={{
								fontFamily: fonts.punch,
								fontWeight: 900,
								fontSize: 86,
								lineHeight: 1.1,
								textTransform: 'uppercase',
								color: hot || w.em ? highlight : '#fff',
								WebkitTextStroke: `14px ${OUT}`,
								paintOrder: 'stroke fill',
								textShadow: `0 8px 0 ${OUT}`,
								opacity: active ? 1 : 0.0,
								transform: `scale(${active ? 0.7 + 0.3 * wp + (hot ? 0.06 : 0) : 0.7}) rotate(${hot ? -2 : 0}deg)`,
								display: 'inline-block',
							}}
						>
							{w.word.replace(/[…]/g, '')}
						</span>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};
