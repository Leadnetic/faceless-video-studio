import React from 'react';
import {AbsoluteFill, random, staticFile} from 'remotion';
import {Layer} from '../lib/camera';
import {palette, VIDEO} from '../theme';

export type AtmosphereProps = {
	/** Global time in seconds (drives particles + flicker). */
	t: number;
	/** Base gradient colours, top → bottom. */
	sky: string;
	ground: string;
	/** Overhead key light. */
	lightX?: number;
	lightColor?: string;
	lightIntensity?: number;
	coneWidth?: number;
	/** Horizon / floor line. */
	floorY?: number;
	floorSheen?: number;
	particles?: number;
	particleColor?: string;
	vignette?: number;
};

/** Layered cinematic environment: gradient room, volumetric cone, floor, dust, vignette. */
export const Atmosphere: React.FC<AtmosphereProps> = ({
	t,
	sky,
	ground,
	lightX = 540,
	lightColor = palette.cold,
	lightIntensity = 0.5,
	coneWidth = 520,
	floorY = 1540,
	floorSheen = 0.25,
	particles = 46,
	particleColor = palette.ice,
	vignette = 0.85,
}) => {
	const {width: W, height: H} = VIDEO;
	return (
		<AbsoluteFill style={{backgroundColor: palette.void}}>
			{/* Room: far background plane */}
			<Layer depth={0.35}>
				<AbsoluteFill
					style={{
						background: `radial-gradient(120% 70% at ${(lightX / W) * 100}% 0%, ${sky} 0%, ${palette.night} 55%, ${palette.void} 100%)`,
						transform: 'scale(1.15)',
					}}
				/>
			</Layer>

			{/* Floor plane with sheen */}
			<Layer depth={0.85}>
				<div
					style={{
						position: 'absolute',
						left: -300,
						right: -300,
						top: floorY,
						height: H - floorY + 400,
						background: `linear-gradient(180deg, ${ground} 0%, ${palette.void} 70%)`,
						opacity: 0.9,
					}}
				/>
				<div
					style={{
						position: 'absolute',
						left: lightX - 520,
						width: 1040,
						top: floorY - 70,
						height: 200,
						borderRadius: '50%',
						background: `radial-gradient(closest-side, ${lightColor} 0%, transparent 100%)`,
						opacity: floorSheen * lightIntensity,
					}}
				/>
				<div
					style={{
						position: 'absolute',
						left: -300,
						right: -300,
						top: floorY,
						height: 2,
						background: `linear-gradient(90deg, transparent, ${lightColor}, transparent)`,
						opacity: 0.18 * lightIntensity,
					}}
				/>
			</Layer>

			{/* Volumetric light cone: pre-blurred mask tinted by the light colour (no runtime blur) */}
			<Layer depth={0.7}>
				<div
					style={{
						position: 'absolute',
						left: lightX - (coneWidth * 1.15) / 2,
						width: coneWidth * 1.15,
						top: -80,
						height: floorY + 160,
						background: `linear-gradient(180deg, ${lightColor} 0%, ${lightColor} 30%, transparent 100%)`,
						opacity: 0.38 * lightIntensity,
						WebkitMaskImage: `url(${staticFile('textures/cone.png')})`,
						WebkitMaskSize: '100% 100%',
						maskImage: `url(${staticFile('textures/cone.png')})`,
						maskSize: '100% 100%',
					}}
				/>
			</Layer>

			{/* Dust motes, three depth bands for parallax */}
			{[0.55, 1, 1.5].map((depth, band) => (
				<Layer depth={depth} key={band}>
					{new Array(Math.round(particles / 3)).fill(0).map((_, i) => {
						const id = `${band}-${i}`;
						const x0 = random(`x${id}`) * (W + 200) - 100;
						const y0 = random(`y${id}`) * H;
						const speed = 6 + random(`s${id}`) * 14;
						const size = (1.2 + random(`z${id}`) * 2.8) * depth;
						const y = (((y0 - t * speed * depth) % H) + H) % H;
						const x = x0 + Math.sin(t * 0.4 + i) * 18 * depth;
						const inCone = Math.max(0, 1 - Math.abs(x - lightX) / (coneWidth * 0.9));
						const twinkle = 0.5 + 0.5 * Math.sin(t * (1 + random(`t${id}`) * 2) + i);
						return (
							<div
								key={i}
								style={{
									position: 'absolute',
									left: x,
									top: y,
									width: size,
									height: size,
									borderRadius: '50%',
									background: particleColor,
									opacity: (0.08 + inCone * 0.5) * twinkle * lightIntensity,
								}}
							/>
						);
					})}
				</Layer>
			))}

			{/* Vignette */}
			<AbsoluteFill
				style={{
					background: `radial-gradient(85% 60% at 50% 48%, transparent 35%, rgba(2,3,7,${vignette}) 100%)`,
				}}
			/>
		</AbsoluteFill>
	);
};

/** Screen-space letterbox-free cinematic finishing: subtle top/bottom falloff. */
export const Falloff: React.FC<{strength?: number}> = ({strength = 0.6}) => (
		<AbsoluteFill
			style={{
				background: `linear-gradient(180deg, rgba(3,4,8,${strength}) 0%, transparent 18%, transparent 80%, rgba(3,4,8,${strength}) 100%)`,
				pointerEvents: 'none',
			}}
		/>
);
