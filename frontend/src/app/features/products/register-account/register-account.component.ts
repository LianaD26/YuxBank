import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-register-account',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register-account.component.html',
  styleUrls: ['./register-account.component.css']
})
export class RegisterAccountComponent {
  accountType = signal('');
  accountNumber = signal('');
  password = signal('');
  accounts = signal<any[]>([]);

  constructor(public accountService: AccountService) {
    const savedAccounts = this.accountService.getAccounts();
    if (savedAccounts) {
      this.accounts.set(savedAccounts);
    }
  }

  registerAccount(): void {
    const type = this.accountType();
    const number = this.accountNumber();
    const pass = this.password();

    if (!type || !number || !pass) {
      alert('Please fill out all fields.');
      return;
    }

    if (this.accountService.accountExists(number)) {
      alert('The account number is already registered.');
      return;
    }

    this.accountService.registerAccount({
      type,
      number,
      password: pass,
      balance: 0
    });

    this.accounts.set(this.accountService.getAccounts());
    this.accountType.set('');
    this.accountNumber.set('');
    this.password.set('');

    alert('Account successfully registered.');
  }
}
