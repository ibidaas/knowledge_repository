import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSelfServiceComponent } from './dialog-self-service.component';

describe('DialogSelfServiceComponent', () => {
  let component: DialogSelfServiceComponent;
  let fixture: ComponentFixture<DialogSelfServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogSelfServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSelfServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
