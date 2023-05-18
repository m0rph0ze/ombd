import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { OmbdService } from '../../services/ombd.service';
import { CommonModule } from '@angular/common';
import {
  Observable,
  catchError,
  combineLatest,
  debounceTime,
  filter,
  of,
  startWith,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { Movie, SearchResponse } from 'src/app/models';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SearchQuery } from 'src/app/models/search-query';

interface SearchForm
  extends Partial<{
    title: string | null;
    year: string | null;
    type: string | null;
  }> {}

@Component({
  standalone: true,
  selector: 'search-component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: `./search.component.html`,
  styleUrls: ['search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
  searchResponse$: Observable<SearchResponse>;
  searchForm: FormGroup = new FormGroup({
    title: new FormControl(''),
    year: new FormControl(''),
    type: new FormControl(''),
  });
  pagination: FormControl = new FormControl(1);

  constructor(private ombdService: OmbdService, private router: Router) {}

  ngOnInit(): void {
    this.searchForm.setValue({
      title: this.ombdService.searchQueryCache.title,
      year: this.ombdService.searchQueryCache.year,
      type: this.ombdService.searchQueryCache.type,
    });
    this.pagination.setValue(this.ombdService.pagination);

    this.searchResponse$ = combineLatest([
      this.searchForm.valueChanges.pipe(
        startWith(this.ombdService.searchQueryCache)
      ),
      this.pagination.valueChanges.pipe(startWith(this.ombdService.pagination)),
    ]).pipe(
      debounceTime(500),
      filter(
        ([formValue, _pagination]: [SearchForm, number]) => !!formValue.title
      ),
      switchMap(([formValue, pagination]: [SearchForm, number]) =>
        this.ombdService.getMovies(formValue as SearchQuery, pagination)
      )
    );
  }

  handleMovieSelection(movie: Movie): void {
    this.router.navigate([movie.imdbID]);
  }

  handleForward(): void {
    this.pagination.setValue(this.pagination.value + 1);
  }

  handleBackward(): void {
    this.pagination.setValue(this.pagination.value - 1);
  }
}
