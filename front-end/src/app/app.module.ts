import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { MaterialDModule } from './shared/material-d.module';
import { HomeComponent } from './home/home.component';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AccueilComponent } from './accueil/accueil.component';
@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    MaterialDModule,
    HttpClientModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
