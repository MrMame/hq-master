import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {

  readTableFromLocalStorage<T>(tableName: string): T[] | null {
    const data = localStorage.getItem(tableName);
    return data ? (JSON.parse(data) as T[]) : null;
  }

  writeTableToLocalStorage<T>(tableName: string, data: T[]): void {
    localStorage.setItem(tableName, JSON.stringify(data));
  }

  writeToLocalStorage<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  readFromLocalStorage<T>(key: string): T | null {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  }
}
