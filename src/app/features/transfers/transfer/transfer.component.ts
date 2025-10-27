import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AccountService, Account } from '../../../services/account.service';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent {
  private accountService = inject(AccountService);

  sourceAccount = signal('');
  destinationType = signal('');
  destinationAccount = signal('');
  amount = signal<number | null>(null);

  accounts = signal<Account[]>(this.accountService.getAccounts());

  onSubmit(): void {
    const sourceNum = this.sourceAccount();
    const destNum = this.destinationAccount();
    const amountValue = this.amount();

    if (!sourceNum || !destNum || !this.destinationType() || !amountValue) {
      alert('Please fill in all fields.');
      return;
    }

    if (amountValue <= 0) {
      alert('The amount must be greater than 0.');
      return;
    }

    const accounts = this.accountService.getAccounts();
    const source = accounts.find(a => a.number === sourceNum);
    const destination = accounts.find(a => a.number === destNum);

    if (!source) {
      alert('Source account not found.');
      return;
    }

    if (source.balance < amountValue) {
      alert('Insufficient funds.');
      return;
    }

    source.balance -= amountValue;

    if (destination) {
      destination.balance += amountValue;
    } else {
      alert('Destination account not found.');
      return;
    }

    localStorage.setItem('accounts', JSON.stringify(accounts));
    this.accounts.set(accounts);

    // Reset form
    this.sourceAccount.set('');
    this.destinationType.set('');
    this.destinationAccount.set('');
    this.amount.set(null);

    alert('Transfer successful.');
  }
}
