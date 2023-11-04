import { TestBed } from '@angular/core/testing';

import { FiestaPatronalService } from './fiesta-patronal.service';

describe('FiestaPatronalService', () => {
  let service: FiestaPatronalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FiestaPatronalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
