import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface User {
  name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
}

export interface RegisterResponse {
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
export class RegisterUserService {
  private apiUrl = `${environment.apiUrl}/auth`;
  
  constructor(private http: HttpClient) {}

  /**
   * Registra un nuevo usuario en la API
   * @param user Datos del usuario a registrar
   * @returns Observable con la respuesta de la API
   */
  public registerUser(user: User): Observable<RegisterResponse> {
    // Mapear los campos del frontend a los que espera la API
    const registerDto = {
      nombre: user.name,
      apellido: user.last_name,
      correo: user.email,
      contrasena: user.password
    };

    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, registerDto)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Verifica si un correo electrónico ya existe en la base de datos
   * @param email Correo electrónico a verificar
   * @returns Observable con boolean (true si existe, false si no existe)
   */
  public emailExists(email: string): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.http.get<any>(`${environment.apiUrl}/usuarios/${email}`).subscribe({
        next: (usuario) => {
          // Si encuentra el usuario, significa que el email existe
          observer.next(true);
          observer.complete();
        },
        error: (error: HttpErrorResponse) => {
          // Si es 404 (Not Found), significa que el email NO existe
          if (error.status === 404) {
            observer.next(false);
            observer.complete();
          } else {
            // Para otros errores, se considera que existe por seguridad
            observer.error(error);
          }
        }
      });
    });
  }

  /**
   * Valida que las contraseñas coincidan
   */
  public passwordsMatch(password: string, confirm_password: string): boolean {
    return password === confirm_password;
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
      if (error.status === 400 || error.status === 409 || error.status === 500) {
        errorMessage = 'Incorrect data.';
      } else if (error.status === 0) {
        errorMessage = 'Could not connect to the server. Please verify that the API is running.';
      } else {
        errorMessage = 'Incorrect data.';
      }
    }
    
    console.error('Registration error:', error);
    return throwError(() => new Error(errorMessage));
  }
}