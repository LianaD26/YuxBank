import { Component, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { FooterComponent } from '../../shared/footer/footer.component';
import { RegisterUserService } from '../../services/register-user.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [RouterOutlet, FooterComponent, FormsModule, HttpClientModule, CommonModule],
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name = signal('');
  last_name = signal('');
  email = signal('');
  password = signal('');
  confirm_password = signal('');
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(private registerUserService: RegisterUserService, private router: Router) {}

  updateName(value: string): void {
    this.name.set(value);
  }

  updateLastName(value: string): void {
    this.last_name.set(value);
  }

  updateEmail(value: string): void {
    this.email.set(value);
  }

  updatePassword(value: string): void {
    this.password.set(value);
  }

  updateConfirmPassword(value: string): void {
    this.confirm_password.set(value);
  }

  onSubmit(): void {
    this.errorMessage.set('');

    if (!this.name() || !this.last_name() || !this.email() || !this.password() || !this.confirm_password()) {
      alert('Please complete all fields.');
      return;
    }

    if (!this.registerUserService.passwordsMatch(this.password(), this.confirm_password())) {
      alert('Passwords do not match. Please try again.');
      return;
    }

    if (this.password().length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }

    // Start registration process
    this.isLoading.set(true);

    this.registerUserService.registerUser({
      name: this.name(),
      last_name: this.last_name(),
      email: this.email(),
      password: this.password(),
      confirm_password: this.confirm_password()
    }).subscribe({
      next: (response) => {
        console.log('User registered successfully:', response);
        
        // Save token in localStorage for future authentication
        if (response.token) {
          localStorage.setItem('yuxbank_token', response.token);
          localStorage.setItem('yuxbank_user', JSON.stringify(response.usuario));
        }

        this.isLoading.set(false);
        alert('Registration successful! Welcome to YuxBank.');
        
        // Redirect to login
        this.router.navigate(['/log-in']);
      },
      error: (error) => {
        console.error('Registration error:', error);
        this.isLoading.set(false);
        this.errorMessage.set(error.message || 'An error occurred while registering the user.');
        alert(this.errorMessage());
      }
    });
  }
}
