import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card'; // ✅ Manquait pour <mat-card> et <mat-card-actions>

const AngularComponents = [
  MatButtonModule,
  MatToolbarModule,
  MatIconModule,
  MatTabsModule,
  MatFormFieldModule,
  MatSidenavModule,
  MatInputModule,     // ✅ pour les champs <input matInput>
  MatCardModule       // ✅ pour les composants <mat-card>
];

@NgModule({
  exports: [AngularComponents],
  imports: [AngularComponents]
})
export class MaterialDModule {}
