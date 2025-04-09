import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  currentStep = 1;

  // ✅ Pour afficher le message d’erreur sous le formulaire
  errorMessage: string = '';

  user = {
    gender: '',
    otherGender: '',
    birthDate: '',
    lastName: '',
    firstName: '',
    city: '',
    street: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    console.log('✅ RegisterComponent chargé');
    console.log('currentStep au chargement :', this.currentStep);
  }

  goToNextStep(): void {
    this.currentStep = 2;
  }

  goToPreviousStep(): void {
    this.currentStep = 1;
  }

  onSubmit(): void {
    this.errorMessage = ''; // Reset erreur avant chaque tentative

    if (this.user.password !== this.user.confirmPassword) {
      this.errorMessage = "Les mots de passe ne correspondent pas.";
      return;
    }

    this.http.post('http://localhost:3000/api/register', this.user).subscribe({
      next: (res: any) => {
        console.log('✅ Succès:', res);
        this.currentStep = 3;
      },
      error: (err) => {
        console.error('❌ Erreur:', err);
        this.errorMessage = err.error?.message || 'Erreur serveur.';
      }
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/']).then(() => {
      const appComponent = document.querySelector('app-root') as any;
      if (appComponent && appComponent.openLoginPopup) {
        appComponent.openLoginPopup();
      }
    });
  }

  formatDate(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
    if (value.length > 5) value = value.slice(0, 5) + '/' + value.slice(5);
    input.value = value;
    this.user.birthDate = value;
  }
}
