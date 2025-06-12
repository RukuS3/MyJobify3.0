import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-apertura',
  templateUrl: './apertura.page.html',
  styleUrls: ['./apertura.page.scss'],
})
export class AperturaPage implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
    setTimeout(() => {
      this.router.navigateByUrl('/auth', { replaceUrl: true });
    }, 3000); // espera 3 segundos antes de redirigir
  }

}
