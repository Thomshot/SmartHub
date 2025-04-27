import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AsyncPipe, CommonModule } from '@angular/common';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
  MatDialogRef
} from '@angular/material/dialog';


@Component({
  selector: 'app-filtre-dialog',
  standalone: true,
  imports: [MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,MatCheckboxModule,CommonModule, FormsModule, MatButtonModule ],
  templateUrl: './filtre-dialog.component.html',
  styleUrl: './filtre-dialog.component.scss'
})
export class FiltreDialogComponent {
  constructor(private dialogRef: MatDialogRef<FiltreDialogComponent>) {}

  showAllTypes = false; // Controls the visibility of the full list of object types
  showAllRooms = false; // Controls the visibility of the full list of rooms

  filtres = {
    types: [
      { label: 'Alarme', checked: false }, { label: 'Ampoule connectée', checked: false },
      { label: 'Arrosage automatique', checked: false }, { label: 'Assistant vocal', checked: false },
      { label: 'Badge d’accès', checked: false }, { label: 'Bouilloire connectée', checked: false },
      { label: 'Cafetière connectée', checked: false }, { label: 'Caméra connectée', checked: false },
      { label: 'Capteur connecté', checked: false }, { label: 'Capteur d’humidité', checked: false },
      { label: 'Capteur d’ouverture', checked: false }, { label: 'Capteur de luminosité', checked: false },
      { label: 'Capteur de qualité de l’air', checked: false }, { label: 'Chauffage connecté', checked: false },
      { label: 'Climatisation', checked: false }, { label: 'Compteur d’énergie connecté', checked: false },
      { label: 'Console de jeu', checked: false }, { label: 'Déshumidificateur', checked: false },
      { label: 'Détecteur de fumée', checked: false }, { label: 'Détecteur de gaz', checked: false },
      { label: 'Détecteur de mouvement', checked: false }, { label: 'Enceinte connectée', checked: false },
      { label: 'Four', checked: false }, { label: 'Grille-pain connecté', checked: false },
      { label: 'Hub domotique', checked: false }, { label: 'Humidificateur', checked: false },
      { label: 'Interphone', checked: false }, { label: 'Interrupteur connecté', checked: false },
      { label: 'Lampe connectée', checked: false }, { label: 'Lave-vaisselle', checked: false },
      { label: 'Machine à laver', checked: false }, { label: 'Micro-ondes', checked: false },
      { label: 'Nettoyeur de vitres', checked: false }, { label: 'Panneau solaire', checked: false },
      { label: 'Porte de garage connectée', checked: false }, { label: 'Prise intelligente', checked: false },
      { label: 'Radiateur connecté', checked: false }, { label: 'Réfrigérateur connecté', checked: false },
      { label: 'Robot aspirateur', checked: false }, { label: 'Robot laveur de sol', checked: false },
      { label: 'Ruban LED', checked: false }, { label: 'Sèche-linge', checked: false },
      { label: 'Serrure connectée', checked: false }, { label: 'Sonnette connectée', checked: false },
      { label: 'Station météo', checked: false }, { label: 'Télécommande universelle', checked: false },
      { label: 'Télévision connectée', checked: false }, { label: 'Thermostat intelligent', checked: false },
      { label: 'Ventilateur connecté', checked: false }, { label: 'Volet roulant', checked: false }
    ].sort((a, b) => a.label.localeCompare(b.label)), // Sort types alphabetically
    etats: [
      { label: 'Allumé', checked: false },
      { label: 'Éteint', checked: false }
    ],
    connectivite: [
      { label: 'Wi-Fi', checked: false },
      { label: 'Bluetooth', checked: false }
    ],
    pieces: [
      { label: 'Buanderie', checked: false },
      { label: 'Bureau', checked: false },
      { label: 'Chambre', checked: false },
      { label: 'Cuisine', checked: false },
      { label: 'Entrée', checked: false },
      { label: 'Garage', checked: false },
      { label: 'Grenier', checked: false },
      { label: 'Jardin', checked: false },
      { label: 'Salle de bain', checked: false },
      { label: 'Salon', checked: false },
      { label: 'Terrasse', checked: false }
    ].sort((a, b) => a.label.localeCompare(b.label)) // Sort rooms alphabetically
  };

  appliquerFiltres() {
    const result = {
      pieces: this.filtres.pieces.filter(f => f.checked).map(f => f.label),
      etats: this.filtres.etats.filter(f => f.checked).map(f => f.label),
      connectivite: this.filtres.connectivite.filter(f => f.checked).map(f => f.label),
      types: this.filtres.types.filter(f => f.checked).map(f => f.label)
    };
    console.log('Filtres sélectionnés ✅', result);
    this.dialogRef.close(result);
  }

  resetFiltres() {
    (Object.keys(this.filtres) as (keyof typeof this.filtres)[]).forEach((key) => {
      this.filtres[key].forEach((filter: { label: string; checked: boolean }) => filter.checked = false);
    });
    console.log('Filtres réinitialisés ✅');
    this.dialogRef.close(null); // Fermer le dialogue sans appliquer de filtres
  }

  fermer() {
    this.dialogRef.close();
  }
}
