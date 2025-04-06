import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { MaterialDModule } from './shared/material-d.module';
import { AccueilComponent } from './accueil/accueil.component';
import { RegisterComponent } from './auth/register/register.component'; // Import du composant Register
import { AppRoutingModule } from './app.routes';


@NgModule({
  declarations: [
    AppComponent,
    AccueilComponent,
    RegisterComponent, // Ajout de RegisterComponent ici
  ],
  imports: [
    BrowserModule,
    MaterialDModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}