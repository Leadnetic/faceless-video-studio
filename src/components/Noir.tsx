import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {ease, rise, tween} from '../lib/anim';
import type {Timeline} from '../lib/timeline';
import {fonts} from '../theme';
import {Grain} from './Primitives';
import {pop} from './Toon';

/**
 * "Case Files" — graphic-novel noir kit (video 009+).
 * Ink outlines, halftone shadows, mustard brand accent, comic lettering.
 */
export const N = {
	ink: '#0e0d12',
	paper: '#efe6d2',
	paperDark: '#d9cdb2',
	mustard: '#e2b33c',
	mustardDeep: '#b8862a',
	teal: '#1f3b3d',
	tealMid: '#2d5658',
	tealLight: '#4f7f7c',
	red: '#c8323c',
	redDeep: '#7d1f2a',
	plum: '#3b1e4a',
	white: '#fbf7ee',
};

const INKW = 5;

/* ------------------------------------------------------------------ talk */

/** Mouth-open amount for `who` at time t, driven by the word timings of their lines. */
export const talkAmp = (tl: Timeline, t: number, who: string) => {
	const l = tl.lines.find((x) => x.speaker === who && t >= x.start - 0.02 && t <= x.end + 0.02);
	if (!l) return 0;
	const w = l.words.find((x) => t >= x.start && t < x.end);
	if (!w) return 0.08;
	const p = (t - w.start) / Math.max(0.05, w.end - w.start);
	return Math.max(0, Math.sin(Math.PI * p)) * (0.5 + 0.5 * Math.abs(Math.sin(t * 21 + w.start * 7)));
};

/* ------------------------------------------------------------------ characters */

export type HairStyle = 'curls' | 'bob' | 'buzz' | 'side' | 'big';
export type CharLook = {
	skin: string;
	hair: string;
	hairStyle: HairStyle;
	brow?: string;
	iris?: string;
	shirt: string;
	vest?: string;
	jacket?: string;
	tie?: string;
	shawl?: string;
	scarf?: string;
	earrings?: string;
	lips?: string;
	stubble?: number;
	liner?: boolean;
	pocket?: string;
	seed?: number;
};

export const CAST: Record<string, CharLook> = {
	reader: {skin: '#e7b892', hair: '#d8b264', brow: '#9a7436', iris: '#5b8aa0', hairStyle: 'curls', shirt: '#f5f0e4', vest: '#33363f', pocket: N.mustard, stubble: 0.35, seed: 3},
	detective: {skin: '#c98e6b', hair: '#1b1514', brow: '#1b1514', iris: '#5a3b2a', hairStyle: 'bob', shirt: '#e8e2d6', jacket: '#1c2a33', lips: '#9c3a3f', seed: 5},
	suspect: {skin: '#d9a17b', hair: '#3a2a22', brow: '#2a1d17', iris: '#4b3626', hairStyle: 'buzz', shirt: '#7a2f33', jacket: '#4a4038', stubble: 0.75, seed: 8},
	client: {skin: '#b67d58', hair: '#2a1d17', brow: '#2a1d17', iris: '#3d2a1d', hairStyle: 'side', shirt: '#e9e1cf', jacket: '#5d7f95', tie: N.mustardDeep, seed: 11},
	psychic: {skin: '#e9bc98', hair: '#5b1f2a', brow: '#4a1820', iris: '#3f6b4a', hairStyle: 'big', shirt: N.plum, shawl: '#5a2d6b', scarf: N.red, earrings: N.mustard, lips: '#a3283a', liner: true, seed: 13},
};

const FACE = 'M206 250 C204 150 396 150 394 250 L392 330 C388 402 352 452 300 458 C248 452 212 402 208 330 Z';
const NECK = 'M258 400 L256 548 Q300 574 344 548 L342 400 Z';
const TORSO = 'M34 850 C40 640 140 590 250 552 Q300 572 350 552 C460 590 560 640 566 850 Z';
const SHADE = 'M300 110 C350 190 330 290 356 372 C346 430 326 456 300 474 L480 474 L480 110 Z';
const BODY_SHADE = 'M300 540 C380 600 400 700 380 850 L600 850 L600 540 Z';

