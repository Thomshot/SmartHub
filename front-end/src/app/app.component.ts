import { Component } from '@angular/core';
import { AccueilComponent } from './accueil/accueil.component';
import { RouterOutlet } from '@angular/router';
import { MaterialDModule } from './shared/material-d.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AccueilComponent, RouterOutlet, MaterialDModule, CommonModule], // Ajouter CommonModule ici
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'] // Corrigé : styleUrls au lieu de styleUrl
})
export class AppComponent {
  title = 'siteweb-maison';
  isLoginPopupVisible: boolean = false;

  openLoginPopup(): void {
    console.log('Bouton Connexion cliqué');
    this.isLoginPopupVisible = true;
  }

  closeLoginPopup(): void {
    this.isLoginPopupVisible = false;
  }
}