import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadSecundariasComponent } from './actividad-secundarias.component';

describe('ActividadSecundariasComponent', () => {
  let component: ActividadSecundariasComponent;
  let fixture: ComponentFixture<ActividadSecundariasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActividadSecundariasComponent]
    });
    fixture = TestBed.createComponent(ActividadSecundariasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
