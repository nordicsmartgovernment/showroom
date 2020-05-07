import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  cards = [
    { title: 'Create a company' },
    { title: 'Something else' },
    { title: 'Something else' },
    { title: 'Something else' },
    { title: 'Something else' }
  ];

  constructor() {
  }

  ngOnInit(): void {
  }

}