/** Procedural tousled curls over the crown (deterministic per seed). */
const curlsPath = (seed: number, rx = 120, ry = 116, n = 14, big = 1) => {
	const cx = 300;
	const cy = 246;
	const a0 = Math.PI * 1.08;
	const a1 = -Math.PI * 0.08;
	const pts: [number, number][] = [];
	for (let i = 0; i <= n; i++) {
		const a = a0 + ((a1 - a0) * i) / n;
		const j = 1 + (random(`c${seed}${i}`) - 0.5) * 0.08;
		pts.push([cx + Math.cos(a) * rx * j * big, cy - Math.sin(a) * ry * j * big]);
	}
	let d = `M${pts[0][0]} ${pts[0][1] + 40}L${pts[0][0]} ${pts[0][1]}`;
	for (let i = 0; i < n; i++) {
		const [x0, y0] = pts[i];
		const [x1, y1] = pts[i + 1];
		const mx = (x0 + x1) / 2;
		const my = (y0 + y1) / 2;
		const ox = mx - cx;
		const oy = my - cy;
		const len = Math.hypot(ox, oy);
		const k = 26 + random(`k${seed}${i}`) * 18;
		d += `Q${mx + (ox / len) * k} ${my + (oy / len) * k} ${x1} ${y1}`;
	}
	const [ex, ey] = pts[n];
	// right sideburn, then a curly fringe back across the forehead
	d += `L${ex} ${ey + 52}C388 236 360 214 336 222Q326 252 306 230Q292 258 270 226Q252 246 236 224C220 236 210 262 ${pts[0][0] + 6} ${pts[0][1] + 40}Z`;
	return d;
};

const HAIR_FRONT: Record<Exclude<HairStyle, 'curls' | 'big'>, string> = {
	bob: 'M194 330 C176 158 262 126 302 128 C364 126 424 168 406 330 L414 430 C402 446 382 442 376 428 L380 300 C372 242 334 214 304 210 C286 238 244 252 216 258 L222 428 C214 444 194 446 186 430 Z',
	buzz: 'M210 266 C204 160 396 160 390 266 C382 222 352 204 300 204 C248 204 218 222 210 266 Z',
	side: 'M204 282 C194 146 406 146 396 282 C392 236 380 214 352 204 C312 230 250 224 222 232 C212 246 206 262 204 282 Z',
};

export type BustProps = {
	x: number;
	/** bottom of the frame-filling shoulders */
	y: number;
	/** rendered height of the 600×800 drawing */
	size: number;
	t: number;
	who?: keyof typeof CAST | string;
	look?: CharLook;
	smile?: number;
	asym?: number;
	open?: number;
	talk?: number;
	browL?: number;
	browR?: number;
	knit?: number;
	lids?: number;
	lookX?: number;
	lookY?: number;
	tilt?: number;
	turn?: number;
	light?: 'left' | 'right';
	shade?: number;
	sweat?: number;
	blush?: number;
	flip?: boolean;
	/** draw as a flat silhouette (over-the-shoulder foreground) */
	solid?: string;
	rim?: string;
	blink?: boolean;
	style?: React.CSSProperties;
};

