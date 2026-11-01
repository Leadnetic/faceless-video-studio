import type {BoardEpisodeDef} from '../BoardEpisode';
import {episode017} from './episode017';
import {episode018} from './episode018';
import {episode019} from './episode019';

/** "THE ARCHIVE" evidence-board episodes (017+). */
export const BOARD_EPISODES: Record<string, BoardEpisodeDef> = {
	'017': episode017,
	'018': episode018,
	'019': episode019,
};
