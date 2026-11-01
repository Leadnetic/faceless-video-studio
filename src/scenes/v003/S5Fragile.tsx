import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Cracks, Mirror} from '../../components/Mirror';
import {Person} from '../../components/Person';
import {useTime} from '../../components/Primitives';
import {ease, keys, rise, tween} from '../../lib/anim';
import {camAt, Camera, Layer} from '../../lib/camera';
import {cast, look003, type Video003} from '../../videos/video003';
import {MaskWord} from './Set';

/** The reveal: they have been carrying a huge, beautiful — paper-thin — mirror all along. */
export const S5Fragile: React.FC<{v: Video003}> = ({v}) => {
	const t = useTime();
	const [s] = v.scenes.mirror;
	const m = v.mirror;
	const [o0, , o2] = m.orbit;
	const turn = keys(t, [[o0, 0], [o0 + 0.8, 0.965], [m.hugeAt + 0.1, 0.965], [m.hugeAt + 0.8, 0.22], [o2, 0]]);
	const sinT = Math.sin((turn * Math.PI) / 2);
	const mx = 540 + sinT * 250;
	const cam = camAt(t, {zoom: [[s, 2.1], [m.revealEnd, 1.0], [m.fragileAt, 1.06], [v.scenes.mirror[1] + 0.3, 1.0]], fy: [[s, 1180], [m.revealEnd, 960]], rot: [[o0, 0], [o0 + 0.8, -1.2], [o2, 0]]}, 0.4);
	const W = 760;
	const H = 1500;
	const fragile = rise(t, m.fragileAt, 1.1, ease.out);
	const strike = rise(t, m.fragileAt - 0.05, 0.22, ease.out);
	const small = m.cracks.map((at, i) => ({cx: [0.3, 0.74, 0.42][i], cy: [0.24, 0.42, 0.7][i], p: rise(t, at, 0.22, ease.out), r: 80, seed: `sm${i}`, red: 0.9, branches: 6}));
	const tense = rise(t, m.tensionAt, m.fragileAt - m.tensionAt);
	const jitter = tense * (1 - fragile) * Math.sin(t * 90) * 1.5;

	return (
		<AbsoluteFill style={{background: 'radial-gradient(90% 60% at 50% 25%, #2a241e 0%, #141317 55%, #0b0b0e 100%)'}}>
			<Camera cam={cam}>
				<Layer depth={0.92}>
					<Mirror
						x={mx + jitter}
						y={1640}
						w={W}
						h={H}
						t={t}
						turn={turn}
						cracks={[...small, {cx: 0.5, cy: 0.2, p: fragile, r: 950, seed: 'fragile', red: 0.55, branches: 14}]}
					>
						<div style={{position: 'absolute', inset: 0, background: 'radial-gradient(70% 55% at 50% 30%, rgba(255,205,140,0.35), transparent 75%)'}} />
						<Person x={W / 2} y={H + 120} height={1640} t={t} view="back" look={cast.main} glow={0.6} rim={look003.amber} rimStrength={1} shade={0.3} />
					</Mirror>
					{/* straps: the mirror is being carried */}
					<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
						<path d={`M470 980 L${mx - (W / 2) * Math.cos((turn * Math.PI) / 2) + 40} 420`} stroke="#3b2a1a" strokeWidth={6} />
						<path d={`M610 980 L${mx + (W / 2) * Math.cos((turn * Math.PI) / 2) - 40} 420`} stroke="#3b2a1a" strokeWidth={6} />
					</svg>
				</Layer>
				<Layer depth={1}>
					<div style={{position: 'absolute', left: 300, top: 1560, width: 480, height: 70, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(0,0,0,0.6), transparent)'}} />
					<div style={{position: 'absolute', inset: 0, transform: `scaleX(${1 - sinT * 0.1})`, transformOrigin: '540px 0'}}>
						<Person x={540} y={1600} height={780} t={t} look={cast.main} smile={tween(tense, [0, 1], [0.35, 0.05])} tension={tense * 0.6} rim={look003.amber} rimStrength={0.9} />
					</div>
				</Layer>
			</Camera>
			<MaskWord text="HUGE EGO?" t={t} at={m.hugeAt} until={m.fragileAt - 0.02} top={190} size={140} family="serif" weight={900} tracking={0.01} color={look003.paper} />
			{strike > 0 && t < m.fragileAt + 0.2 ? (
				<div style={{position: 'absolute', left: 170, top: 280, width: 410 * strike, height: 8, background: look003.red, boxShadow: '0 0 18px rgba(163,36,44,0.8)'}} />
			) : null}
			<MaskWord text="FRAGILE EGO." t={t} at={m.fragileAt + 0.22} top={190} size={124} family="serif" weight={900} tracking={0.0} color={look003.paper} />
			{fragile > 0 ? (
				<div style={{position: 'absolute', left: 120, top: 190, width: 840, height: 160, opacity: rise(t, m.fragileAt + 0.45, 0.4)}}>
					<Cracks w={840} h={160} cracks={[{cx: 0.36, cy: 0.5, p: rise(t, m.fragileAt + 0.45, 0.4, ease.out), r: 210, seed: 'type', red: 0.8, branches: 7}]} />
				</div>
			) : null}
		</AbsoluteFill>
	);
};
