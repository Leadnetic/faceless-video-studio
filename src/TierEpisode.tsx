import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {Sfx} from './components/Primitives';
import {Grain} from './components/Primitives';
import {SafeGuide} from './components/SafeZone';
import {pop} from './components/Toon';
import {ease, rise, s2f, tween} from './lib/anim';
import type {Timeline} from './lib/timeline';
import {fonts, fontsReady, VIDEO} from './theme';
import {TIER_EPISODES} from './videos/tier';

/**
 * "Psychology-based Tierlist" format (020+): the account's proven winner, rebuilt with motion.
 * Hand-drawn doodles that "boil", a tier ladder that fills F → S, a focus card per tier with an
 * anxiety gauge, study chips for the evidence, highlighter captions.
 */
export const T = {
	bg: '#f7f2e8',
	ink: '#1d1b1a',
	red: '#d62f2f',
	green: '#2e9e4a',
	marker: '#ffe066',
	tiers: {S: '#e3342f', A: '#f6993f', B: '#f2c94c', C: '#7bc96f', D: '#4fa3d1', F: '#9a9a9a'} as Record<string, string>,
};

export type TierKey = 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
export type TierItem = {tier: TierKey; line: number; label: string; note: string; anxiety: number; chip?: string; Doodle: React.FC<{t: number; s: number}>};
export type TierEpisodeDef = {
	id: string;
	timeline: Timeline;
	audioDir: string;
	title: [string, string, string, string];
	items: TierItem[];
	Hook: React.FC<{t: number}>;
	hookEnd: number;
	ladderAt: number;
	outro: {line: number; text: string; chip?: string; Doodle: React.FC<{t: number; s: number}>};
	cta: {line: number; text: string};
	sfx: [string, number, number][];
	music?: number;
};

/* ------------------------------------------------------------------ hand-drawn helpers */

