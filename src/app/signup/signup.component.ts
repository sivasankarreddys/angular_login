import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  firstName = '';
  lastName = '';
  email = '';
  username = '';
  password = '';
  confirmPassword = '';
  phone = '';
  currentTime = '';
  currentLocation = 'Hyderabad, India';

  constructor(private router: Router) {}

  ngOnInit() {
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }

  updateTime() {
    this.currentTime = new Date().toLocaleString();
  }

  onSignup() {
    // Simulate signup process
    if (this.firstName && this.lastName && this.email && this.username && this.password) {
      alert('Signup successful! Redirecting to login page.');
      this.router.navigate(['/']);
    } else {
      alert('Please fill all required fields.');
    }
  }
}
