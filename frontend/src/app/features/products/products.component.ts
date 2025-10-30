import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SerchBarComponent } from '../../shared/serch-bar/serch-bar.component';
import { AccountService, AccountResponse } from '../../services/account.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, SerchBarComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  // Estado del componente
  selectedOption: 'register' | 'view' = 'register';

  sidebarRoutes = [
    { key: 'register' as const, label: 'Register Account' },
    { key: 'view' as const, label: 'View Accounts' }
  ];

  // Datos y señales reactivas
  accountType = signal('');
  accountNumber = signal('');
  password = signal('');
  accounts = signal<AccountResponse[]>([]);

  constructor(private accountService: AccountService) {
    console.log('🔍 ProductsComponent - sidebarRoutes:', this.sidebarRoutes);
    console.log('🔍 Type of sidebarRoutes:', typeof this.sidebarRoutes);
    console.log('🔍 Is Array?:', Array.isArray(this.sidebarRoutes));
    console.log('🔍 Length:', this.sidebarRoutes.length);
  }

  ngOnInit() {
    this.loadAccounts();
  }

  loadAccounts() {
    this.accountService.getAccounts().subscribe({
      next: (accounts) => {
        this.accounts.set(accounts);
      },
      error: (error) => {
        console.error('Error loading accounts:', error);
        this.accounts.set([]);
      }
    });
  }

  // Cambiar opción en el menú lateral
  selectOption(optionKey: string) {
    if (optionKey === 'register' || optionKey === 'view') {
      this.selectedOption = optionKey;
    }
  }

  // Registrar una cuenta
  registerAccount(): void {
    const type = this.accountType();
    const number = this.accountNumber();
    const pass = this.password();

    if (!type || !number || !pass) {
      alert('Please fill out all fields.');
      return;
    }

    this.accountService.registerAccount({
      type,
      number,
      password: pass,
      balance: 0
    }).subscribe({
      next: (response) => {
        console.log('Account registered successfully:', response);
        alert('Account successfully registered.');
        
        // Clear form
        this.accountType.set('');
        this.accountNumber.set('');
        this.password.set('');
        
        // Reload accounts
        this.loadAccounts();
      },
      error: (error) => {
        console.error('Error registering account:', error);
        alert(error.message || 'Error registering account.');
      }
    });
  }

  // Eliminar cuenta
  deleteAccount(accountId: number) {
    this.accountService.deleteAccount(accountId).subscribe({
      next: () => {
        alert('Account deleted successfully.');
        this.loadAccounts();
      },
      error: (error) => {
        console.error('Error deleting account:', error);
        alert(error.message || 'Error deleting account.');
      }
    });
  }
}