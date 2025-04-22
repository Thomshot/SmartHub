import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AsyncPipe, CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

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
} from '@angular/material/dialog';

@Component({
  selector: 'app-ajout-objet-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatStepperModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    AsyncPipe
  ],
  templateUrl: './ajout-objet-dialog.component.html',
  styleUrl: './ajout-objet-dialog.component.scss'
})
export class AjoutObjetDialogComponent implements OnInit {

  private _formBuilder = inject(FormBuilder);
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar);

  isLinear = true;

  // Formulaires
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  thirdFormGroup!: FormGroup;

  // Autocomplete
  myControl = new FormControl('');
  options: string[] = [
    'Lampe', 'Ampoule connectée', 'Prise intelligente', 'Interrupteur connecté', 'Ruban LED',
    'Thermostat', 'Chauffage connecté', 'Climatisation', 'Radiateur connecté', 'Ventilateur connecté',
    'Déshumidificateur', 'Humidificateur', 'Réfrigérateur', 'Four', 'Micro-ondes', 'Lave-vaisselle',
    'Machine à laver', 'Sèche-linge', 'Bouilloire connectée', 'Cafetière connectée', 'Grille-pain connecté',
    'Aspirateur robot', 'Robot laveur de sol', 'Nettoyeur de vitres', 'Arrosage automatique',
    'Caméra de sécurité', 'Détecteur de mouvement', 'Détecteur de fumée', 'Détecteur de gaz', 'Alarme',
    'Capteur d’ouverture', 'Sonnette connectée', 'Serrure connectée', 'Volet roulant', 'Porte de garage connectée',
    'Interphone', 'Badge d’accès', 'Télévision connectée', 'Enceinte connectée', 'Assistant vocal',
    'Télécommande universelle', 'Console de jeu', 'Hub domotique', 'Panneau solaire', 'Station météo',
    'Capteur de qualité de l’air', 'Compteur d’énergie connecté', 'Capteur de luminosité', 'Capteur d’humidité'
  ];
  filteredOptions!: Observable<string[]>;

  // Liste des pièces
  rooms: string[] = [
    'Salon', 'Cuisine', 'Chambre', 'Salle de bain', 'Garage', 'Entrée',
    'Buanderie', 'Bureau', 'Jardin', 'Terrasse', 'Grenier'
  ];

  // Image upload
  previewUrl: string | ArrayBuffer | null = null;

  ngOnInit(): void {
    // Étape 1 : Choix du type d’objet
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', [Validators.required]], // Validation correcte pour le champ "Type d'objet"
    });

    // Étape 2 : Détails de l’objet
    this.secondFormGroup = this._formBuilder.group({
      objectName: ['', Validators.required],
      room: ['', Validators.required],
      brand: [''],
      id: [''],
    });

    // Étape 3 : Connectivité
    this.thirdFormGroup = this._formBuilder.group({
      ip: [''],
      mac: [''],
      protocol: [''],
    });

    // Autocomplete : filtrage des options
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option =>
      option.toLowerCase().includes(filterValue)
    );
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () => (this.previewUrl = reader.result);
      reader.readAsDataURL(input.files[0]);
    }
  }

  submitObject(): void {
    if (!this.firstFormGroup.valid || !this.secondFormGroup.valid) {
      this.snackBar.open('Veuillez remplir tous les champs obligatoires.', 'Fermer', { duration: 3000 });
      return;
    }

    const objectData = {
      idUnique: this.secondFormGroup.value.id || `Device-${Date.now()}`,
      nom: this.secondFormGroup.value.objectName,
      type: this.firstFormGroup.value.firstCtrl, // Récupération correcte du champ "Type d'objet"
      statutActuel: 'Inactif',
      couleurActuelle: 'N/A',
      connectivite: this.thirdFormGroup.value.protocol || 'N/A',
      etats: ['Inactif', 'Actif'],
      fonctionnalités: ['Fonctionnalité 1', 'Fonctionnalité 2'],
      luminosite: 'N/A',
      ...this.secondFormGroup.value,
      ...this.thirdFormGroup.value,
    };

    this.http.post('http://localhost:3000/api/devices/create', objectData).subscribe({
      next: () => {
        console.log('Objet ajouté à la base de données ✅');
        this.snackBar.open('Objet créé avec succès !', 'Fermer', { duration: 3000 });
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout de l\'objet :', err);
        const errorMessage = err.error?.message || 'Erreur serveur.';
        this.snackBar.open(`Erreur : ${errorMessage}`, 'Fermer', { duration: 3000 });
      },
    });
  }
}
