import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-orderconfirmed',
  templateUrl: './orderconfirmed.component.html',
  styleUrls: ['./orderconfirmed.component.css']
})
export class OrderconfirmedComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<OrderconfirmedComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  ngOnInit(): void {
  }

}
