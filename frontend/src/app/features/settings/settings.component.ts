import { Component, signal, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterUserService, User } from '../../services/register-user.service';
import { StorageService } from '../../services/storage.service';
import { FormsModule } from '@angular/forms';
import { SerchBarComponent } from '../../shared/serch-bar/serch-bar.component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, SerchBarComponent],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  @Input() url?: string; 
  
  // ESTADO DEL COMPONENTE
  selectedOption: 'email' | 'password' = 'email';

  sidebarRoutes = [
    { key: 'email' as const, label: 'Change Email' },
    { key: 'password' as const, label: 'Change Password' }
  ];

  // Señales reactivas para los formularios
  newEmail = signal('');
  currentPasswordEmail = signal('');
  currentPassword = signal('');
  newPassword = signal('');
  confirmNewPassword = signal('');

  constructor(
    private registerUserService: RegisterUserService,
    private storageService: StorageService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  // CAMBIO DE OPCIÓN EN SIDEBAR
  selectOption(optionKey: string) {
    if (optionKey === 'email' || optionKey === 'password') {
      this.selectedOption = optionKey;
    }
  }

  // FUNCIONES AUXILIARES
  private getLoggedUser(): User | null {
    return this.storageService.getLoggedUser();
  }

  // ACTUALIZAR EMAIL
  changeEmail(newEmail: string, currentPassword: string): void {
    const loggedUser = this.storageService.getLoggedUser();

    if (!loggedUser || loggedUser.password !== currentPassword) {
      alert('Current password is incorrect.');
      return;
    }

    if (this.registerUserService.emailExists(newEmail)) {
      alert('The new email is already in use. Please choose another one.');
      return;
    }

    const oldEmail = loggedUser.email;
    loggedUser.email = newEmail;

    const updateSuccess = this.storageService.updateUserInStorage(oldEmail, loggedUser);

    if (updateSuccess) {
      this.storageService.saveLoggedUser(loggedUser);
      alert('Email updated successfully.');
      this.newEmail.set('');
      this.currentPasswordEmail.set('');
    } else {
      alert('Error updating email. Please try again.');
    }
  }

  // ACTUALIZAR CONTRASEÑA
  changePassword(currentPassword: string, newPassword: string, confirmNewPassword: string): void {
    const loggedUser = this.storageService.getLoggedUser();

    if (!loggedUser || loggedUser.password !== currentPassword) {
      alert('Current password is incorrect.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      alert('New passwords do not match.');
      return;
    }

    this.storageService.changePassword(currentPassword, newPassword);
    alert('Password updated successfully.');

    // Limpieza de campos
    this.currentPassword.set('');
    this.newPassword.set('');
    this.confirmNewPassword.set('');
  }
}