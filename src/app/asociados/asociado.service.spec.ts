import { TestBed } from '@angular/core/testing';

import { AsociadoService } from './asociado.service';

describe('AsociadoService', () => {
  let service: AsociadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AsociadoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
