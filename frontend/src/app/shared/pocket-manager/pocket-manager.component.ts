import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AccountService, Account } from '../../services/account.service';

@Component({
  selector: 'app-pocket-manager',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './pocket-manager.component.html',
  styleUrls: ['./pocket-manager.component.css']
})
export class PocketManagerComponent {
  @Output() created = new EventEmitter<any>();
  name = '';
  description = '';
  count = '';
  value: number | null = null;
  accounts: Account[] = [];
  selectedAccount: string | null = null;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    // Cargar cuentas disponibles desde el servicio
    this.accounts = this.accountService.getAccounts();
    if (this.accounts.length > 0) {
      this.selectedAccount = this.accounts[0].number;
    }
  }

  createPocket(form: NgForm) {
    if (!form || form.invalid) return;

    // Garantizar que enviamos la cuenta origen seleccionada
    const data = { ...form.value, fromAccount: this.selectedAccount };

    this.created.emit(data);

    form.resetForm();
    // Reset selección a la primera cuenta si existe
    if (this.accounts.length > 0) this.selectedAccount = this.accounts[0].number;
    else this.selectedAccount = null;
  }
}