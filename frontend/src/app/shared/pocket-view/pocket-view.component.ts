import { Component, Input } from '@angular/core';
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
}

