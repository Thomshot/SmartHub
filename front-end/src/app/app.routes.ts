import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { RegisterComponent } from './auth/register/register.component';

// Définition des routes
export const routes: Routes = [
  { path: '', component: AppComponent }, // Page d'accueil
  { path: 'register', component: RegisterComponent }, // Page d'inscription
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}