import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
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

  public registerUser(user: User): Observable<RegisterResponse> {
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

  public emailExists(email: string): Observable<boolean> {
    const token = localStorage.getItem('yuxbank_token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return new Observable<boolean>(observer => {
      this.http.get<any>(`${environment.apiUrl}/usuarios/${email}`, { headers }).subscribe({
        next: (usuario) => {
          observer.next(true);
          observer.complete();
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 404) {
            observer.next(false);
            observer.complete();
          } else {
            observer.error(error);
          }
        }
      });
    });
  }

  public passwordsMatch(password: string, confirm_password: string): boolean {
    return password === confirm_password;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
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