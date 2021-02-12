import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSelfService3Component } from './dialog-self-service3.component';

describe('DialogSelfService3Component', () => {
  let component: DialogSelfService3Component;
  let fixture: ComponentFixture<DialogSelfService3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogSelfService3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSelfService3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
