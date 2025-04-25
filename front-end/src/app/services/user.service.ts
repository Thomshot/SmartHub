import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = 'http://localhost:3000/api/users';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // 🔍 Récupérer le profil par ID
  getProfile(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/profile/${userId}`);
  }

  // ✏️ Mettre à jour un profil
  updateProfile(userId: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/${userId}`, formData);
  }

  deleteUser(userId: string) {
    return this.http.delete(`${this.baseUrl}/${userId}`);
  }
}