/** Wobble a point so lines "boil" like hand-drawn animation (changes every 4 frames). */
export const wob = (t: number, seed: string, amt = 2.2) => {
	const k = Math.floor(t * 7.5);
	return [(random(`${seed}x${k}`) - 0.5) * amt, (random(`${seed}y${k}`) - 0.5) * amt] as const;
};
export const Ink: React.FC<{d: string; t: number; seed: string; w?: number; color?: string; fill?: string}> = ({d, t, seed, w = 6, color = T.ink, fill = 'none'}) => {
	const [dx, dy] = wob(t, seed);
	return <path d={d} transform={`translate(${dx} ${dy})`} stroke={color} strokeWidth={w} fill={fill} strokeLinecap="round" strokeLinejoin="round" />;
};
/** Simple doodle person: head + body, arms/legs given as path strings relative to (x,y) = neck. */
export const Stick: React.FC<{x: number; y: number; t: number; seed: string; s?: number; arms?: string; legs?: string; face?: 'sad' | 'calm' | 'worried' | 'smile'}> = ({x, y, t, seed, s = 1, arms, legs, face = 'calm'}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`}>
		<Ink d="M0 -46 a34 34 0 1 0 0.1 0" t={t} seed={`${seed}h`} />
		{face === 'sad' ? <Ink d="M-12 2 q12 -10 24 0" t={t} seed={`${seed}m`} w={4} /> : face === 'smile' ? <Ink d="M-13 -6 q13 12 26 0" t={t} seed={`${seed}m`} w={4} /> : face === 'worried' ? <Ink d="M-12 0 q6 -5 12 0 q6 5 12 0" t={t} seed={`${seed}m`} w={4} /> : <Ink d="M-10 -2 h20" t={t} seed={`${seed}m`} w={4} />}
		<circle cx={-11} cy={-20} r={3.5} fill={T.ink} />
		<circle cx={11} cy={-20} r={3.5} fill={T.ink} />
		<Ink d="M0 22 L0 110" t={t} seed={`${seed}b`} />
		<Ink d={arms ?? 'M0 45 L-40 85 M0 45 L40 85'} t={t} seed={`${seed}a`} />
		<Ink d={legs ?? 'M0 110 L-30 170 M0 110 L30 170'} t={t} seed={`${seed}l`} />
	</g>
);

/** The account's signature gauge (LOW → HIGH) with an animated needle. */
export const Gauge: React.FC<{v: number; label: string; r?: number; t: number}> = ({v, label, r = 120, t}) => {
	const a = Math.PI * (1 - Math.min(1, Math.max(0, v)));
	const jitter = Math.sin(t * 30) * 0.015 * v;
	const segs = ['#5cb85c', '#9ccc65', '#f2c94c', '#f6993f', '#e3342f'];
	return (
		<svg width={r * 2 + 40} height={r + 70} viewBox={`${-r - 20} ${-r - 10} ${r * 2 + 40} ${r + 70}`}>
			{segs.map((c, i) => {
				const a0 = Math.PI - (i / 5) * Math.PI;
				const a1 = Math.PI - ((i + 1) / 5) * Math.PI;
				return <path key={i} d={`M${Math.cos(a0) * r} ${-Math.sin(a0) * r} A${r} ${r} 0 0 1 ${Math.cos(a1) * r} ${-Math.sin(a1) * r}`} stroke={c} strokeWidth={r * 0.22} fill="none" />;
			})}
			<line x1={0} y1={0} x2={Math.cos(a + jitter) * r * 0.86} y2={-Math.sin(a + jitter) * r * 0.86} stroke={T.ink} strokeWidth={8} strokeLinecap="round" />
			<circle r={12} fill={T.ink} />
			<text x={-r} y={34} fontSize={22} fontFamily="Inter" fontWeight={800} fill={T.ink}>LOW</text>
			<text x={r} y={34} fontSize={22} fontFamily="Inter" fontWeight={800} fill={T.ink} textAnchor="end">HIGH</text>
			<text x={0} y={46} fontSize={28} fontFamily="Inter" fontWeight={800} fill={T.ink} textAnchor="middle" letterSpacing={3}>{label}</text>
		</svg>
	);
};

const Badge: React.FC<{k: TierKey; size: number}> = ({k, size}) => (
	<div style={{width: size, height: size * 0.9, background: T.tiers[k], border: `5px solid ${T.ink}`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.serif, fontWeight: 900, fontSize: size * 0.6, color: '#fff', textShadow: `3px 3px 0 ${T.ink}`}}>{k}</div>
);

/* ------------------------------------------------------------------ captions */

const MarkerCaptions: React.FC<{t: number; tl: Timeline}> = ({t, tl}) => {
	type W = {word: string; start: number; end: number; line: number};
	const words: W[] = tl.lines.flatMap((l) => l.words.map((w) => ({...w, line: l.index})));
	const pages: W[][] = [];
	let cur: W[] = [];
	words.forEach((w, i) => {
		cur.push(w);
		const nx = words[i + 1];
		if (!nx || cur.length >= 5 || (/[,.?!:]$/.test(w.word) && cur.length >= 2) || nx.line !== w.line || nx.start - w.end > 0.45) {
			pages.push(cur);
			cur = [];
		}
	});
	const page = pages.find((p, i) => t >= p[0].start - 0.05 && t < (pages[i + 1]?.[0].start ?? p[p.length - 1].end + 0.6) - 0.05);
	if (!page) return null;
	return (
		<div style={{position: 'absolute', left: 70, right: 160, top: 1290, height: 140, display: 'flex', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center', gap: '4px 14px'}}>
			{page.map((w, i) => {
				const on = t >= w.start - 0.03;
				const hot = on && t < w.end + 0.05;
				return (
					<span key={i} style={{position: 'relative', fontFamily: fonts.sans, fontWeight: 800, fontSize: 58, color: T.ink, opacity: on ? 1 : 0.18}}>
						{hot ? <span style={{position: 'absolute', left: -6, right: -6, top: 14, bottom: 4, background: T.marker, transform: 'rotate(-1.5deg)', zIndex: -1}} /> : null}
						<span style={{position: 'relative'}}>{w.word}</span>
					</span>
				);
			})}
		</div>
	);
};

/* ------------------------------------------------------------------ episode */

const ROW_Y = 600;
const ROW_H = 108;
const ORDER: TierKey[] = ['S', 'A', 'B', 'C', 'D', 'F'];

export const TierEpisode: React.FC<{epId: string; guides?: boolean}> = ({epId, guides}) => {
	const ep = TIER_EPISODES[epId];
	const frame = useCurrentFrame();
	const t = frame / VIDEO.fps;
	const [h] = useState(() => delayRender('fonts'));
	useEffect(() => {
		fontsReady.then(() => continueRender(h));
	}, [h]);
	const tl = ep.timeline;
	const start = (i: number) => tl.lines[i].start;
	const end = (i: number) => (tl.lines[i + 1]?.start ?? tl.duration) - 0.35;
	const total = s2f(tl.duration);
	const vol = ep.music ?? 0.22;
	const musicVol = (f: number) => interpolate(f, [0, 10, total - 20, total], [vol * 0.6, vol, vol, vol * 0.4], {extrapolateRight: 'clamp'});
	const ladderIn = rise(t, ep.ladderAt, 0.5);
	const active = ep.items.find((it) => t >= start(it.line) - 0.1 && t < end(it.line) + 0.35);
	const outroOn = t >= start(ep.outro.line) - 0.1 && t < end(ep.outro.line) + 0.35;
	const ctaOn = t >= start(ep.cta.line) - 0.1;

	return (
		<AbsoluteFill style={{backgroundColor: T.bg}}>
			{/* title (the cover that already works for this audience) */}
			<div style={{position: 'absolute', left: 60, right: 60, top: 228, textAlign: 'center', transform: `scale(${pop(t, 0.02, 0.4)})`}}>
				<div style={{fontFamily: fonts.serif, fontWeight: 900, fontSize: 86, lineHeight: 1.0, color: T.red}}>{ep.title[0]}</div>
				<div style={{fontFamily: fonts.serif, fontWeight: 900, fontSize: 96, lineHeight: 1.0, color: T.ink}}>{ep.title[1]}</div>
				<div style={{fontFamily: fonts.serif, fontWeight: 900, fontSize: 58, lineHeight: 1.1, color: T.green}}>{ep.title[2]}</div>
				<div style={{fontFamily: fonts.sans, fontWeight: 600, fontSize: 30, color: '#555'}}>{ep.title[3]}</div>
			</div>
			{/* hook */}
			{t < ep.hookEnd + 0.6 ? (
				<AbsoluteFill style={{opacity: 1 - rise(t, ep.hookEnd, 0.5), transform: `translateY(${rise(t, ep.hookEnd, 0.5, ease.in) * 300}px)`}}>
					<ep.Hook t={t} />
				</AbsoluteFill>
			) : null}
			{/* ladder */}
			{ladderIn > 0 ? (
				<div style={{position: 'absolute', left: 50, right: 150, top: ROW_Y, opacity: ladderIn}}>
					{ORDER.map((k, i) => {
						const it = ep.items.find((x) => x.tier === k);
						const filled = it ? t >= end(it.line) : false;
						const fp = it ? pop(t, end(it.line), 0.35) : 0;
						const isS = k === 'S';
						const mystery = isS && !filled;
						const bounce = ctaOn ? Math.max(0, Math.sin((t - start(ep.cta.line)) * 6 - i * 0.7)) * 10 : 0;
						return (
							<div key={k} style={{position: 'absolute', left: 0, right: 0, top: i * ROW_H, height: ROW_H - 8, display: 'flex', alignItems: 'center', gap: 18, transform: `translateX(${(1 - rise(t, ep.ladderAt + i * 0.08, 0.4)) * -900}px) translateY(${-bounce}px)`}}>
								<Badge k={k} size={92} />
								<div style={{flex: 1, height: ROW_H - 18, border: `4px ${filled ? 'solid' : 'dashed'} ${T.ink}`, borderRadius: 14, background: filled ? '#fff' : 'transparent', display: 'flex', alignItems: 'center', padding: '0 22px', position: 'relative', overflow: 'hidden'}}>
									{filled && it ? (
										<div style={{fontFamily: fonts.sans, fontWeight: 800, fontSize: 40, color: T.ink, transform: `scale(${0.7 + 0.3 * fp})`, transformOrigin: 'left center'}}>{it.label}</div>
									) : mystery ? (
										<div style={{fontFamily: fonts.hand, fontWeight: 700, fontSize: 40, color: T.red, opacity: 0.5 + 0.5 * Math.abs(Math.sin(t * 2))}}>🔒 the one almost nobody does</div>
									) : null}
								</div>
							</div>
						);
					})}
					<div style={{position: 'absolute', right: -44, top: 0, height: ORDER.length * ROW_H - 8, width: 30, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', fontFamily: fonts.hand, fontWeight: 700, fontSize: 24, color: '#666', opacity: rise(t, ep.ladderAt + 1, 0.4)}}>
						<span>▲</span>
					</div>
				</div>
			) : null}
			{/* focus card for the tier being explained */}
			{active ? <FocusCard t={t} it={active} s={start(active.line)} e={end(active.line)} /> : null}
			{outroOn ? <OutroCard t={t} s={start(ep.outro.line)} e={end(ep.outro.line)} text={ep.outro.text} chip={ep.outro.chip} Doodle={ep.outro.Doodle} /> : null}
			{ctaOn ? (
				<>
					<div style={{position: 'absolute', left: 0, right: 150, top: 1245, textAlign: 'center', fontFamily: fonts.hand, fontWeight: 700, fontSize: 56, color: T.red, transform: `scale(${pop(t, start(ep.cta.line), 0.3)}) rotate(-2deg)`}}>{ep.cta.text}</div>
					<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
						<path d="M820 1180 C900 1150 925 1110 935 1060" stroke={T.red} strokeWidth={9} fill="none" strokeLinecap="round" strokeDasharray={240} strokeDashoffset={240 * (1 - rise(t, start(ep.cta.line) + 0.3, 0.5))} />
					</svg>
				</>
			) : null}
			<MarkerCaptions t={t} tl={tl} />
			<Grain opacity={0.05} />
			{guides ? <SafeGuide /> : null}
			<Audio src={staticFile(`${ep.audioDir}/voiceover.wav`)} />
			<Audio src={staticFile(`${ep.audioDir}/score.wav`)} volume={musicVol} />
			{ep.sfx.map(([src, at, v], i) => (
				<Sfx key={i} src={src} at={at} volume={v} dir={`${ep.audioDir}/sfx`} />
			))}
		</AbsoluteFill>
	);
};

const FocusCard: React.FC<{t: number; it: TierItem; s: number; e: number}> = ({t, it, s, e}) => {
	const p = pop(t, s - 0.05, 0.4);
	const fly = tween(t, [e, e + 0.35], [0, 1], ease.in);
	const rowIdx = ORDER.indexOf(it.tier);
	const targetY = ROW_Y + rowIdx * ROW_H + ROW_H / 2;
	const y = 600 + 320;
	const ty = (targetY - y) * fly;
	const sc = (0.85 + 0.15 * p) * (1 - 0.85 * fly);
	const needle = tween(t, [s + 0.5, s + 1.6], [1, it.anxiety], ease.inOut);
	return (
		<div style={{position: 'absolute', left: 50, width: 880, top: 600, height: 640, transform: `translateY(${ty}px) scale(${sc})`, opacity: Math.min(1, p * 2) * (1 - fly * 0.6)}}>
			<div style={{position: 'absolute', inset: 0, background: '#fffdf8', border: `6px solid ${T.ink}`, borderRadius: 28, boxShadow: `12px 14px 0 ${T.ink}`}} />
			<div style={{position: 'absolute', left: 30, top: 26}}>
				<Badge k={it.tier} size={120} />
			</div>
			<div style={{position: 'absolute', left: 175, top: 32, right: 30, fontFamily: fonts.serif, fontWeight: 900, fontSize: 56, lineHeight: 1.05, color: T.ink}}>{it.label}</div>
			<div style={{position: 'absolute', left: 178, top: 160, right: 30, fontFamily: fonts.hand, fontWeight: 700, fontSize: 36, color: it.anxiety > 0.55 ? T.red : T.green, opacity: rise(t, s + 1.2, 0.3)}}>{it.note}</div>
			<svg width={650} height={395} viewBox="0 0 560 340" style={{position: 'absolute', left: 10, top: 225}}>
				<it.Doodle t={t} s={s} />
			</svg>
			<div style={{position: 'absolute', right: 6, top: 225, transform: 'scale(0.78)', transformOrigin: 'right top'}}>
				<Gauge v={needle} label="ANXIETY" t={t} />
			</div>
			{it.chip ? (
				<div style={{position: 'absolute', left: 34, bottom: 26, background: '#eef6ff', border: `3px solid ${T.ink}`, borderRadius: 999, padding: '6px 18px', fontFamily: fonts.mono, fontSize: 22, color: T.ink, transform: `scale(${pop(t, s + 2.2, 0.3)})`}}>🔬 {it.chip}</div>
			) : null}
		</div>
	);
};

const OutroCard: React.FC<{t: number; s: number; e: number; text: string; chip?: string; Doodle: React.FC<{t: number; s: number}>}> = ({t, s, e, text, chip, Doodle}) => {
	const p = pop(t, s - 0.05, 0.4);
	const out = rise(t, e, 0.3);
	return (
		<div style={{position: 'absolute', left: 50, width: 880, top: 600, height: 640, transform: `scale(${(0.85 + 0.15 * p) * (1 - 0.2 * out)})`, opacity: Math.min(1, p * 2) * (1 - out)}}>
			<div style={{position: 'absolute', inset: 0, background: '#f1fbf3', border: `6px solid ${T.ink}`, borderRadius: 28, boxShadow: `12px 14px 0 ${T.ink}`}} />
			<div style={{position: 'absolute', left: 40, top: 34, right: 40, fontFamily: fonts.serif, fontWeight: 900, fontSize: 60, color: T.green, textAlign: 'center'}}>{text}</div>
			<svg width={820} height={364} viewBox="0 0 900 400" style={{position: 'absolute', left: 30, top: 150}}>
				<Doodle t={t} s={s} />
			</svg>
			{chip ? <div style={{position: 'absolute', left: 0, right: 0, bottom: 28, textAlign: 'center', fontFamily: fonts.mono, fontSize: 24}}>🔬 {chip}</div> : null}
		</div>
	);
};
