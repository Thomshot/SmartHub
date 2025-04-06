import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  isLoginPopupVisible: boolean = false;

  openLoginPopup(): void {
    console.log('Popup ouverte via PopupService');
    this.isLoginPopupVisible = true;
  }

  closeLoginPopup(): void {
    console.log('Popup fermée via PopupService');
    this.isLoginPopupVisible = false;
  }
}