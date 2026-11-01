import React, {useEffect, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender} from 'remotion';
import {Bust, N, PaperOverlay, SfxWord} from '../components/Noir';
import {Interrogation} from '../scenes/noir/Sets';
import {fontsReady} from '../theme';

/** Character sheet for the noir cast (QA still). */
export const NoirLab: React.FC = () => {
	const [h] = useState(() => delayRender('fonts'));
	useEffect(() => {
		fontsReady.then(() => continueRender(h));
	}, [h]);
	return (
		<AbsoluteFill>
			<Interrogation t={1} table={false} />
			<Bust who="reader" x={300} y={760} size={700} t={1} smile={0.5} asym={0.8} browR={0.7} lookX={0.4} />
			<Bust who="detective" x={790} y={760} size={700} t={1.3} knit={0.6} smile={-0.2} light="right" lookX={-0.5} />
			<Bust who="suspect" x={200} y={1400} size={560} t={2} sweat={0.8} open={0.4} browL={0.6} browR={0.6} lookX={-0.8} />
			<Bust who="client" x={540} y={1400} size={560} t={2.4} smile={0.8} blush={0.8} talk={0.6} />
			<Bust who="psychic" x={880} y={1400} size={560} t={2.6} smile={0.4} lids={0.6} light="right" />
			<Bust who="reader" x={300} y={1920} size={460} t={3} solid={N.ink} />
			<Bust who="reader" x={760} y={1920} size={480} t={4} talk={0.9} smile={0.3} />
			<SfxWord text="CASE 009" x={540} y={80} t={1} at={0} size={110} />
			<PaperOverlay />
		</AbsoluteFill>
	);
};
