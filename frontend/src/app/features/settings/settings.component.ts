import { Component, signal, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RegisterUserService, User } from '../../services/register-user.service';
import { StorageService } from '../../services/storage.service';
import { UserSettingsService } from '../../services/user-settings.service';
import { FormsModule } from '@angular/forms';
import { SerchBarComponent } from '../../shared/serch-bar/serch-bar.component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, SerchBarComponent, HttpClientModule],
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

  isLoading = signal(false);

  constructor(
    private registerUserService: RegisterUserService,
    private storageService: StorageService,
    private userSettingsService: UserSettingsService,
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
    if (!newEmail || !currentPassword) {
      alert('Please fill out all fields.');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      alert('Please enter a valid email address.');
      return;
    }

    this.isLoading.set(true);

    // Verificar si el email ya existe
    this.registerUserService.emailExists(newEmail).subscribe({
      next: (exists) => {
        if (exists) {
          this.isLoading.set(false);
          alert('The new email is already in use. Please choose another one.');
          return;
        }

        // El email está disponible, proceder con la actualización en la API
        this.userSettingsService.changeEmail(newEmail).subscribe({
          next: (response) => {
            this.isLoading.set(false);
            alert('Email updated successfully.');
            
            // Update local storage
            const loggedUser = this.storageService.getLoggedUser();
            if (loggedUser) {
              loggedUser.email = newEmail;
              this.storageService.saveLoggedUser(loggedUser);
            }
            
            // Clear form
            this.newEmail.set('');
            this.currentPasswordEmail.set('');
          },
          error: (error) => {
            this.isLoading.set(false);
            alert(error.message || 'Error updating email. Please try again.');
          }
        });
      },
      error: (error) => {
        this.isLoading.set(false);
        alert('Error checking email availability. Please try again.');
      }
    });
  }

  // ACTUALIZAR CONTRASEÑA
  changePassword(currentPassword: string, newPassword: string, confirmNewPassword: string): void {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      alert('Please fill out all fields.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      alert('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      alert('New password must be at least 6 characters long.');
      return;
    }

    this.isLoading.set(true);

    // Call API to change password
    this.userSettingsService.changePassword(newPassword).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        alert('Password updated successfully.');

        // Update local storage
        const loggedUser = this.storageService.getLoggedUser();
        if (loggedUser) {
          loggedUser.password = newPassword;
          this.storageService.saveLoggedUser(loggedUser);
        }

        // Clear form
        this.currentPassword.set('');
        this.newPassword.set('');
        this.confirmNewPassword.set('');
      },
      error: (error) => {
        this.isLoading.set(false);
        alert(error.message || 'Error updating password. Please try again.');
      }
    });
  }
}