import {Easing, interpolate, interpolateColors} from 'remotion';
import {VIDEO} from '../theme';

export const s2f = (s: number) => Math.round(s * VIDEO.fps);

export const ease = {
	out: Easing.bezier(0.16, 1, 0.3, 1),
	inOut: Easing.bezier(0.65, 0, 0.35, 1),
	in: Easing.bezier(0.55, 0, 1, 0.45),
	soft: Easing.bezier(0.45, 0.05, 0.25, 1),
};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Clamped, eased interpolation over time (seconds). */
export const tween = (t: number, [t0, t1]: [number, number], [a, b]: [number, number], easing = ease.inOut) =>
	interpolate(t, [t0, t1], [a, b], {...clamp, easing});

/** 0 → 1 progress starting at `start` lasting `dur` seconds. */
export const rise = (t: number, start: number, dur = 0.45, easing = ease.out) => tween(t, [start, start + dur], [0, 1], easing);

/** Multi-stop keyframes: [[time, value], ...]. */
export const keys = (t: number, k: [number, number][], easing = ease.inOut) => {
	if (t <= k[0][0]) return k[0][1];
	for (let i = 0; i < k.length - 1; i++) {
		if (t <= k[i + 1][0]) return tween(t, [k[i][0], k[i + 1][0]], [k[i][1], k[i + 1][1]], easing);
	}
	return k[k.length - 1][1];
};

export const colorKeys = (t: number, k: [number, string][]) =>
	interpolateColors(
		Math.min(Math.max(t, k[0][0]), k[k.length - 1][0]),
		k.map((x) => x[0]),
		k.map((x) => x[1]),
	);

/** Visibility envelope: fades in at `start`, out at `end`. */
export const envelope = (t: number, start: number, end: number, fadeIn = 0.35, fadeOut = 0.45) =>
	Math.min(rise(t, start, fadeIn), 1 - rise(t, end - fadeOut, fadeOut, ease.in));

/** Deterministic organic wobble, useful for handheld drift and light flicker. */
export const drift = (t: number, seed = 0, speed = 1) =>
	Math.sin(t * 0.73 * speed + seed) * 0.6 + Math.sin(t * 1.37 * speed + seed * 2.1) * 0.3 + Math.sin(t * 2.91 * speed + seed * 0.7) * 0.1;
