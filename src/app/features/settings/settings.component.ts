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
  // Forms (signals)
  newEmail = signal('');
  currentPasswordEmail = signal('');
  currentPassword = signal('');
  newPassword = signal('');
  confirmNewPassword = signal('');

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

  // update Email
  changeEmail(newEmail:string,currentPassword:string): void {
    const loggedUser = this.storageService.getLoggedUser();

    //check password
    if (!loggedUser || loggedUser.password !== currentPassword) {
      alert('Current password is incorrect.');
      return;
    }
    // check if new email is different
    if (this.registerUserService.emailExists(newEmail)) {
      alert('The new email is already in use. Please choose another one.');
      return;
    }
    // update email
    const oldEmail = loggedUser.email;
    // actualizar el email en el objeto del usuario logueado
    loggedUser.email = newEmail;

    // update email in storage
    const updateSuccess = this.storageService.updateUserInStorage(oldEmail, loggedUser);
    if (updateSuccess) {
      // update logged user in session
      this.storageService.saveLoggedUser(loggedUser);
      alert('Email updated successfully.');
      // clear form
      this.newEmail.set('');
      this.currentPasswordEmail.set('');
    } else {
      alert('Error updating email. Please try again.');
    }
  }
  // update Password
  changePassword(currentPassword:string,newPassword:string,confirmNewPassword:string): void {
    // get logged user
    const loggedUser = this.storageService.getLoggedUser();

    if (loggedUser && loggedUser.password !== currentPassword) {
      alert('Current password is incorrect.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      alert('New passwords do not match.');
      return;
    }
    // change password
    this.storageService.changePassword(currentPassword, newPassword);
    alert('Password updated successfully.');
  } 
}