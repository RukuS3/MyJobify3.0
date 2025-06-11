import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';  // Import Firestore
import { Router } from '@angular/router';

interface UsuarioData {
  role?: string;
  // Puedes añadir otras propiedades si quieres
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private firestore: AngularFirestore,    // Inyectar Firestore
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {}

  async onSubmit() {
    const { email, password } = this.loginForm.value;

    try {
      // Hacer login y obtener usuario
      const userCredential = await this.authService.login(email, password);
      const uid = userCredential.user?.uid;

      if (!uid) throw new Error('No se pudo obtener el UID del usuario');

      // Obtener el documento del usuario en Firestore
      const userDoc = await this.firestore.collection('usuarios').doc(uid).get().toPromise();

      if (!userDoc.exists) {
        throw new Error('Perfil de usuario no encontrado');
      }

      const userData = userDoc.data() as UsuarioData; 

      if (userData?.role === 'admin') {
        this.router.navigate(['/admin/panel']);  
      } else {
        this.router.navigate(['/inicio']);       
      }

    } catch (err: any) {
      alert('Error al iniciar sesión: ' + err.message);
    }
  }
}
