import React from 'react';
import {AbsoluteFill} from 'remotion';
import {MAIN_LOOK, Person} from '../components/Person';

export const PersonLab: React.FC = () => (
	<AbsoluteFill style={{background: 'radial-gradient(80% 60% at 50% 30%, #2a2622, #121114)'}}>
		<Person x={200} y={900} height={760} t={0} smile={0.8} />
		<Person x={540} y={900} height={760} t={0} view="back" />
		<Person x={880} y={900} height={760} t={0} pose="crossed" smile={-0.3} tension={1} look={{...MAIN_LOOK, coat: '#2c3446', hairStyle: 'long', skin: '#8d5f45'}} />
		<Person x={200} y={1800} height={760} t={0} pose="phone" smile={0} />
		<Person x={540} y={1800} height={760} t={0} pose="pockets" tilt={6} glow={1} smile={0.6} look={{...MAIN_LOOK, coat: '#3a3a40', hairStyle: 'bun', skin: '#e0b89a'}} />
		<Person x={880} y={1800} height={760} t={0} headDown={1} stride={0.6} look={{...MAIN_LOOK, coat: '#6b5a48', hairStyle: 'crop', skin: '#a8765a'}} />
	</AbsoluteFill>
);
