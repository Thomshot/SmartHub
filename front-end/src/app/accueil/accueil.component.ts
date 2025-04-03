import { Component } from '@angular/core';
import { MaterialDModule } from '../shared/material-d.module';


@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [MaterialDModule],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.scss'
})
export class AccueilComponent {
  }
