import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { MaterialDModule } from './shared/material-d.module';
import { AccueilComponent } from './accueil/accueil.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MaterialDModule,
    AccueilComponent,
    HttpClientModule // Ajout du module HTTP pour communiquer avec l’API PHP
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
