import { Injectable } from '@angular/core';

export interface UserLimits {
  sameBankTransferLimit: number;
  otherBankTransferLimit: number;
  scheduledTransferLimit: number;
}

@Injectable({ providedIn: 'root' })
export class LimitsService {
  private readonly LIMITS_KEY = 'yuxbank_limits';

  constructor() {}

  private readLimitsMap(): Record<string, UserLimits> {
    const json = localStorage.getItem(this.LIMITS_KEY);
    return json ? JSON.parse(json) : {};
  }

  private writeLimitsMap(map: Record<string, UserLimits>): void {
    localStorage.setItem(this.LIMITS_KEY, JSON.stringify(map));
  }

  getLimitsForUser(email: string): UserLimits {
    const map = this.readLimitsMap();
    return map[email] || { 
      sameBankTransferLimit: 0,
      otherBankTransferLimit: 0,
      scheduledTransferLimit: 0
    };
  }

  saveLimitsForUser(email: string, limits: UserLimits): void {
    const map = this.readLimitsMap();
    map[email] = limits;
    this.writeLimitsMap(map);
  }
}
