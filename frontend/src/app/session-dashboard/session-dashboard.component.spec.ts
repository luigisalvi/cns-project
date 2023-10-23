import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionDashboardComponent } from './session-dashboard.component';

describe('SessionDashboardComponent', () => {
  let component: SessionDashboardComponent;
  let fixture: ComponentFixture<SessionDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SessionDashboardComponent]
    });
    fixture = TestBed.createComponent(SessionDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
