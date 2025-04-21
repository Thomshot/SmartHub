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

  filtres = {
    pieces: [
      { label: 'Cuisine', checked: false },
      { label: 'Salon', checked: false },
      { label: 'Chambre', checked: false },
      { label: 'Salle de bain', checked: false },
      { label: 'Garage', checked: false }
    ],
    etats: [
      { label: 'Allumé', checked: false },
      { label: 'Éteint', checked: false }
    ],
    connectivite: [
      { label: 'Connecté', checked: false },
      { label: 'Déconnecté', checked: false }
    ],
    types: [
      { label: 'Éclairage', checked: false },
      { label: 'Sécurité', checked: false },
      { label: 'Multimédia', checked: false },
      { label: 'Température', checked: false },
      { label: 'Électroménager', checked: false }
    ]
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

  fermer() {
    this.dialogRef.close();
  }
}
