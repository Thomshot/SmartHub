import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MaterialDModule } from './shared/material-d.module';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MaterialDModule, CommonModule, RouterModule], // Ajouter CommonModule ici
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isLoginPopupVisible = false;
  title = 'siteweb-maison';

  constructor(public router: Router) {}

  navigateToRegister(): void {
    this.router.navigate(['register']);
  }

  openLoginPopup(): void {
    this.isLoginPopupVisible = true; // Affiche la popup de connexion
  }

  closeLoginPopup(): void {
    this.isLoginPopupVisible = false; // Ferme la popup de connexion
  }

  debugClick(): void {
    console.log('Lien vers la page d\'inscription cliqué');
  }
}
