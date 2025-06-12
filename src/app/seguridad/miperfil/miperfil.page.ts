import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-miperfil',
  templateUrl: './miperfil.page.html',
  styleUrls: ['./miperfil.page.scss'],
})
export class MiperfilPage implements OnInit {
  telefono: string = '';
  correo: string = '';
  direccion: string = '';
  nombre: string = '';
  apellido: string = '';
  rut: string = '';
  fotoPerfil: string = 'https://placehold.co/150x150';

  editandoTelefono = false;
  editandoCorreo = false;
  editandoDireccion = false;

  uid: string = '';

  promedioCalificacion: number | null = null;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.cargarDatosUsuario();
  }

  async cargarDatosUsuario() {
    const user = await this.afAuth.currentUser;
    if (!user) {
      console.error('Usuario no autenticado');
      return;
    }

    this.uid = user.uid;

    this.afs.collection('usuarios').doc(this.uid).valueChanges().subscribe((data: any) => {
      if (data) {
        this.telefono = data.telefono || '';
        this.correo = data.email || user.email || '';
        this.direccion = data.direccion || '';
        this.nombre = data.nombre || '';
        this.apellido = data.apellido || '';
        this.rut = data.rut || '';
        this.fotoPerfil = data.fotoUrl || this.fotoPerfil;
      }
    });

    // Cargar calificaciones y calcular promedio
    this.afs.collection(`usuarios/${this.uid}/calificaciones`).valueChanges().subscribe((calificaciones: any[]) => {
      if (calificaciones.length > 0) {
        const total = calificaciones.reduce((sum, c) => sum + (c.calificacion || 0), 0);
        this.promedioCalificacion = Number((total / calificaciones.length).toFixed(1));
      } else {
        this.promedioCalificacion = null;
      }
    });
  }

  obtenerEstrellas(promedio: number): string[] {
    const estrellas: string[] = [];
    const enteras = Math.floor(promedio);
    const decimal = promedio - enteras;

    for (let i = 0; i < enteras; i++) {
      estrellas.push('star');
    }
    if (decimal >= 0.25 && decimal < 0.75) {
      estrellas.push('star-half');
    } else if (decimal >= 0.75) {
      estrellas.push('star');
    }
    while (estrellas.length < 5) {
      estrellas.push('star-outline');
    }
    return estrellas;
  }

  async cambiarFotoPerfil() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
      });

      this.fotoPerfil = image.dataUrl;
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
    }
  }

  guardarCambios() {
    if (!this.uid) {
      console.error('UID no disponible para guardar cambios');
      return;
    }

    this.afs.collection('usuarios').doc(this.uid).update({
      telefono: this.telefono,
      email: this.correo,
      direccion: this.direccion,
      fotoUrl: this.fotoPerfil,
      nombre: this.nombre,
      apellido: this.apellido,
      rut: this.rut,
    }).then(() => {
      console.log('Datos actualizados correctamente');
      this.editandoTelefono = false;
      this.editandoCorreo = false;
      this.editandoDireccion = false;
    }).catch(err => {
      console.error('Error al actualizar datos:', err);
    });
  }

  async logout() {
    const alert = await this.alertController.create({
      header: '¿Cerrar sesión?',
      message: '¿Estás seguro de que deseas cerrar sesión?',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-button-cancel'
        },
        {
          text: 'Cerrar sesión',
          handler: () => {
            this.authService.logout().then(() => {
              this.router.navigate(['/auth']);
            }).catch(err => {
              console.error('Error al cerrar sesión:', err);
            });
          },
          cssClass: 'alert-button-confirm'
        }
      ]
    });

    await alert.present();
  }

}
