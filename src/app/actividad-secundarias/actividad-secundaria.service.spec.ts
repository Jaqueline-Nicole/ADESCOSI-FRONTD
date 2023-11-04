import { TestBed } from '@angular/core/testing';

import { ActividadSecundariaService } from './actividad-secundaria.service';

describe('ActividadSecundariaService', () => {
  let service: ActividadSecundariaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActividadSecundariaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
