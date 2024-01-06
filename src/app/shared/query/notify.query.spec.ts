import { TestBed } from '@angular/core/testing';

import { NotifyQuery } from './notify.query';

describe('NotifyService', () => {
  let service: NotifyQuery;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotifyQuery);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
