import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule], // Ajout de CommonModule et FormsModule
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  currentStep = 1; // Étape actuelle du formulaire
  user = {
    lastName: '',
    firstName: '',
    email: '',
    password: ''
  };

  goToNextStep(): void {
    this.currentStep = 2;
  }

  onSubmit(): void {
    console.log('Formulaire soumis', this.user);
  }
}