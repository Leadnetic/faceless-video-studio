import React from 'react';

// Segment order: a b c d e f g
const DIGITS: Record<string, number[]> = {
	'0': [1, 1, 1, 1, 1, 1, 0],
	'1': [0, 1, 1, 0, 0, 0, 0],
	'2': [1, 1, 0, 1, 1, 0, 1],
	'3': [1, 1, 1, 1, 0, 0, 1],
	'4': [0, 1, 1, 0, 0, 1, 1],
	'5': [1, 0, 1, 1, 0, 1, 1],
	'6': [1, 0, 1, 1, 1, 1, 1],
	'7': [1, 1, 1, 0, 0, 0, 0],
	'8': [1, 1, 1, 1, 1, 1, 1],
	'9': [1, 1, 1, 1, 0, 1, 1],
};

// Hexagonal segments in a 60 × 100 cell.
const SEG = [
	'M10 4 L50 4 L44 10 L16 10 Z',
	'M52 6 L52 47 L46 43 L46 12 Z',
	'M52 53 L52 94 L46 88 L46 57 Z',
	'M10 96 L50 96 L44 90 L16 90 Z',
	'M8 53 L8 94 L14 88 L14 57 Z',
	'M8 6 L8 47 L14 43 L14 12 Z',
	'M10 50 L16 46 L44 46 L50 50 L44 54 L16 54 Z',
];

/** Glowing seven-segment readout, e.g. "2:47". Unlit segments stay faintly visible like a real LED panel. */
export const SevenSeg: React.FC<{
	text: string;
	height: number;
	color: string;
	t: number;
	blink?: boolean;
	glow?: number;
}> = ({text, height, color, t, blink = true, glow = 1}) => {
	const colonOn = !blink || t % 1 < 0.55;
	const chars = text.split('');
	const cell = (c: string) => (c === ':' ? 26 : 66);
	const width = chars.reduce((w, c) => w + cell(c), 0);
	let x = 0;
	return (
		<svg viewBox={`0 0 ${width} 100`} height={height} width={(height * width) / 100} style={{overflow: 'visible', filter: `drop-shadow(0 0 ${6 * glow}px ${color}) drop-shadow(0 0 ${18 * glow}px ${color})`}}>
			{chars.map((c, i) => {
				const ox = x;
				x += cell(c);
				if (c === ':') {
					return (
						<g key={i} fill={color} opacity={colonOn ? 1 : 0.12}>
							<circle cx={ox + 13} cy={32} r={5} />
							<circle cx={ox + 13} cy={68} r={5} />
						</g>
					);
				}
				const on = DIGITS[c] ?? DIGITS['8'];
				return (
					<g key={i} transform={`translate(${ox} 0)`}>
						{SEG.map((d, s) => (
							<path key={s} d={d} fill={color} opacity={on[s] ? 1 : 0.07} />
						))}
					</g>
				);
			})}
		</svg>
	);
};
