import type {TierEpisodeDef} from '../TierEpisode';
import {tier020} from './tier020';

/** "Psychology-based Tierlist" episodes (020+). */
export const TIER_EPISODES: Record<string, TierEpisodeDef> = {
	'020': tier020,
};
