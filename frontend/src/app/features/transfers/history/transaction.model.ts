export interface Transaction {
  id: string;
  date: string; // ISO
  amount: number;
  currency: string;
  type: 'debit' | 'credit' | 'transfer' | 'fee';
  fromAccountId?: string;
  toAccountId?: string;
  status: 'pending' | 'completed' | 'failed';
  merchant?: { name: string; category?: string };
  description?: string;
  metadata?: Record<string, any>;
}
