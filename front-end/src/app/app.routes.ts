
import { Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { PagePresentationComponent } from './page-presentation/page-presentation.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './auth/register/register.component';

export const routes: Routes = [
  {
    path: '',
    component: PagePresentationComponent,
    children: [
      { path: '', component: HomeComponent }, // 👈 ça charge Home automatiquement dans le <router-outlet> de PagePresentation
    ]
  },
  { path: 'accueil', component: AccueilComponent },
  { path: 'register', component: RegisterComponent },
];
