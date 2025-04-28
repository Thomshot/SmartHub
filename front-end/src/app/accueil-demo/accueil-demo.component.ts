import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialDModule } from '../shared/material-d.module';
import { BreakpointObserver } from '@angular/cdk/layout';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { AjoutObjetDialogComponent } from '../accueil/ajout-objet-dialog/ajout-objet-dialog.component';
import { FiltreDialogComponent } from '../accueil/filtre-dialog/filtre-dialog.component';
import { ProgressionNiveauDialogComponent } from '../accueil/progression-niveau-dialog/progression-niveau-dialog.component';

import { ProfilComponent } from '../profil/profil.component';
import { ProfilLesAutresComponent } from '../profil-les-autres/other-profil.component';
import { EditUserComponent } from '../edit-user/edit-user.component';

import { DeviceService } from '../services/device.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-accueil-demo',
  standalone: true,
  imports: [
    MaterialDModule, CommonModule, ProfilComponent, FormsModule,
    RouterModule, ProfilLesAutresComponent, EditUserComponent
  ],
  templateUrl: './accueil-demo.component.html',
  styleUrls: ['./accueil-demo.component.scss']
})
export class AccueilDemoComponent implements OnInit {
  isMobileorTablet = false;
  user = 'Utilisateur inconnu';
  selectedIndex = 0;

  searchQuery = '';
  searchResults: any[] = [];
  searchTriggered = false;
  selectedDevice: any = null;
  selectedOtherUser: any = null;
  serviceSearchQuery = '';
  serviceSearchResults: any[] = [];
  serviceSearchTriggered = false;
  currentUser: any = null;
  editOtherUserMode = false;

  availableDevices: any[] = [];
  maisonDevices: any[] = [];
  filteredMaisonDevices: any[] = [];

  userSearchQuery = '';
  userSearchResults: any[] = [];
  userSearchTriggered = false;

