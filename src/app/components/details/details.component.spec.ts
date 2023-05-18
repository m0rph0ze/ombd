import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { DetailsComponent } from './details.component';
import { OmbdService } from 'src/app/services/ombd.service';
import { ActivatedRoute, Router } from '@angular/router';

const mockOmbdService = {
  getMovie: () =>
    of({
      imdbID: '123',
    }),
  getLatestDisplayed: () =>
    of([
      {
        imdbID: '132',
      },
    ]),
};
const activatedRouteMock = {
  params: of({ id: '123' }),
  snapshop: {
    params: {
      id: '123',
    },
  },
};
const routerMock = {
  navigate: (_args: string[]) => null,
};

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DetailsComponent],
      providers: [
        {
          provide: OmbdService,
          useValue: mockOmbdService,
        },
        {
          provide: ActivatedRoute,
          useValue: activatedRouteMock,
        },
        {
          provide: Router,
          useValue: routerMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('onInit', () => {
    it('should setup subscriptions', () => {
      component.ngOnInit();
      expect(component.movieDetails$).toBeDefined();
      expect(component.latestDisplayed$).toBeDefined();
    });
  });

  describe('handleLastestDisplayedSelection', () => {
    it('should navigate to provided id', () => {
      spyOn(routerMock, 'navigate').and.callThrough();
      component.handleLastestDisplayedSelection({ imdbID: '123' });
      expect(routerMock.navigate).toHaveBeenCalledWith(['/', '123']);
    });
  });

  describe('handleBack', () => {
    it('should snavigate to home', () => {
      spyOn(routerMock, 'navigate').and.callThrough();
      component.handleBack();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});
