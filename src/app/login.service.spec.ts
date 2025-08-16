import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoginService } from './login.service';

describe('LoginService', () => {
  let service: LoginService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoginService]
    });
    service = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getLogin', () => {
    it('should fetch login name successfully', () => {
      const mockName = 'John Doe';
      const testName = 'testuser';

      service.getLogin(testName).subscribe(name => {
        expect(name).toBe(mockName);
      });

      const req = httpMock.expectOne(`http://localhost:8080/login/name?name=${testName}`);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('name')).toBe(testName);
      req.flush(mockName);
    });

    it('should handle empty name parameter', () => {
      const mockName = 'Guest';
      const emptyName = '';

      service.getLogin(emptyName).subscribe(name => {
        expect(name).toBe(mockName);
      });

      const req = httpMock.expectOne(`http://localhost:8080/login/name?name=${emptyName}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockName);
    });

    it('should handle HTTP error for getLogin', () => {
      const testName = 'testuser';
      const errorMessage = 'Server error';

      service.getLogin(testName).subscribe({
        next: () => fail('Expected error'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`http://localhost:8080/login/name?name=${testName}`);
      req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('validate', () => {
    it('should validate credentials successfully', () => {
      const credentials = { username: 'testuser', password: 'testpass' };
      const mockResponse = 'login successful!';

      service.validate(credentials).subscribe(response => {
        expect(response).toBe(mockResponse);
      });

      const req = httpMock.expectOne('http://localhost:8080/login/validate');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(credentials);
      expect(req.request.headers.get('Content-Type')).toBeNull(); // Angular sets this automatically
      req.flush(mockResponse);
    });

    it('should handle invalid credentials', () => {
      const credentials = { username: 'wronguser', password: 'wrongpass' };
      const mockResponse = 'Invalid credentials';

      service.validate(credentials).subscribe(response => {
        expect(response).toBe(mockResponse);
      });

      const req = httpMock.expectOne('http://localhost:8080/login/validate');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(credentials);
      req.flush(mockResponse);
    });

    it('should handle empty credentials', () => {
      const credentials = { username: '', password: '' };
      const mockResponse = 'Please enter credentials';

      service.validate(credentials).subscribe(response => {
        expect(response).toBe(mockResponse);
      });

      const req = httpMock.expectOne('http://localhost:8080/login/validate');
      expect(req.request.body).toEqual(credentials);
      req.flush(mockResponse);
    });

    it('should handle HTTP error for validate', () => {
      const credentials = { username: 'testuser', password: 'testpass' };

      service.validate(credentials).subscribe({
        next: () => fail('Expected error'),
        error: (error) => {
          expect(error.status).toBe(401);
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/login/validate');
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    });

    it('should handle server error (500)', () => {
      const credentials = { username: 'testuser', password: 'testpass' };

      service.validate(credentials).subscribe({
        next: () => fail('Expected error'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/login/validate');
      req.flush('Internal Server Error', { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle network error', () => {
      const credentials = { username: 'testuser', password: 'testpass' };

      service.validate(credentials).subscribe({
        next: () => fail('Expected error'),
        error: (error) => {
          expect(error.status).toBe(0);
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/login/validate');
      req.error(new ErrorEvent('Network error'));
    });
  });

  describe('Service Configuration', () => {
    it('should have correct API URL', () => {
      expect(service['url']).toBe('http://localhost:8080/login/validate');
    });

    it('should be provided in root', () => {
      expect(service).toBeTruthy();
    });
  });
});
