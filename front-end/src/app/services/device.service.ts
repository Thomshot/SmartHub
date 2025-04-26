import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  private apiUrl = 'http://localhost:3000/api/devices'; // Remplacez par l'URL de votre API

  constructor(private http: HttpClient) {}

  // Méthode pour ajouter un objet
  addDevice(deviceData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, deviceData);
  }

  // Méthode pour récupérer tous les objets
  getAllDevices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

  updateDeviceStatus(deviceId: string, newStatus: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/update-status`, { deviceId, newStatus });
  }
}