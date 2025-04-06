import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { MaterialDModule } from './shared/material-d.module';
import { AppRoutingModule } from './app.routes'; // Import du module de routage

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MaterialDModule,
    HttpClientModule,
    AppRoutingModule // Ajout du module de routage
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}