import { Component,inject } from '@angular/core';
import { ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialDModule } from '../shared/material-d.module';
import { BreakpointObserver } from '@angular/cdk/layout';
import { FormControl, FormsModule } from '@angular/forms'; // ✅ Import FormsModule
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { OnInit } from '@angular/core';
import { ProfilComponent } from '../profil/profil.component'; // ✅ Import du composant profil
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import { AjoutObjetDialogComponent } from './ajout-objet-dialog/ajout-objet-dialog.component';
import { FiltreDialogComponent } from './filtre-dialog/filtre-dialog.component';
import { ProgressionNiveauDialogComponent } from './progression-niveau-dialog/progression-niveau-dialog.component';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [MaterialDModule, CommonModule, ProfilComponent, FormsModule,RouterModule], // ✅ Add FormsModule here
  templateUrl: './accueil.component.html', // Ensure this path is correct
  styleUrls: ['./accueil.component.scss'] // Ensure this path is correct
})
export class AccueilComponent implements OnInit {

  isMobileorTablet: boolean = false;
  user: string = "Bonnet Ostrean";
  selectedIndex: number = 0; // Index pour gérer les onglets
  searchQuery: string = '';
  searchResults: any[] = [];
  selectedDevice: any = null; // Pour afficher les détails d'un objet
  serviceSearchQuery: string = '';
  serviceSearchResults: any[] = [];

  constructor(private breakpointObserver: BreakpointObserver, private http: HttpClient) {
  }
  readonly dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(AjoutObjetDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  filtreDialog() {
    const dialogRef = this.dialog.open(FiltreDialogComponent,{
      panelClass: 'filtre-dialog',
      position:{right:'0'},
      height:'100vh',
      width:'30%',
    } );

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
  

  ngOnInit(): void {
    this.breakpointObserver.observe(['(max-width: 960px)'])
      .subscribe(result => {
        this.isMobileorTablet = result.matches;
      });
  }

  shouldSidenavBeOpened(): boolean {
    return !this.isMobileorTablet;
  }

  onTabChange(index: number): void {
    this.selectedIndex = index;
  }

  closeSidenav(): boolean {
    return !this.isMobileorTablet;
  }

  recordAction(actionCount: number): void {
    const userId = 'ID_UTILISATEUR'; // Remplacez par l'ID réel de l'utilisateur
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
    if (!this.searchQuery.trim()) {
      this.searchResults = [];
      return;
    }

    this.http.get<any[]>(`http://localhost:3000/api/devices/search?query=${this.searchQuery}`)
      .subscribe({
        next: (results) => this.searchResults = results,
        error: (err) => console.error('Erreur recherche :', err)
      });
  }

  searchService(): void {
    if (!this.serviceSearchQuery.trim()) {
      this.serviceSearchResults = [];
      return;
    }

    this.http.get<any[]>(`http://localhost:3000/api/services/search?query=${this.serviceSearchQuery}`)
      .subscribe({
        next: (results) => {
          console.log('Résultats de la recherche d\'outils/services :', results); // ✅ Vérifiez les résultats ici
          this.serviceSearchResults = results;
        },
        error: (err) => console.error('Erreur recherche outils/services :', err)
      });
  }
}
