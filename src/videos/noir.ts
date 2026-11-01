import type {NoirEpisodeDef} from '../NoirEpisode';
import {episode009} from './episode009';
import {episode010} from './episode010';
import {episode011} from './episode011';
import {episode012} from './episode012';
import {episode013} from './episode013';
import {episode014} from './episode014';
import {episode015} from './episode015';
import {episode016} from './episode016';

/** Noir "Case Files" episodes (009+), looked up by id like EPISODES. */
export const NOIR_EPISODES: Record<string, NoirEpisodeDef> = {
	'009': episode009,
	'010': episode010,
	'011': episode011,
	'012': episode012,
	'013': episode013,
	'014': episode014,
	'015': episode015,
	'016': episode016,
};
