import { Component, OnInit } from '@angular/core';

const DASHBOARD_WIDGETS = [
  { title: 'Create a company' },
  { title: 'Purchasing' },
  { title: 'Ordering' },
  { title: 'Something else' },
  { title: 'Something else' },
  { title: 'Something else' },
  { title: 'Something else' }
];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  cards = DASHBOARD_WIDGETS;

  constructor() {
  }

  ngOnInit(): void {
  }

}
