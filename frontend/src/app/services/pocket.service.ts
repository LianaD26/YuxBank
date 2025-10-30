import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Pocket {
  id: string;
  name: string;
  description?: string;
  value: number;
  createdAt: string;
  fromAccount?: string | null;
}

export interface BolsilloResponse {
  id_bolsillo: number;
  id_usuario: number;
  nombre: string;
  saldo: number;
}

@Injectable({ providedIn: 'root' })
export class PocketService {
  private apiUrl = `${environment.apiUrl}/bolsillos`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('yuxbank_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Obtener bolsillos del usuario autenticado desde la API
  getPockets(): Observable<BolsilloResponse[]> {
    return this.http.get<BolsilloResponse[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          console.error('Error loading pockets:', error);
          return of([]);
        })
      );
  }

  // Crear bolsillo (deduce dinero de la cuenta)
  createPocket(nombre: string, saldo: number, numCuenta: string): Observable<BolsilloResponse> {
    const params = numCuenta ? `?num_cuenta=${numCuenta}` : '';
    return this.http.post<BolsilloResponse>(
      `${this.apiUrl}${params}`,
      { nombre, saldo },
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error creating pocket:', error);
        throw error;
      })
    );
  }

  // Actualizar bolsillo
  updatePocket(id: number, nombre: string, saldo: number): Observable<BolsilloResponse> {
    return this.http.put<BolsilloResponse>(
      `${this.apiUrl}/${id}`,
      { nombre, saldo },
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error updating pocket:', error);
        throw error;
      })
    );
  }

  // Eliminar bolsillo (devuelve dinero a la cuenta)
  deletePocket(id: number, numCuenta: string): Observable<void> {
    const params = numCuenta ? `?num_cuenta=${numCuenta}` : '';
    return this.http.delete<void>(
      `${this.apiUrl}/${id}${params}`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error deleting pocket:', error);
        throw error;
      })
    );
  }

  // Métodos legacy para compatibilidad (deprecated)
  getPocketsForUser(email: string): Pocket[] {
    return [];
  }

  addPocket(email: string, pocket: Pocket): void {
    console.warn('addPocket is deprecated, use createPocket instead');
  }

  updatePocketLegacy(email: string, updatedPocket: Pocket): boolean {
    console.warn('updatePocket is deprecated, use updatePocket with API instead');
    return false;
  }

  deletePocketLegacy(email: string, pocketId: string): boolean {
    console.warn('deletePocket is deprecated, use deletePocket with API instead');
    return false;
  }
}
