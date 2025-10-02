import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterUserService } from '../../services/register-user.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  // Formularios (signals)
  newEmail = signal('');
  currentPasswordEmail = signal('');
  currentPassword = signal('');
  newPassword = signal('');
  confirmNewPassword = signal('');

  // Estado para mostrar formulario
  selectedOption: 'email' | 'password' = 'email';

  constructor(
    private registerUserService: RegisterUserService,
    private storageService: StorageService
  ) {}

  selectOption(option: 'email' | 'password') {
    this.selectedOption = option;
  }

  private getLoggedUser(): any {
    return this.storageService.getLoggedUser();
  }

  private saveLoggedUser(user: any): void {
    this.storageService.saveLoggedUser(user);
  }

onUpdateEmail(): void {
    const loggedUser = this.getLoggedUser();

    if (loggedUser.password !== this.currentPasswordEmail()) {
      alert('Current password is incorrect.');
      return;
    }


    if (!loggedUser) {
        alert('No user logged in.');
        return;
    }

    const oldEmail = loggedUser.email; // El email ANTES de la actualización
    const newEmailVal = this.newEmail().trim();

    // ... (otras validaciones de newEmailVal y currentPasswordEmail)

    // Si newEmail es igual al anterior
    if (newEmailVal === oldEmail) {
        alert('The new email is the same as the current one.');
        this.newEmail.set('');
        this.currentPasswordEmail.set('');
        return;
    }
    
    // **Ajuste clave aquí:**
    // Verificar si el email ya está en uso por OTRA cuenta (diferente a la actual)
    const users = this.storageService.getUsers();
    const emailInUse = users.some(user => user.email === newEmailVal && user.email !== oldEmail);

    if (emailInUse) {
        alert('This email is already in use by another account.');
        return;
    }

    // Actualiza email en objeto loggedUser (ESTO ES CORRECTO)
    loggedUser.email = newEmailVal; 

    // Persistir cambios: primero en users, luego en loggedUser
    // oldEmail: email ANTERIOR usado para buscar en el array de users
    // loggedUser: objeto con el email NUEVO para actualizar
    const updated = this.storageService.updateUserInStorage(oldEmail, loggedUser);
    
    if (!updated) {
        // Si falló, mostramos el error y detenemos (eliminamos el fallback complejo)
        alert('Could not update user in storage. User not found by previous email.');
        return;
    }

    // El loggedUser ya tiene el nuevo email, lo guardamos
    this.saveLoggedUser(loggedUser);
    console.log('[SettingsComponent] loggedUser updated:', loggedUser);

    alert('Email updated successfully ✅');
    this.newEmail.set('');
    this.currentPasswordEmail.set('');
}

onUpdatePassword(): void {
  const loggedUser = this.getLoggedUser();

  if (!loggedUser) {
    alert('No user logged in.');
    return;
  }

  const oldEmail = loggedUser.email; // <- usar este, no el que cambie después

  const newPwd = this.newPassword(); 
  const confirmPwd = this.confirmNewPassword();

  if (loggedUser.password !== this.currentPassword()) {
    alert('Current password is incorrect.');
    return;
  }

  if (!this.registerUserService.passwordsMatch(newPwd, confirmPwd)) {
    alert('Passwords do not match.');
    return;
  }

  loggedUser.password = newPwd;

  const updated = this.storageService.updateUserInStorage(oldEmail, loggedUser);

  if (!updated) {
    alert('Could not update user in storage. User not found by previous email.');
    return;
  }

  this.saveLoggedUser(loggedUser);
  alert('Password updated successfully ✅');

  this.currentPassword.set('');
  this.newPassword.set('');
  this.confirmNewPassword.set('');
}

}