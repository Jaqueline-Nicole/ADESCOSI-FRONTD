import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoEgresosComponent } from './tipo-egresos.component';

describe('TipoEgresosComponent', () => {
  let component: TipoEgresosComponent;
  let fixture: ComponentFixture<TipoEgresosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TipoEgresosComponent]
    });
    fixture = TestBed.createComponent(TipoEgresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
