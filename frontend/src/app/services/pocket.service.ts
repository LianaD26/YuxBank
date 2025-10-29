import { Injectable } from '@angular/core';

export interface Pocket {
  id: string;
  name: string;
  description?: string;
  value: number;
  createdAt: string;
  fromAccount?: string | null;
}

@Injectable({ providedIn: 'root' })
export class PocketService {
  private readonly POCKETS_KEY = 'yuxbank_pockets';

  constructor() {}

  private readAllPocketsMap(): Record<string, Pocket[]> {
    const json = localStorage.getItem(this.POCKETS_KEY);
    return json ? JSON.parse(json) : {};
  }

  private writeAllPocketsMap(map: Record<string, Pocket[]>): void {
    localStorage.setItem(this.POCKETS_KEY, JSON.stringify(map));
  }

  getPocketsForUser(email: string): Pocket[] {
    const map = this.readAllPocketsMap();
    return map[email] || [];
  }

  addPocket(email: string, pocket: Pocket): void {
    const map = this.readAllPocketsMap();
    const list = map[email] || [];
    list.push(pocket);
    map[email] = list;
    this.writeAllPocketsMap(map);
  }

  updatePocket(email: string, updatedPocket: Pocket): boolean {
    const map = this.readAllPocketsMap();
    const list = map[email] || [];
    const idx = list.findIndex(p => p.id === updatedPocket.id);
    if (idx === -1) return false;
    list[idx] = updatedPocket;
    map[email] = list;
    this.writeAllPocketsMap(map);
    return true;
  }

  deletePocket(email: string, pocketId: string): boolean {
    const map = this.readAllPocketsMap();
    const list = map[email] || [];
    const newList = list.filter(p => p.id !== pocketId);
    if (newList.length === list.length) return false;
    map[email] = newList;
    this.writeAllPocketsMap(map);
    return true;
  }
}
