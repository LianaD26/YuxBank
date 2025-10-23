import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PocketManagerComponent } from '../../shared/pocket-manager/pocket-manager.component';

@Component({
  selector: 'app-pockets',
  standalone: true,
  imports: [CommonModule, PocketManagerComponent],
  templateUrl: './pockets.component.html',
  styleUrls: ['./pockets.component.css']
})
export class PocketsComponent {
  showPocketManager = false;

  openPocketManager() {
    this.showPocketManager = true;
  }

  closePocketManager() {
    this.showPocketManager = false;
  }

}
