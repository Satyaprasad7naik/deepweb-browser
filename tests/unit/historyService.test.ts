import { HistoryService } from '../../src/services/historyService';

describe('HistoryService', () => {
  let history: HistoryService;

  beforeEach(() => {
    history = new HistoryService();
  });

  test('should start empty', () => {
    expect(history.getAll()).toHaveLength(0);
    expect(history.count()).toBe(0);
  });

  test('should add entries', () => {
    history.add('https://example.com', 'Example');
    expect(history.getAll()).toHaveLength(1);
    expect(history.getAll()[0].url).toBe('https://example.com');
    expect(history.getAll()[0].title).toBe('Example');
  });

  test('should increment visit count for duplicate URLs', () => {
    history.add('https://example.com', 'Example');
    history.add('https://example.com', 'Example');
    expect(history.getAll()).toHaveLength(1);
    expect(history.getAll()[0].visitCount).toBe(2);
  });

  test('should skip blank URLs', () => {
    history.add('about:blank', 'Blank');
    history.add('', 'Empty');
    expect(history.getAll()).toHaveLength(0);
  });

  test('should search by URL', () => {
    history.add('https://google.com', 'Google');
    history.add('https://github.com', 'GitHub');
    history.add('https://example.com', 'Example');

    const results = history.search('google');
    expect(results).toHaveLength(1);
    expect(results[0].url).toBe('https://google.com');
  });

  test('should search by title', () => {
    history.add('https://example.com', 'My Example Site');
    const results = history.search('example');
    expect(results).toHaveLength(1);
  });

  test('should clear all history', () => {
    history.add('https://a.com', 'A');
    history.add('https://b.com', 'B');
    expect(history.count()).toBe(2);

    history.clear();
    expect(history.count()).toBe(0);
    expect(history.getAll()).toHaveLength(0);
  });

  test('should remove specific entries', () => {
    history.add('https://a.com', 'A');
    history.add('https://b.com', 'B');
    const allEntries = history.getAll();
    expect(allEntries.length).toBe(2);
    // Remove the first entry and verify count decreases
    const idToRemove = allEntries[0].id;
    history.remove(idToRemove);
    const remaining = history.getAll();
    expect(remaining.find(e => e.id === idToRemove)).toBeUndefined();
  });
});
