import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfservicemodeComponent } from './selfservicemode.component';

describe('SelfservicemodeComponent', () => {
  let component: SelfservicemodeComponent;
  let fixture: ComponentFixture<SelfservicemodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelfservicemodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfservicemodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
