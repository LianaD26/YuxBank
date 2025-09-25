import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // para usar <router-outlet>

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {}
