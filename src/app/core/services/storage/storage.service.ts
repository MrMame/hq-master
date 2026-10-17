import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  readTableFromLocalStorage<T>(tableName: string): T[] | null {
    return this.parse<T[]>(tableName);
  }

  writeTableToLocalStorage<T>(tableName: string, data: T[]): void {
    localStorage.setItem(tableName, JSON.stringify(data));
  }

  writeToLocalStorage<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  readFromLocalStorage<T>(key: string): T | null {
    return this.parse<T>(key);
  }

  // Ein manipulierter oder kaputter Eintrag darf den Start der Services nicht verhindern.
  private parse<T>(key: string): T | null {
    const value: string | null = localStorage.getItem(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      console.warn(`StorageService: ungültiges JSON unter "${key}" ignoriert.`);
      return null;
    }
  }
}
