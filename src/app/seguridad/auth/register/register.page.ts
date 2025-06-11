import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      rut: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]], // Solo 8 dígitos
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {}

  validateRut(rut: string): boolean {
    const cleanRut = rut.replace(/^0+|[^0-9kK]+/g, '').toUpperCase();
    if (cleanRut.length < 2) return false;

    const body = cleanRut.slice(0, -1);
    const dv = cleanRut.slice(-1);

    let sum = 0;
    let multiplier = 2;

    for (let i = body.length - 1; i >= 0; i--) {
      sum += parseInt(body.charAt(i), 10) * multiplier;
      multiplier = multiplier < 7 ? multiplier + 1 : 2;
    }

    const expectedDv = 11 - (sum % 11);
    let expectedDvStr = '';

    if (expectedDv === 11) expectedDvStr = '0';
    else if (expectedDv === 10) expectedDvStr = 'K';
    else expectedDvStr = expectedDv.toString();

    return dv === expectedDvStr;
  }

  async onRegister() {
    let { email, password, rut, nombre, apellido, telefono } = this.registerForm.value;

    if (!this.validateRut(rut)) {
      alert('El RUT ingresado no es válido.');
      return;
    }

    // Agregar prefijo chileno +56 9
    telefono = '+569' + telefono;

    try {
      const rutExists = await this.authService.checkRutExists(rut);
      if (rutExists) {
        alert('El RUT ya está registrado.');
        return;
      }

      const emailExists = await this.authService.checkEmailExists(email);
      if (emailExists) {
        alert('El correo ya está registrado.');
        return;
      }

      const telefonoExists = await this.authService.checkTelefonoExists(telefono);
      if (telefonoExists) {
        alert('El teléfono ya está registrado.');
        return;
      }

      // Registrar usuario y obtener userCredential
      const userCredential = await this.authService.register(email, password, rut, nombre, apellido, telefono);

      // Enviar correo de verificación
      if (userCredential && userCredential.user) {
        await userCredential.user.sendEmailVerification();
        alert('Registro exitoso. Se ha enviado un correo de verificación. Por favor revisa tu correo antes de iniciar sesión.');
        this.router.navigate(['/auth']);
      } else {
        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        this.router.navigate(['/auth']);
      }

    } catch (error: any) {
      alert('Error al registrarse: ' + error.message);
    }
  }
}
