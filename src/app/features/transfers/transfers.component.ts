import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-transfers',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './transfers.component.html',
  styleUrls: ['./transfers.component.css']
})
export class TransfersComponent {
  selectedPage: 'transfer' | 'history' = 'transfer';

  constructor(private router: Router) {}

  selectPage(page: 'transfer' | 'history') {
    this.router.navigate(['/transfers', page], { replaceUrl: true }).then(() => {
      this.selectedPage = page;
    });
  }
}
