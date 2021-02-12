import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSelfService2Component } from './dialog-self-service2.component';

describe('DialogSelfService2Component', () => {
  let component: DialogSelfService2Component;
  let fixture: ComponentFixture<DialogSelfService2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogSelfService2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSelfService2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
