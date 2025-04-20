import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialDModule } from '../shared/material-d.module';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';

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

  // valeurs fixes non modifiables
  memberType: string = '';
  userRole: string = '';

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
          gender: [user.gender || '', Validators.required],
          birthDate: [user.birthDate || '', Validators.required],
          nom: [user.lastName || '', Validators.required],
          prenom: [user.firstName || '', Validators.required],
          city: [user.city || '', Validators.required],
          address: [user.address || '', Validators.required],
          email: [user.email || '', [Validators.required, Validators.email]],
          login: [user.login || '', Validators.required],
          motDePasse: [''],
          confirmation: ['']
        });

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
    if (this.profilForm.invalid) {
      this.profilForm.markAllAsTouched();
      return;
    }

    if (
      this.profilForm.value.motDePasse &&
      this.profilForm.value.motDePasse !== this.profilForm.value.confirmation
    ) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }

    const userId = this.authService.getUserId();
    if (!userId) return;

    const formData = new FormData();
    formData.append('gender', this.profilForm.value.gender);
    formData.append('birthDate', this.profilForm.value.birthDate);
    formData.append('lastName', this.profilForm.value.nom);
    formData.append('firstName', this.profilForm.value.prenom);
    formData.append('city', this.profilForm.value.city);
    formData.append('address', this.profilForm.value.address);
    formData.append('email', this.profilForm.value.email);
    formData.append('login', this.profilForm.value.login);

    if (this.profilForm.value.motDePasse) {
      formData.append('password', this.profilForm.value.motDePasse);
    }

    if (this.selectedPhotoFile) {
      formData.append('photo', this.selectedPhotoFile);
    }

    this.http.put(`http://localhost:3000/api/users/${userId}`, formData).subscribe({
      next: () => {
        alert('✅ Profil mis à jour avec succès.');
      },
      error: (err) => {
        console.error('❌ Erreur maj profil:', err);
        alert("Une erreur s'est produite.");
      }
    });
  }

  reinitialiser(): void {
    this.ngOnInit(); // recharge les données originales
    this.selectedPhotoFile = null;
  }
}
