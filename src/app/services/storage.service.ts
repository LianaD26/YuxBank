import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly LOGGED_USER_KEY = 'loggedUser';
  private readonly USERS_KEY = 'yuxbank_users';

  constructor() {}

  getUsers(): any[] {
    try {
      return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
    } catch {
      return [];
    }
  }

    saveUsers(users: any[]): void {
        // La clave debe ser 'yuxbank_users'
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }

  getLoggedUser(): any | null {
    try {
      return JSON.parse(localStorage.getItem(this.LOGGED_USER_KEY) || 'null');
    } catch {
      return null;
    }
  }

  saveLoggedUser(user: any): void {
    localStorage.setItem(this.LOGGED_USER_KEY, JSON.stringify(user));
  }

  updateUserInStorage(currentEmail: string, updatedUser: any): boolean {
    const users = this.getUsers();
    
    // 1. Busca estrictamente por el email actual del usuario
    let index = users.findIndex(u => u.email === currentEmail);

    if (index === -1) {
      console.warn('[StorageService] updateUserInStorage: user not found with email:', currentEmail);
      
      // NOTA: El fallback original era muy complejo. Si el usuario logueado NO tiene un email
      // que coincida con el array de usuarios, es probable que haya un problema de sincronización.
      // Eliminamos el fallback complejo por uno más simple:
      
      // Si el email del usuario logueado (currentEmail) ya fue actualizado en loggedUser pero no
      // en users, y estamos actualizando la password, el email en users será diferente.
      // Para evitar esto, es CRUCIAL que el componente **SIEMPRE** pase el email que estaba
      // en la lista de `users` (el que está en `loggedUser` ANTES de la actualización).
      
      return false; // No encontrado
    }

    // 2. Aplica la actualización
    // Preservamos el email del usuario en el array si updatedUser no lo incluye
    users[index] = { ...users[index], ...updatedUser }; 
    
    this.saveUsers(users);
    console.log('[StorageService] user updated in yuxbank_users at index', index, users[index]);
    return true;
  }

  // Utilidad: comprobar si existe un email (ler desde storage)
  emailExists(email: string): boolean {
    if (!email) return false;
    const users = this.getUsers();
    return users.some(u => u.email === email);
  }
}