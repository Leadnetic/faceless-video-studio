// Render QA stills at given seconds:  [COMP=PsychologyShort002 PREFIX=v2] node tools/stills.mjs 0.5 4.2 7 ...
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const serveUrl = await bundle({entryPoint: path.join(root, 'src/index.ts')});
const id = process.env.COMP ?? 'PsychologyShort';
const inputProps = process.env.GUIDES ? {guides: true} : {};
const composition = await selectComposition({serveUrl, id, browserExecutable, inputProps});
const prefix = process.env.PREFIX ?? 'still';
for (const s of process.argv.slice(2).map(Number)) {
	const frame = Math.round(s * 30);
	const output = path.join(root, 'previews', `${prefix}_${String(frame).padStart(4, '0')}.jpg`);
	await renderStill({serveUrl, composition, frame, output, inputProps, imageFormat: 'jpeg', jpegQuality: 85, scale: 0.5, browserExecutable, chromiumOptions: {gl: 'swangle'}});
	console.log('wrote', output);
}
