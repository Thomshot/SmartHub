import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialDModule } from '../shared/material-d.module';
import { BreakpointObserver } from '@angular/cdk/layout';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { OnInit } from '@angular/core';
import { ProfilComponent } from '../profil/profil.component'; // ✅ Import du composant profil

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [MaterialDModule, CommonModule, ProfilComponent], // ✅ Ajout ici
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent implements OnInit {
  isMobileorTablet: boolean = false;
  selectedIndex: number = 0;

  constructor(private breakpointObserver: BreakpointObserver) {}

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
}