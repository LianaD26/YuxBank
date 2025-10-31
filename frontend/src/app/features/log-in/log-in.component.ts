import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../../shared/footer/footer.component';
import { LogInUserService } from '../../services/log-in-user.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [RouterLink, FooterComponent, FormsModule, HttpClientModule, CommonModule],
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent {
  email = signal('');
  password = signal('');
  isLoading = signal(false);

  constructor(
    private logInUserService: LogInUserService, 
    private router: Router
  ) {}

  updateEmail(value: string): void {
    this.email.set(value);
  }

  updatePassword(value: string): void {
    this.password.set(value);
  }

  onSubmit(): void {
    if (!this.email() || !this.password()) {
      alert('Please complete all fields.');
      return;
    }

    this.isLoading.set(true);

    this.logInUserService.login(this.email().trim(), this.password().trim()).subscribe({
      next: (response) => {
        console.log('User authenticated successfully:', response);
        
        if (response.token) {
          localStorage.setItem('yuxbank_token', response.token);
          localStorage.setItem('token', 'true');
          localStorage.setItem('yuxbank_user', JSON.stringify(response.usuario));
        }

        this.isLoading.set(false);
        alert('Welcome back to YuxBank!');
        
        this.router.navigate(['/products']);
      },
      error: (error) => {
        console.error('Login error:', error);
        this.isLoading.set(false);
        alert(error.message || 'Login error. Please try again.');
      }
    });
  }
}
