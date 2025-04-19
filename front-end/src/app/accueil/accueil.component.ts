import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialDModule } from '../shared/material-d.module';
import { BreakpointObserver } from '@angular/cdk/layout';
import { FormControl, FormsModule } from '@angular/forms'; // ✅ Import FormsModule
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { OnInit } from '@angular/core';
import { ProfilComponent } from '../profil/profil.component'; // ✅ Import du composant profil
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [MaterialDModule, CommonModule, ProfilComponent, FormsModule], // ✅ Add FormsModule here
  templateUrl: './accueil.component.html', // Ensure this path is correct
  styleUrls: ['./accueil.component.scss'] // Ensure this path is correct
})
export class AccueilComponent implements OnInit {
  isMobileorTablet: boolean = false;
  user: string="Bonnet Ostrean";
  selectedIndex:number=0;
  searchQuery: string = '';
  searchResults: any[] = [];
  selectedDevice: any = null; // Pour afficher les détails d'un objet

  constructor(private breakpointObserver: BreakpointObserver, private http: HttpClient) {}

  ngOnInit(): void {
    this.breakpointObserver.observe(['(max-width: 960px)'])
      .subscribe(result => {
        this.isMobileorTablet = result.matches;
      });
  }

  shouldSidenavBeOpened(): boolean {
    return !this.isMobileorTablet;
  }

  onTabChange(index:number){
    this.selectedIndex=index;
  }

  closeSidenav():boolean {
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
        next: (results) => {
          console.log('Résultats de la recherche :', results); // ✅ Inspectez les données ici
          this.searchResults = results;
        },
        error: (err) => console.error('Erreur recherche :', err)
      });
  }
}
