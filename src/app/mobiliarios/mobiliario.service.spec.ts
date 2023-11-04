import { TestBed } from '@angular/core/testing';

import { MobiliarioService } from './mobiliario.service';

describe('MobiliarioService', () => {
  let service: MobiliarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MobiliarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
