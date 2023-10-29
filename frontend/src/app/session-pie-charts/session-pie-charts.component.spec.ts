import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionPieChartsComponent } from './session-pie-charts.component';

describe('SessionPieChartsComponent', () => {
  let component: SessionPieChartsComponent;
  let fixture: ComponentFixture<SessionPieChartsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SessionPieChartsComponent]
    });
    fixture = TestBed.createComponent(SessionPieChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
