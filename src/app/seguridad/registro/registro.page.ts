import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone:false
})
export class RegistroPage implements OnInit {

  nombre: string ='';
  rut: string = '';       
  password: string = '';
  correo: string ='';
  password2: string='';


  constructor(private router: Router) { }

  ngOnInit() {
    // Inicialización si es necesario
  }


  login() {
    if (this.rut && this.password) {
      console.log('Iniciando sesión con:', this.rut, this.password);
      

      this.router.navigateByUrl('/home');
    } else {
      console.error('Por favor ingrese su RUT y su contraseña.');
    }
  }

  // Redirigir a recuperación de contraseña
  forgotPassword() {
    console.log('Redirigiendo a la página de recuperación de contraseña...');
 
  }

  // Redirigir a registro
  goToRegister() {
    console.log('Redirigiendo a la página de registro...');

  }
}