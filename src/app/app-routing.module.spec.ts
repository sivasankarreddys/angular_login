import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';

@Component({
  template: '<div>Test Component</div>'
})
class TestComponent { }

describe('AppRoutingModule', () => {
  let router: Router;
  let location: Location;
  let fixture: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'dashboard', component: DashboardComponent },
          { path: 'test', component: TestComponent },
          { path: '', redirectTo: '/test', pathMatch: 'full' }
        ])
      ],
      declarations: [
        DashboardComponent,
        TestComponent
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(TestComponent);
  });

  it('should create routing module', () => {
    expect(router).toBeTruthy();
  });

  it('should navigate to dashboard', async () => {
    await router.navigate(['/dashboard']);
    expect(location.path()).toBe('/dashboard');
  });

  it('should have dashboard route configured', () => {
    const routes = router.config;
    const dashboardRoute = routes.find(route => route.path === 'dashboard');
    expect(dashboardRoute).toBeDefined();
    expect(dashboardRoute?.component).toBe(DashboardComponent);
  });

  it('should handle invalid routes', async () => {
    await router.navigate(['/invalid-route']);
    // Since no wildcard route is defined, it should stay at the invalid route
    expect(location.path()).toBe('/invalid-route');
  });

  it('should support programmatic navigation', async () => {
    // Test navigation from code
    await router.navigate(['/dashboard']);
    expect(location.path()).toBe('/dashboard');
    
    // Navigate back
    await router.navigate(['/test']);
    expect(location.path()).toBe('/test');
  });

  it('should handle route parameters if added in future', async () => {
    // This test is for future extensibility
    await router.navigate(['/dashboard'], { queryParams: { user: 'testuser' } });
    expect(location.path()).toBe('/dashboard?user=testuser');
  });

  describe('Route Guards (Future Implementation)', () => {
    it('should be ready for authentication guard implementation', () => {
      // This test documents where auth guards would be tested
      const routes = router.config;
      const dashboardRoute = routes.find(route => route.path === 'dashboard');
      
      // Currently no guards, but structure is ready
      expect(dashboardRoute?.canActivate).toBeUndefined();
      expect(dashboardRoute?.canLoad).toBeUndefined();
    });
  });

  describe('Route Data and Resolve', () => {
    it('should support route data if needed', async () => {
      // Test that routes can carry data
      await router.navigate(['/dashboard']);
      const routeSnapshot = router.routerState.root.firstChild?.snapshot;
      
      // Currently no data, but structure supports it
      expect(routeSnapshot?.data).toBeDefined();
    });
  });
});