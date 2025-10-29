import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../services/storage.service';
import { AccountService, Account } from '../../services/account.service';
import { TransactionService } from '../../services/transaction.service';
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
  imports: [CommonModule, FormsModule, SerchBarComponent],
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
  accounts: Account[] = [];
  
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
    this.accounts = this.accountService.getAccounts();
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
    const account = this.accountService.getAccountByNumber(this.fromAccount);
    if (!account) {
      alert('The selected account does not exist.');
      return;
    }

    // Check sufficient balance
    if (account.balance < this.amount) {
      alert(`Insufficient balance. Available: $${account.balance.toFixed(2)}, Required: $${this.amount.toFixed(2)}`);
      return;
    }

    // Deduct amount from account
    const success = this.accountService.updateAccountBalance(this.fromAccount, -this.amount);
    
    if (!success) {
      alert('Error processing payment. Please try again.');
      return;
    }

    // Create transaction description
    let description = '';
    if (this.selectedService.id === 'utilities') {
      description = `${this.utilityType.charAt(0).toUpperCase() + this.utilityType.slice(1)} payment - Account: ${this.accountNumber}`;
    } else if (this.selectedService.id === 'civica') {
      description = `Civica card recharge - Card: ${this.civicaCardNumber}`;
    } else if (this.selectedService.id === 'mobile') {
      description = `Mobile recharge - ${this.phoneNumber} (${this.mobileCarrier})`;
    }

    if (this.reference) {
      description += ` - ${this.reference}`;
    }

    // Create transaction record
    const transaction: Transaction = {
      id: `PAY${Date.now()}`,
      date: new Date(),
      amount: -this.amount,
      currency: 'USD',
      type: 'payment',
      status: 'completed',
      merchant: { name: this.selectedService.name },
      description: description
    };

    this.transactionService.addTransaction(transaction);

    console.log('Payment processed:', transaction);
    
    alert(`Payment of $${this.amount.toFixed(2)} for ${this.selectedService.name} processed successfully!\nNew balance: $${(account.balance - this.amount).toFixed(2)}`);
    this.closeModal();
  }
}
