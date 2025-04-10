import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MaterialDModule } from './shared/material-d.module';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // ✅ Import FormsModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MaterialDModule, CommonModule, RouterModule, FormsModule], // ✅ Ajout de FormsModule ici
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // État pour contrôler la visibilité de la popup de connexion
  isLoginPopupVisible = false;

  // Titre de l'application
  title = 'siteweb-maison';

  // Modèle de données pour le formulaire de connexion
  loginData = {
    email: '',
    password: ''
  };

  // Messages d'erreur pour la validation de l'email et du mot de passe
  emailError: string | null = null;
  passwordError: string | null = null;

  constructor(public router: Router) {}

  // Naviguer vers la page d'inscription
  navigateToRegister(): void {
    this.router.navigate(['register']);
  }

  // Ouvrir la popup de connexion
  openLoginPopup(): void {
    this.isLoginPopupVisible = true;
  }

  // Fermer la popup de connexion
  closeLoginPopup(): void {
    this.isLoginPopupVisible = false;
  }

  // Méthode de débogage pour tester la navigation
  debugClick(): void {
    console.log('Lien vers la page d\'inscription cliqué');
  }

  // Gérer la soumission du formulaire de connexion
  onLoginSubmit(): void {
    if (!this.loginData.email || !this.loginData.password) {
      console.error('Formulaire invalide');
      return;
    }
    console.log('Connexion réussie avec:', this.loginData);
  }

  // Valider le champ email
  validateEmail(): void {
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    this.emailError = emailPattern.test(this.loginData.email)
      ? null
      : 'Veuillez entrer une adresse mail valide.';
  }

  // Valider le champ mot de passe
  validatePassword(): void {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    this.passwordError = passwordPattern.test(this.loginData.password)
      ? null
      : 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.';
  }
}
