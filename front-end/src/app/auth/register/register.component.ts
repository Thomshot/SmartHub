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

  errorMessage: string = '';

  // Messages d'erreur pour les champs
  lastNameError: string | null = null;
  firstNameError: string | null = null;
  cityError: string | null = null;
  addressError: string | null = null;
  birthDateError: string | null = null;
  emailError: string | null = null;
  passwordError: string | null = null;
  confirmPasswordError: string | null = null;
  loginError: string | null = null;
  memberTypeError: string | null = null;
  photoError: string | null = null;
  genderError: string | null = null;


  // Date maximale pour la validation de la date de naissance
  maxBirthDate: string = new Date().toISOString().split('T')[0];

  user = {
    gender: '',
    otherGender: '',
    birthDate: '',
    lastName: '',
    firstName: '',
    city: '',
    address: '',
    email: '',
    password: '',
    confirmPassword: '',
    login: '',
    age: '',
    memberType: '',
    photo: ''
  };

  photoPreview: string | null = null;
  selectedPhotoFile: File | null = null;


  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    console.log('✅ RegisterComponent chargé');
    console.log('currentStep au chargement :', this.currentStep);
  }

  goToNextStep(): void {
    // Réinitialise les messages d'erreur
    this.errorMessage = '';
    this.lastNameError = this.user.lastName ? null : 'Le champ "Nom" est obligatoire.';
    this.firstNameError = this.user.firstName ? null : 'Le champ "Prénom" est obligatoire.';
    this.cityError = this.user.city ? null : 'Le champ "Ville" est obligatoire.';
    this.addressError = this.user.address ? null : 'Le champ "Adresse" est obligatoire.';
    this.memberTypeError = this.user.memberType ? null : 'Le champ "Type de membre" est obligatoire.';
    this.loginError = this.user.login ? null : 'Le champ "Pseudonyme" est obligatoire.';
    this.birthDateError = this.user.birthDate ? null : 'Le champ "Date de naissance" est obligatoire.';
    this.validateGender(); // Valide le champ "Sexe"
  
    // Vérifie si tous les champs sont valides
    if (
      !this.user.lastName ||
      !this.user.firstName ||
      !this.user.city ||
      !this.user.address ||
      !this.user.memberType ||
      !this.user.login ||
      !this.user.birthDate ||
      !this.user.gender
    ) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
      return; // Empêche le passage à l'étape suivante
    }
  
    // Passe à l'étape suivante si tout est valide
    this.currentStep = 2;
  }

  goToPreviousStep(): void {
    this.currentStep = 1;
  }

  goBack(): void {
    this.router.navigate(['/']); // Redirige vers la page d'accueil ou une autre page
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('photo') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoPreview = e.target.result;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  removePhoto(): void {
    this.photoPreview = null;
    this.selectedPhotoFile = null;
  
    // Réinitialise l'input file
    const fileInput = document.getElementById('photo') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onSubmit(): void {
    this.errorMessage = ''; // Reset erreur avant chaque tentative

    if (this.user.password !== this.user.confirmPassword) {
      this.errorMessage = "Les mots de passe ne correspondent pas.";
      return;
    }

    const formData = new FormData();
    for (const key in this.user) {
      formData.append(key, (this.user as any)[key]);
    }

    if (this.selectedPhotoFile) {
      formData.append('photo', this.selectedPhotoFile);
    }

    this.http.post('http://localhost:3000/api/register', formData).subscribe({
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

  validateGender(): void {
    this.genderError = this.user.gender
      ? null
      : 'Le champ "Sexe" est obligatoire.';
  }

  // Validation du champ nom
  validateLastName(): void {
    const namePattern = /^[a-zA-ZÀ-ÿ\s-]+$/;
    this.lastNameError = namePattern.test(this.user.lastName)
      ? null
      : 'Le nom ne doit contenir que des lettres.';
  }

  // Validation du champ prénom
  validateFirstName(): void {
    const namePattern = /^[a-zA-ZÀ-ÿ\s-]+$/;
    this.firstNameError = namePattern.test(this.user.firstName)
      ? null
      : 'Le prénom ne doit contenir que des lettres.';
  }

  // Validation du champ ville
  validateCity(): void {
    const cityPattern = /^[a-zA-ZÀ-ÿ\s-]+$/;
    this.cityError = cityPattern.test(this.user.city)
      ? null
      : 'La ville ne doit contenir que des lettres.';
  }

  // Validation du champ adresse
  validateAddress(): void {
    const addressPattern = /^[a-zA-ZÀ-ÿ0-9\s-]+$/;
    this.addressError = addressPattern.test(this.user.address)
      ? null
      : 'L\'adresse ne doit contenir que des lettres et des chiffres.';
  }

  // Validation du champ date de naissance
  validateBirthDate(): void {
    const birthDate = new Date(this.user.birthDate);
    const minDate = new Date('1900-01-01');
    const maxDate = new Date();

    this.birthDateError =
      birthDate >= minDate && birthDate <= maxDate
        ? null
        : 'La date de naissance doit être entre 1900 et aujourd\'hui.';
  }

  // Validation du champ email
  validateEmail(): void {
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    this.emailError = emailPattern.test(this.user.email)
      ? null
      : 'Veuillez entrer une adresse mail valide.';
  }

  // Validation du champ mot de passe
  validatePassword(): void {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    this.passwordError = passwordPattern.test(this.user.password)
      ? null
      : 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.';
  }

  // Validation du champ confirmation du mot de passe
  validateConfirmPassword(): void {
    this.confirmPasswordError =
      this.user.password === this.user.confirmPassword
        ? null
        : 'Les mots de passe ne correspondent pas.';
  }
}
