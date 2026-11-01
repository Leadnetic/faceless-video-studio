import React from 'react';
import {Reveal, useTime} from '../../components/Primitives';
import {ease, keys, rise} from '../../lib/anim';
import {camAt, Camera, Layer} from '../../lib/camera';
import {fonts} from '../../theme';
import type {Video002} from '../../videos/video002';
import {Bedroom} from './Bedroom';

/** 2:47 AM. Someone sits on the edge of the bed. The phone lights up once. */
export const S1Night: React.FC<{v: Video002}> = ({v}) => {
	const t = useTime();
	const [, e] = v.scenes.bedroom;
	const cam = camAt(t, {zoom: [[0, 1.0], [e + 0.4, 1.17]], fy: [[0, 1060]], x: [[0, 20], [e, -10]]}, 0.4);
	const phone = keys(t, [[v.hook.notifyAt - 0.05, 0], [v.hook.notifyAt + 0.1, 1], [3.2, 0.7], [4.6, 0]]);
	const [t1, t2] = v.hook.title;
	const second = rise(t, t2.at, 0.9, ease.out);

	return (
		<Camera cam={cam}>
			<Bedroom t={t} phone={phone} clock={v.hook.clock} />
			<Layer depth={0.25}>
				<div style={{position: 'absolute', top: 300, left: 60, right: 60, opacity: 1 - second * 0.35}}>
					<Reveal
						text={t1.text}
						t={t}
						at={t1.at}
						stagger={0.22}
						style={{fontFamily: fonts.sans, fontWeight: 600, fontSize: 44, letterSpacing: '0.2em', color: '#c3bedc'}}
					/>
				</div>
				<div style={{position: 'absolute', top: 372, left: 40, right: 40}}>
					<Reveal
						text={t2.text}
						t={t}
						at={t2.at}
						stagger={0.2}
						style={{
							fontFamily: fonts.serif,
							fontWeight: 900,
							fontSize: 112,
							letterSpacing: '-0.01em',
							color: '#efeaff',
							lineHeight: 1.05,
							filter: `drop-shadow(0 0 ${24 * second}px rgba(160,140,255,0.45))`,
						}}
					/>
				</div>
			</Layer>
		</Camera>
	);
};
