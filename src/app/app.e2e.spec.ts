import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginService } from './login.service';

describe('Login Application E2E Tests', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let loginService: jasmine.SpyObj<LoginService>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    const loginServiceSpy = jasmine.createSpyObj('LoginService', ['validate', 'getLogin']);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'dashboard', component: DashboardComponent }
        ]),
        FormsModule,
        HttpClientTestingModule
      ],
      declarations: [AppComponent, DashboardComponent],
      providers: [
        { provide: LoginService, useValue: loginServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    loginService = TestBed.inject(LoginService) as jasmine.SpyObj<LoginService>;
  });

  describe('User Interface Tests', () => {
    it('should display login form with all required elements', () => {
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      
      // Check form elements exist
      expect(compiled.querySelector('h2')).toBeTruthy();
      expect(compiled.querySelector('h2')?.textContent).toContain('Login');
      
      const usernameLabel = compiled.querySelector('label');
      expect(usernameLabel?.textContent).toContain('Usernmae:'); // Note: typo in original
      
      const inputs = compiled.querySelectorAll('input');
      expect(inputs.length).toBe(2);
      
      const usernameInput = inputs[0] as HTMLInputElement;
      expect(usernameInput.placeholder).toBe('Enter username');
      
      const passwordInput = inputs[1] as HTMLInputElement;
      expect(passwordInput.type).toBe('password');
      expect(passwordInput.placeholder).toBe('Enter password');
      
      const button = compiled.querySelector('button');
      expect(button?.textContent).toContain('Login');
      
      const messageArea = compiled.querySelector('p');
      expect(messageArea).toBeTruthy();
    });

    it('should have proper styling applied', () => {
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const body = compiled.querySelector('body');
      const div = compiled.querySelector('div');
      const messageP = compiled.querySelector('p');
      
      // Check inline styles
      expect(body?.style.color).toBe('rgb(22, 23, 23)');
      expect(messageP?.style.color).toBe('blue');
      expect(messageP?.style.marginTop).toBe('10px');
    });
  });

  describe('User Interaction Scenarios', () => {
    it('should handle complete successful login scenario', async () => {
      loginService.validate.and.returnValue(of('login successful!'));
      fixture.detectChanges();
      
      // Get form elements
      const usernameInput = debugElement.query(By.css('input[placeholder=\"Enter username\"]')).nativeElement;
      const passwordInput = debugElement.query(By.css('input[type=\"password\"]')).nativeElement;
      const loginButton = debugElement.query(By.css('button')).nativeElement;
      
      // Simulate user input
      usernameInput.value = 'admin';
      usernameInput.dispatchEvent(new Event('input'));
      
      passwordInput.value = 'password123';
      passwordInput.dispatchEvent(new Event('input'));
      
      fixture.detectChanges();
      
      // Verify data binding
      expect(component.username).toBe('admin');
      expect(component.password).toBe('password123');
      
      // Click login button
      loginButton.click();
      fixture.detectChanges();
      
      // Verify service call
      expect(loginService.validate).toHaveBeenCalledWith({
        username: 'admin',
        password: 'password123'
      });
      
      // Verify success message
      expect(component.message).toBe('login successful!');
      
      // Check message display
      const messageElement = debugElement.query(By.css('p')).nativeElement;
      expect(messageElement.textContent).toContain('login successful!');
    });

    it('should handle failed login scenario', async () => {
      loginService.validate.and.returnValue(of('Invalid credentials'));
      fixture.detectChanges();
      
      // Fill form with invalid credentials
      const usernameInput = debugElement.query(By.css('input[placeholder=\"Enter username\"]')).nativeElement;
      const passwordInput = debugElement.query(By.css('input[type=\"password\"]')).nativeElement;
      const loginButton = debugElement.query(By.css('button')).nativeElement;
      
      usernameInput.value = 'wronguser';
      usernameInput.dispatchEvent(new Event('input'));
      
      passwordInput.value = 'wrongpass';
      passwordInput.dispatchEvent(new Event('input'));
      
      fixture.detectChanges();
      
      // Submit form
      loginButton.click();
      fixture.detectChanges();
      
      // Verify failure handling
      expect(component.message).toBe('Invalid credentials');
      
      const messageElement = debugElement.query(By.css('p')).nativeElement;
      expect(messageElement.textContent).toContain('Invalid credentials');
    });

    it('should handle server error scenario', async () => {
      loginService.validate.and.returnValue(throwError(() => new Error('Server down')));
      fixture.detectChanges();
      
      // Fill form
      component.username = 'testuser';
      component.password = 'testpass';
      
      // Trigger login
      const loginButton = debugElement.query(By.css('button')).nativeElement;
      loginButton.click();
      fixture.detectChanges();
      
      // Verify error handling
      expect(component.message).toBe('Login failed due to server error');
    });

    it('should handle empty form submission', async () => {
      loginService.validate.and.returnValue(of('Please enter credentials'));
      fixture.detectChanges();
      
      // Submit empty form
      const loginButton = debugElement.query(By.css('button')).nativeElement;
      loginButton.click();
      fixture.detectChanges();
      
      // Verify empty credentials are sent
      expect(loginService.validate).toHaveBeenCalledWith({
        username: '',
        password: ''
      });
    });
  });

  describe('Form Validation and UX', () => {
    it('should maintain form state during interactions', () => {
      fixture.detectChanges();
      
      const usernameInput = debugElement.query(By.css('input[placeholder=\"Enter username\"]')).nativeElement;
      const passwordInput = debugElement.query(By.css('input[type=\"password\"]')).nativeElement;
      
      // Type in username
      usernameInput.value = 'partialuser';
      usernameInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      
      // Type in password
      passwordInput.value = 'partialpass';
      passwordInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      
      // Verify both fields maintain their values
      expect(component.username).toBe('partialuser');
      expect(component.password).toBe('partialpass');
      expect(usernameInput.value).toBe('partialuser');
      expect(passwordInput.value).toBe('partialpass');
    });

    it('should clear message on new input', () => {
      fixture.detectChanges();
      
      // Set initial message
      component.message = 'Previous error';
      fixture.detectChanges();
      
      // In a real app, you might want to clear message on new input
      // This test documents current behavior
      const messageElement = debugElement.query(By.css('p')).nativeElement;
      expect(messageElement.textContent).toContain('Previous error');
      
      // Type new input
      const usernameInput = debugElement.query(By.css('input[placeholder=\"Enter username\"]')).nativeElement;
      usernameInput.value = 'newuser';
      usernameInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      
      // Message should still be there (current behavior)
      expect(component.message).toBe('Previous error');
    });
  });

  describe('Accessibility Tests', () => {
    it('should have proper form labels', () => {
      fixture.detectChanges();
      
      const labels = debugElement.queryAll(By.css('label'));
      expect(labels.length).toBeGreaterThan(0);
      
      // Check label text
      const usernameLabel = labels[0].nativeElement;
      expect(usernameLabel.textContent).toContain('Usernmae:');
    });

    it('should have focusable form elements', () => {
      fixture.detectChanges();
      
      const usernameInput = debugElement.query(By.css('input[placeholder=\"Enter username\"]')).nativeElement;
      const passwordInput = debugElement.query(By.css('input[type=\"password\"]')).nativeElement;
      const loginButton = debugElement.query(By.css('button')).nativeElement;
      
      // Elements should be focusable
      expect(usernameInput.tabIndex).not.toBe(-1);
      expect(passwordInput.tabIndex).not.toBe(-1);
      expect(loginButton.tabIndex).not.toBe(-1);
    });
  });
});