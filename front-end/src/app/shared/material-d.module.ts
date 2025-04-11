import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSidenavModule} from '@angular/material/sidenav';
const AngularComponents=[ MatButtonModule,
                          MatToolbarModule,
                          MatIconModule,
                          MatTabsModule,MatFormFieldModule,MatSidenavModule];

@NgModule({
    exports:[AngularComponents],
    imports: [AngularComponents],

  })
  export class MaterialDModule { }