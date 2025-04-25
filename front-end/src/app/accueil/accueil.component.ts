import { ViewChild } from '@angular/core';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialDModule } from '../shared/material-d.module';
import { BreakpointObserver } from '@angular/cdk/layout';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ProfilComponent } from '../profil/profil.component';
import { HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AjoutObjetDialogComponent } from './ajout-objet-dialog/ajout-objet-dialog.component';
import { FiltreDialogComponent } from './filtre-dialog/filtre-dialog.component';
import { ProgressionNiveauDialogComponent } from './progression-niveau-dialog/progression-niveau-dialog.component';
import { ProfilLesAutresComponent } from '../profil-les-autres/other-profil.component';
import { UserService } from '../services/user.service'; // <-- Ajoute cet import
import { EditUserComponent } from '../edit-user/edit-user.component';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [
    MaterialDModule, CommonModule, ProfilComponent, FormsModule,
    RouterModule, ProfilLesAutresComponent, EditUserComponent
  ],
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent implements OnInit {
  isMobileorTablet: boolean = false;
  user: string = 'Utilisateur inconnu';
  selectedIndex: number = 0;

  searchQuery: string = '';
  searchResults: any[] = [];
  searchTriggered: boolean = false;
  selectedDevice: any = null;
  selectedOtherUser: any = null;
  serviceSearchQuery: string = '';
  serviceSearchResults: any[] = [];
  serviceSearchTriggered: boolean = false;
  currentUser: any = null;
  editOtherUserMode: boolean = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
  ) {}
  readonly dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(AjoutObjetDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  filtreDialog() {
    const dialogRef = this.dialog.open(FiltreDialogComponent, {
      panelClass: 'filtre-dialog',
      position: { right: '0' },
      height: '100vh',
      width: '30%',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  statusDialog() {
    const dialogRef = this.dialog.open(ProgressionNiveauDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  userSearchQuery: string = '';
  userSearchResults: any[] = [];
  userSearchTriggered: boolean = false;

  ngOnInit(): void {
    this.breakpointObserver.observe(['(max-width: 960px)']).subscribe(result => {
      this.isMobileorTablet = result.matches;
    });

    if (typeof window !== 'undefined' && localStorage) {
      const connectedUserId = localStorage.getItem('userId');
      if (connectedUserId) {
        this.userService.getProfile(connectedUserId).subscribe({
          next: (user: any) => {
            this.currentUser = user;
          },
          error: () => {
            this.currentUser = null;
          }
        });
      }
    }

    if (typeof window !== 'undefined') {
      const name = localStorage.getItem('userName');
      const email = localStorage.getItem('userEmail');
      const id = localStorage.getItem('userId');

      if (name && email && id) {
        this.user = name;
        console.log(`✅ Connecté en tant que ${name} <${email}> (ID: ${id})`);
      } else {
        console.warn('⚠️ Aucun utilisateur détecté dans localStorage');
      }
    }
  }

  shouldSidenavBeOpened(): boolean {
    return !this.isMobileorTablet;
  }

  onTabChange(index: number): void {
    this.selectedIndex = index;

    if (index === 0) {
      window.scrollTo(0, 0);
      console.log("🟢 Accueil affiché !");
    }
  }

  closeSidenav(): boolean {
    return !this.isMobileorTablet;
  }

  selectOtherUser(user: any) {
    this.selectedOtherUser = user;
  }

  recordAction(actionCount: number): void {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    this.http.post('http://localhost:3000/api/actions/record-action', { userId, actionCount })
      .subscribe({
        next: (res: any) => console.log('Action enregistrée :', res),
        error: (err: any) => console.error('Erreur :', err)
      });
  }

  onConsultation(): void {
    this.recordAction(1); // 1 action = 0.5 points
  }

  searchDevice(): void {
    this.searchTriggered = true;
    if (!this.searchQuery.trim()) {
      this.searchResults = [];
      return;
    }

    this.http.get<any[]>(`http://localhost:3000/api/devices/search?query=${this.searchQuery}`)
      .subscribe({
        next: (results: any[]) => this.searchResults = results,
        error: (err: any) => {
          console.error('Erreur lors de la recherche d’objet :', err);
          this.searchResults = [];
        }
      });
  }

  searchService(): void {
    this.serviceSearchTriggered = true;
    if (!this.serviceSearchQuery.trim()) {
      this.serviceSearchResults = [];
      return;
    }

    this.http.get<any[]>(`http://localhost:3000/api/services/search?query=${this.serviceSearchQuery}`)
      .subscribe({
        next: (results: any[]) => this.serviceSearchResults = results,
        error: (err: any) => {
          console.error('Erreur lors de la recherche de service :', err);
          this.serviceSearchResults = [];
        }
      });
  }

  logout() {
    localStorage.clear();
    window.location.href = '/';
  }

  goToProfile(): void {
    this.selectedIndex = 3;
    if (this.isMobileorTablet) {
      const sidenavEl = document.querySelector('mat-sidenav') as any;
      sidenavEl?.close?.();
    }
  }

  goToOtherProfile(userId: string): void {
    this.router.navigate(['/profil-les-autres', userId]);
  }

  searchUser(): void {
    this.userSearchTriggered = true;
    console.log('Recherche utilisateur avec login :', this.userSearchQuery);

    if (!this.userSearchQuery.trim()) {
      this.userSearchResults = [];
      return;
    }

    this.http.get<any>(`http://localhost:3000/api/users/search?login=${this.userSearchQuery}`)
      .subscribe({
        next: (result: any) => this.userSearchResults = result ? [result] : [],
        error: (err: any) => {
          console.error('Erreur lors de la recherche utilisateur :', err);
          this.userSearchResults = [];
        }
      });
  }
}
