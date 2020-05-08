import { Component, OnInit } from '@angular/core';
import { Page, PAGES } from '../shared/page.constants';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  cards: Page[] = PAGES;

  constructor() {
  }

  ngOnInit(): void {
  }

}
