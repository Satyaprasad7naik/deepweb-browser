import { SEARCH_ENGINES } from '../shared/constants';

export type SearchEngineId = keyof typeof SEARCH_ENGINES;

/**
 * SearchService — Privacy-focused search engine management.
 *
 * Supports DuckDuckGo, Startpage, Brave Search, and Google.
 * Builds search URLs without tracking parameters.
 */
export class SearchService {
  private currentEngine: SearchEngineId = 'duckduckgo';

  /** Get current search engine */
  getCurrentEngine(): SearchEngineId {
    return this.currentEngine;
  }

  /** Set the active search engine */
  setEngine(engineId: SearchEngineId): void {
    if (SEARCH_ENGINES[engineId]) {
      this.currentEngine = engineId;
    }
  }

  /** Build a search URL for the given query */
  buildSearchUrl(query: string, engineId?: SearchEngineId): string {
    const engine = SEARCH_ENGINES[engineId || this.currentEngine];
    return `${engine.url}${encodeURIComponent(query)}`;
  }

  /** Get all available search engines */
  getAvailableEngines() {
    return Object.entries(SEARCH_ENGINES).map(([id, engine]) => ({
      id,
      ...engine,
    }));
  }

  /** Get only privacy-focused engines */
  getPrivateEngines() {
    return this.getAvailableEngines().filter((engine) => engine.isPrivate);
  }
}

export default new SearchService();
