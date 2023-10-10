import { TestBed } from '@angular/core/testing';

import { DbQueryService } from './db.query.service';

describe('DbQueryService', () => {
  let service: DbQueryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbQueryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
