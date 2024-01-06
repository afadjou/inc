import { TestBed } from '@angular/core/testing';

import { UserQuery } from './user.query';

describe('UserQuery', () => {
  let service: UserQuery;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserQuery);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
