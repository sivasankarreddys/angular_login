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

  constructor(private loginService: LoginService, private router:Router){}
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
          
         this.router.navigate(['/dashboard']); 
        }
        else{
          this.router.navigate(['http://localhost:4200'])
        }
        this.message = res},
      error:() => this.message ='Login failed due to server error'
     });
  }
}
