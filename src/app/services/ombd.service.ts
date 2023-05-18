import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, finalize, tap } from 'rxjs';
import { LatestDisplayed, MovieDetails, SearchResponse } from '../models';
import { SearchQuery } from '../models/search-query';

@Injectable({
  providedIn: 'root',
})
export class OmbdService {
  readonly path: string = 'http://www.omdbapi.com/?apikey=c0dcbc4d';
  private loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  private latestDisplayed: BehaviorSubject<LatestDisplayed> =
    new BehaviorSubject<LatestDisplayed>([]);
  searchQueryCache: SearchQuery = {
    title: '',
    year: '',
    type: '',
  };
  pagination: number = 1;

  constructor(private httpClient: HttpClient) {}

  getIsLoading(): Observable<boolean> {
    return this.loading;
  }

  getLatestDisplayed(): Observable<LatestDisplayed> {
    return this.latestDisplayed;
  }

  getMovies(
    searchQuery: SearchQuery,
    pagination: number
  ): Observable<SearchResponse> {
    this.searchQueryCache = searchQuery;
    this.pagination = pagination;
    this.loading.next(true);
    return this.httpClient
      .get<SearchResponse>(
        `${this.path}&s=${searchQuery.title}&y=${searchQuery.year}&type=${searchQuery.type}&page=${pagination}`
      )
      .pipe(
        catchError((error: Error) => {
          throw error;
        }),
        finalize(() => {
          this.loading.next(false);
        })
      );
  }

  getMovie(id: string): Observable<MovieDetails> {
    this.loading.next(true);
    return this.httpClient.get<MovieDetails>(`${this.path}&i=${id}`).pipe(
      tap((movieDetails: MovieDetails) => {
        this.latestDisplayed.next([
          ...this.latestDisplayed.value.filter(
            (latestMovie: Pick<MovieDetails, 'imdbID'>) =>
              latestMovie.imdbID !== movieDetails.imdbID
          ),
          {
            Title: movieDetails.Title,
            imdbID: movieDetails.imdbID,
            Poster: movieDetails.Poster,
          },
        ]);
      }),
      catchError((error: Error) => {
        throw error;
      }),
      finalize(() => {
        this.loading.next(false);
      })
    );
  }
}
