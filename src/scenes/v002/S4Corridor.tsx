import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Corridor} from '../../components/Corridor';
import {Figure} from '../../components/Figure';
import {ChatMemory, memoryTint} from '../../components/MemoryCard';
import {useTime} from '../../components/Primitives';
import {SevenSeg} from '../../components/SevenSeg';
import {ease, rise} from '../../lib/anim';
import {camAt, Camera, Layer} from '../../lib/camera';
import {fonts} from '../../theme';
import type {Video002} from '../../videos/video002';

const START = 1.6; // first memory reaches the camera after ~1.4 units

/** Integrates speed so the walk can arrive fast, settle, then grind to a halt at the freeze. */
const travelAt = (t: number, s: number, base: number, freezeAt: number) => {
	let d = START;
	const dt = 1 / 30;
	for (let x = s; x < t; x += dt) {
		const arrive = 1 + 2.2 * Math.exp(-(x - s) * 2.4);
		const stop = 1 - rise(x, freezeAt - 0.2, 0.5, ease.out);
		d += base * arrive * stop * dt;
	}
	return d;
};

/** An endless circular corridor: the character keeps walking, the same memory keeps coming back. */
export const S4Corridor: React.FC<{v: Video002}> = ({v}) => {
	const t = useTime();
	const [s] = v.scenes.corridor;
	const {speed, freezeAt, memoryEvery} = v.corridor;
	const travel = travelAt(t, s, speed, freezeAt);
	const frozen = rise(t, freezeAt - 0.1, 0.5);
	const stride = Math.sin(travel * Math.PI * 1.15);
	const bob = Math.abs(Math.sin(travel * Math.PI * 1.15)) * 7;
	const loops = Math.floor(travel / memoryEvery) + 1;
	const sinceLoop = (travel % memoryEvery) / speed;
	const cam = camAt(t, {zoom: [[s, 1.35], [s + 1.2, 1.0]], fy: [[s, 960]]}, 0.3 * (1 - frozen));

	return (
		<AbsoluteFill style={{backgroundColor: '#05050d'}}>
			<Camera cam={cam}>
				<Layer depth={1}>
					<Corridor
						travel={travel}
						renderItem={(i, z, project, alpha) => {
							if (alpha < 0.02 || z < 0.85) return null;
							if (i % memoryEvery === 0) {
								const p = project(-0.74, -0.42, z);
								const w = 0.66 * p.k;
								return (
									<div style={{position: 'absolute', left: p.x - w / 2, top: p.y - (w * 0.5) / 2, width: 600, height: 300, transformOrigin: '0 0', transform: `scale(${w / 600}) perspective(900px) rotateY(32deg)`, opacity: alpha, borderRadius: 30, overflow: 'hidden', background: memoryTint.glass, border: `1.5px solid ${memoryTint.edge}`}}>
										<ChatMemory t={t} at={-10} them={v.memory.word.them} me={v.memory.word.me} word={v.memory.word.word} />
									</div>
								);
							}
							if (i % memoryEvery === 1) {
								const p = project(0.8, -0.62, z);
								const sc = (0.42 * p.k) / 260;
								return (
									<div style={{position: 'absolute', left: p.x - 130 * sc, top: p.y - 50 * sc, width: 260, height: 100, transformOrigin: '0 0', transform: `scale(${sc}) perspective(900px) rotateY(-32deg)`, opacity: alpha, borderRadius: 16, background: '#0b0a18', border: '1px solid rgba(150,140,220,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
										<SevenSeg text={v.hook.clock} height={62} color="#a99cff" t={t} blink={frozen < 0.5} />
									</div>
								);
							}
							return null;
						}}
					/>
				</Layer>
				<Layer depth={1}>
					<Figure x={540 + Math.sin(travel * 0.9) * 4} y={1234 - bob * (1 - frozen)} height={570} t={t} stride={stride * 0.9} rimColor="#c9bfff" rimSide={0} rimStrength={0.95} keyLight={0.45} />
				</Layer>
			</Camera>
			{/* loop counter / pause state */}
			<div style={{position: 'absolute', left: 96, top: 240, fontFamily: fonts.mono, fontSize: 30, letterSpacing: '0.16em', color: '#c9bfff', opacity: rise(t, s + 0.8, 0.5) * 0.85, textShadow: '0 0 12px rgba(185,174,230,0.6)'}}>
				{frozen > 0.5 ? '❚❚ PAUSED' : `↻ REPLAY ${String(loops).padStart(2, '0')}`}
				<div style={{height: 2, marginTop: 10, width: 220, background: 'rgba(185,174,230,0.18)'}}>
					<div style={{height: 2, width: `${frozen > 0.5 ? 100 : Math.min(100, (sinceLoop / (memoryEvery / speed)) * 100)}%`, background: '#c9bfff'}} />
				</div>
			</div>
			{/* the freeze drains colour */}
			<AbsoluteFill style={{background: 'rgba(20,18,36,0.55)', mixBlendMode: 'saturation', opacity: frozen}} />
		</AbsoluteFill>
	);
};
