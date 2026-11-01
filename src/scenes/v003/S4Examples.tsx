import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Person} from '../../components/Person';
import {useTime} from '../../components/Primitives';
import {ease, rise, tween} from '../../lib/anim';
import {camAt, Camera, Layer} from '../../lib/camera';
import {fonts} from '../../theme';
import {cast, look003, type Video003} from '../../videos/video003';
import {MaskWord, Salon} from './Set';

const Label: React.FC<{n: number; text: string; t: number; at: number}> = ({n, text, t, at}) => (
	<>
		<div style={{position: 'absolute', top: 262, left: 0, right: 0, textAlign: 'center', fontFamily: fonts.mono, fontSize: 24, letterSpacing: '0.3em', color: look003.amber, opacity: rise(t, at, 0.3)}}>
			0{n} / 03
		</div>
		<MaskWord text={text} t={t} at={at + 0.05} top={300} size={92} weight={800} tracking={0.05} color={look003.paper} />
	</>
);

/** Example 1 — someone else gets the spotlight; the character watches from the dark. */
const Status: React.FC<{t: number; at: number; end: number}> = ({t, at, end}) => {
	const rack = rise(t, at + (end - at) * 0.5, 0.35, ease.inOut);
	const cam = camAt(t, {zoom: [[at, 1.08], [end, 1.0]], x: [[at, 30], [end, -20]], fy: [[0, 1000]]}, 0.6);
	return (
		<Camera cam={cam}>
			<Salon t={t} spot={{x: 640, w: 480, o: 1}} lamps={[640]} dim={0.3} />
			<Layer depth={0.9}>
				<div style={{position: 'absolute', inset: 0, filter: `blur(${rack * 5}px)`}}>
					<Person x={640} y={1360} height={600} t={t + 2} look={cast.praised} smile={0.8} glow={0.9} tilt={-3} />
					<Person x={440} y={1400} height={560} t={t + 4} look={cast.guest} view="back" />
					<Person x={850} y={1390} height={560} t={t + 6} look={cast.colleague} view="back" />
				</div>
			</Layer>
			<Layer depth={1.25}>
				<div style={{position: 'absolute', inset: 0, filter: `blur(${(1 - rack) * 5}px)`}}>
					<Person x={210} y={2040} height={1500} t={t} look={cast.main} look_x={1} smile={0.05} tension={0.3} shade={0.75} rim={look003.amber} rimStrength={0.5} />
				</div>
			</Layer>
		</Camera>
	);
};

/** Example 2 — a disagreement; the smile goes. */
const Defensive: React.FC<{t: number; at: number; end: number}> = ({t, at, end}) => {
	const drop = rise(t, at + 0.55, 0.9, ease.inOut);
	const cam = camAt(t, {zoom: [[at, 1.0], [end, 1.12]], fx: [[0, 540]], fy: [[0, 820]]}, 0.5);
	const bubble = rise(t, at + 0.15, 0.3, ease.out);
	return (
		<>
			<Camera cam={cam}>
				<Salon t={t} lamps={[540]} dim={0.4} />
				<Layer depth={1}>
					<Person x={540} y={3137} height={2600} t={t} look={cast.main} look_x={-0.6} smile={tween(drop, [0, 1], [0.65, -0.3])} tension={drop * 0.9} rim={drop > 0.3 ? '#c23a3f' : look003.amber} rimStrength={0.6 + drop * 0.5} shade={0.55} />
				</Layer>
			</Camera>
			<div style={{position: 'absolute', left: 90, top: 560, opacity: bubble, transform: `translateY(${(1 - bubble) * 16}px)`, fontFamily: fonts.sans, fontWeight: 500, fontSize: 40, color: look003.charcoal, background: '#e8dcc6', padding: '20px 30px', borderRadius: '30px 30px 30px 8px', boxShadow: '0 20px 50px rgba(0,0,0,0.45)'}}>
				Actually, I see it differently.
			</div>
		</>
	);
};

