import { Component } from '@angular/core';
import { CommonModule, NgIf, NgForOf, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { startWith, debounceTime, switchMap, tap } from 'rxjs/operators';
import { TransactionService } from '../../../services/transaction.service';
import { Transaction } from './transaction.model';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, NgIf, NgForOf, AsyncPipe, FormsModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent {
  search$ = new Subject<string>();
  transactions$: Observable<Transaction[]>;
  isLoading = false;

  // modal state
  selectedTx?: Transaction | null = null;

  constructor(private txService: TransactionService) {
    this.transactions$ = this.search$.pipe(
      startWith(''),
      debounceTime(250),
      tap(() => this.isLoading = true),
      switchMap(q => this.txService.list({ search: q })),
      tap(() => this.isLoading = false)
    );
  }

  openDetail(tx: Transaction) {
    this.selectedTx = tx;
  }

  closeDetail() {
    this.selectedTx = null;
  }
}
