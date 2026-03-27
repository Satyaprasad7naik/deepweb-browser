import * as fs from 'fs';
import * as path from 'path';
import { app } from 'electron';

/**
 * StorageService — File-based JSON storage for bookmarks and settings.
 *
 * Stores data in the app's user data directory for persistence.
 */
export class StorageService {
  private dataDir: string;

  constructor(dataDir?: string) {
    this.dataDir = dataDir || path.join(app.getPath('userData'), 'deepweb-data');
    this.ensureDir();
  }

  /** Read data from a JSON file */
  read<T>(filename: string, fallback: T): T {
    try {
      const filePath = this.getFilePath(filename);
      if (!fs.existsSync(filePath)) {
        return fallback;
      }
      const raw = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }

  /** Write data to a JSON file */
  write<T>(filename: string, data: T): void {
    try {
      const filePath = this.getFilePath(filename);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error(`StorageService write error for ${filename}:`, error);
    }
  }

  /** Delete a data file */
  delete(filename: string): void {
    try {
      const filePath = this.getFilePath(filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error(`StorageService delete error for ${filename}:`, error);
    }
  }

  /** Check if a data file exists */
  exists(filename: string): boolean {
    return fs.existsSync(this.getFilePath(filename));
  }

  private getFilePath(filename: string): string {
    return path.join(this.dataDir, `${filename}.json`);
  }

  private ensureDir(): void {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }
    } catch (error) {
      console.error('StorageService: failed to create data directory', error);
    }
  }
}

export default StorageService;
