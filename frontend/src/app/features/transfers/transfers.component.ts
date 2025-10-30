import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SerchBarComponent } from '../../shared/serch-bar/serch-bar.component';
import { AccountService, AccountResponse } from '../../services/account.service';
import { TransactionService, TransactionRequest } from '../../services/transaction.service';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { debounceTime, switchMap, startWith, tap } from 'rxjs/operators';
import { Transaction } from './transaction.model';
import { LimitsService, UserLimits } from '../../services/limits.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-transfers',
  standalone: true,
  imports: [CommonModule, SerchBarComponent, HttpClientModule],
  templateUrl: './transfers.component.html',
  styleUrls: ['./transfers.component.css']
})
export class TransfersComponent implements OnInit {
  selectedPage: 'transfer' | 'history' = 'transfer';

  // Rutas del sidebar
  sidebarRoutes = [
    { key: 'transfer' as const, label: 'Make transfer' },
    { key: 'history' as const, label: 'Transaction history' }
  ];

  // VARIABLES PARA TRANSFERENCIAS
  showModal = false;
  modalType: 'own' | 'other' | 'schedule' | null = null;
  currentLimit: number = 0;
  userLimits: UserLimits | null = null;

  // VARIABLES PARA HISTORIAL
  search$ = new Subject<string>();
  transactions$!: Observable<Transaction[]>;
  isLoading = false;
  selectedTx: Transaction | null = null;
  // CUENTAS ORIGEN
  accounts: AccountResponse[] = [];
  selectedFromAccount: AccountResponse | null = null;
  
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);

  constructor(
    private limitsService: LimitsService,
    private storageService: StorageService,
    private accountService: AccountService,
    private transactionService: TransactionService
  ) {}

  ngOnInit() {
    // Load user limits
    this.loadUserLimits();

    // Load transactions from API
    this.loadTransactionsFromAPI();

    // Load accounts from AccountService
    this.loadAccounts();

    // Configurar búsqueda con debounce
    this.transactions$ = this.search$.pipe(
      startWith(''),
      debounceTime(300),
      tap(() => this.isLoading = true),
      switchMap(query => this.filterTransactions(query)),
      tap(() => this.isLoading = false)
    );
  }

  private loadAccounts() {
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

  private loadUserLimits() {
    this.limitsService.getLimits().subscribe({
      next: (limits) => {
        this.userLimits = limits;
      },
      error: (error) => {
        console.error('Error loading limits:', error);
        this.userLimits = {
          sameBankTransferLimit: 0,
          otherBankTransferLimit: 0,
          scheduledTransferLimit: 0
        };
      }
    });
  }

  // MÉTODOS PARA NAVEGACIÓN
  selectPage(page: string) {
    if (page === 'transfer' || page === 'history') {
      this.selectedPage = page;
    }
  }

  // MÉTODOS PARA TRANSFERENCIAS
  openModal(type: 'own' | 'other' | 'schedule') {
    this.modalType = type;
    this.showModal = true;
    
    // Reload limits from API when opening modal
    this.limitsService.getLimits().subscribe({
      next: (limits) => {
        this.userLimits = limits;
        
        // Set current limit based on transfer type
        switch(type) {
          case 'own':
            this.currentLimit = limits.sameBankTransferLimit;
            break;
          case 'other':
            this.currentLimit = limits.otherBankTransferLimit;
            break;
          case 'schedule':
            this.currentLimit = limits.scheduledTransferLimit;
            break;
        }
      },
      error: (error) => {
        console.error('Error loading limits:', error);
        this.currentLimit = 0;
      }
    });

    // Reload accounts when opening modal to reflect changes
    this.loadAccounts();
  }

  onSelectFrom(id: string) {
    if (!id) {
      this.selectedFromAccount = null;
      return;
    }
    this.selectedFromAccount = this.accounts.find(a => a.num_cuenta === id) || null;
  }

  closeModal() {
    this.showModal = false;
    this.modalType = null;
  }

  onSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const fromAccount = formData.get('fromAccount') as string;
    const toAccount = (formData.get('toAccountOwn') || formData.get('toAccountOther')) as string;
    const amount = parseFloat(formData.get('amount') as string) || 0;
    const description = formData.get('description') as string;

    // Validate amount against limit
    if (this.currentLimit > 0 && amount > this.currentLimit) {
      alert(`Transfer amount ($${amount.toFixed(2)}) exceeds the limit of $${this.currentLimit.toFixed(2)} for this transfer type.`);
      return;
    }

    if (amount <= 0) {
      alert('Please enter a valid amount greater than 0.');
      return;
    }

    if (!fromAccount || !toAccount) {
      alert('Please select both source and destination accounts.');
      return;
    }

    // Create transaction request
    const transactionRequest: TransactionRequest = {
      num_cuenta_origen: fromAccount,
      num_cuenta_destino: toAccount,
      tipo: 'transferencia',
      monto: amount,
      descripcion: description || `Transfer to ${toAccount}`
    };

    this.isLoading = true;

    // Call API to create transfer
    this.transactionService.createTransfer(transactionRequest).subscribe({
      next: (response) => {
        this.isLoading = false;
        alert('Transfer processed successfully!');
        this.closeModal();
        form.reset();
        
        // Reload transactions and accounts
        this.loadTransactionsFromAPI();
        this.loadAccounts();
      },
      error: (error) => {
        this.isLoading = false;
        alert(error.message || 'Error processing transfer. Please try again.');
      }
    });
  }

  // MÉTODOS PARA HISTORIAL
  openDetail(tx: Transaction) {
    this.selectedTx = tx;
  }

  closeDetail() {
    this.selectedTx = null;
  }

  private loadTransactionsFromAPI() {
    this.transactionService.getTransactions().subscribe({
      next: (transactions) => {
        this.transactionsSubject.next(transactions);
      },
      error: (error) => {
        console.error('Error loading transactions:', error);
        this.transactionsSubject.next([]);
      }
    });
  }

  private filterTransactions(query: string): Observable<Transaction[]> {
    return new Observable(observer => {
      const allTransactions = this.transactionsSubject.value;
      
      if (!query || query.trim() === '') {
        observer.next(allTransactions);
      } else {
        const filtered = allTransactions.filter(tx => {
          const searchTerm = query.toLowerCase();
          return (
            tx.id.toLowerCase().includes(searchTerm) ||
            tx.description?.toLowerCase().includes(searchTerm) ||
            tx.merchant?.name.toLowerCase().includes(searchTerm) ||
            tx.status.toLowerCase().includes(searchTerm)
          );
        });
        observer.next(filtered);
      }
      
      observer.complete();
    });
  }
}