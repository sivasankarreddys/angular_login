import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
  name = '';
  message = '';
  username='';
  password='';
  isLoggedIn = false;
  loginFailed = false;
  isSignupPage = false;

  constructor(private loginService: LoginService, private router:Router){
    this.router.events.subscribe(() => {
      this.isSignupPage = this.router.url === '/signup';
    });
  }
 getLogin(){
    this.loginService.getLogin(this.name).subscribe(data => this.name=data);
  }
  validate(){
     const credentials={
      username: this.username,
      password: this.password
     };
     this.loginService.validate(credentials).subscribe({
      next:(res) => {
        if(res === 'login successful!'){
          this.isLoggedIn = true;
          this.router.navigate(['/weather']); 
        } else {
          this.loginFailed = true;
          this.router.navigate(['/error']);
        }
        this.message = res},
      error:() => {
        this.loginFailed = true;
        this.router.navigate(['/error']);
      }
     });
  } 
}
