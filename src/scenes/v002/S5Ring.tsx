import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {Atmosphere} from '../../components/Atmosphere';
import {Figure} from '../../components/Figure';
import {ChatMemory, FaceMemory, MemoryCard, PauseMemory} from '../../components/MemoryCard';
import {useTime} from '../../components/Primitives';
import {colorKeys, ease, rise, tween} from '../../lib/anim';
import {camAt, Camera, Layer} from '../../lib/camera';
import {fonts} from '../../theme';
import type {Video002} from '../../videos/video002';

const CX = 540;
const CY = 1240;
const RX = 380;
const RY = 96;

type Frozen = {angle: number; lift: number; kind: 'chat' | 'pause' | 'face' | 'bubble'; text?: string};
const ITEMS: Frozen[] = [
	{angle: 2.55, lift: 420, kind: 'chat'},
	{angle: 0.35, lift: 520, kind: 'pause'},
	{angle: 4.3, lift: 560, kind: 'face'},
	{angle: 1.4, lift: 250, kind: 'bubble', text: 'sure.'},
	{angle: 3.6, lift: 300, kind: 'bubble', text: 'what if…'},
	{angle: 5.4, lift: 330, kind: 'bubble', text: '…'},
];

/** Realisation + exit: everything freezes, the camera pulls back, one memory dissolves, the character walks out of the loop. */
export const S5Ring: React.FC<{v: Video002}> = ({v}) => {
	const t = useTime();
	const [s] = v.scenes.ring;
	const r = v.ring;
	const frozenT = s; // memories are rendered at a fixed time: nothing moves
	const cam = camAt(t, {zoom: [[s, 1.0], [s + 2.4, 0.64]], fy: [[s, 1000]], y: [[s, 0], [s + 2.4, 60]]}, 0.25 * rise(t, r.calmAt, 1));
	const calm = rise(t, r.calmAt, 2.2, ease.soft);
	const ringGlow = 1 - rise(t, r.calmAt + 0.2, 2.0);
	const othersOut = rise(t, r.calmAt + 0.4, 2.2);
	const dissolve = rise(t, r.dissolveAt, 1.6, ease.out);

	const walk = rise(t, r.walk[0], r.walk[1] - r.walk[0], ease.inOut);
	const walkPhase = Math.max(0, t - r.walk[0]) * Math.PI * 1.8;
	const walking = walk > 0 && walk < 1 ? 1 : 0;
	const feetY = tween(walk, [0, 1], [CY, 930]);
	const height = tween(walk, [0, 1], [560, 250]);

	const finalIn = rise(t, r.rewindAt, 0.9, ease.out);
	const glyph = rise(t, r.final[0].at - 0.35, 0.5) * (1 - rise(t, r.rewindAt + 0.6, 0.8));
	const light = colorKeys(calm, [[0, '#b9aee6'], [1, '#a7b6ee']]);

	const pos = (a: number) => ({x: CX + Math.cos(a) * RX, y: CY + Math.sin(a) * RY, depth: Math.sin(a)});
	const renderItem = (it: Frozen, i: number) => {
		const p = pos(it.angle);
		const isChat = it.kind === 'chat';
		const fade = isChat ? dissolve : othersOut;
		const scale = 0.62 + 0.25 * ((p.depth + 1) / 2);
		const common = {t: frozenT, appear: 1, exit: fade, glitch: 0};
		const wrap = (w: number, h: number, node: React.ReactNode) => (
			<div key={i} style={{position: 'absolute', left: p.x - (w * scale) / 2, top: p.y - it.lift - (h * scale) / 2, width: w, height: h, transformOrigin: '0 0', transform: `scale(${scale})`, filter: p.depth < 0 ? 'brightness(0.7)' : undefined}}>
				{node}
				{/* tether to the loop: a faint line down to the track */}
				<div style={{position: 'absolute', left: w / 2, top: h, width: 1.5, height: it.lift / scale - h / 2, background: 'linear-gradient(180deg, rgba(185,174,230,0.35), transparent)', opacity: 1 - fade}} />
			</div>
		);
		if (it.kind === 'chat') return wrap(600, 300, <MemoryCard x={0} y={0} w={600} h={300} label="MEMORY · 21:14" {...common}><ChatMemory t={frozenT} at={-10} them={v.memory.word.them} me={v.memory.word.me} word={v.memory.word.word} /></MemoryCard>);
		if (it.kind === 'pause') return wrap(520, 240, <MemoryCard x={0} y={0} w={520} h={240} label="MEMORY · 21:15" {...common}><PauseMemory t={frozenT} at={-10} /></MemoryCard>);
		if (it.kind === 'face') return wrap(330, 380, <MemoryCard x={0} y={0} w={330} h={380} label="MEMORY · 21:16" {...common}><FaceMemory t={frozenT} at={-10} w={330} h={380} /></MemoryCard>);
		return wrap(
			240,
			80,
			<div style={{width: 240, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.sans, fontSize: 34, color: '#e6e1f7', borderRadius: 26, background: 'linear-gradient(160deg, rgba(58,48,104,0.85), rgba(24,20,48,0.85))', border: '1px solid rgba(185,174,230,0.25)', opacity: 1 - othersOut}}>{it.text}</div>,
		);
	};

	// the dissolving memory breaks into motes that drift upward
	const chat = pos(ITEMS[0].angle);
	const motes = dissolve > 0 && dissolve < 1
		? new Array(42).fill(0).map((_, i) => {
				const ox = (random(`mx${i}`) - 0.5) * 420;
				const oy = (random(`my${i}`) - 0.5) * 200;
				const vy = 160 + random(`mv${i}`) * 260;
				const vx = (random(`mvx${i}`) - 0.5) * 120;
				const sz = 3 + random(`ms${i}`) * 6;
				return (
					<div key={i} style={{position: 'absolute', left: chat.x + ox + vx * dissolve, top: chat.y - ITEMS[0].lift + oy - vy * dissolve, width: sz, height: sz, borderRadius: 2, background: '#d8d0ff', opacity: (1 - dissolve) * 0.85, boxShadow: '0 0 8px rgba(200,190,255,0.8)'}} />
				);
			})
		: null;

	const back = ITEMS.map((it, i) => ({it, i, d: pos(it.angle).depth})).filter((x) => x.d < 0);
	const front = ITEMS.map((it, i) => ({it, i, d: pos(it.angle).depth})).filter((x) => x.d >= 0);

	return (
		<AbsoluteFill>
			<Camera cam={cam}>
				<Atmosphere t={t} sky={colorKeys(calm, [[0, '#1b1640'], [1, '#18203f']])} ground="#0b0a1a" lightX={540} lightColor={light} lightIntensity={tween(calm, [0, 1], [0.32, 0.5])} coneWidth={tween(calm, [0, 1], [480, 640])} floorY={900} particles={calm > 0.05 ? 30 : 0} particleColor="#c9d0ff" vignette={0.85} />
				<Layer depth={1}>
					{/* distant soft light the character walks toward */}
					<div style={{position: 'absolute', left: CX - 260, top: 600, width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(170,185,240,0.22), transparent)', opacity: calm}} />
					{/* the worn loop track */}
					<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
						<ellipse cx={CX} cy={CY} rx={RX} ry={RY} fill="none" stroke="rgba(185,174,230,0.16)" strokeWidth={26} opacity={ringGlow} />
						<ellipse cx={CX} cy={CY} rx={RX} ry={RY} fill="none" stroke="#c9bfff" strokeWidth={2.5} opacity={0.8 * ringGlow} />
						<ellipse cx={CX} cy={CY} rx={RX - 18} ry={RY - 6} fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth={6} opacity={ringGlow} strokeDasharray="3 9" />
					</svg>
					{back.map((x) => renderItem(x.it, x.i))}
					<Figure x={CX} y={feetY - (walking ? Math.abs(Math.sin(walkPhase)) * 5 : 0)} height={height} t={t} stride={walking ? Math.sin(walkPhase) * 0.8 : 0} rimColor={light} rimSide={0} rimStrength={0.9} keyLight={0.45} opacity={1 - walk * 0.25} />
					{front.map((x) => renderItem(x.it, x.i))}
					{motes}
				</Layer>
			</Camera>

			{/* final statement */}
			<div style={{position: 'absolute', top: 1180, left: 0, right: 0, textAlign: 'center', fontFamily: fonts.mono, fontSize: 40, letterSpacing: '0.2em', color: '#b9aee6', opacity: glyph * 0.8}}>◀◀</div>
			<div style={{position: 'absolute', top: 1256, left: 60, right: 60, display: 'flex', justifyContent: 'center', gap: '0.5em'}}>
				{r.final.map((w) => {
					const p = rise(t, w.at, 0.6, ease.out);
					return (
						<span key={w.text} style={{fontFamily: fonts.sans, fontWeight: 600, fontSize: 52, letterSpacing: '0.3em', color: '#d4cff0', opacity: p, transform: `translateY(${(1 - p) * 16}px)`, filter: `blur(${(1 - p) * 8}px)`, display: 'inline-block'}}>
							{w.text}
						</span>
					);
				})}
			</div>
			<div
				style={{
					position: 'absolute',
					top: 1318,
					left: 0,
					right: 0,
					textAlign: 'center',
					fontFamily: fonts.serif,
					fontWeight: 900,
					fontSize: 196,
					lineHeight: 1,
					letterSpacing: `${tween(finalIn, [0, 1], [0.18, -0.01])}em`,
					opacity: finalIn,
					transform: `scale(${1.05 - finalIn * 0.05})`,
					filter: `blur(${(1 - finalIn) * 14}px) drop-shadow(0 0 30px rgba(150,130,255,0.4))`,
					background: 'linear-gradient(180deg, #ffffff 0%, #d9d2ff 55%, #9c8fd6 100%)',
					WebkitBackgroundClip: 'text',
					WebkitTextFillColor: 'transparent',
				}}
			>
				REWIND.
			</div>
		</AbsoluteFill>
	);
};