/** Head-and-shoulders graphic-novel character. */
export const Bust: React.FC<BustProps> = ({
	x,
	y,
	size,
	t,
	who = 'reader',
	look,
	smile = 0,
	asym = 0,
	open = 0,
	talk = 0,
	browL = 0,
	browR = 0,
	knit = 0,
	lids = 1,
	lookX = 0,
	lookY = 0,
	tilt = 0,
	turn = 0,
	light = 'left',
	shade = 0.8,
	sweat = 0,
	blush = 0,
	flip = false,
	solid,
	rim,
	blink = true,
	style,
}) => {
	const c = look ?? CAST[who] ?? CAST.reader;
	const uid = React.useId().replace(/:/g, '');
	const w = (size * 600) / 800;
	const seed = c.seed ?? 1;
	const breathe = Math.sin(t * 1.6 + seed) * 3;
	const blinkNow = blink && ((t + seed * 0.37) % 3.7) < 0.12;
	const o = blinkNow ? 0.05 : lids;
	const fx = turn * 18;
	const ink = solid ?? N.ink;
	const fill = (col: string) => solid ?? col;
	const mouthOpen = Math.min(1, open + talk * 0.75);

	const eye = (cx: number, side: -1 | 1) => {
		const cxx = cx + fx;
		const top = -17 * o;
		const almond = `M${cxx - 25} 312 Q${cxx} ${312 + top} ${cxx + 25} 312 Q${cxx} ${312 + 13 * Math.max(o, 0.3)} ${cxx - 25} 312 Z`;
		const ix = cxx + lookX * 11;
		const iy = 312 + lookY * 5 - (1 - o) * 2;
		return (
			<g key={side}>
				<clipPath id={`e${uid}${side}`}>
					<path d={almond} />
				</clipPath>
				{o > 0.12 ? (
					<>
						<path d={almond} fill={N.white} />
						<g clipPath={`url(#e${uid}${side})`}>
							<circle cx={ix} cy={iy} r={11} fill={c.iris ?? '#4b3626'} />
							<circle cx={ix} cy={iy} r={5.5} fill={N.ink} />
							<circle cx={ix + 3.5} cy={iy - 4} r={2.6} fill="#fff" />
							<rect x={cxx - 30} y={290} width={60} height={14 * (1 - o) + 4} fill={c.skin} opacity={0.0} />
						</g>
					</>
				) : null}
				<path d={`M${cxx - 27} 313 Q${cxx} ${312 + top - 1} ${cxx + 27} 312`} stroke={N.ink} strokeWidth={c.liner ? 8 : 6} fill="none" strokeLinecap="round" />
				{c.liner ? <path d={`M${cxx + side * 26} 311 l${side * 12} -8`} stroke={N.ink} strokeWidth={5} strokeLinecap="round" /> : null}
				{o > 0.12 ? <path d={`M${cxx - 20} ${314 + 11 * o} Q${cxx} ${318 + 12 * o} ${cxx + 20} ${314 + 11 * o}`} stroke={N.ink} strokeWidth={2} fill="none" opacity={0.6} /> : null}
			</g>
		);
	};

	const brow = (side: -1 | 1, raise: number) => {
		const inner = 300 + side * 20 + fx;
		const outer = 300 + side * 70 + fx;
		const yi = 274 - raise * 14 + knit * 10;
		const yo = 278 - raise * 16 - knit * 3;
		return <path key={`b${side}`} d={`M${inner} ${yi} Q${(inner + outer) / 2} ${yi - 10 - raise * 4} ${outer} ${yo}`} stroke={c.brow ?? c.hair} strokeWidth={11} fill="none" strokeLinecap="round" />;
	};

	const gasp = mouthOpen > 0.06 && smile < 0;
	const lx = (gasp ? 280 : 268) + fx;
	const rx = (gasp ? 320 : 332) + fx;
	const my = 410;
	const cornerK = mouthOpen > 0.06 && smile < 0 ? 18 : 9;
	const ly = my - smile * cornerK + asym * 8;
	const ry = my - smile * cornerK - asym * 8;
	const topC = gasp ? my - mouthOpen * 18 : my + smile * 6 - mouthOpen * 4;
	const botC = my + smile * 14 + mouthOpen * 46;
	const mouthPath = `M${lx} ${ly} Q${300 + fx} ${topC} ${rx} ${ry} Q${300 + fx} ${botC} ${lx} ${ly} Z`;

	const hairFront =
		c.hairStyle === 'curls' ? curlsPath(seed) : c.hairStyle === 'big' ? curlsPath(seed, 140, 132, 16, 1) : HAIR_FRONT[c.hairStyle];

	return (
		<div style={{position: 'absolute', left: x - w / 2, top: y - size, width: w, height: size, transform: flip ? 'scaleX(-1)' : undefined, ...style}}>
			<svg viewBox="0 0 600 800" width={w} height={size} style={{overflow: 'visible', display: 'block'}}>
				<defs>
					<pattern id={`ht${uid}`} width={9} height={9} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
						<circle cx={4.5} cy={4.5} r={2.7} fill={N.ink} />
					</pattern>
					<pattern id={`st${uid}`} width={7} height={7} patternUnits="userSpaceOnUse" patternTransform="rotate(20)">
						<circle cx={3.5} cy={3.5} r={1.3} fill={c.hair} />
					</pattern>
					<clipPath id={`f${uid}`}>
						<path d={FACE} />
					</clipPath>
					<clipPath id={`t${uid}`}>
						<path d={TORSO} />
					</clipPath>
					<clipPath id={`m${uid}`}>
						<path d={mouthPath} />
					</clipPath>
				</defs>
				<g transform={`translate(0 ${breathe * 0.5})`}>
					{/* back hair mass (big style) */}
					{c.hairStyle === 'big' ? (
						<path d="M150 320 C130 170 220 96 300 96 C380 96 470 170 450 320 C470 420 470 520 500 590 C420 624 370 590 350 540 L250 540 C230 590 180 624 100 590 C130 520 130 420 150 320 Z" fill={fill(c.hair)} stroke={ink} strokeWidth={INKW} />
					) : null}
					{/* torso (lifted so the neck reads short and sturdy) */}
					<g transform="translate(0 -46)">
					<path d={TORSO} fill={fill(c.jacket ?? c.shirt)} stroke={ink} strokeWidth={INKW} />
					{!solid ? (
						<g>
							{c.jacket ? (
								<>
									<path d="M222 562 Q300 590 378 562 L360 850 L240 850 Z" fill={c.shirt} stroke={N.ink} strokeWidth={4} />
									<path d="M34 850 C40 640 140 590 250 552 L276 600 L240 850 Z" fill={c.jacket} stroke={N.ink} strokeWidth={INKW} />
									<path d="M566 850 C560 640 460 590 350 552 L324 600 L360 850 Z" fill={c.jacket} stroke={N.ink} strokeWidth={INKW} />
									<path d="M250 552 L276 600 L254 640 L232 600 Z" fill={c.jacket} stroke={N.ink} strokeWidth={3} />
									<path d="M350 552 L324 600 L346 640 L368 600 Z" fill={c.jacket} stroke={N.ink} strokeWidth={3} />
								</>
							) : null}
							{c.vest ? (
								<>
									<path d="M150 850 L170 646 L250 580 L300 694 L350 580 L430 646 L450 850 Z" fill={c.vest} stroke={N.ink} strokeWidth={INKW} />
									<circle cx={300} cy={728} r={7} fill={N.mustard} stroke={N.ink} strokeWidth={3} />
									<circle cx={300} cy={770} r={7} fill={N.mustard} stroke={N.ink} strokeWidth={3} />
									{c.pocket ? <path d="M380 686 l34 -8 l-4 -22 l-10 14 l-8 -18 l-6 20 Z" fill={c.pocket} stroke={N.ink} strokeWidth={3} /> : null}
								</>
							) : null}
							{c.shawl ? (
								<path d="M34 850 C50 640 150 586 300 616 C450 586 550 640 566 850 Z" fill={c.shawl} stroke={N.ink} strokeWidth={INKW} />
							) : null}
							{/* open collar */}
							{!c.shawl ? (
								<>
									<path d="M262 552 L300 640 L338 552 Z" fill={c.skin} stroke={N.ink} strokeWidth={3} />
									<path d="M246 548 L264 538 L300 640 L266 604 L232 584 Z" fill={c.shirt} stroke={N.ink} strokeWidth={4} />
									<path d="M354 548 L336 538 L300 640 L334 604 L368 584 Z" fill={c.shirt} stroke={N.ink} strokeWidth={4} />
								</>
							) : null}
							{c.tie ? (
								<>
									<path d="M288 600 L312 600 L324 850 L276 850 Z" fill={c.tie} stroke={N.ink} strokeWidth={4} />
									<path d="M284 582 L316 582 L310 606 L290 606 Z" fill={c.tie} stroke={N.ink} strokeWidth={4} />
								</>
							) : null}
							<g clipPath={`url(#t${uid})`} transform={light === 'right' ? 'translate(600 0) scale(-1 1)' : undefined}>
								<path d={BODY_SHADE} fill={`url(#ht${uid})`} opacity={shade * 0.55} />
							</g>
						</g>
					) : null}
					</g>
					{/* head */}
					<g transform={`rotate(${tilt} 300 470)`}>
						<path d={NECK} fill={fill(c.skin)} stroke={ink} strokeWidth={INKW} />
						{!solid ? <path d="M256 400 L344 400 L344 468 Q300 500 256 468 Z" fill={N.ink} opacity={0.32} /> : null}
						<ellipse cx={206 - turn * 6} cy={322} rx={17} ry={31} fill={fill(c.skin)} stroke={ink} strokeWidth={INKW} />
						<ellipse cx={394 - turn * 6} cy={322} rx={17} ry={31} fill={fill(c.skin)} stroke={ink} strokeWidth={INKW} />
						{c.earrings && !solid ? (
							<>
								<circle cx={204} cy={372} r={16} fill="none" stroke={c.earrings} strokeWidth={6} />
								<circle cx={396} cy={372} r={16} fill="none" stroke={c.earrings} strokeWidth={6} />
							</>
						) : null}
						<path d={FACE} fill={fill(c.skin)} stroke={ink} strokeWidth={INKW} />
						{!solid ? (
							<g>
								<g clipPath={`url(#f${uid})`}>
									{c.stubble ? <rect x={200} y={368} width={200} height={100} fill={`url(#st${uid})`} opacity={c.stubble} /> : null}
									<g transform={light === 'right' ? 'translate(600 0) scale(-1 1)' : undefined}>
										<path d={SHADE} fill={`url(#ht${uid})`} opacity={shade * 0.6} />
										<path d="M372 352 l-16 22 M382 362 l-16 22 M390 374 l-14 20" stroke={N.ink} strokeWidth={3} opacity={shade * 0.7} strokeLinecap="round" />
										<path d="M268 452 Q300 468 334 452" stroke={N.ink} strokeWidth={3} fill="none" opacity={0.5} />
									</g>
									{blush > 0 ? (
										<>
											<ellipse cx={250 + fx} cy={370} rx={30} ry={14} fill={N.red} opacity={0.35 * blush} />
											<ellipse cx={350 + fx} cy={370} rx={30} ry={14} fill={N.red} opacity={0.35 * blush} />
										</>
									) : null}
								</g>
								{eye(258, -1)}
								{eye(342, 1)}
								{brow(-1, browL)}
								{brow(1, browR)}
								<path d={`M${302 + fx * 1.2} 318 C${298 + fx * 1.2} 340 ${288 + fx * 1.2} 356 ${290 + fx * 1.2} 366 Q${300 + fx * 1.2} 375 ${316 + fx * 1.2} 366`} stroke={N.ink} strokeWidth={4.5} fill="none" strokeLinecap="round" />
								{mouthOpen > 0.06 ? (
									<g>
										<path d={mouthPath} fill="#3a1216" stroke={N.ink} strokeWidth={4.5} strokeLinejoin="round" />
										<g clipPath={`url(#m${uid})`}>
											<rect x={lx} y={Math.min(ly, ry) - 6} width={rx - lx} height={8 + 10 * Math.min(1, mouthOpen * 2)} fill={N.white} />
											<ellipse cx={300 + fx} cy={botC - 6} rx={18} ry={10} fill="#b5464e" />
										</g>
										{c.lips ? <path d={`M${lx + 4} ${ly + 2} Q${300 + fx} ${botC + 3} ${rx - 4} ${ry + 2}`} stroke={c.lips} strokeWidth={6} fill="none" strokeLinecap="round" /> : null}
									</g>
								) : (
									<g>
										<path d={`M${lx} ${ly} Q${300 + fx} ${my + smile * 14} ${rx} ${ry}`} stroke={c.lips ?? N.ink} strokeWidth={c.lips ? 9 : 5} fill="none" strokeLinecap="round" />
										{c.lips ? <path d={`M${lx} ${ly} Q${300 + fx} ${my + smile * 14} ${rx} ${ry}`} stroke={N.ink} strokeWidth={3} fill="none" strokeLinecap="round" /> : null}
										{smile > 0.3 || Math.abs(asym) > 0.3 ? <path d={`M${asym > 0 ? lx - 4 : rx + 4} ${asym > 0 ? ly - 6 : ry - 6} q${asym > 0 ? -4 : 4} 6 0 12`} stroke={N.ink} strokeWidth={3} fill="none" /> : null}
									</g>
								)}
								{sweat > 0 ? (
									<g opacity={Math.min(1, sweat * 1.5)}>
										{[0, 1, 2].slice(0, Math.ceil(sweat * 3)).map((i) => {
											const sy = 230 + i * 50 + ((t * 40 + i * 30) % 40);
											const sx = i === 1 ? 228 : 372 - i * 6;
											return <path key={i} d={`M${sx} ${sy} q-9 16 0 22 q9 -6 0 -22 Z`} fill="#bfe3f2" stroke={N.ink} strokeWidth={3} />;
										})}
									</g>
								) : null}
							</g>
						) : null}
						{/* front hair */}
						<path d={hairFront} fill={fill(c.hair)} stroke={ink} strokeWidth={INKW} strokeLinejoin="round" opacity={c.hairStyle === 'buzz' && !solid ? 0.92 : 1} />
						{!solid && (c.hairStyle === 'curls' || c.hairStyle === 'big') ? (
							<g stroke={N.ink} strokeWidth={3} fill="none" opacity={0.55} strokeLinecap="round">
								{[0, 1, 2, 3, 4, 5].map((i) => {
									const ax = 230 + i * 28 + random(`hx${seed}${i}`) * 10;
									const ay = 160 + random(`hy${seed}${i}`) * 40;
									return <path key={i} d={`M${ax} ${ay} q14 -10 22 6`} />;
								})}
							</g>
						) : null}
						{c.scarf && !solid ? (
							<path d="M196 214 Q300 166 404 214 L404 250 Q300 206 196 250 Z" fill={c.scarf} stroke={N.ink} strokeWidth={INKW} />
						) : null}
						{c.scarf && !solid ? <circle cx={300} cy={208} r={13} fill={N.mustard} stroke={N.ink} strokeWidth={4} /> : null}
					</g>
					{rim ? <path d={TORSO} fill="none" stroke={rim} strokeWidth={6} opacity={0.6} transform="translate(4 -48)" /> : null}
				</g>
			</svg>
		</div>
	);
};

