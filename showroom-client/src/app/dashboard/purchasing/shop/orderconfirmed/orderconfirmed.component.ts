import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-orderconfirmed',
  templateUrl: './orderconfirmed.component.html',
  styleUrls: ['./orderconfirmed.component.css']
})
export class OrderconfirmedComponent implements OnInit {

  public info = [];

  constructor(public dialogRef: MatDialogRef<OrderconfirmedComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {

    for (const [key, value] of Object.entries(data)) {
      this.info.push({ k: key.substr(1, key.length - 2), val: value });
    }

  }

  ngOnInit(): void {
  }

}
