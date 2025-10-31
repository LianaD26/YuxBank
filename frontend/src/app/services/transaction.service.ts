import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Transaction } from '../features/transfers/transaction.model';
import { environment } from '../../environments/environment';

export interface TransactionRequest {
  num_cuenta_origen?: string;
  num_cuenta_destino?: string;
  tipo: 'transferencia' | 'pago';
  monto: number;
  referencia?: string;
  descripcion?: string;
}

export interface TransactionResponse {
  id_transaccion: number;
  id_cuenta_origen: number;
  id_cuenta_destino: number;
  tipo: string;
  monto: number;
  referencia: string;
  descripcion: string;
  fecha: string;
  estado: string;
}

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private apiUrl = `${environment.apiUrl}/transacciones`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('yuxbank_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  createTransfer(transaction: TransactionRequest): Observable<TransactionResponse> {
    return this.http.post<TransactionResponse>(`${this.apiUrl}/transferir`, transaction, { 
      headers: this.getHeaders() 
    }).pipe(
      catchError(this.handleError)
    );
  }

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<TransactionResponse[]>(this.apiUrl, { 
      headers: this.getHeaders() 
    }).pipe(
      map(transactions => this.mapToTransactionModel(transactions)),
      catchError(this.handleError)
    );
  }

  getTransactionsByAccount(accountId: number): Observable<Transaction[]> {
    return this.http.get<TransactionResponse[]>(`${this.apiUrl}/cuenta/${accountId}/historial`, { 
      headers: this.getHeaders() 
    }).pipe(
      map(transactions => this.mapToTransactionModel(transactions)),
      catchError(this.handleError)
    );
  }

  private mapToTransactionModel(transactions: TransactionResponse[]): Transaction[] {
    return transactions.map(tx => ({
      id: `TXN${tx.id_transaccion}`,
      date: new Date(tx.fecha),
      amount: tx.id_cuenta_origen ? -tx.monto : tx.monto,
      currency: 'USD',
      type: tx.tipo as any,
      status: tx.estado as any,
      description: tx.descripcion || tx.referencia
    }));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if (error.status === 400) {
        const serverError = error.error;
        if (serverError?.message) {
          if (Array.isArray(serverError.message)) {
            errorMessage = `Validation errors: ${serverError.message.join(', ')}`;
          } else {
            errorMessage = `Error: ${serverError.message}`;
          }
        } else {
          errorMessage = 'Invalid data format or insufficient balance';
        }
      } else if (error.status === 401) {
        errorMessage = 'Unauthorized access. Please login again.';
      } else if (error.status === 404) {
        errorMessage = 'Account not found.';
      } else if (error.status === 0) {
        errorMessage = 'Could not connect to the server. Please verify that the API is running.';
      } else {
        errorMessage = `Server error: ${error.status}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
