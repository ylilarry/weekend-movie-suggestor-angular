import { TestBed } from '@angular/core/testing';

import { MovieCarouselService } from './movie-carousel.service';

describe('MovieCarouselService', () => {
  let service: MovieCarouselService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovieCarouselService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
