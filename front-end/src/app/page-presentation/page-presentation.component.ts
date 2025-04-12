import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MaterialDModule } from '../shared/material-d.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-presentation',
  standalone: true,
  imports: [MaterialDModule,RouterModule,CommonModule],
  templateUrl: './page-presentation.component.html',
  styleUrl: './page-presentation.component.scss'
})
export class PagePresentationComponent {
  isLoginPopupVisible = false;
 

  constructor(public router: Router) {}

  navigateToRegister(): void {
    this.router.navigate(['/register']);
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