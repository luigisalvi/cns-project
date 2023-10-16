import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberCardViewComponent } from './number-card-view.component';

describe('NumberCardViewComponent', () => {
  let component: NumberCardViewComponent;
  let fixture: ComponentFixture<NumberCardViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NumberCardViewComponent]
    });
    fixture = TestBed.createComponent(NumberCardViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
