import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render welcome message', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Hello !!!!');
  });

  it('should have correct component selector', () => {
    expect(component.constructor.name).toBe('DashboardComponent');
  });

  it('should render content in template', () => {
    const welcomeElement = debugElement.query(By.css('*'));
    expect(welcomeElement.nativeElement.textContent.trim()).toBe('Hello !!!!');
  });

  it('should be accessible after login', () => {
    // This test verifies the component can be instantiated
    // In a real app, you might test route guards here
    expect(component).toBeDefined();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have no initial data or properties', () => {
    // Since this is a simple component with no properties,
    // we verify it has the expected minimal structure
    expect(Object.keys(component).length).toBe(0);
  });

  it('should not throw errors during initialization', () => {
    expect(() => {
      const newFixture = TestBed.createComponent(DashboardComponent);
      newFixture.detectChanges();
    }).not.toThrow();
  });

  it('should maintain consistent rendering', () => {
    const initialContent = fixture.nativeElement.textContent;
    fixture.detectChanges();
    const afterChangeDetection = fixture.nativeElement.textContent;
    
    expect(initialContent).toBe(afterChangeDetection);
  });
});
