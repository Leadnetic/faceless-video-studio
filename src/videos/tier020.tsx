import React from 'react';
import {Gauge, Ink, Stick, T, type TierEpisodeDef} from '../TierEpisode';
import {pop} from '../components/Toon';
import tlJson from '../data/timeline-020.json';
import {rise, tween} from '../lib/anim';
import {narration, type Timeline} from '../lib/timeline';
import {fonts} from '../theme';

const tl = tlJson as Timeline;
const n = narration(tl);
const w = n.word;

const Bubble: React.FC<{x: number; y: number; text: string; p: number; out?: boolean; size?: number; color?: string}> = ({x, y, text, p, out = false, size = 26, color = '#fff'}) =>
	p > 0 ? (
		<g transform={`translate(${x} ${y}) scale(${p})`}>
			<rect x={-text.length * size * 0.29 - 18} y={-size - 6} width={text.length * size * 0.58 + 36} height={size * 2 + 4} rx={22} fill={out ? '#4fa3d1' : color} stroke={T.ink} strokeWidth={4} />
			<text x={0} y={size * 0.35} fontSize={size} fontFamily="Inter" fontWeight={700} textAnchor="middle" fill={out ? '#fff' : T.ink}>{text}</text>
		</g>
	) : null;

const Phone: React.FC<{x: number; y: number; t: number; s?: number; children?: React.ReactNode}> = ({x, y, t, s = 1, children}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`}>
		<Ink d="M-70 -130 h140 a18 18 0 0 1 18 18 v224 a18 18 0 0 1 -18 18 h-140 a18 18 0 0 1 -18 -18 v-224 a18 18 0 0 1 18 -18 Z" t={t} seed="ph" fill="#fff" />
		{children}
	</g>
);

/** Hook: "Seen" … no reply … the brain writes the worst story; anxiety gauge climbs. */
const Hook: React.FC<{t: number}> = ({t}) => {
	const stories: [string, number][] = [
		["they're bored of me", w(0, 17) - 0.6],
		['I said something wrong', w(0, 20)],
		['they found someone better', w(0, 23)],
	];
	const g = tween(t, [w(0, 11), w(0, 23) + 0.5], [0.2, 0.97]);
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: 560, height: 720}}>
			<svg width={1080} height={560} viewBox="0 0 1080 560">
				<Phone x={290} y={290} t={t} s={1.85}>
					<text x={0} y={-90} fontSize={20} fontFamily="Inter" fontWeight={700} textAnchor="middle" fill="#888">them</text>
					<Bubble x={-10} y={-40} text="miss u" p={pop(t, 0.3, 0.3)} out />
					<text x={40} y={0} fontSize={16} fontFamily="Inter" fill="#888" opacity={rise(t, 1.4, 0.3)}>Seen 2:14</text>
					{t > w(0, 9) && t < w(0, 13) ? <text x={-40} y={60} fontSize={40} fontFamily="Inter" fontWeight={800} fill="#999">{'•••'.slice(0, 1 + (Math.floor(t * 3) % 3))}</text> : null}
					<text x={0} y={100} fontSize={22} fontFamily="Inter" fontWeight={700} textAnchor="middle" fill={T.red} opacity={rise(t, w(0, 13), 0.3)}>no reply · 47 min</text>
				</Phone>
				{stories.map(([s, at], i) => (
					<g key={s} transform={`translate(${Math.sin(t * 3 + i) * 3} 0)`}>
						<Bubble x={720} y={90 + i * 160} text={s} p={pop(t, at, 0.35)} size={34} color="#fff5f5" />
					</g>
				))}
				<Ink d="M480 230 q60 -30 110 -100" t={t} seed="h1" w={4} color="#999" />
			</svg>
			<div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center', transform: `translateX(${g > 0.9 ? Math.sin(t * 50) * 4 : 0}px)`}}>
				<Gauge v={g} label="ANXIETY" t={t} r={110} />
			</div>
		</div>
	);
};

const F: React.FC<{t: number; s: number}> = ({t, s}) => {
	const k = Math.floor((t - s) * 2.5) % 4;
	return (
		<g>
			<Stick x={140} y={110} t={t} seed="f" s={0.9} face="worried" arms="M0 45 L40 70 L70 40 M0 45 L40 80 L70 50" />
			<Ink d="M200 20 h70 v120 h-70 Z" t={t} seed="fp" fill="#fff" />
			<text x={235} y={70} fontSize={18} fontFamily="Inter" fontWeight={800} textAnchor="middle">online?</text>
			<circle cx={235} cy={100} r={9} fill={k % 2 ? '#5cb85c' : '#ccc'} />
			<Ink d="M330 60 a40 40 0 1 1 -8 30" t={t} seed="fr" w={5} color={T.red} />
			<Ink d="M322 90 l-4 -22 l20 8" t={t} seed="fa" w={5} color={T.red} />
			<text x={420} y={200} fontSize={30} fontFamily="Kalam" fontWeight={700} fill={T.red} opacity={rise(t, s + 2.5, 0.3)}>check #{12 + Math.floor(Math.max(0, t - s) * 3)}</text>
		</g>
	);
};

const D: React.FC<{t: number; s: number}> = ({t}) => (
	<g>
		<Ink d="M120 10 h200 v300 h-200 Z" t={t} seed="dp" fill="#fff" />
		<Bubble x={230} y={70} text="hey :)" p={pop(t, w(3, 2), 0.3)} out size={24} />
		<Bubble x={220} y={140} text="hello??" p={pop(t, w(3, 4), 0.3)} out size={24} />
		<Bubble x={205} y={210} text="ok whatever" p={pop(t, w(3, 9) - 0.3, 0.3)} out size={24} />
		<Stick x={450} y={120} t={t} seed="d2" s={0.8} face="worried" arms="M0 45 L45 30 M0 45 L45 60" />
		<text x={360} y={300} fontSize={30} fontFamily="Kalam" fontWeight={700} fill={T.red} opacity={rise(t, w(3, 17), 0.3)}>← pushes away</text>
	</g>
);

const C: React.FC<{t: number; s: number}> = ({t}) => {
	const cloud = 0.4 + rise(t, w(4, 10), 0.8) * 1.0;
	return (
		<g>
			<Ink d="M40 230 h240 v60 h-240 Z M60 230 v-50 h200 v50" t={t} seed="cc" fill="#f2d7a6" />
			<Stick x={160} y={110} t={t} seed="c1" s={0.65} face="calm" />
			<Ink d="M340 80 h180 v120 h-180 Z M400 200 l-20 40 M460 200 l20 40" t={t} seed="tv" fill="#dbeafe" />
			<text x={430} y={150} fontSize={26} fontFamily="Inter" fontWeight={800} textAnchor="middle" opacity={rise(t, w(4, 6), 0.2)}>20:00</text>
			<g transform={`translate(160 40) scale(${cloud})`} opacity={rise(t, w(4, 10), 0.3)}>
				<Ink d="M-60 0 a30 30 0 0 1 40 -30 a35 35 0 0 1 60 5 a28 28 0 0 1 20 45 h-110 a25 25 0 0 1 -10 -20 Z" t={t} seed="cl" fill="#9aa5b1" />
			</g>
		</g>
	);
};

const Bb: React.FC<{t: number; s: number}> = ({t}) => {
	const calm = rise(t, w(5, 13), 1.2);
	const shake = (1 - calm) * Math.sin(t * 40) * 6;
	return (
		<g>
			<g transform={`translate(${130 + shake} 150)`}>
				<Ink d="M-90 0 c0 -70 60 -100 100 -80 c40 -30 100 0 90 60 c20 30 0 80 -40 80 c-20 30 -90 30 -110 0 c-40 0 -60 -40 -40 -60 Z" t={t} seed="br" fill="#f9c6d0" />
				<Ink d="M-40 -20 q20 20 0 40 M20 -40 q-10 30 20 50" t={t} seed="bf" w={4} />
			</g>
			<g transform={`translate(250 50) rotate(${shake * 3})`}>
				<Ink d="M-25 30 q0 -50 25 -50 q25 0 25 50 Z M-32 30 h64" t={t} seed="bell" fill={calm > 0.6 ? '#ddd' : '#ffd166'} />
			</g>
			<text x={250} y={20} fontSize={24} fontFamily="Inter" fontWeight={800} textAnchor="middle" fill={T.red} opacity={1 - calm}>!!!</text>
			<Bubble x={410} y={260} text="I feel abandoned" p={pop(t, w(5, 22), 0.35)} size={30} color="#fff" />
		</g>
	);
};

const A: React.FC<{t: number; s: number}> = ({t}) => {
	const in1 = tween(t, [w(6, 5), w(6, 7)], [0, 0.6]);
	const in2 = tween(t, [w(6, 8), w(6, 10)], [0, 0.4]);
	const out = tween(t, [w(6, 11), w(6, 14) + 0.8], [0, 1]);
	const r = 60 + (in1 + in2) * 90 - out * 90 + Math.sin(t * 1.4) * 4;
	const lbl = t < w(6, 8) ? 'IN' : t < w(6, 11) ? '+ IN' : 'OUUUT';
	return (
		<g>
			<circle cx={200} cy={170} r={Math.max(50, r)} fill="#dff3e4" stroke={T.ink} strokeWidth={6} />
			<text x={200} y={182} fontSize={36} fontFamily="Inter" fontWeight={900} textAnchor="middle" opacity={rise(t, w(6, 4), 0.2)}>{lbl}</text>
			<text x={420} y={120} fontSize={30} fontFamily="Kalam" fontWeight={700} fill={T.green}>2× nose in</text>
			<text x={420} y={170} fontSize={30} fontFamily="Kalam" fontWeight={700} fill={T.green}>1× long out</text>
			<text x={420} y={240} fontSize={30} fontFamily="Kalam" fontWeight={700} fill={T.ink} opacity={rise(t, w(6, 18), 0.3)}>5 min/day</text>
		</g>
	);
};

const S: React.FC<{t: number; s: number}> = ({t}) => (
	<g>
		<Stick x={110} y={120} t={t} seed="s1" s={0.8} face={t > w(7, 18) ? 'smile' : 'worried'} />
		<Stick x={420} y={120} t={t} seed="s2" s={0.8} face={t > w(7, 31) ? 'smile' : 'calm'} />
		<g opacity={t > w(7, 12) && t < w(7, 18) ? 1 : 0}>
			<Bubble x={260} y={40} text="why are you ignoring me?!" p={1} size={22} color="#ffe3e3" />
		</g>
		<Bubble x={260} y={40} text="can we check in at night?" p={pop(t, w(7, 18), 0.35)} size={24} color="#e8f7ec" />
		<text x={265} y={250} fontSize={70} textAnchor="middle" opacity={rise(t, w(7, 31), 0.3)}>❤</text>
	</g>
);

const Couple: React.FC<{t: number; s: number}> = ({t, s}) => {
	const v = tween(t, [s + 1, s + 5], [0.25, 0.85]);
	return (
		<g>
			<Stick x={300} y={110} t={t} seed="o1" s={0.85} face="smile" arms="M0 45 L-40 85 M0 45 L60 75" />
			<Stick x={420} y={110} t={t} seed="o2" s={0.85} face="smile" arms="M0 45 L-50 75 M0 45 L40 85" />
			<text x={620} y={80} fontSize={28} fontFamily="Inter" fontWeight={800}>SECURITY</text>
			<rect x={620} y={100} width={220} height={40} rx={10} fill="none" stroke={T.ink} strokeWidth={5} />
			<rect x={624} y={104} width={212 * v} height={32} rx={8} fill="#5cb85c" />
			<text x={620} y={200} fontSize={30} fontFamily="Kalam" fontWeight={700} fill={T.green}>grows over time</text>
		</g>
	);
};

export const tier020: TierEpisodeDef = {
	id: '020',
	timeline: tl,
	audioDir: 'audio/v020',
	title: ['Anxious Attachment', 'Tierlist', 'What Actually Calms It', '(psychology-based)'],
	Hook,
	hookEnd: n.start(1) - 0.2,
	ladderAt: n.start(1) + 0.1,
	items: [
		{tier: 'F', line: 2, label: 'Checking if they’re online', note: 'relief now → more anxiety later', anxiety: 0.93, Doodle: F},
		{tier: 'D', line: 3, label: 'The double text', note: '“protest behavior”', anxiety: 0.84, Doodle: D},
		{tier: 'C', line: 4, label: 'Distracting yourself', note: 'works ~20 min, then comes back', anxiety: 0.6, Doodle: C},
		{tier: 'B', line: 5, label: 'Naming the feeling', note: 'words calm the alarm system', anxiety: 0.42, chip: 'Lieberman et al. 2007 · UCLA', Doodle: Bb},
		{tier: 'A', line: 6, label: 'The physiological sigh', note: 'in · in · long out', anxiety: 0.27, chip: 'Balban et al. 2023 · Stanford', Doodle: A},
		{tier: 'S', line: 7, label: 'Ask for the need, early', note: 'need — not accusation', anxiety: 0.14, Doodle: S},
	],
	outro: {line: 8, text: 'Not a life sentence.', chip: 'Arriaga et al. 2018 · J. Pers. Soc. Psych.', Doodle: Couple},
	cta: {line: 9, text: 'Which tier are you in? F → S 👇'},
	sfx: [
		['ping', 0.3, 0.45],
		['pop', w(0, 13), 0.3],
		['pop', w(0, 17) - 0.6, 0.3],
		['pop', w(0, 20), 0.3],
		['pop', w(0, 23), 0.3],
		['heart', w(0, 21), 0.45],
		['whoosh', n.start(1) - 0.2, 0.35],
		...[2, 3, 4, 5, 6, 7, 8].flatMap((i): [string, number, number][] => [
			['pop', n.start(i) - 0.05, 0.35],
			['whoosh', (tl.lines[i + 1]?.start ?? tl.duration) - 0.35, 0.3],
		]),
		['ping', w(3, 2), 0.3],
		['ping', w(3, 4), 0.3],
		['ping', w(3, 9) - 0.3, 0.3],
		['ding', n.start(7) + 0.5, 0.45],
		['ping', w(7, 18), 0.35],
		['pop', n.start(9), 0.35],
	],
	music: 0.2,
};
