import { Injectable } from '@angular/core';

export interface LogInUser{
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class LogInUserService {
  private readonly STORAGE_KEY='yuxbank_users';
  constructor() { }

  public getAllLogInUsers(): LogInUser[] {
    try {
      const logInUsers = localStorage.getItem(this.STORAGE_KEY);
      return logInUsers ? JSON.parse(logInUsers) : [];
    } catch (error) {
      console.error('Error al obtener usuarios para iniciar sesión:', error);
      return [];
    }
  }
  

  public validateEmailAndPassword(email: string, password: string): boolean {
    const logInUsers = this.getAllLogInUsers();
    return logInUsers.some(user => user.email === email && user.password === password);
  }

  private logInUser(email: string, password: string): boolean {
    const permiso= this.validateEmailAndPassword(email, password);
    if (permiso) {
      return true;
    } else {
      return false;
    }
  }

}