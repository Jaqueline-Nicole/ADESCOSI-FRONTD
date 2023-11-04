import { TestBed } from '@angular/core/testing';

import { ActividadPrincipalService } from './actividad-principal.service';

describe('ActividadPrincipalService', () => {
  let service: ActividadPrincipalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActividadPrincipalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
