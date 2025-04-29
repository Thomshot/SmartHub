  import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { MaterialDModule } from '../shared/material-d.module';
  import { BreakpointObserver } from '@angular/cdk/layout';
  import { FormsModule } from '@angular/forms';
  import { HttpClient } from '@angular/common/http';
  import { RouterModule, Router } from '@angular/router';
  import { MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';

import { ViewChild } from '@angular/core';
  import { AjoutObjetDialogComponent } from './ajout-objet-dialog/ajout-objet-dialog.component';
  import { FiltreDialogComponent } from './filtre-dialog/filtre-dialog.component';
  import { ProgressionNiveauDialogComponent } from './progression-niveau-dialog/progression-niveau-dialog.component';

  import { ProfilComponent } from '../profil/profil.component';
  import { ProfilLesAutresComponent } from '../profil-les-autres/other-profil.component';
  import { EditUserComponent } from '../edit-user/edit-user.component';
import { ChartComponent } from "ng-apexcharts";
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexFill,
  ApexDataLabels,
  ApexLegend
} from "ng-apexcharts";
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { ChartWrapperComponent } from './chart-wrapper.component';
import { MatSidenav } from '@angular/material/sidenav';
import { LayoutModule } from '@angular/cdk/layout';


export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  fill: ApexFill;
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
};
  import { DeviceService } from '../services/device.service';
  import { UserService } from '../services/user.service';

  @Component({
    selector: 'app-accueil',
    standalone: true,
    imports: [
      MaterialDModule, CommonModule, ProfilComponent, FormsModule,
      RouterModule, ProfilLesAutresComponent, EditUserComponent,
    MatSelectModule,ChartWrapperComponent, LayoutModule
    ],
    templateUrl: './accueil.component.html',
    styleUrls: ['./accueil.component.scss']
  })
  export class AccueilComponent implements OnInit {
    @ViewChild("chart") chart!: ChartComponent;
    isMobileorTablet = false;
    user = 'Utilisateur inconnu';
    selectedIndex = 0;
  tabs = [
    { label: 'Accueil', disabled: false },
    { label: 'Création objet', disabled: false },
    { label: 'Gestion objet', disabled: false },
    { label: 'Recherche d\'objets', disabled: false },
    { label: 'Recherche d\'outils/services', disabled: false },
    { label: 'Recherche d\'utilisateurs', disabled: false },
    { label: 'Gestion profil', disabled: false },
  ];
    searchQuery = '';
    isBrowser : boolean;
    menuOpened=false;
    searchResults: any[] = [];
    searchTriggered = false;
    selectedDevice: any = null;
    selectedOtherUser: any = null;
    serviceSearchQuery = '';
    serviceSearchResults: any[] = [];
    serviceSearchTriggered = false;
    currentUser: any = null;
    editOtherUserMode = false;
    deleteMessage: string | null = null;
    deleteMessageType: 'success' | 'error' | null = null;
    availableDevices: any[] = [];
    maisonDevices: any[] = [];
    filteredMaisonDevices: any[] = [];

    userSearchQuery = '';
    userSearchResults: any[] = [];
    userSearchTriggered = false;
    pointsActuels: number = 0;
    pointsMax: number = 10;
    loginHistory: any[] = [];
    showLoginHistory: boolean = false; 



    constructor(
      private breakpointObserver: BreakpointObserver,
      private http: HttpClient,
      private router: Router,
      private deviceService: DeviceService,
      private userService: UserService,
      private dialog: MatDialog,
    private cdr: ChangeDetectorRef,@Inject(PLATFORM_ID) private platformId: Object
    ) {this.isBrowser = isPlatformBrowser(platformId); 

    }

    loadPoints(): void {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        this.http.get<any>(`http://localhost:3000/api/users/profile/${userId}`).subscribe({
          next: (data) => {
            console.log('✅ Données profil reçues :', data);
            this.pointsActuels = data.points || 0;
            this.pointsMax = 10;
            console.log(`✅ Points récupérés : ${this.pointsActuels}/${this.pointsMax}`);
          },
          error: (err) => {
            console.error('❌ Erreur récupération points :', err);
          }
        });
      }
    }

    loadLoginHistory(): void {
      if (this.currentUser?.userType !== 'administrateur') {
        console.log('Accès refusé : utilisateur non admin');
        return;
      }
    
      this.http.get<any[]>('http://localhost:3000/api/login-history').subscribe({
        next: (history) => {
          this.loginHistory = history;
          this.showLoginHistory = true; // 🛠️ C'est cette ligne qui manquait
          console.log('✅ Historique des connexions chargé :', this.loginHistory);
        },
        error: (err) => {
          console.error('❌ Erreur lors de la récupération de l\'historique de connexion :', err);
        }
      });
    }
    
    
    

  openDialog() {
    const dialogRef = this.dialog.open(AjoutObjetDialogComponent,{
      backdropClass:"backdrop-dialog",
      width:"80%"
    });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
        this.createdObjects.push(result); // 👈 ajouter l'objet retourné
      }
      });
    }

    filtreDialog(): void {
      const dialogRef = this.dialog.open(FiltreDialogComponent, {
        panelClass: 'filtre-dialog',
        position: { right: '0' },
        height: '100vh',
        width: '30%',
       backdropClass:"backdrop-dialog"
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
      const dialogRef = this.dialog.open(ProgressionNiveauDialogComponent,{
       backdropClass:"backdrop-dialog"
    });
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    }

    ngOnInit(): void {
    this.cdr.detectChanges();
      this.loadAvailableDevices();
        this.filteredMaisonDevices = [...this.maisonDevices];
      this.loadUserFromLocalStorage();
    
      const screenWidth = window.innerWidth;
    this.isMobileorTablet = screenWidth <= 960;
    this.menuOpened = !this.isMobileorTablet;
  
    // Ensuite continue à écouter les changements de taille
    this.breakpointObserver.observe(['(max-width: 960px)']).subscribe(result => {
        this.isMobileorTablet = result.matches;
        this.menuOpened = !this.isMobileorTablet;
    });
    
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const connectedUserId = localStorage.getItem('userId');
        if (connectedUserId) {
          this.userService.getProfile(connectedUserId).subscribe({
            next: (user: any) => {
              this.currentUser = user;
            if (this.currentUser?.userType === 'simple') {
              this.tabs[1].disabled = true; // Création objet
              this.tabs[2].disabled = true; // Gestion objet
            }

            this.maisonDevices = user.userDevices.map((ud: any) => ({
              ...ud.device,
              userDeviceId: ud._id,
              statutActuel: ud.statutActuel,
              etats: ['Actif', 'Inactif'],
            }));


            this.filteredMaisonDevices = [...this.maisonDevices];
            this.cdr.detectChanges();
              this.loadPoints(); // ✅ Charger les points de l'utilisateur
              // 👉 Pas d'appel à loadLoginHistory ici !
            },
            error: () => {
              this.currentUser = null;
            }
          });
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
    onTabClose(): void {
      if (this.isMobileorTablet) {
        this.menuOpened = false;
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
              this.recordAction(1);
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


  clearMaisonDevices(): void {
    const userId = localStorage.getItem('userId');
    this.http.post('http://localhost:3000/api/users/' + userId + '/clear-devices', {})
      .subscribe({
        next: () => {
          this.reloadMaisonDevices(); // recharge à jour après suppression
          console.log('Maison réinitialisée.');
        },
        error: (err) => {
          console.error('Erreur lors de la réinitialisation de la maison :', err);
        }
      });
  }



  logout(): void {
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
    const userId = localStorage.getItem('userId');
    this.http.post('http://localhost:3000/api/users/' + userId + '/add-device', {
      userId, deviceId: device._id
    }).subscribe({
      next: () => {
        // Recharge les devices depuis le backend
        this.reloadMaisonDevices();
        console.log('Objet ajouté à la Maison :', device);
      },
      error: err => {
        console.error('Erreur lors de l’ajout de l’objet :', err);
      }
    });
  }

  reloadMaisonDevices() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.userService.getProfile(userId).subscribe({
        next: (user: any) => {
          this.currentUser = user;
          this.maisonDevices = user.userDevices.map((ud: any) => ({
            ...ud.device,
            userDeviceId: ud._id, // ✅ important
            statutActuel: ud.statutActuel
          }));
          this.filteredMaisonDevices = this.maisonDevices.map(d => ({ ...d }));
          console.log('Maison rechargée :', this.maisonDevices);
        }
      });
    }
  }

  removeFromMaison(device: any): void {
    this.deleteMessage = null;

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
          setTimeout(() => { this.deleteMessage = null; }, 3000);
        },
        error: err => {
          this.deleteMessage = 'Erreur lors de la demande : ' + (err.error?.message || err.message);
          this.deleteMessageType = 'error';
          setTimeout(() => { this.deleteMessage = null; }, 3000);
        }
      });
      return;
    }

    // Si expert : suppression directe (appel backend, plus localStorage !)
    const userId = localStorage.getItem('userId');
    this.http.post('http://localhost:3000/api/users/' + userId + '/remove-device', {
      userId,
      deviceId: device.userDeviceId
    }).subscribe({
      next: () => {
        this.reloadMaisonDevices();
      },
      error: err => {
        this.deleteMessage = 'Erreur lors de la suppression : ' + (err.error?.message || err.message);
        this.deleteMessageType = 'error';
      }
    });
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
    this.filteredMaisonDevices = this.maisonDevices
      .filter(device => {
        const matchPiece = filtres.pieces.length === 0 || filtres.pieces.includes(device.room);
        const matchEtat = filtres.etats.length === 0 || filtres.etats.includes(device.statutActuel);
        const matchConnectivite = filtres.connectivite.length === 0 || filtres.connectivite.includes(device.connectivite);
        const matchType = filtres.types.length === 0 || filtres.types.includes(device.type);
        return matchPiece && matchEtat && matchConnectivite && matchType;
      })
      .map(d => ({ ...d }));
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
      this.searchDevice();
      console.log('Filtres réinitialisés (Recherche d\'objets)');
    }

    showAllDevices(): void {
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
    
  

  updateDeviceStatus(device: any): void {
    const userId = localStorage.getItem('userId');
    const userDeviceId = device.userDeviceId;
    if (!userDeviceId) {
      console.error('❌ userDeviceId manquant pour updateDeviceStatus');
      return;
    }
    if (userId && device.newStatus && device.newStatus !== device.statutActuel) {
      this.http.put(`http://localhost:3000/api/users/${userId}/devices/${userDeviceId}/status`, { status: device.newStatus })

        .subscribe({
          next: (response: any) => {
            this.reloadMaisonDevices();
            device.isEditingStatus = false;
            device.newStatus = undefined;
            console.log('Statut mis à jour avec succès :', response);
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
    const userId = localStorage.getItem('userId');
    const deviceId = device.userDeviceId;

    if (!userId || !deviceId) {
      console.error('❌ Utilisateur ou device ID manquant', { userId, deviceId });
      return;
    }

    if (device.newName && device.newName !== device.nom) {
      this.http.put(`http://localhost:3000/api/users/${userId}/devices/${deviceId}/name`, { name: device.newName })
        .subscribe({
          next: (response: any) => {
            device.nom = device.newName;
            device.newName = undefined;
            console.log('✅ Nom mis à jour :', response);
            console.log('📤 Requête PUT :', `http://localhost:3000/api/users/${userId}/devices/${deviceId}/name`, {
              name: device.newName
            });
          },
          error: (err) => {
            console.log('📤 Requête PUT :', `http://localhost:3000/api/users/${userId}/devices/${deviceId}/name`, {
              name: device.newName
            });
            console.error('❌ Erreur lors de la mise à jour du nom :', err);
          }
        });
    }

  }

  toggleEditStatus(device: any): void {
    device.isEditingStatus = !device.isEditingStatus;
    device.newStatus = device.statutActuel;
  }

  toggleEditName(device: any): void {
    console.log('🧪 toggleEditName called for device:', device);

    if (!device.userDeviceId) {
      console.warn('⚠️ userDeviceId manquant dans device !');
      return;
    }

    if (device.isEditingName) {
      if (device.newName && device.newName !== device.nom) {
        this.updateDeviceName(device);
      }
      device.isEditingName = false;
    } else {
      device.isEditingName = true;
      device.newName = device.nom;
    }
  }
  selectedChart: string='electricite';
  createdObjects: any[] = [];

  deleteObject(obj: any) {
    const index = this.createdObjects.indexOf(obj);
    if (index > -1) {
      this.createdObjects.splice(index, 1);
    }
  }
  
  // Pour simplifier, tu peux réutiliser le dialog de création en mode "édition"
  editObject(obj: any) {
    // Tu peux ouvrir le dialog avec les valeurs préremplies, par exemple :
    // (nécessite un peu plus de logique côté openDialog())
    console.log('Édition demandée pour :', obj);
  }
 
}
