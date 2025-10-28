import { Component,signal } from '@angular/core';
import { RouterLink,Router } from '@angular/router';
import { FooterComponent } from '../../shared/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { LogInUserService } from '../../services/log-in-user.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [RouterLink, FooterComponent, FormsModule],
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})

export class LogInComponent {
  // data binding con signals
  email = signal('');
  password = signal('');
  constructor(
    private logInUserService: LogInUserService, 
    private router: Router,
    private storageService: StorageService
  ) { }

  // update values from the form
  updateEmail(value: string): void {
    this.email.set(value);
  }
  updatePassword(value: string): void {
    this.password.set(value);
  }
  onSubmit(): void {
    const users = this.storageService.getAllUsers();
    
    // find user with matching email and password
    const foundUser = users.find(user => 
      user.email === this.email() && 
      user.password === this.password()
    );
    
    if (foundUser) {
      // save logged user and navigate to products page
      this.storageService.saveLoggedUser(foundUser);
      this.router.navigate(['/products']);
    } else {
      alert('email or password is incorrect; try again please');
    }
  }
}