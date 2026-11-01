import React from 'react';
import {AbsoluteFill} from 'remotion';
import {ChatMemory, FaceMemory, MemoryCard, PauseMemory} from '../../components/MemoryCard';
import {useTime} from '../../components/Primitives';
import {RewindOverlay, TapeJitter} from '../../components/Rewind';
import {ease, envelope, keys, rise} from '../../lib/anim';
import {camAt, Camera, Layer} from '../../lib/camera';
import type {Video002} from '../../videos/video002';
import {Bedroom} from './Bedroom';

/** Fragments of the earlier conversation drift around the sitter, then rewind and replay. */
export const S2Memories: React.FC<{v: Video002}> = ({v}) => {
	const t = useTime();
	const [s] = v.scenes.memory;
	const m = v.memory;
	const [rw0, rw1] = m.rewind;
	const [repA, repB] = m.repeats;

	const cam = camAt(
		t,
		{
			zoom: [[s, 1.17], [m.dive - 0.05, 1.3], [m.dive + 0.55, 5.2]],
			fy: [[s, 1060], [m.dive, 1040]],
			x: [[s, -10], [m.dive, 0]],
		},
		0.35,
	);

	const rewinding = envelope(t, rw0, rw1, 0.12, 0.18);
	const spikeA = envelope(t, repA - 0.05, repA + 0.25, 0.05, 0.15) * 0.6;
	const spikeB = envelope(t, repB - 0.05, repB + 0.25, 0.05, 0.15) * 0.6;
	const glitch = Math.max(rewinding, spikeA, spikeB);
	const dip = (repeatAt?: number) => rise(t, rw0, 0.4) * (repeatAt ? 1 - rise(t, repeatAt, 0.35, ease.out) : 1);
	// Tape position: runs forward, then spools back fast while rewinding.
	const tape = 21 * 60 + 14 + (t - s) - keys(t, [[rw0, 0], [rw1, 9]]) * 1.4;

	const card = (at: number, repeatAt?: number) => rise(t, at, 0.6, ease.out) * (1 - 0.75 * dip(repeatAt));

	return (
		<AbsoluteFill>
			<TapeJitter strength={glitch}>
				<Camera cam={cam}>
					<Bedroom t={t} dim={rise(t, s, 1.2)} clock={v.hook.clock} />
					<Layer depth={1.08}>
						<MemoryCard x={130} y={330} w={580} h={300} t={t} appear={card(m.word.at, repA)} glitch={glitch} label="MEMORY · 21:14" tilt={-1.5}>
							<ChatMemory t={t} at={t < repA ? m.word.at : repA} them={m.word.them} me={m.word.me} word={m.word.word} />
						</MemoryCard>
					</Layer>
					<Layer depth={1.04}>
						<MemoryCard x={470} y={670} w={470} h={230} t={t} appear={card(m.pause.at, repB)} glitch={glitch} label="MEMORY · 21:15" tilt={1.2}>
							<PauseMemory t={t} at={t < repB ? m.pause.at : repB} />
						</MemoryCard>
					</Layer>
					<Layer depth={1.15}>
						<MemoryCard x={130} y={790} w={300} h={350} t={t} appear={card(m.face.at)} glitch={glitch} label="MEMORY · 21:16" tilt={-2}>
							<FaceMemory t={t} at={m.face.at} w={300} h={350} />
						</MemoryCard>
					</Layer>
				</Camera>
			</TapeJitter>
			<RewindOverlay strength={glitch} clock={tape} label={rewinding > 0.3 ? 'REW' : 'REPLAY'} />
		</AbsoluteFill>
	);
};
