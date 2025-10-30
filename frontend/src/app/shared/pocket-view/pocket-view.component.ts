import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PocketViewModel {
  id: string;
  name: string;
  description?: string;
  value: number;
  createdAt: string;
  fromAccount?: string | null;
}

@Component({
  selector: 'app-pocket-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pocket-view.component.html',
  styleUrls: ['./pocket-view.component.css']
})
export class PocketViewComponent {
  @Input() pocket!: PocketViewModel;
  @Output() delete = new EventEmitter<PocketViewModel>();

  onDelete(): void {
    if (confirm(`Are you sure you want to delete "${this.pocket.name}"? The balance will be returned to your account.`)) {
      this.delete.emit(this.pocket);
    }
  }
}

