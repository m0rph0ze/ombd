import { TestBed, waitForAsync } from '@angular/core/testing';
import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';
import { OmbdService } from 'src/app/services/ombd.service';
import { LatestDisplayed, MovieDetails, SearchResponse } from 'src/app/models';
import { HttpErrorResponse } from '@angular/common/http';

describe('OmbdService', () => {
  let service: OmbdService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OmbdService],
    });

    service = TestBed.inject(OmbdService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  describe('getIsLoading', () => {
    it('should return isLoading', (done) => {
      service.getIsLoading().subscribe((isLoading: boolean) => {
        expect(isLoading).toBeFalse();
        done();
      });
    });
  });

  describe('latestDisplayed', () => {
    it('should return latestDisplayed', (done) => {
      service.getLatestDisplayed().subscribe((latest: LatestDisplayed) => {
        expect(latest).toEqual([]);
        done();
      });
    });
  });

  describe('latestDisplayed', () => {
    it('should return latestDisplayed', () => {
      const responseMock: SearchResponse = {
        Search: [],
        totalResults: '5',
        Response: 'true',
      };
      service
        .getMovies(service.searchQueryCache, service.pagination)
        .subscribe((movies: SearchResponse) => {
          expect(movies).toEqual(responseMock);
        });
      const req = httpTestingController.expectOne({
        method: 'GET',
        url: `${service.path}&s=${service.searchQueryCache.title}&y=${service.searchQueryCache.year}&type=${service.searchQueryCache.type}&page=${service.pagination}`,
      });
      req.flush(responseMock);
    });
    it('should catch error', () => {
      const responseMock: SearchResponse = {
        Search: [],
        totalResults: '5',
        Response: 'true',
      };
      service
        .getMovies(service.searchQueryCache, service.pagination)
        .subscribe({
          next: () => {},
          error: (error: HttpErrorResponse) => {
            expect(error.status).toBe(404);
          },
        });
      const req = httpTestingController.expectOne({
        method: 'GET',
        url: `${service.path}&s=${service.searchQueryCache.title}&y=${service.searchQueryCache.year}&type=${service.searchQueryCache.type}&page=${service.pagination}`,
      });
      req.flush('404 error', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getMovie', () => {
    it('should return movie', () => {
      service['latestDisplayed'].next([
        { imdbID: '11', Poster: '', Title: '' },
      ]);
      const responseMock: MovieDetails = {
        imdbID: '123',
      } as MovieDetails;
      service.getMovie('123').subscribe((movies: MovieDetails) => {
        expect(movies).toEqual(responseMock);
      });
      const req = httpTestingController.expectOne({
        method: 'GET',
        url: `${service.path}&i=${responseMock.imdbID}`,
      });
      req.flush(responseMock);
    });
    it('should catch error', () => {
      service['latestDisplayed'].next([
        { imdbID: '11', Poster: '', Title: '' },
      ]);
      const responseMock: MovieDetails = {
        imdbID: '123',
      } as MovieDetails;
      service.getMovie('123').subscribe({
        next: () => {},
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(404);
        },
      });
      const req = httpTestingController.expectOne({
        method: 'GET',
        url: `${service.path}&i=${responseMock.imdbID}`,
      });
      req.flush('404 error', { status: 404, statusText: 'Not Found' });
    });
  });
});
