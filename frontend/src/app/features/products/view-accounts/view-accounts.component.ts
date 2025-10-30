import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService, AccountResponse } from '../../../services/account.service';

@Component({
  selector: 'app-view-accounts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-accounts.component.html',
  styleUrls: ['./view-accounts.component.css']
})
export class ViewAccountsComponent implements OnInit {
  private accountService = inject(AccountService);

  accounts = signal<AccountResponse[]>([]);

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