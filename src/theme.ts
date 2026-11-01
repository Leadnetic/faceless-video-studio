import {FONT_DATA} from './data/fonts';

export const VIDEO = {width: 1080, height: 1920, fps: 30};

/** Platform-safe zone (TikTok / Reels / Shorts UI overlays). */
export const SAFE = {top: 220, bottom: 1520, left: 90, right: 940};

/** Self-hosted fonts (public/fonts → src/data/fonts.ts) so renders are offline-safe and reproducible. */
const FONT_FILES: [family: string, file: string, weight: string, style: string][] = [
	['Playfair Display', 'playfair-900.woff2', '900', 'normal'],
	['Playfair Display Italic', 'playfair-italic-400.woff2', '400', 'italic'],
	['Inter', 'inter-500.woff2', '500', 'normal'],
	['Inter', 'inter-600.woff2', '600', 'normal'],
	['Inter', 'inter-800.woff2', '800', 'normal'],
	['JetBrains Mono', 'jetbrains-400.woff2', '400', 'normal'],
	['Montserrat', 'montserrat-900.woff2', '900', 'normal'],
	['Fredoka', 'fredoka-700.woff2', '700', 'normal'],
	['Bangers', 'bangers-400.woff2', '400', 'normal'],
	['Kalam', 'kalam-700.woff2', '700', 'normal'],
	['Comic Neue', 'comicneue-700.woff2', '700', 'normal'],
];

const toBuffer = (b64: string) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)).buffer;

/** Resolves once all embedded faces are registered; awaited by the root composition. */
export const fontsReady: Promise<unknown> =
	typeof document === 'undefined'
		? Promise.resolve()
		: Promise.all(
				FONT_FILES.map(([family, file, weight, style]) => {
					const face = new FontFace(family, toBuffer(FONT_DATA[file.replace('.woff2', '')]), {weight, style});
					document.fonts.add(face);
					return face.load();
				}),
			).catch((err) => console.error(err));

export const fonts = {
	serif: '"Playfair Display", Georgia, serif',
	serifItalic: '"Playfair Display Italic", Georgia, serif',
	sans: 'Inter, "Helvetica Neue", Arial, sans-serif',
	mono: '"JetBrains Mono", Menlo, monospace',
	/** Video 004+: punchy social captions and playful cartoon type. */
	punch: 'Montserrat, Inter, Arial, sans-serif',
	round: 'Fredoka, Inter, Arial, sans-serif',
	/** Video 009+: noir graphic-novel series. */
	comic: 'Bangers, Impact, sans-serif',
	hand: 'Kalam, "Comic Neue", cursive',
	letter: '"Comic Neue", Inter, sans-serif',
};

export const palette = {
	void: '#04060b',
	night: '#070b14',
	navy: '#0b1426',
	deep: '#122039',
	slate: '#1d2c47',
	muted: '#4a6a99',
	cold: '#8fb4e8',
	ice: '#d6e4fb',
	warm: '#c9b8a6',
	text: '#eaeef5',
	dim: '#8590a6',
	faint: '#4b5569',
	red: '#c8323c',
	redSoft: '#8e2a33',
	redGlow: 'rgba(214, 52, 66, 0.55)',
};
