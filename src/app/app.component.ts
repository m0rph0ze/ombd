import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { OmbdService } from './services/ombd.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  isLoading$: Observable<boolean>;

  constructor(private ombdService: OmbdService) {}

  ngOnInit(): void {
    this.isLoading$ = this.ombdService.getIsLoading();
  }
}
