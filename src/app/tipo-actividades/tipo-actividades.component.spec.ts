import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoActividadesComponent } from './tipo-actividades.component';

describe('TipoActividadesComponent', () => {
  let component: TipoActividadesComponent;
  let fixture: ComponentFixture<TipoActividadesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TipoActividadesComponent]
    });
    fixture = TestBed.createComponent(TipoActividadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
