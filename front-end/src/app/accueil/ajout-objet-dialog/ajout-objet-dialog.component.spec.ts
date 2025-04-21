import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutObjetDialogComponent } from './ajout-objet-dialog.component';

describe('AjoutObjetDialogComponent', () => {
  let component: AjoutObjetDialogComponent;
  let fixture: ComponentFixture<AjoutObjetDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutObjetDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjoutObjetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
