import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Cracks} from '../../components/Mirror';
import {Person} from '../../components/Person';
import {useTime} from '../../components/Primitives';
import {ease, keys, rise, tween} from '../../lib/anim';
import {camAt, Camera, Layer} from '../../lib/camera';
import {fonts} from '../../theme';
import {cast, look003, type Video003} from '../../videos/video003';
import {MaskWord, Paper, Salon} from './Set';

/** A normal comment. The room freezes. Inside, the tiny arrow becomes a spear. */
export const S3Critique: React.FC<{v: Video003}> = ({v}) => {
	const t = useTime();
	const c = v.critique;
	const inside = t >= c.insideAt;
	const frozen = rise(t, c.freezeAt, 0.25);
	const tf = t < c.freezeAt ? t : c.freezeAt; // time stops for everyone

	if (!inside) {
		const bubble = rise(t, c.commentAt, 0.35, ease.out);
		const collapse = rise(t, c.arrowAt, 0.18, ease.in);
		const fly = rise(t, c.arrowAt + 0.12, c.insideAt - c.arrowAt - 0.12, ease.in);
		const cam = camAt(t, {zoom: [[c.commentAt - 0.2, 1.0], [c.freezeAt, 1.06], [c.insideAt, 1.16]], fx: [[0, 420]], fy: [[0, 760]]}, 0.5 * (1 - frozen));
		const ax = tween(fly, [0, 1], [700, 400]);
		const ay = tween(fly, [0, 1], [560, 690]);
		return (
			<AbsoluteFill>
				<Camera cam={cam}>
					<Salon t={tf} lamps={[300, 800]} />
					<Layer depth={1}>
						<Person x={820} y={1640} height={960} t={tf + 5} look={cast.colleague} look_x={-1} smile={0.25} rimStrength={0.6} />
						<Person x={380} y={1680} height={1000} t={tf} look={cast.main} look_x={1} smile={tween(frozen, [0, 1], [0.4, 0.15])} tension={frozen * 0.4} rim={look003.amber} rimStrength={0.8} />
					</Layer>
				</Camera>
				{/* freeze: colour drains, time stops */}
				<AbsoluteFill style={{background: '#8a8a8a', mixBlendMode: 'saturation', opacity: frozen * 0.85}} />
				<AbsoluteFill style={{background: `radial-gradient(60% 45% at 40% 40%, transparent 40%, rgba(10,8,10,${0.5 * frozen}) 100%)`}} />
				{/* the comment: ordinary, beige, small */}
				<div
					style={{
						position: 'absolute',
						right: 110,
						top: 500,
						transformOrigin: '80% 100%',
						transform: `scale(${(0.9 + 0.1 * bubble) * (1 - collapse)})`,
						opacity: bubble * (1 - collapse),
						fontFamily: fonts.sans,
						fontWeight: 500,
						fontSize: 38,
						lineHeight: 1.25,
						color: look003.charcoal,
						background: '#e8dcc6',
						padding: '22px 30px',
						borderRadius: '30px 30px 8px 30px',
						maxWidth: 520,
						boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
					}}
				>
					{c.comment}
				</div>
				{/* …which becomes a tiny arrow */}
				{collapse > 0 ? (
					<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
						<g transform={`translate(${ax} ${ay}) rotate(${190})`} opacity={collapse}>
							<line x1={0} y1={0} x2={46} y2={0} stroke={look003.red} strokeWidth={3} />
							<path d="M-2 0 L12 -7 L12 7 Z" fill={look003.red} transform="rotate(180 5 0)" />
						</g>
					</svg>
				) : null}
			</AbsoluteFill>
		);
	}

	// Inside the head: a glass self-image on paper; the arrow arrives as a spear.
	const fly = rise(t, c.insideAt + 0.02, c.strikeAt - c.insideAt, ease.in);
	const hit = t - c.strikeAt;
	const shake = hit > 0 ? Math.exp(-hit * 9) * Math.sin(hit * 70) * 12 : 0;
	const spearScale = tween(fly, [0, 1], [0.08, 1]);
	const tipX = tween(fly, [0, 1], [1180, 560]);
	const cam = camAt(t, {zoom: [[c.insideAt, 1.12], [c.insideAt + 1.8, 1.0]], fy: [[0, 960]]}, 0.4);
	cam.x += shake;
	const crack = rise(t, c.strikeAt, 0.35, ease.out);
	return (
		<AbsoluteFill>
			<Camera cam={cam}>
				<Paper t={t} />
				<Layer depth={1}>
					<div style={{position: 'absolute', left: 540, top: 1460, width: 520, height: 60, marginLeft: -260, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(60,50,40,0.18), transparent)'}} />
					<Person x={540} y={1470} height={900} t={t} look={cast.glass} features={false} rim="#ffffff" rimStrength={0.9} shade={0.12} shadow={false} />
					{/* glass highlight sweep */}
					<div style={{position: 'absolute', left: 390, top: 570, width: 300, height: 900, background: 'linear-gradient(100deg, transparent 30%, rgba(255,255,255,0.35) 45%, transparent 60%)', WebkitMaskImage: 'radial-gradient(40% 50% at 50% 50%, #000, transparent)', opacity: 0.6}} />
					<div style={{position: 'absolute', left: 290, top: 600, width: 500, height: 700}}>
						<Cracks w={500} h={700} cracks={[{cx: 0.53, cy: 0.38, p: crack, r: 330, seed: 'self', red: 1, branches: 12}]} />
					</div>
				</Layer>
				<Layer depth={1.05}>
					{fly < 1.2 ? (
						<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
							<g transform={`translate(${tipX + (hit > 0 ? 0 : 0)} 866) scale(${spearScale})`}>
								<rect x={30} y={-6} width={900} height={12} rx={4} fill={look003.red} />
								<path d="M0 0 L60 -26 L44 0 L60 26 Z" fill="#7d1a21" />
								<rect x={880} y={-14} width={10} height={28} fill="#5e141a" />
							</g>
						</svg>
					) : null}
				</Layer>
			</Camera>
			<AbsoluteFill style={{background: `radial-gradient(50% 35% at 52% 45%, rgba(163,36,44,${0.18 * keys(t, [[c.strikeAt, 0], [c.strikeAt + 0.06, 1], [c.strikeAt + 1, 0.3]])}), transparent)`}} />
			<MaskWord text="SELF-IMAGE" t={t} at={c.strikeAt - 0.25} until={c.threatAt - 0.05} top={300} size={44} weight={600} tracking={0.42} color={look003.ink} />
			<MaskWord text="CRITICISM " t={t} at={c.threatAt} top={290} size={84} weight={800} tracking={0.02} color={look003.ink}>
				<span style={{color: look003.red}}>→ THREAT</span>
			</MaskWord>
		</AbsoluteFill>
	);
};
