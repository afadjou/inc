import { TestBed } from '@angular/core/testing';

import { PictogramService } from './pictogram.service';

describe('PictogramService', () => {
  let service: PictogramService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PictogramService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
