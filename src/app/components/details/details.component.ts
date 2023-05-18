import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, catchError, map, switchMap } from 'rxjs';
import { LatestDisplayed, MovieDetails } from 'src/app/models';
import { OmbdService } from 'src/app/services/ombd.service';

@Component({
  standalone: true,
  selector: 'details-component',
  imports: [CommonModule],
  templateUrl: `./details.component.html`,
  styleUrls: ['./details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsComponent implements OnInit {
  movieDetails$: Observable<MovieDetails>;
  latestDisplayed$: Observable<LatestDisplayed>;

  constructor(
    private ombdService: OmbdService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.movieDetails$ = this.activatedRoute.params.pipe(
      switchMap((routeParams: Params) =>
        this.ombdService.getMovie(routeParams['id'])
      )
    );

    this.latestDisplayed$ = this.ombdService
      .getLatestDisplayed()
      .pipe(
        map((latestDisplayed: LatestDisplayed) =>
          latestDisplayed.filter(
            (movie: Pick<MovieDetails, 'imdbID'>) =>
              movie.imdbID !== this.activatedRoute.snapshot.params['id']
          )
        )
      );
  }

  handleLastestDisplayedSelection(
    latestMovie: Pick<MovieDetails, 'imdbID'>
  ): void {
    this.router.navigate(['/', latestMovie.imdbID]);
  }

  handleBack(): void {
    this.router.navigate(['/']);
  }
}
