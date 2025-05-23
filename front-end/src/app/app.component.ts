import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MaterialDModule } from './shared/material-d.module';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // ✅ Ajout
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MaterialDModule,
    CommonModule,
    RouterModule,
    FormsModule,
    HttpClientModule // ✅ Très important
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'siteweb-maison';
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

    if (!this.loginData.email || !this.loginData.password) {
      this.loginError = 'Tous les champs sont obligatoires.';
      return;
    }

    this.http.post('http://localhost:3000/api/login', this.loginData).subscribe({
      next: (res: any) => {
        console.log('✅ Connexion réussie :', res);
        this.closeLoginPopup();
      },
      error: (err) => {
        console.error('❌ Erreur connexion :', err);
        this.loginError = err.error?.message || 'Erreur serveur';
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
