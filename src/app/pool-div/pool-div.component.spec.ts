import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoolDivComponent } from './pool-div.component';

describe('PoolDivComponent', () => {
  let component: PoolDivComponent;
  let fixture: ComponentFixture<PoolDivComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PoolDivComponent]
    });
    fixture = TestBed.createComponent(PoolDivComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
