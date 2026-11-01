import type {EpisodeDef} from '../ToonEpisode';
import {episode006} from './episode006';
import {episode007} from './episode007';
import {episode008} from './episode008';

/** Episodes are looked up by id: Remotion serialises props, so shot components can't travel as props. */
export const EPISODES: Record<string, EpisodeDef> = {
	'006': episode006,
	'007': episode007,
	'008': episode008,
};
