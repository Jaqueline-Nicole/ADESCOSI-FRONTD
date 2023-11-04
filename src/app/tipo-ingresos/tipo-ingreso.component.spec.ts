import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoIngresoComponent } from './tipo-ingreso.component';

describe('TipoIngresoComponent', () => {
  let component: TipoIngresoComponent;
  let fixture: ComponentFixture<TipoIngresoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TipoIngresoComponent]
    });
    fixture = TestBed.createComponent(TipoIngresoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
