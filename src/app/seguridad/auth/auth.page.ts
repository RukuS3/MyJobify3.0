import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences'; // 👈 Importar Preferences

interface UsuarioData {
  role?: string;
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
    private firestore: AngularFirestore,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false], // 👈 Agregado
    });
  }

  async ngOnInit() {
    // 👇 Leer UID guardado (si existe) y redirigir automáticamente
    const session = await Preferences.get({ key: 'user_session' });
    if (session.value) {
      const { uid } = JSON.parse(session.value);
      const userDoc = await this.firestore.collection('usuarios').doc(uid).get().toPromise();

      if (userDoc?.exists) {
        const userData = userDoc.data() as UsuarioData;
        if (userData?.role === 'admin') {
          this.router.navigate(['/admin/panel']);
        } else {
          this.router.navigate(['/inicio']);
        }
      }
    }
  }

  async onSubmit() {
    const { email, password, rememberMe } = this.loginForm.value;

    try {
      const userCredential = await this.authService.login(email, password);
      const uid = userCredential.user?.uid;

      if (!uid) throw new Error('No se pudo obtener el UID del usuario');

      // Si el usuario eligió "Recordarme", guardamos el UID localmente
      if (rememberMe) {
        await Preferences.set({
          key: 'user_session',
          value: JSON.stringify({ uid }),
        });
      } else {
        await Preferences.remove({ key: 'user_session' });
      }

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
