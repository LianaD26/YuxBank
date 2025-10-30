import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface LogInUser {
  email: string;
  password: string;
}

export interface LoginResponse {
  usuario: {
    id_usuario: number;
    nombre: string;
    apellido: string;
    correo: string;
    estado: string;
    fecha_registro: Date;
  };
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class LogInUserService {
  private apiUrl = `${environment.apiUrl}/auth`;
  
  constructor(private http: HttpClient) {}

  /**
   * Inicia sesión de un usuario en la API
   * @param email Correo electrónico del usuario
   * @param password Contraseña del usuario
   * @returns Observable con la respuesta de la API
   */
  public login(email: string, password: string): Observable<LoginResponse> {
    // Mapear los campos del frontend a los que espera la API
    const loginDto = {
      correo: email,
      contrasena: password
    };

    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginDto)
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
      if (error.status === 401 || error.status === 404 || error.status === 400) {
        errorMessage = 'Incorrect data.';
      } else if (error.status === 0) {
        errorMessage = 'Could not connect to the server. Please verify that the API is running.';
      } else {
        errorMessage = 'Incorrect data.';
      }
    }
    
    console.error('Login error:', error);
    return throwError(() => new Error(errorMessage));
  }
}