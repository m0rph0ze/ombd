import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { OmbdService } from 'src/app/services/ombd.service';
import { Router } from '@angular/router';
import { SearchComponent } from './search.component';
import { SearchQuery } from 'src/app/models/search-query';
import { Movie } from 'src/app/models';

const mockOmbdService = {
  getMovies: (_searchQuery: SearchQuery, _pagination: number) =>
    of({
      imdbID: '123',
    }),
  searchQueryCache: {
    title: 'Harry Potter',
    year: '2005',
    type: 'movie',
  },
  pagination: 5,
};
const routerMock = {
  navigate: (_args: string[]) => null,
};

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SearchComponent],
      providers: [
        {
          provide: OmbdService,
          useValue: mockOmbdService,
        },
        {
          provide: Router,
          useValue: routerMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('onInit', () => {
    it('should setup subscriptions', waitForAsync(() => {
      component.ngOnInit();
      expect(component.searchResponse$).toBeDefined();
      expect(component.pagination.value).toBe(5);
      expect(component.searchForm.controls['title'].value).toBe('Harry Potter');
    }));
  });

  describe('handleMovieSelection', () => {
    it('should navigate to provided id', () => {
      spyOn(routerMock, 'navigate').and.callThrough();
      component.handleMovieSelection({ imdbID: '123' } as Movie);
      expect(routerMock.navigate).toHaveBeenCalledWith(['123']);
    });
  });

  describe('handleBackward', () => {
    it('should decrease pagination', () => {
      component.handleBackward();
      expect(component.pagination.value).toBe(4);
    });
  });

  describe('handleForward', () => {
    it('should increase pagination', () => {
      component.handleForward();
      expect(component.pagination.value).toBe(6);
    });
  });
});
