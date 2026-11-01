import React from 'react';
import {Composition, Still} from 'remotion';
import {PsychologyShort} from './PsychologyShort';
import {PsychologyShort002} from './PsychologyShort002';
import {PsychologyShort003} from './PsychologyShort003';
import {PsychologyShort004} from './PsychologyShort004';
import {PsychologyShort005} from './PsychologyShort005';
import {ToonEpisode} from './ToonEpisode';
import {EPISODES} from './videos/episodes';
import {PersonLab} from './lab/PersonLab';
import {ToonLab} from './lab/ToonLab';
import {NoirLab} from './lab/NoirLab';
import {NoirEpisode} from './NoirEpisode';
import {BoardEpisode} from './BoardEpisode';
import {BOARD_EPISODES} from './videos/board';
import {NOIR_EPISODES} from './videos/noir';
import {VIDEO} from './theme';
import {video001} from './videos/video001';
import {video002} from './videos/video002';
import {video003} from './videos/video003';
import {video004} from './videos/video004';
import {video005} from './videos/video005';

export const RemotionRoot: React.FC = () => (
	<>
		<Composition
			id="PsychologyShort"
			component={PsychologyShort}
			durationInFrames={Math.ceil(video001.timeline.duration * VIDEO.fps)}
			fps={VIDEO.fps}
			width={VIDEO.width}
			height={VIDEO.height}
			defaultProps={{v: video001}}
		/>
		<Composition
			id="PsychologyShort002"
			component={PsychologyShort002}
			durationInFrames={Math.ceil(video002.timeline.duration * VIDEO.fps)}
			fps={VIDEO.fps}
			width={VIDEO.width}
			height={VIDEO.height}
			defaultProps={{v: video002}}
		/>
		<Composition
			id="PsychologyShort003"
			component={PsychologyShort003}
			durationInFrames={Math.ceil(video003.timeline.duration * VIDEO.fps)}
			fps={VIDEO.fps}
			width={VIDEO.width}
			height={VIDEO.height}
			defaultProps={{v: video003}}
		/>
		<Composition
			id="PsychologyShort004"
			component={PsychologyShort004}
			durationInFrames={Math.ceil(video004.timeline.duration * VIDEO.fps)}
			fps={VIDEO.fps}
			width={VIDEO.width}
			height={VIDEO.height}
			defaultProps={{v: video004}}
		/>
		<Composition
			id="PsychologyShort005"
			component={PsychologyShort005}
			durationInFrames={Math.ceil(video005.timeline.duration * VIDEO.fps)}
			fps={VIDEO.fps}
			width={VIDEO.width}
			height={VIDEO.height}
			defaultProps={{v: video005, guides: false}}
		/>
		{Object.entries(EPISODES).map(([epId, ep]) => (
			<Composition
				key={epId}
				id={`Episode${epId}`}
				component={ToonEpisode}
				durationInFrames={Math.ceil(ep.timeline.duration * VIDEO.fps)}
				fps={VIDEO.fps}
				width={VIDEO.width}
				height={VIDEO.height}
				defaultProps={{epId, guides: false}}
			/>
		))}
		{Object.entries(NOIR_EPISODES).map(([epId, ep]) => (
			<Composition
				key={epId}
				id={`Episode${epId}`}
				component={NoirEpisode}
				durationInFrames={Math.ceil(ep.timeline.duration * VIDEO.fps)}
				fps={VIDEO.fps}
				width={VIDEO.width}
				height={VIDEO.height}
				defaultProps={{epId, guides: false}}
			/>
		))}
		{Object.entries(BOARD_EPISODES).map(([epId, ep]) => (
			<Composition
				key={epId}
				id={`Episode${epId}`}
				component={BoardEpisode}
				durationInFrames={Math.ceil(ep.timeline.duration * VIDEO.fps)}
				fps={VIDEO.fps}
				width={VIDEO.width}
				height={VIDEO.height}
				defaultProps={{epId, guides: false}}
			/>
		))}
		<Still id="NoirLab" component={NoirLab} width={1080} height={1920} />
		<Still id="ToonLab" component={ToonLab} width={1080} height={1920} />
		<Still id="PersonLab" component={PersonLab} width={1080} height={1920} />
		<Still id="Thumbnail" component={PsychologyShort} width={VIDEO.width} height={VIDEO.height} defaultProps={{v: video001}} />
	</>
);
