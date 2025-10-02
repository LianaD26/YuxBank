import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterUserService, User } from '../../services/register-user.service';
import { StorageService } from '../../services/storage.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  private getLoggedUser(): User | null {
    return this.storageService.getLoggedUser();
  }

  // Actualizar Email
  changeEmail(newEmail:string,currentPassword:string): void {
    // Obtener el usuario logueado
    const loggedUser = this.storageService.getLoggedUser();

    //validadr constraseña actual
    if (!loggedUser || loggedUser.password !== currentPassword) {
      alert('Current password is incorrect.');
      return;
    }
    // Validar que el nuevo email no esté en uso
    if (this.registerUserService.emailExists(newEmail)) {
      alert('The new email is already in use. Please choose another one.');
      return;
    }
    // actualizar email anterior para la búsqueda
    const oldEmail = loggedUser.email;
    // actualizar el email en el objeto del usuario logueado
    loggedUser.email = newEmail;

    // Actualizar el usuario en el almacenamiento
    const updateSuccess = this.storageService.updateUserInStorage(oldEmail, loggedUser);
    if (updateSuccess) {
      // Actualizar el usuario logueado en el almacenamiento
      this.storageService.saveLoggedUser(loggedUser);
      alert('Email updated successfully.');
      // Limpiar formularios
      this.newEmail.set('');
      this.currentPasswordEmail.set('');
    } else {
      alert('Error updating email. Please try again.');
    }
  }
  // Actualizar Password
  changePassword(currentPassword:string,newPassword:string,confirmNewPassword:string): void {
    // Obtener el usuario logueado
    const loggedUser = this.storageService.getLoggedUser();

    if (loggedUser && loggedUser.password !== currentPassword) {
      alert('Current password is incorrect.');
      return;
    }
    // Validar que las nuevas contraseñas coincidan
    if (newPassword !== confirmNewPassword) {
      alert('New passwords do not match.');
      return;
    }
    // Cambiar la contraseña
    this.storageService.changePassword(currentPassword, newPassword);
  } 
}