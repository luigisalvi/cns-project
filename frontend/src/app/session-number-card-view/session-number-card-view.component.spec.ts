import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionNumberCardViewComponent } from './session-number-card-view.component';

describe('SessionNumberCardViewComponent', () => {
  let component: SessionNumberCardViewComponent;
  let fixture: ComponentFixture<SessionNumberCardViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SessionNumberCardViewComponent]
    });
    fixture = TestBed.createComponent(SessionNumberCardViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