/** Example 3 — the post gets nothing back; refresh, refresh, refresh. */
const Validation: React.FC<{t: number; at: number; end: number}> = ({t, at, end}) => {
	const span = end - at;
	const pulls = [0.18, 0.48, 0.76].map((f) => at + span * f);
	const pull = Math.max(...pulls.map((p) => Math.max(0, Math.sin(Math.min(Math.PI, Math.max(0, (t - p) / 0.4) * Math.PI)))));
	const cam = camAt(t, {zoom: [[at, 1.05], [end, 1.14]], fy: [[0, 960]], rot: [[at, -1.5], [end, 1]]}, 0.6);
	return (
		<Camera cam={cam}>
			<Salon t={t} lamps={[540]} dim={0.6} />
			<Layer depth={0.8}>
				<div style={{position: 'absolute', inset: 0, filter: 'blur(9px)', opacity: 0.7}}>
					<Person x={540} y={2900} height={2400} t={t} look={cast.main} look_x={0} smile={0} tension={0.35} />
				</div>
			</Layer>
			<Layer depth={1.1}>
				{/* hand */}
				<div style={{position: 'absolute', left: 300, top: 1380, width: 520, height: 520, borderRadius: '45% 45% 30% 30%', background: 'linear-gradient(160deg,#c99a7c,#9c7058)', transform: 'rotate(-8deg)'}} />
				{/* phone */}
				<div style={{position: 'absolute', left: 290, top: 620, width: 500, height: 980, borderRadius: 64, background: '#0d0d10', boxShadow: '0 50px 120px rgba(0,0,0,0.7), inset 0 0 0 2px rgba(255,255,255,0.08)', transform: 'rotate(-6deg)'}}>
					<div style={{position: 'absolute', inset: 16, borderRadius: 50, overflow: 'hidden', background: '#f4efe6'}}>
						{/* pull-to-refresh spinner */}
						<div style={{position: 'absolute', left: '50%', top: 40 + pull * 40, width: 34, height: 34, marginLeft: -17, borderRadius: 17, border: '4px solid rgba(29,27,31,0.15)', borderTopColor: look003.ink, transform: `rotate(${t * 720}deg)`, opacity: pull}} />
						<div style={{position: 'absolute', left: 0, right: 0, top: 70 + pull * 90}}>
							<div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '20px 26px'}}>
								<div style={{width: 54, height: 54, borderRadius: 27, background: 'linear-gradient(135deg,#bfa98a,#6b5a48)'}} />
								<div style={{fontFamily: fonts.sans, fontWeight: 600, fontSize: 26, color: look003.ink}}>
									you
									<div style={{fontWeight: 500, fontSize: 20, color: '#8b8378'}}>posted 2h ago</div>
								</div>
							</div>
							<div style={{margin: '0 0', height: 470, background: 'linear-gradient(160deg, #2b2a30 0%, #6b5a48 55%, #e0a957 100%)'}} />
							<div style={{display: 'flex', gap: 36, padding: '24px 28px', fontFamily: fonts.sans, fontWeight: 600, fontSize: 34, color: look003.ink, alignItems: 'center'}}>
								<span>♡ 0</span>
								<span>◯ 0</span>
								<span style={{marginLeft: 'auto', fontSize: 22, color: '#8b8378', fontWeight: 500}}>no new activity</span>
							</div>
						</div>
					</div>
				</div>
				{/* thumb */}
				<div style={{position: 'absolute', left: 560, top: 1010 + pull * 70, width: 120, height: 210, borderRadius: 60, background: 'linear-gradient(160deg,#d3a688,#a87a60)', transform: 'rotate(-18deg)'}} />
			</Layer>
		</Camera>
	);
};

/** Three rapid, elegant examples separated by whip-pans. */
export const S4Examples: React.FC<{v: Video003}> = ({v}) => {
	const t = useTime();
	const [c0, c1, c2, c3] = v.examples.cuts;
	const idx = t < c1 ? 0 : t < c2 ? 1 : 2;
	const starts = [c0, c1, c2];
	const ends = [c1, c2, c3];
	const local = t - starts[idx];
	const whipIn = 1 - rise(local, 0, 0.2, ease.out);
	const whipOut = rise(t, ends[idx] - 0.16, 0.16, ease.in);
	const dx = whipIn * 260 - whipOut * 260;
	const blur = (whipIn + whipOut) * 14;
	return (
		<AbsoluteFill style={{backgroundColor: look003.charcoal}}>
			<AbsoluteFill style={{transform: `translateX(${dx}px)`, filter: blur > 0.5 ? `blur(${blur}px)` : undefined}}>
				{idx === 0 ? <Status t={t} at={c0} end={c1} /> : idx === 1 ? <Defensive t={t} at={c1} end={c2} /> : <Validation t={t} at={c2} end={c3} />}
			</AbsoluteFill>
			<Label n={idx + 1} text={v.examples.labels[idx]} t={t} at={starts[idx] + 0.12} />
		</AbsoluteFill>
	);
};
