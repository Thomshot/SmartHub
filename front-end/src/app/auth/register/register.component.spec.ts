import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  currentStep: number = 1;  // Définir l'étape initiale
  user = {
    lastName: '',
    firstName: '',
    email: '',
    password: ''
  };

  // Passer à l'étape suivante
  goToNextStep() {
    if (this.currentStep < 2) {
      this.currentStep++;
    }
  }

  // Gérer la soumission du formulaire
  onSubmit() {
    if (this.currentStep === 2) {
      // Logique de soumission (envoi des données à un service ou une API)
      console.log('Utilisateur inscrit:', this.user);
      // Réinitialiser ou rediriger selon les besoins
    }
  }
}
