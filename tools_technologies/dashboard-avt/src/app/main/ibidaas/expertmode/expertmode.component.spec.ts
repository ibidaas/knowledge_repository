import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertmodeComponent } from './expertmode.component';

describe('ExpertmodeComponent', () => {
  let component: ExpertmodeComponent;
  let fixture: ComponentFixture<ExpertmodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpertmodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpertmodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
