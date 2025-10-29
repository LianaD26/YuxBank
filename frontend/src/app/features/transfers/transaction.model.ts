// src/app/features/transfers/transaction.model.ts
export interface Transaction {
  id: string;
  date: Date;
  amount: number;
  currency: string;
  type: string;
  status: string;
  description?: string; // Opcional
  merchant?: {
    name: string;
  };
}
