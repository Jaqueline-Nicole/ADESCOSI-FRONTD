import { TestBed } from '@angular/core/testing';

import { TipoEgresoService } from './tipo-egreso.service';

describe('TipoEgresoService', () => {
  let service: TipoEgresoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoEgresoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
