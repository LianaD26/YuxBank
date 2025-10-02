import { Injectable } from '@angular/core';

export interface User {
  name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegisterUserService {
  private readonly STORAGE_KEY = 'yuxbank_users'; 
  
  constructor() {
    this.initializeStorage();
  }
  
  private initializeStorage(): void {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
    } 
  }

  /* extraer usuarios existentes del localStorage */
  public getAllUsers(): User[] {
    try {
      const users = localStorage.getItem(this.STORAGE_KEY);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      return [];
    }
  }

  /* verificar si el email ya existe */
  public emailExists(email: string): boolean {
    const users = this.getAllUsers();
    return users.some(user => user.email === email);
  }
  
  /* verificar que password sea igual a confirm_password */
  public passwordsMatch(password: string, confirm_password: string): boolean {
    return password === confirm_password;
  }
  
  /* verificar si el usuario cumple las reglas (solo email único y contraseñas iguales) */
  public isUserValid(user: User): boolean {
    return (
      !this.emailExists(user.email) &&
      this.passwordsMatch(user.password, user.confirm_password)
    );
  }

  /* registrar usuario */
  public registerUser(user: User): boolean {
    if (this.isUserValid(user)) {
      const users = this.getAllUsers();
      users.push(user);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
      return true;
    }
    return false;
  }
}