/* ------------------------------------------------------------------ comic chrome */

/** Inked panel with a hard offset shadow and a pop-in. */
export const Panel: React.FC<{x: number; y: number; w: number; h: number; t: number; at?: number; rot?: number; bg?: string; children?: React.ReactNode; border?: number; from?: 'scale' | 'left' | 'right' | 'down'}> = ({
	x,
	y,
	w,
	h,
	t,
	at = -1,
	rot = 0,
	bg = N.paper,
	children,
	border = 8,
	from = 'scale',
}) => {
	const p = at < 0 ? 1 : pop(t, at, 0.35);
	if (p <= 0) return null;
	const enter =
		from === 'scale' ? `scale(${0.6 + 0.4 * p})` : from === 'left' ? `translateX(${(1 - p) * -900}px)` : from === 'right' ? `translateX(${(1 - p) * 900}px)` : `translateY(${(1 - p) * -700}px)`;
	return (
		<div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `${enter} rotate(${rot}deg)`, opacity: Math.min(1, p * 2)}}>
			<div style={{position: 'absolute', inset: 0, background: N.ink, transform: 'translate(14px, 14px)'}} />
			<div style={{position: 'absolute', inset: 0, background: bg, border: `${border}px solid ${N.ink}`, overflow: 'hidden'}}>{children}</div>
		</div>
	);
};

