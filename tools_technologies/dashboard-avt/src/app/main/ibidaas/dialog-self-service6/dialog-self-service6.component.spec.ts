import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSelfService6Component } from './dialog-self-service6.component';

describe('DialogSelfService6Component', () => {
  let component: DialogSelfService6Component;
  let fixture: ComponentFixture<DialogSelfService6Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogSelfService6Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSelfService6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
