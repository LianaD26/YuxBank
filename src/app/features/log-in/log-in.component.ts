import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'; // ← Import correcto

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent {

}