/** Radial comic action lines. */
export const Burst: React.FC<{cx: number; cy: number; t: number; color?: string; bg?: string; n?: number; spin?: number; r0?: number; opacity?: number}> = ({
	cx,
	cy,
	t,
	color = N.mustard,
	bg,
	n = 36,
	spin = 4,
	r0 = 0,
	opacity = 1,
}) => (
	<AbsoluteFill style={{background: bg, opacity}}>
		<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
			<g transform={`translate(${cx} ${cy}) rotate(${t * spin})`}>
				{new Array(n).fill(0).map((_, i) => {
					const a = (i / n) * Math.PI * 2;
					const da = (Math.PI / n) * (0.55 + 0.4 * random(`bw${i}`));
					const R = 2400;
					return (
						<path
							key={i}
							d={`M${Math.cos(a) * r0} ${Math.sin(a) * r0} L${Math.cos(a - da) * R} ${Math.sin(a - da) * R} L${Math.cos(a + da) * R} ${Math.sin(a + da) * R} Z`}
							fill={color}
						/>
					);
				})}
			</g>
		</svg>
	</AbsoluteFill>
);

/** Halftone dot field, fading along a direction (CSS mask). */
export const Dots: React.FC<{color?: string; size?: number; opacity?: number; fade?: string; style?: React.CSSProperties}> = ({
	color = N.ink,
	size = 22,
	opacity = 0.25,
	fade = 'linear-gradient(180deg, transparent 0%, #000 100%)',
	style,
}) => (
	<AbsoluteFill
		style={{
			opacity,
			backgroundImage: `radial-gradient(circle, ${color} 0 32%, transparent 34%)`,
			backgroundSize: `${size}px ${size}px`,
			WebkitMaskImage: fade,
			maskImage: fade,
			...style,
		}}
	/>
);

