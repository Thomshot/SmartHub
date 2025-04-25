
import { Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { PagePresentationComponent } from './page-presentation/page-presentation.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './auth/register/register.component';
import { ProfilLesAutresComponent } from './profil-les-autres/other-profil.component';
import { EditUserComponent } from './edit-user/edit-user.component';

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
  {
    path: 'verify',
    loadComponent: () => import('./emailverif/email-verification.component')
      .then(m => m.EmailVerificationComponent)
  },
  { path: 'profil-les-autres/:id', component: ProfilLesAutresComponent },
  { path: 'edit-user/:id', component: EditUserComponent}

];
