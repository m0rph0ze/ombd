import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/search/search.component').then(
        (mod) => mod.SearchComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./components/details/details.component').then(
        (mod) => mod.DetailsComponent
      ),
  },
  {
    path: '*',
    redirectTo: '',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
