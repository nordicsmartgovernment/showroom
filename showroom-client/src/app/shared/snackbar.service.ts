import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SNACKBAR} from './snackbar-texts';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  hasShownIntroPopup = false;

  constructor(private snackBar: MatSnackBar) { }

  showIntroPopup() {
    if (!this.hasShownIntroPopup){
      this.hasShownIntroPopup = true;
      this.snackBar.open(SNACKBAR.overviewIntro, SNACKBAR.overviewIntroAction);
    }
  }
}
