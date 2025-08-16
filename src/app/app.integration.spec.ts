import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { of } from 'rxjs';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginService } from './login.service';

@Component({
  template: '<div>Mock Home Component</div>'
})
class MockHomeComponent { }

describe('Login Application Integration Tests', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;
  let location: Location;
  let loginService: jasmine.SpyObj<LoginService>;

  beforeEach(async () => {
    const loginServiceSpy = jasmine.createSpyObj('LoginService', ['validate', 'getLogin']);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: '', component: MockHomeComponent },
          { path: 'dashboard', component: DashboardComponent }
        ]),
        FormsModule,
        HttpClientTestingModule
      ],
      declarations: [
        AppComponent,
        DashboardComponent,
        MockHomeComponent
      ],
      providers: [
        { provide: LoginService, useValue: loginServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    loginService = TestBed.inject(LoginService) as jasmine.SpyObj<LoginService>;
  });

  it('should complete full login flow successfully', async () => {
    // Setup
    loginService.validate.and.returnValue(of('login successful!'));
    
    // Set credentials
    component.username = 'validuser';
    component.password = 'validpass';
    
    // Trigger login
    component.validate();
    
    // Wait for navigation
    await fixture.whenStable();
    
    // Verify service was called with correct credentials
    expect(loginService.validate).toHaveBeenCalledWith({
      username: 'validuser',
      password: 'validpass'
    });
    
    // Verify success message
    expect(component.message).toBe('login successful!');
  });



  it('should handle user interaction flow', async () => {
    fixture.detectChanges();
    
    // Get form elements
    const usernameInput = fixture.nativeElement.querySelector('input[placeholder="Enter username"]') as HTMLInputElement;
    const passwordInput = fixture.nativeElement.querySelector('input[type="password"]') as HTMLInputElement;
    const loginButton = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    
    // Simulate user typing
    usernameInput.value = 'testuser';
    usernameInput.dispatchEvent(new Event('input'));
    
    passwordInput.value = 'testpass';
    passwordInput.dispatchEvent(new Event('input'));
    
    fixture.detectChanges();
    
    // Verify data binding
    expect(component.username).toBe('testuser');
    expect(component.password).toBe('testpass');
    
    // Setup service response
    loginService.validate.and.returnValue(of('login successful!'));
    
    // Simulate button click
    loginButton.click();
    
    await fixture.whenStable();
    
    // Verify login was attempted
    expect(loginService.validate).toHaveBeenCalled();
  });

  it('should display error messages in UI', async () => {
    fixture.detectChanges();
    
    // Set error message
    component.message = 'Login failed';
    fixture.detectChanges();
    
    // Verify error is displayed
    const messageElement = fixture.nativeElement.querySelector('p') as HTMLParagraphElement;
    expect(messageElement.textContent).toContain('Login failed');
    expect(messageElement.style.color).toBe('blue');
  });

  it('should clear form after successful login', async () => {
    // Set initial values
    component.username = 'testuser';
    component.password = 'testpass';
    
    loginService.validate.and.returnValue(of('login successful!'));
    
    // Trigger login
    component.validate();
    await fixture.whenStable();
    
    // In a real app, you might want to clear the form
    // This test documents the current behavior
    expect(component.username).toBe('testuser'); // Currently not cleared
    expect(component.password).toBe('testpass'); // Currently not cleared
  });

  it('should handle rapid successive login attempts', async () => {
    loginService.validate.and.returnValue(of('login successful!'));
    
    component.username = 'testuser';
    component.password = 'testpass';
    
    // Trigger multiple rapid logins
    component.validate();
    component.validate();
    component.validate();
    
    await fixture.whenStable();
    
    // Verify service was called multiple times
    expect(loginService.validate).toHaveBeenCalledTimes(3);
  });

  it('should maintain form state during validation', () => {
    fixture.detectChanges();
    
    const usernameInput = fixture.nativeElement.querySelector('input[placeholder="Enter username"]') as HTMLInputElement;
    const passwordInput = fixture.nativeElement.querySelector('input[type="password"]') as HTMLInputElement;
    
    // Set values
    usernameInput.value = 'maintainuser';
    passwordInput.value = 'maintainpass';
    
    usernameInput.dispatchEvent(new Event('input'));
    passwordInput.dispatchEvent(new Event('input'));
    
    fixture.detectChanges();
    
    // Verify values are maintained
    expect(usernameInput.value).toBe('maintainuser');
    expect(passwordInput.value).toBe('maintainpass');
    expect(component.username).toBe('maintainuser');
    expect(component.password).toBe('maintainpass');
  });
});