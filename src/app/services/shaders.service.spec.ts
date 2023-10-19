import { TestBed } from '@angular/core/testing';

import { ShadersService } from './shaders.service';

describe('ShadersService', () => {
  let service: ShadersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShadersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
