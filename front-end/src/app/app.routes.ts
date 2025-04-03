import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { RegisterComponent } from './auth/register/register.component';

// Définition des routes
export const routes: Routes = [
  { path: '', component: AccueilComponent }, // Page d'accueil
  { path: 'register', component: RegisterComponent }, // Page d'inscription
];

// Module de routage
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}