import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSelfService4Component } from './dialog-self-service4.component';

describe('DialogSelfService4Component', () => {
  let component: DialogSelfService4Component;
  let fixture: ComponentFixture<DialogSelfService4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogSelfService4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSelfService4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
