import { Component } from '@angular/core';
import { MaterialDModule } from '../shared/material-d.module';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-page-presentation',
  standalone: true,
  imports: [MaterialDModule,RouterModule],
  templateUrl: './page-presentation.component.html',
  styleUrl: './page-presentation.component.scss'
})
export class PagePresentationComponent {

}
