import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamDashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: StreamDashboardComponent;
  let fixture: ComponentFixture<StreamDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StreamDashboardComponent]
    });
    fixture = TestBed.createComponent(StreamDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
