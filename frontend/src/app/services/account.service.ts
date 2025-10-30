import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Account {
  type: string;
  number: string;
  password: string;
  balance: number;
}

export interface AccountResponse {
  id_cuenta: number;
  id_usuario: number;
  num_cuenta: string;
  tipo: string;
  saldo: number;
  estado: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = `${environment.apiUrl}/cuenta`;

  constructor(private http: HttpClient) {}

  /**
   * Gets authorization headers with JWT token
   */
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('yuxbank_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  /**
   * Registers a new account in the API
   */
  registerAccount(account: Account): Observable<AccountResponse> {
    // Convert account type to backend format
    let tipoBackend: string;
    if (account.type === 'Savings') {
      tipoBackend = 'ahorros';
    } else if (account.type === 'Checking') {
      tipoBackend = 'corriente';
    } else {
      // If already in Spanish format, use as is
      tipoBackend = account.type;
    }

    const createDto = {
      num_cuenta: account.number.trim(),
      tipo: tipoBackend,
      password: account.password.trim()
    };

    return this.http.post<AccountResponse>(this.apiUrl, createDto, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Gets all accounts from the API
   */
  getAccounts(): Observable<AccountResponse[]> {
    return this.http.get<AccountResponse[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Deletes an account by ID
   */
  deleteAccount(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Handles HTTP errors
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 400) {
        // Show detailed validation errors
        const serverError = error.error;
        if (serverError?.message) {
          if (Array.isArray(serverError.message)) {
            errorMessage = `Validation errors: ${serverError.message.join(', ')}`;
          } else {
            errorMessage = `Error: ${serverError.message}`;
          }
        } else {
          errorMessage = 'Invalid data format';
        }
      } else if (error.status === 401) {
        errorMessage = 'Unauthorized access.';
      } else if (error.status === 404) {
        errorMessage = 'Resource not found.';
      } else if (error.status === 0) {
        errorMessage = 'Could not connect to the server. Please verify that the API is running.';
      } else {
        errorMessage = `Server error: ${error.status}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}