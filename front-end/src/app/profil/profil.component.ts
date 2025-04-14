import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialDModule } from '../shared/material-d.module';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialDModule,
    MatSelectModule,
    MatOptionModule
  ],
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  profilForm!: FormGroup;
  avatarUrl: string = 'https://i.pravatar.cc/150?img=3';
  roles: string[] = ['Utilisateur', 'Administrateur', 'Modérateur'];
  userRole: string = 'Utilisateur'; // rôle fixe

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.profilForm = this.fb.group({
      nom: ['Dupont', Validators.required],
      prenom: ['Jean', Validators.required],
      email: ['jean.dupont@example.com', [Validators.required, Validators.email]],
      telephone: ['+33612345678', Validators.pattern('^\\+?[0-9]{7,15}$')],
      motDePasse: ['motdepasse', [Validators.required, Validators.minLength(6)]],
      confirmation: ['motdepasse'],
    });
  }

  triggerFileInput(): void {
    const input = document.getElementById('fileUpload') as HTMLInputElement;
    input.click();
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.avatarUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  enregistrer(): void {
    if (this.profilForm.valid) {
      if (this.profilForm.value.motDePasse !== this.profilForm.value.confirmation) {
        alert("Les mots de passe ne correspondent pas.");
        return;
      }
      const profilData = {
        ...this.profilForm.value,
        role: this.userRole
      };
      console.log('Profil enregistré:', profilData);
    } else {
      this.profilForm.markAllAsTouched();
    }
  }

  reinitialiser(): void {
    this.profilForm.reset({
      nom: 'Dimaria',
      prenom: 'CookieLover',
      email: 'matthieu.uranium@email.com',
      telephone: '+33612345678',
      motDePasse: 'password',
      confirmation: 'password'
    });
    this.avatarUrl = 'https://i.pravatar.cc/150?img=3';
  }
}