  deleteMessage: string | null = null;
  deleteMessageType: 'success' | 'error' | null = null;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private http: HttpClient,
    private router: Router,
    private deviceService: DeviceService,
    private userService: UserService,
    private dialog: MatDialog
  ) { }

  openDialog() {
    const dialogRef = this.dialog.open(AjoutObjetDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  filtreDialog(): void {
    const dialogRef = this.dialog.open(FiltreDialogComponent, {
      panelClass: 'filtre-dialog',
      position: { right: '0' },
      height: '100vh',
      width: '30%',
    });

    dialogRef.afterClosed().subscribe(filtres => {
      if (filtres) {
        this.filtrerMaisonDevices(filtres);
      } else {
        this.resetMaisonDevices();
      }
    });
  }

  resetMaisonDevices(): void {
    this.filteredMaisonDevices = [...this.maisonDevices];
    console.log('Filtres réinitialisés, affichage de toute la maison ✅');
  }

  statusDialog() {
    const dialogRef = this.dialog.open(ProgressionNiveauDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit(): void {
    this.loadAvailableDevices();
    this.loadMaisonDevicesFromLocalStorage();
    this.filteredMaisonDevices = [...this.maisonDevices];
    this.loadUserFromLocalStorage();
    this.breakpointObserver.observe(['(max-width: 960px)']).subscribe(result => {
      this.isMobileorTablet = result.matches;
    });

    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
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

    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
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

  loadAvailableDevices(): void {
    this.deviceService.getAllDevices().subscribe({
      next: (devices) => {
        this.availableDevices = devices;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des objets :', err);
      }
    });
  }

  loadMaisonDevicesFromLocalStorage(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const maisonDevices = localStorage.getItem('maisonDevices');
      this.maisonDevices = maisonDevices ? JSON.parse(maisonDevices) : [];
    } else {
      this.maisonDevices = [];
    }
  }

  saveMaisonDevicesToLocalStorage(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('maisonDevices', JSON.stringify(this.maisonDevices));
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
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      this.http.post('http://localhost:3000/api/actions/record-action', { userId, actionCount })
        .subscribe({
          next: (res: any) => console.log('Action enregistrée :', res),
          error: (err: any) => console.error('Erreur :', err)
        });
    }
  }

  onConsultation(): void {
    this.recordAction(1);
  }

  searchDevice(): void {
    this.searchTriggered = true;
    if (!this.searchQuery.trim()) {
      this.searchResults = [];
      return;
    }

    this.http.get<any[]>(`http://localhost:3000/api/devices/search?query=${this.searchQuery}`)
      .subscribe({
        next: (results: any[]) => {
          this.searchResults = results;

          if (results.length > 0) {
            const userId = localStorage.getItem('userId');
            if (userId) {
              this.http.post('http://localhost:3000/api/actions/record-action', { userId, actionCount: 1 })
                .subscribe({
                  next: () => console.log('Points mis à jour avec succès.'),
                  error: (err) => console.error('Erreur lors de la mise à jour des points :', err)
                });
            }
          }
        },
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
        next: (results: any[]) => {
          this.serviceSearchResults = results;

          // === Ajout de points si au moins un résultat ===
          if (results.length > 0) {
            const userId = localStorage.getItem('userId');
            if (userId) {
              this.http.post('http://localhost:3000/api/actions/record-action', { userId, actionCount: 1 })
                .subscribe({
                  next: () => console.log('Points mis à jour avec succès (service).'),
                  error: (err) => console.error('Erreur lors de la mise à jour des points :', err)
                });
            }
          }
        },
        error: (err: any) => {
          console.error('Erreur lors de la recherche de service :', err);
          this.serviceSearchResults = [];
        }
      });
  }

  showAllDevices(): void {
    this.searchTriggered = true;
    this.deviceService.getAllDevices().subscribe({
      next: (devices) => {
        this.searchResults = devices;
        console.log('Tous les objets récupérés :', devices);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération de tous les objets :', err);
        this.searchResults = [];
      }
    });
  }

  showAllServices(): void {
    this.serviceSearchTriggered = true;
    this.http.get<any[]>('http://localhost:3000/api/services').subscribe({
      next: (services) => {
        this.serviceSearchResults = services;
        console.log('Tous les outils/services récupérés :', services);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération de tous les outils/services :', err);
        this.serviceSearchResults = [];
      }
    });
  }

  logout(): void {
    this.saveMaisonDevicesToLocalStorage();
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userId');
      window.location.href = '/';
    }
  }

  goToProfile(): void {
    this.selectedIndex = 6; // Index de l'onglet "Gestion profil"
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

  addToMaison(device: any): void {
    this.maisonDevices.push(device);
    this.saveMaisonDevicesToLocalStorage();
    console.log('Objet ajouté à la Maison :', device);
  }

  removeFromMaison(device: any): void {
    this.deleteMessage = null; // Reset message à chaque action

    if (this.currentUser?.role !== 'expert') {
      // Demande de suppression à l’admin
      const userId = localStorage.getItem('userId');
      this.http.post('http://localhost:3000/api/devices/request-delete', {
        deviceId: device._id,
        userId,
        deviceName: device.nom
      }).subscribe({
        next: () => {
          this.deleteMessage = 'Demande envoyée à l’administrateur.';
          this.deleteMessageType = 'success';
          setTimeout(() => {
            this.deleteMessage = null;
          }, 3000);
        },
        error: err => {
          this.deleteMessage = 'Erreur lors de la demande : ' + (err.error?.message || err.message);
          this.deleteMessageType = 'error';
          setTimeout(() => {
            this.deleteMessage = null;
          }, 3000);
        }
      });
      return;
    }

    // Sinon, suppression directe
    this.maisonDevices = this.maisonDevices.filter(d => d !== device);
    this.saveMaisonDevicesToLocalStorage();
    this.deleteMessage = 'Objet supprimé de la Maison.';
    this.deleteMessageType = 'success';
  }

  clearMaisonDevices(): void {
    this.maisonDevices = [];
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.removeItem('maisonDevices');
    }
    console.log('Maison réinitialisée.');
  }

  loadUserFromLocalStorage(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
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

  filtrerMaisonDevices(filtres: any): void {
    this.filteredMaisonDevices = this.maisonDevices.filter(device => {
      const matchPiece = filtres.pieces.length === 0 || filtres.pieces.includes(device.room);
      const matchEtat = filtres.etats.length === 0 || filtres.etats.includes(device.statutActuel);
      const matchConnectivite = filtres.connectivite.length === 0 || filtres.connectivite.includes(device.connectivite);
      const matchType = filtres.types.length === 0 || filtres.types.includes(device.type);

      return matchPiece && matchEtat && matchConnectivite && matchType;
    });
    console.log('Objets filtrés :', this.filteredMaisonDevices);
  }

  filtrerSearchResults(filtres: any): void {
    this.searchResults = this.searchResults.filter(device => {
      const matchPiece = filtres.pieces.length === 0 || filtres.pieces.includes(device.room);
      const matchEtat = filtres.etats.length === 0 || filtres.etats.includes(device.statutActuel);
      const matchConnectivite = filtres.connectivite.length === 0 || filtres.connectivite.includes(device.connectivite);
      const matchType = filtres.types.length === 0 || filtres.types.includes(device.type);

      return matchPiece && matchEtat && matchConnectivite && matchType;
    });
    console.log('Objets filtrés (Recherche d\'objets) :', this.searchResults);
  }

  resetSearchResults(): void {
    this.searchDevice(); // Re-fetch the search results to reset filters
    console.log('Filtres réinitialisés (Recherche d\'objets), affichage des résultats initiaux ✅');
  }
}