/** Comic sound-effect lettering. */
export const SfxWord: React.FC<{text: string; x: number; y: number; t: number; at: number; size?: number; color?: string; rot?: number; until?: number; shake?: boolean}> = ({
	text,
	x,
	y,
	t,
	at,
	size = 150,
	color = N.mustard,
	rot = -8,
	until = 99,
	shake = false,
}) => {
	const p = pop(t, at, 0.3);
	const out = rise(t, until, 0.2);
	if (p <= 0 || out >= 1) return null;
	const sh = shake ? Math.sin(t * 60) * 4 : 0;
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				transform: `translate(-50%, -50%) translate(${sh}px, ${-sh}px) rotate(${rot}deg) scale(${p * (1 - out)})`,
				fontFamily: fonts.comic,
				fontSize: size,
				lineHeight: 0.95,
				color,
				letterSpacing: 4,
				WebkitTextStroke: `${size * 0.09}px ${N.ink}`,
				paintOrder: 'stroke fill',
				textShadow: `${size * 0.05}px ${size * 0.06}px 0 ${N.ink}`,
				whiteSpace: 'pre',
				textAlign: 'center',
			}}
		>
			{text}
		</div>
	);
};

/** Hand-drawn circle / underline that draws itself on, with an optional Kalam note. */
export const Annot: React.FC<{
	x: number;
	y: number;
	w: number;
	h: number;
	t: number;
	at: number;
	color?: string;
	label?: string;
	labelX?: number;
	labelY?: number;
	labelSize?: number;
	kind?: 'circle' | 'cross' | 'underline' | 'strike';
	width?: number;
	dur?: number;
}> = ({x, y, w, h, t, at, color = N.red, label, labelX = 0, labelY = -60, labelSize = 52, kind = 'circle', width = 8, dur = 0.35}) => {
	const p = tween(t, [at, at + dur], [0, 1], ease.out);
	if (p <= 0) return null;
	const cx = w / 2;
	const cy = h / 2;
	const d =
		kind === 'circle'
			? `M${cx + w * 0.42} ${cy - h * 0.38} C${w * 1.05} ${cy - h * 0.1} ${w * 0.9} ${h * 1.05} ${cx} ${h} C${-w * 0.1} ${h * 0.98} ${-w * 0.06} ${-h * 0.02} ${cx} ${-h * 0.02} C${w * 0.8} ${-h * 0.05} ${w * 0.96} ${h * 0.2} ${w * 0.95} ${h * 0.34}`
			: kind === 'cross'
				? `M0 0 L${w} ${h} M${w} 0 L0 ${h}`
				: kind === 'strike'
					? `M-6 ${cy + 4} Q${cx} ${cy - 8} ${w + 6} ${cy}`
					: `M0 ${h} Q${cx} ${h + 10} ${w} ${h - 4}`;
	const len = kind === 'circle' ? (w + h) * 1.9 : kind === 'cross' ? Math.hypot(w, h) * 2 + 10 : w + 20;
	return (
		<div style={{position: 'absolute', left: x, top: y, width: w, height: h}}>
			<svg width={w} height={h} style={{overflow: 'visible', position: 'absolute', inset: 0}}>
				<path d={d} stroke={color} strokeWidth={width} fill="none" strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
			</svg>
			{label ? (
				<div
					style={{
						position: 'absolute',
						left: labelX,
						top: labelY,
						fontFamily: fonts.hand,
						fontWeight: 700,
						fontSize: labelSize,
						color,
						whiteSpace: 'nowrap',
						transform: `rotate(-4deg) scale(${pop(t, at + dur * 0.6, 0.3)})`,
						transformOrigin: 'left center',
					}}
				>
					{label}
				</div>
			) : null}
		</div>
	);
};

