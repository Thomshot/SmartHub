import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltreDialogComponent } from './filtre-dialog.component';

describe('FiltreDialogComponent', () => {
  let component: FiltreDialogComponent;
  let fixture: ComponentFixture<FiltreDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltreDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltreDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
