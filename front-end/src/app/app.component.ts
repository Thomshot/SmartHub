import { Component } from '@angular/core';
import { AccueilComponent } from './accueil/accueil.component';
import { RouterOutlet } from '@angular/router';
import { MaterialDModule } from './shared/material-d.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AccueilComponent,RouterOutlet,MaterialDModule ], 
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'siteweb-maison';
}