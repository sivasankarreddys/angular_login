import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AppComponent } from './app.component';
import { LoginService } from './login.service';
import { DashboardComponent } from './dashboard/dashboard.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let loginService: jasmine.SpyObj<LoginService>;
  let router: Router;

  beforeEach(async () => {
    const loginServiceSpy = jasmine.createSpyObj('LoginService', ['validate', 'getLogin']);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'dashboard', component: DashboardComponent }
        ]),
        FormsModule
      ],
      declarations: [AppComponent, DashboardComponent],
      providers: [
        { provide: LoginService, useValue: loginServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    loginService = TestBed.inject(LoginService) as jasmine.SpyObj<LoginService>;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty credentials', () => {
    expect(component.username).toBe('');
    expect(component.password).toBe('');
    expect(component.message).toBe('');
  });

  it('should render login form', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Login');
    expect(compiled.querySelector('input[placeholder="Enter username"]')).toBeTruthy();
    expect(compiled.querySelector('input[type="password"]')).toBeTruthy();
    expect(compiled.querySelector('button')).toBeTruthy();
  });

  it('should bind username input to component property', () => {
    fixture.detectChanges();
    const usernameInput = fixture.nativeElement.querySelector('input[placeholder="Enter username"]') as HTMLInputElement;
    
    usernameInput.value = 'testuser';
    usernameInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    
    expect(component.username).toBe('testuser');
  });

  it('should bind password input to component property', () => {
    fixture.detectChanges();
    const passwordInput = fixture.nativeElement.querySelector('input[type="password"]') as HTMLInputElement;
    
    passwordInput.value = 'testpass';
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    
    expect(component.password).toBe('testpass');
  });

  it('should call validate method when login button is clicked', () => {
    spyOn(component, 'validate');
    fixture.detectChanges();
    
    const loginButton = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    loginButton.click();
    
    expect(component.validate).toHaveBeenCalled();
  });

  it('should navigate to dashboard on successful login', () => {
    component.username = 'testuser';
    component.password = 'testpass';
    loginService.validate.and.returnValue(of('login successful!'));
    
    component.validate();
    
    expect(loginService.validate).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'testpass'
    });
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(component.message).toBe('login successful!');
  });



  it('should handle server error during login', () => {
    component.username = 'testuser';
    component.password = 'testpass';
    loginService.validate.and.returnValue(throwError(() => new Error('Server error')));
    
    component.validate();
    
    expect(component.message).toBe('Login failed due to server error');
  });

  it('should call getLogin method and update name', () => {
    const testName = 'John Doe';
    loginService.getLogin.and.returnValue(of(testName));
    component.name = 'test';
    
    component.getLogin();
    
    expect(loginService.getLogin).toHaveBeenCalledWith('test');
    expect(component.name).toBe(testName);
  });

  it('should display message in the UI', () => {
    component.message = 'Test message';
    fixture.detectChanges();
    
    const messageElement = fixture.nativeElement.querySelector('p') as HTMLParagraphElement;
    expect(messageElement.textContent).toContain('Test message');
  });

  it('should validate with empty credentials', () => {
    component.username = '';
    component.password = '';
    loginService.validate.and.returnValue(of('Please enter credentials'));
    
    component.validate();
    
    expect(loginService.validate).toHaveBeenCalledWith({
      username: '',
      password: ''
    });
  });
});
