import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadPrincipalesComponent } from './actividad-principales.component';

describe('ActividadPrincipalesComponent', () => {
  let component: ActividadPrincipalesComponent;
  let fixture: ComponentFixture<ActividadPrincipalesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActividadPrincipalesComponent]
    });
    fixture = TestBed.createComponent(ActividadPrincipalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
