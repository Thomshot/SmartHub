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
  user: string = "Bonnet Ostrean";
  selectedIndex: number = 0; // Index pour gérer les onglets
  searchQuery: string = '';
  searchResults: any[] = [];
  searchTriggered: boolean = false;
  selectedDevice: any = null; // Pour afficher les détails d'un objet
  serviceSearchQuery: string = '';
  serviceSearchResults: any[] = [];
  serviceSearchTriggered: boolean = false;
  userSearchQuery: string = '';
  userSearchResults: any[] = [];
  userSearchTriggered: boolean = false;

  constructor(private breakpointObserver: BreakpointObserver, private http: HttpClient) {}

  ngOnInit(): void {
    this.breakpointObserver.observe(['(max-width: 960px)'])
      .subscribe(result => {
        this.isMobileorTablet = result.matches;
      });
      const name = localStorage.getItem('userName');
    const email = localStorage.getItem('userEmail');
    const id = localStorage.getItem('userId');

    if (name && email && id) {
      console.log(`✅ Connecté en tant que ${name} <${email}> (ID: ${id})`);
    }
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
    this.searchTriggered = true; // Set the flag to true when search is triggered
    if (!this.searchQuery.trim()) {
      this.searchResults = [];
      return;
    }

    this.http.get<any[]>(`http://localhost:3000/api/devices/search?query=${this.searchQuery}`)
      .subscribe({
        next: (results) => this.searchResults = results,
        error: (err) => {
          console.error('Error during device search:', err);
          this.searchResults = [];
        }
      });
  }

  searchService(): void {
    this.serviceSearchTriggered = true; // Set the flag to true when search is triggered
    if (!this.serviceSearchQuery.trim()) {
      this.serviceSearchResults = [];
      return;
    }

    this.http.get<any[]>(`http://localhost:3000/api/services/search?query=${this.serviceSearchQuery}`)
      .subscribe({
        next: (results) => this.serviceSearchResults = results,
        error: (err) => {
          console.error('Error during service search:', err);
          this.serviceSearchResults = [];
        }
      });
  }

  searchUser(): void {
    this.userSearchTriggered = true; // Set the flag to true when search is triggered
    console.log('Searching for user with login:', this.userSearchQuery);

    if (!this.userSearchQuery.trim()) {
      console.log('Search query is empty.');
      this.userSearchResults = [];
      return;
    }

    this.http.get<any>(`http://localhost:3000/api/users/search?login=${this.userSearchQuery}`)
      .subscribe({
        next: (result) => this.userSearchResults = result ? [result] : [],
        error: (err) => {
          console.error('Error during user search:', err);
          this.userSearchResults = [];
        }
      });
  }
}
