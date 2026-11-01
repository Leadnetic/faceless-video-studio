import React from 'react';
import {AbsoluteFill} from 'remotion';
import {fonts} from '../theme';

/**
 * Platform UI chrome at 1080×1920 (px covered by the app), measured guides from ghost-editor/safezone.mjs.
 * `right` is the like/comment/share column, which only matters in the lower half.
 */
export const PLATFORM_SAFE = {
	instagram: {top: 220, bottom: 420, right: 130},
	tiktok: {top: 160, bottom: 480, right: 150},
	shorts: {top: 140, bottom: 380, right: 140},
	all: {top: 220, bottom: 480, right: 150},
} as const;

export const SAFE_ALL = {top: 220, bottom: 1920 - 480, right: 1080 - 150, left: 60};

/** QA overlay: red = covered by app UI. Render previews with GUIDES=1; never in the final export. */
export const SafeGuide: React.FC<{platform?: keyof typeof PLATFORM_SAFE}> = ({platform = 'all'}) => {
	const p = PLATFORM_SAFE[platform];
	const red = 'rgba(255,0,60,0.28)';
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: p.top, background: red}} />
			<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: p.bottom, background: red}} />
			<div style={{position: 'absolute', right: 0, top: 960, width: p.right, bottom: p.bottom, background: red}} />
			<div style={{position: 'absolute', left: 12, top: p.top + 8, fontFamily: fonts.mono, fontSize: 22, color: '#ff003c'}}>SAFE ZONE ({platform})</div>
		</AbsoluteFill>
	);
};
