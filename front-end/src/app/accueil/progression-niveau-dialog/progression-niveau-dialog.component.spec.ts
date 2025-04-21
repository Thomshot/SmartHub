import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressionNiveauDialogComponent } from './progression-niveau-dialog.component';

describe('ProgressionNiveauDialogComponent', () => {
  let component: ProgressionNiveauDialogComponent;
  let fixture: ComponentFixture<ProgressionNiveauDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressionNiveauDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressionNiveauDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
