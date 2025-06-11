import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-privacidad-terminos',
  templateUrl: './privacidad-terminos.page.html',
  styleUrls: ['./privacidad-terminos.page.scss'],
})
export class PrivacidadTerminosPage implements OnInit {


  constructor(private router: Router) { }

  ngOnInit() {
  }

  goBack() {
    this.router.navigate(['/informacion']);
  }

}
