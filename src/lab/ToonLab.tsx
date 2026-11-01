import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Bean, Brain, Cloud, Punch, Speech} from '../components/Toon';

export const ToonLab: React.FC = () => (
	<AbsoluteFill style={{background: '#7c6cff'}}>
		<Punch text="your brain at 3am:" y={120} size={80} family="round" />
		<Bean x={220} y={760} size={520} mouth="smile" arms="wave" />
		<Bean x={560} y={760} size={520} mouth="grimace" arms="face" blush={1} sweat={1} brows={-1} shirt="#ff7a59" hairStyle="bob" hair="#2a1a12" skin="#c98b62" />
		<Bean x={880} y={760} size={520} mouth="o" arms="hold" mustache bowtie shirt="#ffffff" hairStyle="none" eyes={1} brows={0.5} />
		<Brain x={300} y={1300} size={420} />
		<Speech x={700} y={1040} text="Enjoy your meal!" p={1} tail="left" />
		<Cloud x={760} y={1350} w={420} h={300} p={1} />
		<Bean x={540} y={1850} size={420} pelt shirt="#a8743a" hairStyle="spiky" mouth="flat" eyes={0.1} />
	</AbsoluteFill>
);
