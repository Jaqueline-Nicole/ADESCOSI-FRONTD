import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiestaPatronalesComponent } from './fiesta-patronales.component';

describe('FiestaPatronalesComponent', () => {
  let component: FiestaPatronalesComponent;
  let fixture: ComponentFixture<FiestaPatronalesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FiestaPatronalesComponent]
    });
    fixture = TestBed.createComponent(FiestaPatronalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
