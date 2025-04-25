import { Component } from '@angular/core';
import { RouterOutlet, Router, RouterModule } from '@angular/router';
import { MaterialDModule } from '../shared/material-d.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-page-presentation',
  standalone: true,
  imports: [MaterialDModule, RouterModule, CommonModule, FormsModule, HttpClientModule],
  templateUrl: './page-presentation.component.html',
  styleUrls: ['./page-presentation.component.scss']
})
export class PagePresentationComponent {
  isLoginPopupVisible = false;

  loginData = {
    email: '',
    password: ''
  };

  emailError: string | null = null;
  passwordError: string | null = null;
  loginError: string | null = null;

  constructor(private http: HttpClient, public router: Router) {}

  navigateToRegister(): void {
    this.router.navigate(['register']);
  }

  openLoginPopup(): void {
    this.isLoginPopupVisible = true;
    this.loginError = null;
  }

  closeLoginPopup(): void {
    this.isLoginPopupVisible = false;
  }

  debugClick(): void {
    console.log('Lien vers la page d\'inscription cliqué');
  }

  onLoginSubmit(): void {
    this.loginError = null;

    this.validateEmail();
    this.validatePassword();

    if (!this.loginData.email || !this.loginData.password) {
      this.loginError = 'Tous les champs sont obligatoires.';
      return;
    }

    const { email, password } = this.loginData;

    this.http.post('http://localhost:3000/api/login', { email, password }).subscribe({
      next: (res: any) => {
        console.log('✅ Connexion réussie', res);
        localStorage.setItem('token', res.token);
        localStorage.setItem('userId', res.user.id);
        this.router.navigate(['/accueil']);
        this.closeLoginPopup();
      },
      error: (err) => {
        console.error('❌ Erreur de connexion', err);
        this.loginError = err.error?.message || 'Erreur lors de la connexion';
      }
    });
  }

  validateEmail(): void {
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    this.emailError = emailPattern.test(this.loginData.email)
      ? null
      : 'Veuillez entrer une adresse mail valide.';
  }

  validatePassword(): void {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    this.passwordError = passwordPattern.test(this.loginData.password)
      ? null
      : 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.';
  }
}
