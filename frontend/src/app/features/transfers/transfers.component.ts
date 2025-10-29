import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SerchBarComponent } from '../../shared/serch-bar/serch-bar.component';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { debounceTime, switchMap, startWith, tap } from 'rxjs/operators';
import { Transaction } from './transaction.model';
import { LimitsService, UserLimits } from '../../services/limits.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-transfers',
  standalone: true,
  imports: [CommonModule, SerchBarComponent],
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
  modalType: 'same' | 'other' | 'schedule' | null = null;
  currentLimit: number = 0;
  userLimits: UserLimits | null = null;

  // VARIABLES PARA HISTORIAL
  search$ = new Subject<string>();
  transactions$!: Observable<Transaction[]>;
  isLoading = false;
  selectedTx: Transaction | null = null;
  
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);

  constructor(
    private limitsService: LimitsService,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    // Load user limits
    this.loadUserLimits();

    // Inicializar datos de ejemplo para transacciones
    this.loadMockTransactions();

    // Configurar búsqueda con debounce
    this.transactions$ = this.search$.pipe(
      startWith(''),
      debounceTime(300),
      tap(() => this.isLoading = true),
      switchMap(query => this.filterTransactions(query)),
      tap(() => this.isLoading = false)
    );
  }

  private loadUserLimits() {
    const logged = this.storageService.getLoggedUser();
    if (logged) {
      this.userLimits = this.limitsService.getLimitsForUser(logged.email);
    }
  }

  // MÉTODOS PARA NAVEGACIÓN
  selectPage(page: string) {
    if (page === 'transfer' || page === 'history') {
      this.selectedPage = page;
    }
  }

  // MÉTODOS PARA TRANSFERENCIAS
  openModal(type: 'same' | 'other' | 'schedule') {
    this.modalType = type;
    this.showModal = true;
    
    // Set current limit based on transfer type
    if (this.userLimits) {
      switch(type) {
        case 'same':
          this.currentLimit = this.userLimits.sameBankTransferLimit;
          break;
        case 'other':
          this.currentLimit = this.userLimits.otherBankTransferLimit;
          break;
        case 'schedule':
          this.currentLimit = this.userLimits.scheduledTransferLimit;
          break;
      }
    }
  }

  closeModal() {
    this.showModal = false;
    this.modalType = null;
  }

  onSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const transferData = {
      fromAccount: formData.get('fromAccount'),
      toAccount: formData.get('toAccountSame') || formData.get('toAccountOther'),
      bankName: formData.get('bankName'),
      amount: formData.get('amount'),
      date: formData.get('date'),
      description: formData.get('description')
    };

    // Validate amount against limit
    const amount = parseFloat(transferData.amount as string) || 0;
    
    if (this.currentLimit > 0 && amount > this.currentLimit) {
      alert(`Transfer amount ($${amount.toFixed(2)}) exceeds the limit of $${this.currentLimit.toFixed(2)} for this transfer type.`);
      return;
    }

    if (amount <= 0) {
      alert('Please enter a valid amount greater than 0.');
      return;
    }

    console.log('Transfer data:', transferData);
    
    // Save transfer to history
    this.addTransactionToHistory(transferData);
    
    alert('Transfer processed successfully!');
    this.closeModal();
    form.reset();
  }

  // MÉTODOS PARA HISTORIAL
  openDetail(tx: Transaction) {
    this.selectedTx = tx;
  }

  closeDetail() {
    this.selectedTx = null;
  }

  private addTransactionToHistory(transferData: any) {
    const currentTransactions = this.transactionsSubject.value;
    
    const newTransaction: Transaction = {
      id: `TXN${String(currentTransactions.length + 1).padStart(3, '0')}`,
      date: new Date(),
      amount: -(parseFloat(transferData.amount as string) || 0),
      currency: 'USD',
      type: 'transfer',
      status: transferData.date ? 'scheduled' : 'completed',
      description: transferData.description as string || `Transfer to ${transferData.toAccount}`
    };

    // Agregar al inicio del array
    this.transactionsSubject.next([newTransaction, ...currentTransactions]);
  }

  private loadMockTransactions() {
    // Datos de ejemplo - reemplazar con servicio real
    const mockTransactions: Transaction[] = [
      {
        id: 'TXN001',
        date: new Date('2025-10-25T10:30:00'),
        amount: -150.50,
        currency: 'USD',
        type: 'transfer',
        status: 'completed',
        description: 'Transfer to savings account'
      },
      {
        id: 'TXN002',
        date: new Date('2025-10-24T15:45:00'),
        amount: 500.00,
        currency: 'USD',
        type: 'deposit',
        status: 'completed',
        merchant: { name: 'Salary Payment' }
      },
      {
        id: 'TXN003',
        date: new Date('2025-10-23T09:15:00'),
        amount: -75.25,
        currency: 'USD',
        type: 'payment',
        status: 'completed',
        merchant: { name: 'Amazon' }
      },
      {
        id: 'TXN004',
        date: new Date('2025-10-22T18:20:00'),
        amount: -30.00,
        currency: 'USD',
        type: 'transfer',
        status: 'pending',
        description: 'Transfer to John Doe'
      },
      {
        id: 'TXN005',
        date: new Date('2025-10-20T12:00:00'),
        amount: 1200.00,
        currency: 'USD',
        type: 'deposit',
        status: 'completed',
        merchant: { name: 'Freelance Payment' }
      }
    ];

    this.transactionsSubject.next(mockTransactions);
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