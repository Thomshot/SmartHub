import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  // 🔍 Récupérer le profil par ID
  getProfile(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/profile/${userId}`);
  }

  // ✏️ Mettre à jour un profil
  updateProfile(userId: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/${userId}`, formData);
  }
}
