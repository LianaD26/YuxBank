import { Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-register-account',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './register-account.component.html',
  styleUrls: ['./register-account.component.css']
})
export class RegisterAccountComponent implements OnInit {
  accountType = signal('');
  accountNumber = signal('');
  password = signal('');
  accounts = signal<any[]>([]);
  isLoading = signal(false);

  constructor(public accountService: AccountService) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.accountService.getAccounts().subscribe({
      next: (accounts) => {
        this.accounts.set(accounts);
      },
      error: (error) => {
        console.error('Error loading accounts:', error);
      }
    });
  }

  registerAccount(): void {
    const type = this.accountType();
    const number = this.accountNumber();
    const pass = this.password();

    if (!type || !number || !pass) {
      alert('Please fill out all fields.');
      return;
    }

    if (number.length < 1 || number.length > 20) {
      alert('Account number must be between 1 and 20 characters.');
      return;
    }

    if (type !== 'Savings' && type !== 'Checking') {
      alert('Please select a valid account type (Savings or Checking).');
      return;
    }

    // Start registration process
    this.isLoading.set(true);

    this.accountService.registerAccount({
      type,
      number,
      password: pass,
      balance: 0
    }).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        alert('Account successfully registered.');
        
        // Clear form
        this.accountType.set('');
        this.accountNumber.set('');
        this.password.set('');
        
        // Reload accounts
        this.loadAccounts();
      },
      error: (error) => {
        this.isLoading.set(false);
        alert(error.message || 'Error registering account. Please try again.');
      }
    });
  }
}
