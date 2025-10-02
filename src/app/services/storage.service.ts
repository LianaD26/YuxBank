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

  // 1 get all the users locally stored
  getAllUsers(): User[] {
    const usersJson = localStorage.getItem(this.USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  }

  // 2 save all users
  saveAllUsers(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  // 3 get user logged in
  getLoggedUser(): User | null {
    try {
      console.log('esto si cogio al usuario logeado');
      return JSON.parse(localStorage.getItem(this.LOGGED_USER_KEY) || 'null');
    } catch (error) {
      console.error('error for getLoggedUser:', error);
      return null;
    }
  }
  // 4 save user logged in
  saveLoggedUser(user: User): void {
    localStorage.setItem(this.LOGGED_USER_KEY, JSON.stringify(user));
  }

  // 5 update user in storage
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

  // 6 logout
  logout(): void {
    localStorage.removeItem(this.LOGGED_USER_KEY);
  }

  // 7 check if user is logged in
  isUserLoggedIn(): boolean {
    return this.getLoggedUser() !== null;
  }

  // 8 check if email exists
  emailExists(email: string): boolean {
    const users = this.getAllUsers();
    return users.some(user => user.email === email);
  }
}