
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

@Component({
  selector: 'app-accueil',
  standalone: true,

  imports: [MaterialDModule, CommonModule, ProfilComponent, FormsModule,RouterModule,ChartWrapperComponent, LayoutModule  ], // ✅ Add FormsModule here
  templateUrl: './accueil.component.html', // Ensure this path is correct
  styleUrls: ['./accueil.component.scss'] // Ensure this path is correct
})
export class AccueilComponent implements OnInit {
  @ViewChild("chart") chart!: ChartComponent;

  isMobileorTablet: boolean = false;
  user: string = 'Utilisateur inconnu';
  selectedIndex: number = 0;
  isBrowser : boolean;
  searchQuery: string = '';
  searchResults: any[] = [];
  searchTriggered: boolean = false;
  selectedDevice: any = null;
  menuOpened=false;
  serviceSearchQuery: string = '';
  serviceSearchResults: any[] = [];
  serviceSearchTriggered: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private breakpointObserver: BreakpointObserver, private http: HttpClient,private router: Router) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    
  }
  readonly dialog = inject(MatDialog);

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
  filtreDialog() {
    const dialogRef = this.dialog.open(FiltreDialogComponent,{
      panelClass: 'filtre-dialog',
      position:{right:'0'},
      height:'100vh',
      width:'30%',
       backdropClass:"backdrop-dialog"
    } );

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  statusDialog() {
    const dialogRef = this.dialog.open(ProgressionNiveauDialogComponent,{
       backdropClass:"backdrop-dialog"
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  

  userSearchQuery: string = '';
  userSearchResults: any[] = [];
  userSearchTriggered: boolean = false;

  ngOnInit(): void {
    const screenWidth = window.innerWidth;
    this.isMobileorTablet = screenWidth <= 960;
    this.menuOpened = !this.isMobileorTablet;
  
    // Ensuite continue à écouter les changements de taille
    this.breakpointObserver.observe(['(max-width: 960px)']).subscribe(result => {
      this.isMobileorTablet = result.matches;
      this.menuOpened = !this.isMobileorTablet;
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

  shouldSidenavBeOpened(): boolean {

    return !this.isMobileorTablet;
  }

  onTabChange(index: number): void {
    this.selectedIndex = index;
  }
  onTabClose(): void {
    if (this.isMobileorTablet) {
      this.menuOpened = false;
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
