import { TestBed } from '@angular/core/testing';

import { ViewSdkService } from './view.sdk.service';

describe('ViewSdkService', () => {
  let service: ViewSdkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewSdkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
