import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MaterialDModule } from './shared/material-d.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MaterialDModule, CommonModule, RouterModule], // Ajouter CommonModule ici
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
}