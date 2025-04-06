import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  currentStep = 1;
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

  constructor(private router: Router) {}

  goToNextStep(): void {
    this.currentStep = 2;
  }

  goToPreviousStep(): void {
    this.currentStep = 1;
  }

  onSubmit(): void {
    console.log('Formulaire soumis', this.user);
    this.currentStep = 3; // Passe à l'étape 3 pour afficher le message de confirmation
  }

  navigateToLogin(): void {
    this.router.navigate(['/']).then(() => {
      // Accède à l'instance de AppComponent pour ouvrir la popup
      const appComponent = document.querySelector('app-root') as any;
      if (appComponent && appComponent.openLoginPopup) {
        appComponent.openLoginPopup(); // Appelle la méthode pour ouvrir la popup
      }
    });
  }

  formatDate(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Supprime tous les caractères non numériques
    if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
    if (value.length > 5) value = value.slice(0, 5) + '/' + value.slice(5);
    input.value = value;
    this.user.birthDate = value; // Met à jour la valeur dans l'objet user
  }
}