/** Rubber stamp slam. */
export const Stamp: React.FC<{text: string; x: number; y: number; t: number; at: number; color?: string; size?: number; rot?: number; blend?: 'multiply' | 'normal'}> = ({text, x, y, t, at, color = N.red, size = 110, rot = -12, blend = 'multiply'}) => {
	const p = tween(t, [at, at + 0.16], [0, 1], ease.in);
	if (p <= 0) return null;
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${2.2 - 1.2 * p})`,
				opacity: p,
				fontFamily: fonts.comic,
				fontSize: size,
				letterSpacing: 6,
				color,
				border: `${size * 0.07}px solid ${color}`,
				padding: `${size * 0.02}px ${size * 0.22}px`,
				borderRadius: size * 0.08,
				whiteSpace: 'nowrap',
				mixBlendMode: blend,
				background: blend === 'normal' ? 'rgba(14,13,18,0.85)' : undefined,
			}}
		>
			{text}
		</div>
	);
};

/** Typewritten case-file sheet. */
export const CaseFile: React.FC<{x: number; y: number; w: number; h: number; t: number; at: number; title: string; lines?: string[]; rot?: number; children?: React.ReactNode}> = ({
	x,
	y,
	w,
	h,
	t,
	at,
	title,
	lines = [],
	rot = -2,
	children,
}) => {
	const p = pop(t, at, 0.4);
	if (p <= 0) return null;
	return (
		<div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `translateY(${(1 - p) * 300}px) rotate(${rot}deg)`, opacity: Math.min(1, p * 2)}}>
			<div style={{position: 'absolute', left: 30, top: -46, width: 260, height: 70, background: N.paperDark, border: `6px solid ${N.ink}`, borderBottom: 'none', borderRadius: '18px 18px 0 0'}} />
			<div style={{position: 'absolute', inset: 0, background: N.paper, border: `7px solid ${N.ink}`, boxShadow: `14px 14px 0 ${N.ink}`}}>
				<div style={{position: 'absolute', left: 40, top: 30, right: 40, fontFamily: fonts.mono, fontSize: 34, letterSpacing: 4, color: N.ink, borderBottom: `4px solid ${N.ink}`, paddingBottom: 12}}>{title}</div>
				{lines.map((l, i) => {
					const lp = rise(t, at + 0.3 + i * 0.25, 0.3);
					return (
						<div key={i} style={{position: 'absolute', left: 40, top: 110 + i * 54, fontFamily: fonts.mono, fontSize: 32, color: N.ink, opacity: lp, clipPath: `inset(0 ${100 - lp * 100}% 0 0)`}}>
							{l}
						</div>
					);
				})}
				{children}
			</div>
			<div style={{position: 'absolute', right: 60, top: -30, width: 34, height: 110, border: `7px solid #8a8f99`, borderRadius: 20}} />
		</div>
	);
};

/** Big hook title for the first seconds (inside the top safe area). */
export const HookTitle: React.FC<{t: number; text: string; until?: number; y?: number; size?: number}> = ({t, text, until = 2.8, y = 270, size = 104}) => {
	const p = pop(t, 0.05, 0.35);
	const out = rise(t, until, 0.25, ease.in);
	if (out >= 1) return null;
	return (
		<div style={{position: 'absolute', left: 70, right: 70, top: y, display: 'flex', justifyContent: 'center', transform: `scale(${p}) translateY(${-out * 300}px) rotate(-2deg)`}}>
			<div
				style={{
					background: N.mustard,
					border: `8px solid ${N.ink}`,
					boxShadow: `12px 12px 0 ${N.ink}`,
					padding: '10px 34px 4px',
					fontFamily: fonts.comic,
					fontSize: size,
					lineHeight: 1.0,
					letterSpacing: 3,
					color: N.ink,
					textAlign: 'center',
				}}
			>
				{text}
			</div>
		</div>
	);
};

/** Paper grain + ink vignette laid over every shot. */
export const PaperOverlay: React.FC = () => (
	<>
		<Grain opacity={0.09} />
		<AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 70% at 50% 45%, transparent 55%, rgba(14,13,18,0.55) 100%)', pointerEvents: 'none'}} />
	</>
);

/* ------------------------------------------------------------------ captions */

