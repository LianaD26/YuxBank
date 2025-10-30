import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StorageService } from '../../services/storage.service';
import { AccountService, AccountResponse } from '../../services/account.service';
import { TransactionService, TransactionRequest } from '../../services/transaction.service';
import { Transaction } from '../transfers/transaction.model';
import { SerchBarComponent } from '../../shared/serch-bar/serch-bar.component';

interface PaymentService {
  id: string;
  name: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-payment-services-component',
  standalone: true,
  imports: [CommonModule, FormsModule, SerchBarComponent, HttpClientModule],
  templateUrl: './payment-services-component.component.html',
  styleUrl: './payment-services-component.component.css'
})
export class PaymentServicesComponentComponent implements OnInit {
  selectedPage: 'services' | 'history' = 'services';
  
  // Rutas del sidebar
  sidebarRoutes = [
    { key: 'services' as const, label: 'Payment Services' },
    { key: 'history' as const, label: 'Payment History' }
  ];

  services: PaymentService[] = [
    {
      id: 'utilities',
      name: 'Pay Utilities',
      icon: '💡',
      description: 'Pay for electricity, water, gas and other public services'
    },
    {
      id: 'civica',
      name: 'Top Up Civica Card',
      icon: '🚌',
      description: 'Recharge your public transportation card'
    },
    {
      id: 'mobile',
      name: 'Mobile Recharge',
      icon: '📱',
      description: 'Top up your mobile phone balance'
    }
  ];

  showModal = false;
  selectedService: PaymentService | null = null;
  
  // Available accounts
  accounts: AccountResponse[] = [];
  
  // Form data
  fromAccount = '';
  
  // Utilities specific
  utilityType = 'electricity';
  accountNumber = '';
  
  // Civica specific
  civicaCardNumber = '';
  
  // Mobile specific
  phoneNumber = '';
  mobileCarrier = 'carrier1';
  
  // Common
  amount = 0;
  reference = '';

  constructor(
    private storageService: StorageService,
    private accountService: AccountService,
    private transactionService: TransactionService
  ) {}

  ngOnInit() {
    // Load available accounts
    this.loadAccounts();
  }

  loadAccounts() {
    this.accountService.getAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
      },
      error: (error) => {
        console.error('Error loading accounts:', error);
        this.accounts = [];
      }
    });
  }

  selectPage(page: string) {
    if (page === 'services' || page === 'history') {
      this.selectedPage = page;
    }
  }

  openServiceModal(service: PaymentService) {
    this.selectedService = service;
    this.showModal = true;
    this.resetForm();
  }

  closeModal() {
    this.showModal = false;
    this.selectedService = null;
  }

  resetForm() {
    this.fromAccount = '';
    this.utilityType = 'electricity';
    this.accountNumber = '';
    this.civicaCardNumber = '';
    this.phoneNumber = '';
    this.mobileCarrier = 'carrier1';
    this.amount = 0;
    this.reference = '';
  }

  onSubmit(event: Event) {
    event.preventDefault();
    
    if (!this.selectedService) return;

    // Validate common fields
    if (!this.fromAccount || this.amount <= 0) {
      alert('Please fill in all required fields with valid values.');
      return;
    }

    // Validate service-specific fields
    if (this.selectedService.id === 'utilities' && !this.accountNumber) {
      alert('Please enter the account number.');
      return;
    }

    if (this.selectedService.id === 'civica' && !this.civicaCardNumber) {
      alert('Please enter the Civica card number.');
      return;
    }

    if (this.selectedService.id === 'mobile' && !this.phoneNumber) {
      alert('Please enter the phone number.');
      return;
    }

    // Verify account exists
    const account = this.accounts.find(acc => acc.num_cuenta === this.fromAccount);
    if (!account) {
      alert('The selected account does not exist.');
      return;
    }

    // Check sufficient balance (convert saldo to number if it's string)
    const saldo = typeof account.saldo === 'string' ? parseFloat(account.saldo) : account.saldo;
    if (saldo < this.amount) {
      alert(`Insufficient balance. Available: $${saldo.toFixed(2)}, Required: $${this.amount.toFixed(2)}`);
      return;
    }

    // Create transaction description
    let description = '';
    let destinationAccount = '';
    
    if (this.selectedService.id === 'utilities') {
      description = `${this.utilityType.charAt(0).toUpperCase() + this.utilityType.slice(1)} payment - Account: ${this.accountNumber}`;
      destinationAccount = this.accountNumber;
    } else if (this.selectedService.id === 'civica') {
      description = `Civica card recharge - Card: ${this.civicaCardNumber}`;
      destinationAccount = this.civicaCardNumber;
    } else if (this.selectedService.id === 'mobile') {
      description = `Mobile recharge - ${this.phoneNumber} (${this.mobileCarrier})`;
      destinationAccount = this.phoneNumber;
    }

    if (this.reference) {
      description += ` - Ref: ${this.reference}`;
    }

    // Create payment request
    const paymentRequest: TransactionRequest = {
      num_cuenta_origen: this.fromAccount,
      num_cuenta_destino: destinationAccount,
      tipo: 'pago',
      monto: this.amount,
      referencia: this.reference || undefined,
      descripcion: description
    };

    // Call API to process payment
    this.transactionService.createTransfer(paymentRequest).subscribe({
      next: (response) => {
        const serviceName = this.selectedService?.name || 'service';
        alert(`Payment of $${this.amount.toFixed(2)} for ${serviceName} processed successfully!`);
        this.closeModal();
        
        // Reload accounts to get updated balances
        this.loadAccounts();
      },
      error: (error) => {
        alert(error.message || 'Error processing payment. Please try again.');
      }
    });
  }
}
