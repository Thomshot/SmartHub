import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card'; // ✅ Manquait pour <mat-card> et <mat-card-actions>
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatDialogModule} from '@angular/material/dialog';
import {MatStepperModule} from '@angular/material/stepper';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatCheckboxModule} from '@angular/material/checkbox';
const AngularComponents = [
  MatButtonModule,
  MatToolbarModule,
  MatIconModule,
  MatTabsModule,
  MatFormFieldModule,
  MatSidenavModule,
  MatInputModule,     // ✅ pour les champs <input matInput>
  MatCardModule,       // ✅ pour les composants <mat-card>
  MatProgressBarModule,
  MatListModule,
  MatMenuModule,
  MatDialogModule,
  MatStepperModule,
  MatAutocompleteModule,
  MatCheckboxModule,
];

@NgModule({
  exports: [AngularComponents],
  imports: [AngularComponents]
})
export class MaterialDModule {}
