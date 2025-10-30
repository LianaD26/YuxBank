import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, catchError, of, forkJoin, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserLimits {
  sameBankTransferLimit: number;
  otherBankTransferLimit: number;
  scheduledTransferLimit: number;
}

export interface TopeResponse {
  id_tope: number;
  id_usuario: number;
  tipo: 'consumo' | 'transferencia';
  monto_maximo: number;
}

@Injectable({ providedIn: 'root' })
export class LimitsService {
  private apiUrl = `${environment.apiUrl}/topes`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('yuxbank_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Obtener límites del usuario autenticado desde la API
  getLimits(): Observable<UserLimits> {
    return this.http.get<TopeResponse[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        map(topes => this.mapTopesToLimits(topes)),
        catchError(() => of({ 
          sameBankTransferLimit: 0,
          otherBankTransferLimit: 0,
          scheduledTransferLimit: 0
        }))
      );
  }

  private mapTopesToLimits(topes: TopeResponse[]): UserLimits {
    const transferenciaTope = topes.find(t => t.tipo === 'transferencia');
    const consumoTope = topes.find(t => t.tipo === 'consumo');

    return {
      sameBankTransferLimit: transferenciaTope?.monto_maximo || 0,
      otherBankTransferLimit: consumoTope?.monto_maximo || 0,
      scheduledTransferLimit: consumoTope?.monto_maximo || 0
    };
  }

  // Guardar límites del usuario autenticado
  saveLimits(limits: UserLimits): Observable<any> {
    const headers = this.getHeaders();
    
    // Primero obtenemos los topes existentes
    return this.http.get<TopeResponse[]>(this.apiUrl, { headers }).pipe(
      switchMap(existingTopes => {
        const requests: Observable<any>[] = [];
        
        // Buscar topes existentes
        const transferenciaTope = existingTopes.find(t => t.tipo === 'transferencia');
        const consumoTope = existingTopes.find(t => t.tipo === 'consumo');
        
        // Actualizar o crear tope de transferencia (mismo banco)
        if (transferenciaTope) {
          requests.push(
            this.http.put(`${this.apiUrl}/${transferenciaTope.id_tope}`, {
              tipo: 'transferencia',
              monto_maximo: limits.sameBankTransferLimit
            }, { headers })
          );
        } else if (limits.sameBankTransferLimit > 0) {
          requests.push(
            this.http.post(this.apiUrl, {
              tipo: 'transferencia',
              monto_maximo: limits.sameBankTransferLimit
            }, { headers })
          );
        }
        
        // Actualizar o crear tope de consumo (otro banco y programadas)
        // Usamos el mayor de los dos valores
        const consumoMax = Math.max(limits.otherBankTransferLimit, limits.scheduledTransferLimit);
        if (consumoTope) {
          requests.push(
            this.http.put(`${this.apiUrl}/${consumoTope.id_tope}`, {
              tipo: 'consumo',
              monto_maximo: consumoMax
            }, { headers })
          );
        } else if (consumoMax > 0) {
          requests.push(
            this.http.post(this.apiUrl, {
              tipo: 'consumo',
              monto_maximo: consumoMax
            }, { headers })
          );
        }
        
        // Si no hay peticiones, retornar éxito
        if (requests.length === 0) {
          return of({ success: true });
        }
        
        // Ejecutar todas las peticiones en paralelo
        return forkJoin(requests);
      }),
      catchError(error => {
        console.error('Error saving limits:', error);
        throw error;
      })
    );
  }

  // Método legacy para compatibilidad
  getLimitsForUser(email: string): UserLimits {
    return { 
      sameBankTransferLimit: 0,
      otherBankTransferLimit: 0,
      scheduledTransferLimit: 0
    };
  }
}
