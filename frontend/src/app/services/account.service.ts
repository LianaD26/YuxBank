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

  getAccountByNumber(number: string): Account | undefined {
    const accounts = this.getAccounts();
    return accounts.find(a => a.number === number);
  }

  updateAccountBalance(accountNumber: string, amount: number): boolean {
    const accounts = this.getAccounts();
    const account = accounts.find(a => a.number === accountNumber);
    
    if (!account) {
      return false;
    }

    // Check if sufficient balance for debit (negative amount)
    if (amount < 0 && account.balance + amount < 0) {
      return false;
    }

    account.balance += amount;
    localStorage.setItem(this.storageKey, JSON.stringify(accounts));
    return true;
  }
}