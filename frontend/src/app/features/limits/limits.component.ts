import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LimitsService, UserLimits } from '../../services/limits.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-limits',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './limits.component.html',
  styleUrl: './limits.component.css'
})
export class LimitsComponent implements OnInit {
  limits: UserLimits = {
    sameBankTransferLimit: 0,
    otherBankTransferLimit: 0,
    scheduledTransferLimit: 0
  };

  constructor(
    private limitsService: LimitsService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('yuxbank_token');
    if (token) {
      this.limitsService.getLimits().subscribe({
        next: (limits) => {
          this.limits = limits;
        },
        error: (err) => {
          console.error('Error loading limits:', err);
        }
      });
    }
  }

  saveLimits(): void {
    const token = localStorage.getItem('yuxbank_token');
    if (!token) {
      alert('You must be logged in to save limits');
      return;
    }
    
    this.limitsService.saveLimits(this.limits).subscribe({
      next: () => {
        alert('Limits saved successfully');
      },
      error: (err) => {
        console.error('Error saving limits:', err);
        alert('Error saving limits. Please try again.');
      }
    });
  }
}
