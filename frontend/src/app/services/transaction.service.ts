import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Transaction } from '../features/transfers/transaction.model';

// Mock data small set (same as previous implementation)
const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', date: new Date(), amount: -45.5, currency: 'USD', type: 'debit', status: 'completed', merchant: { name: 'Supermarket' }, description: 'Groceries' },
  { id: 't2', date: new Date(Date.now() - 1000 * 60 * 60 * 24), amount: 1200, currency: 'USD', type: 'credit', status: 'completed', merchant: { name: 'Salary' }, description: 'Monthly salary' },
  { id: 't3', date: new Date(Date.now() - 1000 * 60 * 60 * 48), amount: -12.75, currency: 'USD', type: 'debit', status: 'completed', merchant: { name: 'Coffee Shop' }, description: 'Coffee' },
  { id: 't4', date: new Date(Date.now() - 1000 * 60 * 60 * 72), amount: -250, currency: 'USD', type: 'transfer', status: 'completed', description: 'Transfer to savings' }
];

@Injectable({ providedIn: 'root' })
export class TransactionService {
  constructor() {}

  // list with optional search filter
  list(params?: { search?: string; limit?: number; offset?: number }): Observable<Transaction[]> {
    const q = (params && params.search || '').toLowerCase();
    // simple filter mock
    const filtered = MOCK_TRANSACTIONS.filter(t => {
      if (!q) return true;
      return (t.merchant?.name || t.description || '').toLowerCase().includes(q) || t.id.toLowerCase().includes(q);
    });
    // simulate network latency
    return of(filtered).pipe(delay(250));
  }

  getById(id: string): Observable<Transaction | undefined> {
    const found = MOCK_TRANSACTIONS.find(t => t.id === id);
    return of(found).pipe(delay(150));
  }
}
