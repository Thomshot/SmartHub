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
import { RouterModule } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import { AjoutObjetDialogComponent } from './ajout-objet-dialog/ajout-objet-dialog.component';
import { FiltreDialogComponent } from './filtre-dialog/filtre-dialog.component';
import { ProgressionNiveauDialogComponent } from './progression-niveau-dialog/progression-niveau-dialog.component';
import { Router } from '@angular/router';
import { DeviceService } from '../services/device.service';



@Component({
  selector: 'app-accueil',
  standalone: true,

  imports: [MaterialDModule, CommonModule, ProfilComponent, FormsModule,RouterModule], // ✅ Add FormsModule here
  templateUrl: './accueil.component.html', // Ensure this path is correct
  styleUrls: ['./accueil.component.scss'] // Ensure this path is correct
})
export class AccueilComponent implements OnInit {

  isMobileorTablet: boolean = false;
  user: string = 'Utilisateur inconnu';
  selectedIndex: number = 0;

  searchQuery: string = '';
  searchResults: any[] = [];
  searchTriggered: boolean = false;
  selectedDevice: any = null;

  serviceSearchQuery: string = '';
  serviceSearchResults: any[] = [];
  serviceSearchTriggered: boolean = false;

  availableDevices: any[] = []; // Liste des objets disponibles
  maisonDevices: any[] = []; // Liste des objets ajoutés à la "Maison"
  filteredMaisonDevices: any[] = []; // Liste des objets filtrés

  constructor(private breakpointObserver: BreakpointObserver, private http: HttpClient,private router: Router, private deviceService: DeviceService) {
  }
  readonly dialog = inject(MatDialog);

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
        this.filtrerMaisonDevices(filtres); // Appliquer les filtres
      } else {
        this.resetMaisonDevices(); // Réinitialiser les filtres
      }
    });
  }

  resetMaisonDevices(): void {
    this.filteredMaisonDevices = [...this.maisonDevices]; // Réinitialiser les objets filtrés
    console.log('Filtres réinitialisés, affichage de toute la maison ✅');
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
    this.loadAvailableDevices();
    this.loadMaisonDevicesFromLocalStorage(); // Charger les objets de la maison depuis localStorage
    this.filteredMaisonDevices = [...this.maisonDevices]; // Initialiser les objets filtrés
    this.loadUserFromLocalStorage(); // Charger les informations utilisateur depuis localStorage
    this.breakpointObserver.observe(['(max-width: 960px)']).subscribe(result => {
      this.isMobileorTablet = result.matches;
    });

    // ✅ Vérifie que l’on est bien dans le navigateur
    if (typeof window !== 'undefined') {
      const name = localStorage.getItem('userName');
      const email = localStorage.getItem('userEmail');
      const id = localStorage.getItem('userId');

      if (name && email && id) {
        this.user = name; // ✅ Met à jour l’affichage du nom
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
    const maisonDevices = localStorage.getItem('maisonDevices');
    this.maisonDevices = maisonDevices ? JSON.parse(maisonDevices) : [];
  }

  saveMaisonDevicesToLocalStorage(): void {
    localStorage.setItem('maisonDevices', JSON.stringify(this.maisonDevices));
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

  recordAction(actionCount: number): void {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    this.http.post('http://localhost:3000/api/actions/record-action', { userId, actionCount })
      .subscribe({
        next: (res) => console.log('Action enregistrée :', res),
        error: (err) => console.error('Erreur :', err)
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
        next: (results) => this.searchResults = results,
        error: (err) => {
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
        next: (results) => this.serviceSearchResults = results,
        error: (err) => {
          console.error('Erreur lors de la recherche de service :', err);
          this.serviceSearchResults = [];
        }
      });
  }

  logout(): void {
    this.saveMaisonDevicesToLocalStorage(); // Sauvegarder les objets de la maison avant de se déconnecter
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    window.location.href = '/';
  }

  goToProfile(): void {
    this.selectedIndex = 3;
    if (this.isMobileorTablet) {
      const sidenavEl = document.querySelector('mat-sidenav') as any;
      sidenavEl?.close?.();
    }
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
        next: (result) => this.userSearchResults = result ? [result] : [],
        error: (err) => {
          console.error('Erreur lors de la recherche utilisateur :', err);
          this.userSearchResults = [];
        }
      });
  }

  // Ajouter un objet à la "Maison"
  addToMaison(device: any): void {
    this.maisonDevices.push(device);
    this.saveMaisonDevicesToLocalStorage(); // Sauvegarder dans localStorage
    console.log('Objet ajouté à la Maison :', device);
  }

  // Supprimer un objet de la "Maison"
  removeFromMaison(device: any): void {
    this.maisonDevices = this.maisonDevices.filter(d => d !== device);
    this.saveMaisonDevicesToLocalStorage(); // Mettre à jour le localStorage
    console.log('Objet supprimé de la Maison :', device);
  }

  clearMaisonDevices(): void {
    this.maisonDevices = [];
    localStorage.removeItem('maisonDevices'); // Supprimer les données de localStorage
    console.log('Maison réinitialisée.');
  }

  loadUserFromLocalStorage(): void {
    const name = localStorage.getItem('userName');
    const email = localStorage.getItem('userEmail');
    const id = localStorage.getItem('userId');

    if (name && email && id) {
      this.user = name; // Met à jour l'affichage du nom
      console.log(`✅ Connecté en tant que ${name} <${email}> (ID: ${id})`);
    } else {
      console.warn('⚠️ Aucun utilisateur détecté dans localStorage');
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
}
