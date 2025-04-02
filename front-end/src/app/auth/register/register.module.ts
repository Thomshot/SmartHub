import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RegisterModule } from './auth/register/register.module'; // Assurez-vous que le chemin est correct ici.

@NgModule({
  declarations: [
    AppComponent,
    // autres composants
  ],
  imports: [
    BrowserModule,
    RegisterModule // Ajouter le RegisterModule ici
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
