import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AccountService, AccountResponse } from '../../services/account.service';

@Component({
  selector: 'app-pocket-manager',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './pocket-manager.component.html',
  styleUrls: ['./pocket-manager.component.css']
})
export class PocketManagerComponent implements OnInit {
  @Output() created = new EventEmitter<any>();
  name = '';
  description = '';
  count = '';
  value: number | null = null;
  accounts: AccountResponse[] = [];
  selectedAccount: string | null = null;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    // Load available accounts from the service
    this.accountService.getAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        if (this.accounts.length > 0) {
          this.selectedAccount = this.accounts[0].num_cuenta;
        }
      },
      error: (error) => {
        console.error('Error loading accounts:', error);
        this.accounts = [];
      }
    });
  }

  createPocket(form: NgForm) {
    if (!form || form.invalid) return;

    // Garantizar que enviamos la cuenta origen seleccionada
    const data = { ...form.value, fromAccount: this.selectedAccount };

    this.created.emit(data);

    form.resetForm();
    // Reset selection to the first account if it exists
    if (this.accounts.length > 0) this.selectedAccount = this.accounts[0].num_cuenta;
    else this.selectedAccount = null;
  }
}