export type SpeakerStyle = {name: string; color: string; text?: string};
export const SPEAKERS: Record<string, SpeakerStyle> = {
	reader: {name: 'THE READER', color: N.mustard},
	detective: {name: 'DETECTIVE', color: '#7fb3c8'},
	suspect: {name: 'SUSPECT', color: '#e07a5f'},
	client: {name: 'CLIENT', color: '#9cc39a'},
	psychic: {name: 'MADAME', color: '#c79bdc'},
	pa: {name: '⚠ BUNKER ALARM', color: '#ff5a4f'},
};

const clean = (w: string) => w.toLowerCase().replace(/[^a-z0-9']/g, '');

/**
 * Comic lettering instead of plain subtitles: dialogue in a white balloon with a speaker tag,
 * narration in a mustard caption box. Words type on as they're spoken; emphasis in red.
 */
export const ComicCaptions: React.FC<{t: number; timeline: Timeline; y?: number; right?: number; maxWords?: number; hidden?: number[]}> = ({
	t,
	timeline,
	y = 1300,
	right = 160,
	maxWords = 6,
	hidden = [],
}) => {
	type W = {word: string; start: number; end: number; em: boolean; line: number; speaker: string};
	const words: W[] = timeline.lines.flatMap((l) =>
		hidden.includes(l.index) ? [] : l.words.map((w) => ({...w, em: l.emphasis.some((e) => clean(e) === clean(w.word)), line: l.index, speaker: l.speaker ?? 'narrator'})),
	);
	const pages: W[][] = [];
	let cur: W[] = [];
	words.forEach((w, i) => {
		cur.push(w);
		const next = words[i + 1];
		if (!next || cur.length >= maxWords || (/[.?!…]$/.test(w.word) && cur.length >= 2) || next.line !== w.line || next.start - w.end > 0.4) {
			pages.push(cur);
			cur = [];
		}
	});
	const idx = pages.findIndex((p, i) => t >= p[0].start - 0.06 && t < (pages[i + 1]?.[0].start ?? p[p.length - 1].end + 0.6) - 0.06 && t < p[p.length - 1].end + 0.7);
	if (idx < 0) return null;
	const page = pages[idx];
	const sp = page[0].speaker;
	const narr = sp === 'narrator';
	const st = SPEAKERS[sp];
	const firstOfLine = idx === 0 || pages[idx - 1][0].line !== page[0].line;
	const enter = firstOfLine ? pop(t, page[0].start - 0.06, 0.25) : 1;
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<div style={{position: 'absolute', left: 80, right, top: y, display: 'flex', justifyContent: 'center', transform: `translateY(-50%) scale(${0.7 + 0.3 * enter})`}}>
				<div style={{position: 'relative', maxWidth: 820}}>
					{st ? (
						<div
							style={{
								position: 'absolute',
								left: 28,
								top: -40,
								background: st.color,
								border: `5px solid ${N.ink}`,
								padding: '2px 16px 0',
								fontFamily: fonts.comic,
								fontSize: 38,
								letterSpacing: 3,
								color: N.ink,
								transform: 'rotate(-3deg)',
								zIndex: 2,
								whiteSpace: 'nowrap',
							}}
						>
							{st.name}
						</div>
					) : null}
					<div
						style={{
							background: narr ? N.mustard : N.white,
							border: `7px solid ${N.ink}`,
							borderRadius: narr ? 4 : 46,
							boxShadow: `10px 10px 0 ${N.ink}`,
							padding: narr ? '22px 34px 18px' : '26px 40px 20px',
							display: 'flex',
							flexWrap: 'wrap',
							justifyContent: 'center',
							gap: '0 16px',
							transform: narr ? 'rotate(-1deg)' : 'rotate(0.6deg)',
							minWidth: 320,
						}}
					>
						{page.map((w, i) => {
							const on = t >= w.start - 0.04;
							const hot = on && t < w.end + 0.04;
							return (
								<span
									key={i}
									style={{
										fontFamily: fonts.letter,
										fontWeight: 700,
										fontSize: 60,
										lineHeight: 1.12,
										textTransform: 'uppercase',
										color: w.em ? N.red : N.ink,
										opacity: on ? 1 : 0.12,
										transform: `scale(${hot ? 1.08 : 1})`,
										display: 'inline-block',
									}}
								>
									{w.word.replace(/…/g, '...')}
								</span>
							);
						})}
					</div>
					{!narr ? (
						<svg width={70} height={60} style={{position: 'absolute', left: '50%', top: -50, marginLeft: -20, overflow: 'visible'}}>
							<path d="M10 60 L40 0 L48 60 Z" fill={N.white} stroke={N.ink} strokeWidth={7} strokeLinejoin="round" />
							<rect x={8} y={56} width={46} height={14} fill={N.white} />
						</svg>
					) : null}
				</div>
			</div>
		</AbsoluteFill>
	);
};
