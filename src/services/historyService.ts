import { HistoryEntry } from '../shared/types';

/**
 * HistoryService — In-memory browsing history management.
 *
 * Tracks visited URLs with timestamps and visit counts.
 * Supports search, deduplication, and clearing.
 */
export class HistoryService {
  private entries: HistoryEntry[] = [];
  private maxEntries = 10000;

  /** Add a URL to history */
  add(url: string, title: string): void {
    // Skip blank pages
    if (url === 'about:blank' || !url) {
      return;
    }

    // Check for existing entry — increment visit count
    const existing = this.entries.find((entry) => entry.url === url);
    if (existing) {
      existing.visitCount += 1;
      existing.visitedAt = new Date();
      existing.title = title || existing.title;
      return;
    }

    const entry: HistoryEntry = {
      id: Date.now().toString(),
      url,
      title: title || url,
      visitedAt: new Date(),
      visitCount: 1,
    };

    this.entries.unshift(entry);

    // Enforce max size
    if (this.entries.length > this.maxEntries) {
      this.entries = this.entries.slice(0, this.maxEntries);
    }
  }

  /** Get all history entries (most recent first) */
  getAll(): HistoryEntry[] {
    return [...this.entries];
  }

  /** Search history by URL or title */
  search(query: string): HistoryEntry[] {
    const lowerQuery = query.toLowerCase();
    return this.entries.filter(
      (entry) =>
        entry.url.toLowerCase().includes(lowerQuery) ||
        entry.title.toLowerCase().includes(lowerQuery)
    );
  }

  /** Get entry by ID */
  getById(id: string): HistoryEntry | undefined {
    return this.entries.find((entry) => entry.id === id);
  }

  /** Remove a specific entry */
  remove(id: string): void {
    this.entries = this.entries.filter((entry) => entry.id !== id);
  }

  /** Clear all history */
  clear(): void {
    this.entries = [];
  }

  /** Get total entry count */
  count(): number {
    return this.entries.length;
  }
}

export default new HistoryService();
