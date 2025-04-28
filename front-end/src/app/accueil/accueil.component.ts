import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialDModule } from '../shared/material-d.module';
import { BreakpointObserver } from '@angular/cdk/layout';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';


import { AjoutObjetDialogComponent } from './ajout-objet-dialog/ajout-objet-dialog.component';
import { FiltreDialogComponent } from './filtre-dialog/filtre-dialog.component';
import { ProgressionNiveauDialogComponent } from './progression-niveau-dialog/progression-niveau-dialog.component';

import { ProfilComponent } from '../profil/profil.component';
import { ProfilLesAutresComponent } from '../profil-les-autres/other-profil.component';
import { EditUserComponent } from '../edit-user/edit-user.component';

import { DeviceService } from '../services/device.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [
    MaterialDModule, CommonModule, ProfilComponent, FormsModule,
    RouterModule, ProfilLesAutresComponent, EditUserComponent,
    MatSelectModule
  ],
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent implements OnInit {
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

  addToMaison(device: any): void {
    this.maisonDevices.push(device);
    this.saveMaisonDevicesToLocalStorage();
    console.log('Objet ajouté à la Maison :', device);
  }

  removeFromMaison(device: any): void {
    this.maisonDevices = this.maisonDevices.filter(d => d !== device);
    this.saveMaisonDevicesToLocalStorage();
    console.log('Objet supprimé de la Maison :', device);
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

  updateDeviceStatus(device: any): void {
    if (device.newStatus && device.newStatus !== device.statutActuel) {
      // Appel HTTP direct vers le backend Express.js
      this.http.put(`http://localhost:3000/api/devices/${device._id}/status`, { status: device.newStatus })
        .subscribe({
          next: (response: any) => {
            device.statutActuel = device.newStatus;
            device.isEditingStatus = false;
            device.newStatus = undefined;
            console.log('Statut mis à jour avec succès :', response);
            this.saveMaisonDevicesToLocalStorage(); // Si tu utilises le localStorage
          },
          error: (err) => {
            console.error('Erreur lors de la mise à jour du statut :', err);
            device.isEditingStatus = false;
          }
        });
    } else {
      device.isEditingStatus = false;
      device.newStatus = undefined;
    }
  }

  updateDeviceName(device: any): void {
    this.deviceService.updateDeviceName(device._id, device.newName).subscribe({
      next: (response: any) => {
        device.nom = device.newName; // Met à jour localement
        console.log('Nom mis à jour avec succès :', response);
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du nom :', err);
      }
    });
  }


  toggleEditStatus(device: any): void {
    device.isEditingStatus = !device.isEditingStatus;
    device.newStatus = device.statutActuel; // Pré-sélectionne le statut actuel
  }

  toggleEditName(device: any): void {
    if (device.isEditingName) {
      // Si l'utilisateur valide la modification
      if (device.newName && device.newName !== device.nom) {
        this.updateDeviceName(device);
      }
      device.isEditingName = false;
    } else {
      // Active le mode édition
      device.isEditingName = true;
      device.newName = device.nom; // Pré-remplit avec le nom actuel
    }
  }
}
