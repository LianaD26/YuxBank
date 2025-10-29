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
    const logged = this.storageService.getLoggedUser();
    if (logged) {
      this.limits = this.limitsService.getLimitsForUser(logged.email);
    }
  }

  saveLimits(): void {
    const logged = this.storageService.getLoggedUser();
    if (!logged) {
      alert('You must be logged in to save limits');
      return;
    }
    this.limitsService.saveLimitsForUser(logged.email, this.limits);
    alert('Limits saved successfully');
  }
}
