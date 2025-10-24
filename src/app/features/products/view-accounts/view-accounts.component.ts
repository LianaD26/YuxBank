import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-view-accounts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-accounts.component.html',
  styleUrls: ['./view-accounts.component.css'] // corrected: "styleUrls" instead of "styleUrl"
})
export class ViewAccountsComponent {
  private accountService = inject(AccountService);

  accounts = signal(this.accountService.getAccounts());

  deleteAccount(accountNumber: string) {
    this.accountService.deleteAccount(accountNumber);
    this.accounts.set(this.accountService.getAccounts());
  }
}