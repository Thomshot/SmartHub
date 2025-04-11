import { Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { PagePresentationComponent } from './page-presentation/page-presentation.component';

export const routes: Routes = [
  { path: '', component: PagePresentationComponent },
  { path: 'accueil', component: AccueilComponent }
];
