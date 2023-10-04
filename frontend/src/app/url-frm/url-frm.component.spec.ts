import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlFrmComponent } from './url-frm.component';

describe('UrlFrmComponent', () => {
  let component: UrlFrmComponent;
  let fixture: ComponentFixture<UrlFrmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UrlFrmComponent]
    });
    fixture = TestBed.createComponent(UrlFrmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
