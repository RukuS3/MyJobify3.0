import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-terminos-condiciones',
  templateUrl: './terminos-condiciones.page.html',
  styleUrls: ['./terminos-condiciones.page.scss'],
})
export class TerminosCondicionesPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goBack() {
    this.router.navigate(['/informacion']);
  }

}
