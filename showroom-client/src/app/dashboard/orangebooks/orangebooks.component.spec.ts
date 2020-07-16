import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrangebooksComponent } from './orangebooks.component';

describe('OrangebooksComponent', () => {
  let component: OrangebooksComponent;
  let fixture: ComponentFixture<OrangebooksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrangebooksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrangebooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
