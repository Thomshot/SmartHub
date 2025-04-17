import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="verification-container">
      <div class="box">
        <div *ngIf="success; else errorTemplate" class="success">
          <h2>✅ Vérification réussie</h2>
          <p>{{ message }}</p>
        </div>

        <ng-template #errorTemplate>
          <div class="error">
            <h2>❌ Vérification échouée</h2>
            <p>{{ message }}</p>
          </div>
        </ng-template>

        <button (click)="router.navigate(['/'])">🏠 Retour à l'accueil</button>
      </div>
    </div>
  `,
  styles: [`
    .verification-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #000;
      color: white;
    }
    .box {
      background: #111;
      border-radius: 10px;
      padding: 40px;
      box-shadow: 0 0 20px rgba(255, 152, 0, 0.5);
      text-align: center;
      max-width: 500px;
      width: 90%;
    }
    .success h2 {
      color: #4caf50;
    }
    .error h2 {
      color: #f44336;
    }
    button {
      margin-top: 20px;
      background-color: #ff9800;
      color: #000;
      border: none;
      padding: 12px 24px;
      border-radius: 6px;
      font-size: 1rem;
      cursor: pointer;
      transition: 0.3s ease;
    }
    button:hover {
      background-color: #e67e22;
    }
  `]
})
export class EmailVerificationComponent implements OnInit {
  success = false;
  message = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    public router: Router
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (token) {
      this.http.get(`http://localhost:3000/api/verify?token=${token}`).subscribe({
        next: (res: any) => {
          this.success = true;
          this.message = res.message;
        },
        error: (err) => {
          this.success = false;
          this.message = err.error?.message || 'Erreur de vérification.';
        }
      });
    } else {
      this.success = false;
      this.message = 'Lien invalide ou token manquant.';
    }
  }
}
