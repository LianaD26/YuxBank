import { Injectable } from '@angular/core';

export interface User {
  name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
}


@Injectable({providedIn: 'root'})

export class StorageService {
  private readonly LOGGED_USER_KEY = 'loggedUser';
  private readonly USERS_KEY = 'yuxbank_users';

  constructor() {}

  // 1 primero debo obtener todos los usuarios registrados
  getAllUsers(): User[] {
    const usersJson = localStorage.getItem(this.USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  }

  // 2 luego debo guardar en una lista los usuarios que obtuve
  saveAllUsers(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  // 3 no obstante debo obtener el usuario que ha iniciado sesión osea el logeado
  getLoggedUser(): User | null {
    try {
      console.log('esto si cogio al usuario logeado');
      return JSON.parse(localStorage.getItem(this.LOGGED_USER_KEY) || 'null');
    } catch (error) {
      console.error('error for getLoggedUser:', error);
      return null;
    }
  }
  // 4 guardar el usuario que ha iniciado sesión
  saveLoggedUser(user: User): void {
    localStorage.setItem(this.LOGGED_USER_KEY, JSON.stringify(user));
  }

  // 5 actualizar el usuario en la lista de usuarios
  updateUserInStorage(oldEmail: string, updatedUser: User): boolean {
    const users = this.getAllUsers();
    const userIndex = users.findIndex((user) => user.email === oldEmail);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      this.saveAllUsers(users);
      return true;
    }
    return false;
  }

  // changePassword
  changePassword(oldPassword: string, newPassword: string): void {
    const loggedUser = this.getLoggedUser();
    if (loggedUser && loggedUser.password === oldPassword) {
      loggedUser.password = newPassword;
      this.saveLoggedUser(loggedUser);
      const users = this.getAllUsers();
      const userIndex = users.findIndex(user => user.email === loggedUser.email);
      if (userIndex !== -1) {
        users[userIndex] = loggedUser;
        this.saveAllUsers(users);
      }
    }
  }

  // 6 cerrar sesión (logout)
  logout(): void {
    localStorage.removeItem(this.LOGGED_USER_KEY);
  }

  // 7 verificar si hay usuario logueado
  isUserLoggedIn(): boolean {
    return this.getLoggedUser() !== null;
  }

  // 8 verificar si un email ya existe
  emailExists(email: string): boolean {
    const users = this.getAllUsers();
    return users.some(user => user.email === email);
  }
}