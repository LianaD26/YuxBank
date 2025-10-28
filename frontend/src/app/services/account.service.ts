import { Injectable } from '@angular/core';

export interface Account {
  type: string;
  number: string;
  password: string;
  balance: number;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private storageKey = 'accounts';

  getAccounts(): Account[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  accountExists(number: string): boolean {
    const accounts = this.getAccounts();
    return accounts.some(a => a.number === number);
  }

  registerAccount(account: Account): void {
    const accounts = this.getAccounts();
    accounts.push(account);
    localStorage.setItem(this.storageKey, JSON.stringify(accounts));
  }

  deleteAccount(number: string): void {
    const accounts = this.getAccounts().filter(a => a.number !== number);
    localStorage.setItem(this.storageKey, JSON.stringify(accounts));
  }
}