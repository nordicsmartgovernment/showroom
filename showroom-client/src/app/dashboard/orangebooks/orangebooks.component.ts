import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-orangebooks',
  templateUrl: './orangebooks.component.html',
  styleUrls: ['./orangebooks.component.css']
})
export class OrangebooksComponent implements OnInit {
  orangeBooksUrl = '';


  constructor() {
  }

  ngOnInit(): void {
    this.orangeBooksUrl = 'https://mb.orangebooks.co/embed/dashboard/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXNvdXJjZSI6eyJkYXNoYm9hcmQiOjl9LCJwYXJhbXMiOnt9LCJleHAiOjE2NTQ4MTQ0NjIsImlhdCI6MTU5NDgxNDQ2Mn0.GGfT58UvZYE6jOlZXShfFtXeuuxKJLjfG_l_ywvcW44';
  }
}
