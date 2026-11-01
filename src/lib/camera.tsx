import React, {createContext, useContext} from 'react';
import {AbsoluteFill} from 'remotion';
import {drift, keys} from './anim';

/** Virtual camera. zoom about focus (fx, fy) plus pan (x, y) in px. */
export type Cam = {zoom: number; x: number; y: number; fx: number; fy: number; rot: number};

const DEFAULT: Cam = {zoom: 1, x: 0, y: 0, fx: 540, fy: 960, rot: 0};
const CameraCtx = createContext<Cam>(DEFAULT);
export const useCam = () => useContext(CameraCtx);

type CamKeys = Partial<Record<keyof Cam, [number, number][]>>;

/** Build a camera from keyframed properties plus subtle handheld breathing. */
export const camAt = (t: number, k: CamKeys, handheld = 1): Cam => {
	const v = (p: keyof Cam) => (k[p] ? keys(t, k[p]!) : DEFAULT[p]);
	return {
		zoom: v('zoom'),
		x: v('x') + drift(t, 1.3, 0.6) * 6 * handheld,
		y: v('y') + drift(t, 4.2, 0.5) * 5 * handheld,
		fx: v('fx'),
		fy: v('fy'),
		rot: v('rot') + drift(t, 2.7, 0.4) * 0.12 * handheld,
	};
};

export const Camera: React.FC<{cam: Cam; children: React.ReactNode}> = ({cam, children}) => (
	<CameraCtx.Provider value={cam}>{children}</CameraCtx.Provider>
);

/**
 * Parallax plane. depth 0 = locked to screen (UI, captions), 1 = world plane,
 * >1 = foreground (moves faster), <1 = background (moves slower).
 */
export const Layer: React.FC<{depth: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
	depth,
	children,
	style,
}) => {
	const c = useCam();
	const zoom = 1 + (c.zoom - 1) * depth;
	return (
		<AbsoluteFill
			style={{
				transformOrigin: `${c.fx}px ${c.fy}px`,
				transform: `translate(${-c.x * depth}px, ${-c.y * depth}px) scale(${zoom}) rotate(${c.rot * depth}deg)`,
				...style,
			}}
		>
			{children}
		</AbsoluteFill>
	);
};
