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
  @Input() url?: string; // optional incoming url (e.g. '/settings/password' or 'password')

  ngOnInit(): void {
    // Priority: explicit input url > route path
  const routePath = this.activatedRoute.snapshot.url.map(s => s.path).join('/');
  const source = this.url ?? (routePath || this.activatedRoute.snapshot.queryParams['section'] || '');
    const target = (source || '').toString().toLowerCase();
    // accept a few variants: 'password'|'changepassword'|'changePassword'|'email'|'changeemail'
    if (target.includes('password')) {
      this.selectedOption = 'password';
    } else if (target.includes('email')) {
      this.selectedOption = 'email';
    }
  }
  // Forms (signals)
  newEmail = signal('');
  currentPasswordEmail = signal('');
  currentPassword = signal('');
  newPassword = signal('');
  confirmNewPassword = signal('');

  selectedOption: 'email' | 'password' = 'email';

  selectedpage:'changeEmail' | 'changePassword' = 'changeEmail';

  sidebarRoutes = [
    { path:'' ,key: 'changeEmail', label: 'Change Email' },
    { path:'' ,key: 'changePassword', label: 'Change Password' }
  ];

  constructor(
    private registerUserService: RegisterUserService,
    private storageService: StorageService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

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