import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidatorFn, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { MaterialDModule } from '../shared/material-d.module';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';

// ----------- Validators -----------
function nameValidator(control: AbstractControl): ValidationErrors | null {
  const pattern = /^[a-zA-ZÀ-ÿ\s-]+$/;
  if (control.value && !pattern.test(control.value)) {
    return { nameInvalid: true };
  }
  return null;
}
function cityValidator(control: AbstractControl): ValidationErrors | null {
  const pattern = /^[a-zA-ZÀ-ÿ\s-]+$/;
  if (control.value && !pattern.test(control.value)) {
    return { cityInvalid: true };
  }
  return null;
}
function addressValidator(control: AbstractControl): ValidationErrors | null {
  const pattern = /^[a-zA-ZÀ-ÿ0-9\s-]+$/;
  if (control.value && !pattern.test(control.value)) {
    return { addressInvalid: true };
  }
  return null;
}
function birthDateValidator(control: AbstractControl): ValidationErrors | null {
  if (control.value) {
    const birthDate = new Date(control.value);
    const minDate = new Date('1900-01-01');
    const maxDate = new Date();
    if (birthDate < minDate || birthDate > maxDate) {
      return { birthDateInvalid: true };
    }
  }
  return null;
}
function passwordValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value || '';
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (value && !passwordPattern.test(value)) {
    return { passwordInvalid: true };
  }
  return null;
}
const passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const password = group.get('motDePasse')?.value;
  const confirmation = group.get('confirmation')?.value;
  if (password && confirmation && password !== confirmation) {
    return { passwordMismatch: true };
  }
  return null;
};

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialDModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  profilForm!: FormGroup;
  avatarUrl: string = 'https://i.pravatar.cc/150?img=3';
  selectedPhotoFile: File | null = null;

  memberType: string = '';
  userRole: string = '';
  errorMessage: string = '';
  successMessage: string = '';


  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.userService.getProfile(userId).subscribe({
      next: (user) => {
        this.profilForm = this.fb.group({
          gender: [user.gender || ''],
          birthDate: [user.birthDate || '', birthDateValidator],
          nom: [user.lastName || '', nameValidator],
          prenom: [user.firstName || '', nameValidator],
          city: [user.city || '', cityValidator],
          address: [user.address || '', addressValidator],
          email: [user.email || '', [Validators.email]],  // plus de required, que format si modifié
          login: [user.login || ''],
          motDePasse: ['', passwordValidator],
          confirmation: ['']
        }, { validators: passwordMatchValidator });

        this.avatarUrl = user.photo
          ? `http://localhost:3000/uploads/${user.photo}`
          : 'https://i.pravatar.cc/150?img=3';

        this.memberType = user.memberType;
        this.userRole = user.role;
      },
      error: (err) => {
        console.error('❌ Erreur chargement profil:', err);
      }
    });
  }

  triggerFileInput(): void {
    const input = document.getElementById('fileUpload') as HTMLInputElement;
    if (input) input.click();
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedPhotoFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.avatarUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  enregistrer(): void {
    this.errorMessage = '';
    const password = this.profilForm.value.motDePasse;
    if (password && passwordValidator(new FormControl(password))) {
      this.errorMessage = "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.";
      return;
    }
    if (password && this.profilForm.value.confirmation !== password) {
      this.errorMessage = "Les mots de passe ne correspondent pas.";
      return;
    }

    // Vérification format des autres champs si modifiés
    if (this.profilForm.value.nom && nameValidator(new FormControl(this.profilForm.value.nom))) {
      this.errorMessage = "Le nom ne doit contenir que des lettres.";
      return;
    }
    if (this.profilForm.value.prenom && nameValidator(new FormControl(this.profilForm.value.prenom))) {
      this.errorMessage = "Le prénom ne doit contenir que des lettres.";
      return;
    }
    if (this.profilForm.value.city && cityValidator(new FormControl(this.profilForm.value.city))) {
      this.errorMessage = "La ville ne doit contenir que des lettres.";
      return;
    }
    if (this.profilForm.value.address && addressValidator(new FormControl(this.profilForm.value.address))) {
      this.errorMessage = "L'adresse ne doit contenir que des lettres et des chiffres.";
      return;
    }
    if (this.profilForm.value.birthDate && birthDateValidator(new FormControl(this.profilForm.value.birthDate))) {
      this.errorMessage = "Date invalide (entre 1900 et aujourd'hui).";
      return;
    }
    // Email (readonly donc jamais modifié, mais vérif si modifié possible)
    if (this.profilForm.value.email && !/^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(this.profilForm.value.email)) {
      this.errorMessage = "Adresse email invalide.";
      return;
    }
    const userId = this.authService.getUserId();
    if (!userId) return;

    const formData = new FormData();
    formData.append('gender', this.profilForm.value.gender || '');
    formData.append('birthDate', this.profilForm.value.birthDate || '');
    formData.append('lastName', this.profilForm.value.nom || '');
    formData.append('firstName', this.profilForm.value.prenom || '');
    formData.append('city', this.profilForm.value.city || '');
    formData.append('address', this.profilForm.value.address || '');
    formData.append('login', this.profilForm.value.login || '');

    if (this.profilForm.value.motDePasse) {
      formData.append('password', this.profilForm.value.motDePasse);
    }

    if (this.selectedPhotoFile) {
      formData.append('photo', this.selectedPhotoFile);
    }

    this.errorMessage = '';

    this.http.put(`http://localhost:3000/api/users/${userId}`, formData).subscribe({
      next: () => {
        this.successMessage = "✅ Profil mis à jour avec succès.";
      },
      error: (err) => {
        console.error('❌ Erreur maj profil:', err);
        this.successMessage = "Une erreur s'est produite.";

      }
    });
  }

  reinitialiser(): void {
    this.ngOnInit();
    this.selectedPhotoFile = null;
  }
}
