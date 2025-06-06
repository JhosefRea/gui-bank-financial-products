import { TestBed } from '@angular/core/testing';

import { FetchApiProductsService } from './fetch-api-products.service';

describe('FetchApiProductsService', () => {
  let service: FetchApiProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchApiProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
