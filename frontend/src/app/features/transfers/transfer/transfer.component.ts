import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, NgIf, FormsModule],
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent {
  showModal = false;
  modalType: 'same' | 'other' | 'schedule' | null = null;

  openModal(type: 'same' | 'other' | 'schedule') {
    this.modalType = type;
    this.showModal = true;
    // prevent background scroll
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.showModal = false;
    this.modalType = null;
    document.body.style.overflow = '';
  }

  onSubmit(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    const payload: any = {};
    data.forEach((v, k) => payload[k] = v);
    // TODO: send payload to service / API. For now log and close modal.
    console.log('Transfer submitted', this.modalType, payload);
    // simple validation example
    if (!payload.amount || isNaN(Number(payload.amount)) || Number(payload.amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    // show success then close
    alert('Transfer submitted (mock)');
    this.closeModal();
  }
}
