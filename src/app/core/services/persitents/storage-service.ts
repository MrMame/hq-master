import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  
  
  readTableFromLocalStorage(tableName: string): any[] | null {
    const data = localStorage.getItem(tableName);
    return data ? JSON.parse(data) : null;
  }

  writeTableToLocalStorage(tableName: string, data: any[]): void {
    localStorage.setItem(tableName, JSON.stringify(data));
  }
  
  writeToLocalStorage(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  readFromLocalStorage(key: string): any {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

}
