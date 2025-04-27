import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // <-- Ajoute Validators ici !
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatIconModule,
  ]
})
export class EditUserComponent implements OnInit {
  @Input() userId!: string;
  @Output() close = new EventEmitter<void>();

  user: any = null;
  editForm!: FormGroup;
  loading = true;
  error: string = '';
  errorMsg: string = '';
  loadingUpdate = false;

  avatarPreview: string | ArrayBuffer | null = null;
  avatarFile: File | null = null;
  avatarError: string = '';

  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) {}

  get avatarUrl(): string {
    if (!this.user) return '';
    return this.user.photo
      ? `http://localhost:3000/uploads/${this.user.photo}`
      : 'https://i.pravatar.cc/150?img=3';
  }

  ngOnInit() {
    if (!this.userId) {
      this.error = 'Utilisateur introuvable.';
      this.loading = false;
      return;
    }
    this.userService.getProfile(this.userId).subscribe({
      next: user => {
        this.user = user;
        this.editForm = this.fb.group({
          firstName: [user.firstName],
          lastName: [user.lastName],
          email: [{ value: user.email, disabled: true }],
          login: [user.login],
          city: [user.city],
          address: [user.address],
          gender: [user.gender],
          otherGender: [user.otherGender || ''],
          birthDate: [user.birthDate],
          points: [user.points, [Validators.required, Validators.min(0)]],
          role: [user.role || 'débutant'],
          userType: [user.userType || 'simple']
        });
        this.avatarPreview = null;
        this.loading = false;
      },
      error: err => {
        this.error = 'Erreur lors du chargement du profil.';
        this.loading = false;
      }
    });
  }

  onAvatarSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (!file.type.startsWith('image/')) {
        this.avatarError = "Le fichier doit être une image.";
        return;
      }
      this.avatarFile = file;
      this.avatarError = "";
      // Aperçu
      const reader = new FileReader();
      reader.onload = () => this.avatarPreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (!this.editForm || !this.editForm.valid) {
      this.errorMsg = 'Merci de remplir correctement le formulaire.';
      return;
    }
    this.loadingUpdate = true;
    this.errorMsg = '';

    let payload: any;
    if (this.avatarFile) {
      payload = new FormData();
      Object.entries(this.editForm.getRawValue()).forEach(([key, value]) => {
        payload.append(key, value as any);
      });
      payload.append('photo', this.avatarFile, this.avatarFile.name);
    } else {
      payload = this.editForm.getRawValue();
    }

    this.userService.updateProfile(this.user._id, payload).subscribe({
      next: (res: any) => {
        alert('Modifications enregistrées.');
        this.loadingUpdate = false;
        if (res && res.user) {
          this.user = res.user;
          this.editForm.patchValue({
            role: res.user.role,
            userType: res.user.userType
          });
        }
        this.close.emit();
      },
      error: err => {
        this.errorMsg = 'Erreur lors de l\'enregistrement.';
        this.loadingUpdate = false;
      }
    });
  }

  onCancel() {
    this.close.emit();
  }
}
