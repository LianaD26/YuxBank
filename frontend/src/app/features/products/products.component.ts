import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SerchBarComponent } from '../../shared/serch-bar/serch-bar.component';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, SerchBarComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
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
  accounts = signal<any[]>([]);

  constructor(private accountService: AccountService) {
    
    console.log('🔍 ProductsComponent - sidebarRoutes:', this.sidebarRoutes);
    console.log('🔍 Type of sidebarRoutes:', typeof this.sidebarRoutes);
    console.log('🔍 Is Array?:', Array.isArray(this.sidebarRoutes));
    console.log('🔍 Length:', this.sidebarRoutes.length);

    const savedAccounts = this.accountService.getAccounts();
    if (savedAccounts) {
      this.accounts.set(savedAccounts);
    }
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

  // Eliminar cuenta
  deleteAccount(accountNumber: string) {
    this.accountService.deleteAccount(accountNumber);
    this.accounts.set(this.accountService.getAccounts());
  }
}