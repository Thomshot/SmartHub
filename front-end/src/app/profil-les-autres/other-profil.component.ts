import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { UserService } from '../services/user.service';
import { Output, EventEmitter } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-other-profil',
  templateUrl: './other-profil.component.html',
  styleUrls: ['./other-profil.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatIconModule,
    NgIf
  ]
})
export class ProfilLesAutresComponent {
  @Input() user: any;
  @Input() isAdmin: boolean = false;
  @Output() editRequested = new EventEmitter<void>();
  isDeleting = false;
  loading: boolean = false;
  error: string = '';

  constructor(private userService: UserService) {}

  get avatarUrl(): string {
    if (!this.user) return '';
    return this.user.photo
      ? `http://localhost:3000/uploads/${this.user.photo}`
      : 'https://i.pravatar.cc/150?img=3';
  }

  supprimerUtilisateur(): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
    if (!this.user || !this.user._id) return;

    this.isDeleting = true;
    this.userService.deleteUser(this.user._id).subscribe({
      next: () => {
        alert('✅ Utilisateur supprimé avec succès.');
        window.location.href = '/accueil';
      },
      error: () => {
        alert('❌ Erreur lors de la suppression.');
        this.isDeleting = false;
      }
    });
  }

  editerUtilisateur(): void {
    if (!this.user || !this.user._id) return;
    window.location.href = `/edit-user/${this.user._id}`;
  }
}
