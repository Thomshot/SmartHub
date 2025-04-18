import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialDModule } from '../shared/material-d.module';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

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

  // valeurs fixes non modifiables
  memberType: string = 'père';
  userRole: string = 'débutant';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.profilForm = this.fb.group({
      gender: ['Femme', Validators.required],
      birthDate: ['2025-04-03', Validators.required],
      nom: ['Doué', Validators.required],
      prenom: ['Matthieu', Validators.required],
      city: ['qwerwqer', Validators.required],
      address: ['wqerwqerwqer', Validators.required],
      email: ['matthieu.doué@example.com', [Validators.required, Validators.email]],
      login: ['fasdf', Validators.required],
      motDePasse: ['motdepasse', [Validators.required, Validators.minLength(6)]],
      confirmation: ['motdepasse']
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
        role: this.userRole,
        memberType: this.memberType
      };
      console.log('Profil enregistré:', profilData);
    } else {
      this.profilForm.markAllAsTouched();
    }
  }

  reinitialiser(): void {
    this.profilForm.reset({
      gender: 'Femme',
      birthDate: '2025-04-03',
      nom: 'Dimaria',
      prenom: 'CookieLover',
      city: 'Paris',
      address: '31 Rue de la Glace',
      email: 'matthieu.uranium@email.com',
      login: 'dimcookie',
      motDePasse: 'password',
      confirmation: 'password'
    });
    this.avatarUrl = 'https://i.pravatar.cc/150?img=3';
  }
}
