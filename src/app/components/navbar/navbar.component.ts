import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent  {
  public linkButtons = [
  { title: 'Movies', url:'/movies' },
  { title: 'TV Series', url:'/series' },
  { title: 'Comics', url:'/comics' },
  { title: 'Art', url:'/art' },
  ];

}
