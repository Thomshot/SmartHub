import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
const AngularComponents=[ MatButtonModule,
                          MatToolbarModule,
                          MatIconModule,
                          MatTabsModule,MatFormFieldModule,MatSidenavModule,MatProgressBarModule, MatInputModule, MatCardModule,MatListModule];

@NgModule({
    exports:[AngularComponents],
    imports: [AngularComponents],

  })
  export class MaterialDModule { }