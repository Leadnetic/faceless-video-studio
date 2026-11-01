import React from 'react';
import {Atmosphere} from '../../components/Atmosphere';
import {Figure} from '../../components/Figure';
import {SevenSeg} from '../../components/SevenSeg';
import {Layer} from '../../lib/camera';
import {fonts} from '../../theme';

export type BedroomProps = {
	t: number;
	/** 0 = normal night, 1 = receded into memory (darker, cooler). */
	dim?: number;
	/** Phone screen light 0…1. */
	phone?: number;
	clock: string;
};

const MOON = '154,166,232';

/** 2.5D bedroom at night: moonlit window, bed edge, nightstand clock, phone on the sheets. */
export const Bedroom: React.FC<BedroomProps> = ({t, dim = 0, phone = 0, clock}) => {
	const lit = 1 - dim * 0.55;
	const id = React.useId().replace(/:/g, '');
	return (
		<>
			<Atmosphere t={t} sky="#16143a" ground="#0b0a1c" lightX={780} lightColor="#9aa6e8" lightIntensity={0.16 * lit} coneWidth={480} floorY={1540} floorSheen={0.1} particles={0} vignette={0.9} />

			{/* back wall: window + moonbeam */}
			<Layer depth={0.6}>
				<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
					<defs>
						<linearGradient id={`bd-sky${id}`} x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stopColor="#2a2a63" />
							<stop offset="100%" stopColor="#14142f" />
						</linearGradient>
						<radialGradient id={`bd-moon${id}`} cx="0.72" cy="0.22" r="0.5">
							<stop offset="0%" stopColor={`rgb(${MOON})`} stopOpacity={0.55} />
							<stop offset="100%" stopColor={`rgb(${MOON})`} stopOpacity={0} />
						</radialGradient>
						<linearGradient id={`bd-beam${id}`} x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stopColor={`rgb(${MOON})`} stopOpacity={0.16 * lit} />
							<stop offset="100%" stopColor={`rgb(${MOON})`} stopOpacity={0} />
						</linearGradient>
					</defs>
					<g opacity={lit}>
						<rect x={650} y={560} width={270} height={440} rx={6} fill={`url(#bd-sky${id})`} />
						<rect x={650} y={560} width={270} height={440} rx={6} fill={`url(#bd-moon${id})`} />
						{/* mullions */}
						<rect x={781} y={560} width={8} height={440} fill="#0a0a18" />
						<rect x={650} y={772} width={270} height={8} fill="#0a0a18" />
						<rect x={644} y={554} width={282} height={452} rx={8} fill="none" stroke="#0a0a18" strokeWidth={14} />
						{/* curtain falling over the left edge */}
						<path d={`M610 520 C 640 700 ${628 + Math.sin(t * 0.7) * 6} 860 660 1040 L 560 1040 C 590 860 580 700 560 520 Z`} fill="#0c0b1f" />
					</g>
					<polygon points="650,1000 920,1000 860,1560 330,1560" fill={`url(#bd-beam${id})`} />
					<polygon points="650,560 920,560 920,1000 650,1000" fill={`rgba(${MOON},0.04)`} />
				</svg>
			</Layer>

			{/* bed */}
			<Layer depth={0.92}>
				<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
					<defs>
						<linearGradient id={`bd-top${id}`} x1="0" y1="0" x2="1" y2="0">
							<stop offset="0%" stopColor="#14132c" />
							<stop offset="100%" stopColor={`rgb(${Math.round(40 * lit)},${Math.round(42 * lit)},${Math.round(80 * lit)})`} />
						</linearGradient>
					</defs>
					<polygon points="150,1205 990,1205 1060,1355 40,1355" fill={`url(#bd-top${id})`} />
					<rect x={40} y={1355} width={1020} height={95} fill="#09091a" />
					<line x1={40} y1={1355} x2={1060} y2={1355} stroke={`rgba(${MOON},${0.28 * lit})`} strokeWidth={2} />
					{/* pillow */}
					<path d="M190 1215 C 200 1180 380 1176 410 1200 C 420 1232 220 1240 190 1215 Z" fill="#1d1c3c" opacity={0.9 * lit} />
				</svg>
			</Layer>

			{/* phone on the sheets + its light */}
			<Layer depth={0.95}>
				<div style={{position: 'absolute', left: 560, top: 1080, width: 520, height: 420, borderRadius: '50%', background: `radial-gradient(closest-side, rgba(170,180,255,${0.35 * phone}), transparent)`}} />
				<div
					style={{
						position: 'absolute',
						left: 740,
						top: 1318,
						width: 88,
						height: 22,
						borderRadius: 6,
						transform: 'skewX(-28deg)',
						background: phone > 0.02 ? `rgba(200,206,255,${0.25 + 0.75 * phone})` : '#111122',
						boxShadow: `0 0 ${30 * phone}px rgba(180,190,255,${phone})`,
						border: '1px solid rgba(120,120,170,0.4)',
					}}
				/>
			</Layer>

			{/* the sitter */}
			<Layer depth={1}>
				<Figure x={540} y={1560} height={820} t={t} pose="seated" rimColor={phone > 0.3 ? '#b8c0ff' : '#9aa6e8'} rimSide={1} rimStrength={0.75 + phone * 0.4} keyLight={0.18} reflection={false} />
			</Layer>

			{/* nightstand + clock (foreground) */}
			<Layer depth={1.12}>
				<div style={{position: 'absolute', left: 40, top: 1070, width: 400, height: 560, background: 'linear-gradient(180deg,#0f0e22,#06060f)', borderTop: `2px solid rgba(${MOON},0.18)`}} />
				<div style={{position: 'absolute', left: 100, top: 900, width: 330, height: 200, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(150,130,255,0.32), transparent)'}} />
				<div style={{position: 'absolute', left: 120, top: 958, width: 290, height: 112, borderRadius: 18, background: 'linear-gradient(180deg,#121126,#08080f)', border: '1px solid rgba(150,140,220,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12}}>
					<SevenSeg text={clock} height={66} color="#a99cff" t={t} />
					<div style={{fontFamily: fonts.mono, fontSize: 18, color: '#a99cff', opacity: 0.8, alignSelf: 'flex-start', marginTop: 24}}>AM</div>
				</div>
			</Layer>
		</>
	);
};
