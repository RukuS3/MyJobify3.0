import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';  // <-- agrego Router para la navegación
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-ver-perfil-detalle',
  templateUrl: './ver-perfil-detalle.page.html',
  styleUrls: ['./ver-perfil-detalle.page.scss'],
})
export class VerPerfilDetallePage implements OnInit {

  perfil: any = null;
  puedeVerDatosPrivados = false;

  mostrarIsla: boolean = false;
  calificacion: number = 0;
  comentario: string = '';

  // Denuncia
  mostrarPanelDenuncia: boolean = false;
  motivoDenuncia: string = '';
  detalleDenuncia: string = '';
  archivo: File | null = null;
  archivoUrl: string | null = null;

  usuarioDenunciadoUid: string = '';
  usuarioDenuncianteUid: string = '';

  yaCalifico: boolean = false;

  // NUEVO: Para controlar si ya denunció
  yaDenuncio: boolean = false;

  // NUEVO: Para indicar si es el perfil propio
  esPerfilPropio: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    private auth: AngularFireAuth,
    private storage: AngularFireStorage,
    private router: Router   // <-- inyecto Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const uid = params['uid'];
      if (uid) {
        this.usuarioDenunciadoUid = uid;
        this.cargarPerfil(uid);
        this.verificarDenunciaPrevia(uid);
      }
    });

    this.auth.authState.subscribe(user => {
      this.puedeVerDatosPrivados = !!user;
      if (user) {
        this.usuarioDenuncianteUid = user.uid;
        this.esPerfilPropio = (user.uid === this.usuarioDenunciadoUid);
      }
    });
  }

  cargarPerfil(uid: string) {
    this.afs.collection('usuarios').doc(uid).valueChanges().subscribe(data => {
      this.perfil = data;

      // Cargar calificaciones
      this.afs.collection('usuarios').doc(uid).collection('calificaciones').valueChanges()
        .subscribe((calificaciones: any[]) => {
          if (calificaciones.length > 0) {
            const suma = calificaciones.reduce((acc, val) => acc + val.calificacion, 0);
            this.perfil.promedioCalificacion = (suma / calificaciones.length).toFixed(1);
            this.perfil.totalCalificaciones = calificaciones.length;
          } else {
            this.perfil.promedioCalificacion = null;
            this.perfil.totalCalificaciones = 0;
          }
        });

    }, error => {
      console.error('Error al cargar perfil:', error);
    });
  }

  // NUEVO: Verificar si ya denunció este usuario
  verificarDenunciaPrevia(uidDenunciado: string) {
    if (!this.usuarioDenuncianteUid) return;

    this.afs.collection('denunciasUsuarios', ref =>
      ref.where('denuncianteUid', '==', this.usuarioDenuncianteUid)
         .where('denunciadoUid', '==', uidDenunciado)
    ).get().subscribe(snapshot => {
      this.yaDenuncio = !snapshot.empty;
    });
  }

  denunciarUsuario() {
    if (this.esPerfilPropio) {
      alert('No puedes denunciar tu propio perfil.');
      return;
    }
    this.mostrarPanelDenuncia = true;
  }

  onFileSelected(event: any) {
    this.archivo = event.target.files[0] || null;
  }

  async enviarDenuncia() {
    if (!this.usuarioDenuncianteUid) {
      alert('Debes iniciar sesión para denunciar.');
      return;
    }

    if (!this.motivoDenuncia || !this.detalleDenuncia) {
      alert('Completa todos los campos.');
      return;
    }

    const denunciaBase: any = {
      motivo: this.motivoDenuncia,
      descripcion: this.detalleDenuncia,
      fecha: new Date().toISOString(),
      denuncianteUid: this.usuarioDenuncianteUid,
      denunciadoUid: this.usuarioDenunciadoUid,
      pruebaUrl: null
    };

    try {
      if (this.archivo) {
        if (!this.archivo.type.startsWith('image/') && !this.archivo.type.includes('pdf')) {
          alert('Solo se permiten imágenes o PDFs.');
          return;
        }

        const path = `denuncias_pruebas/${Date.now()}_${this.archivo.name}`;
        const fileRef = this.storage.ref(path);
        const task = this.storage.upload(path, this.archivo);

        task.snapshotChanges().pipe(
          finalize(async () => {
            try {
              const url = await fileRef.getDownloadURL().toPromise();
              denunciaBase.pruebaUrl = url;
              await this.afs.collection('denunciasUsuarios').add(denunciaBase);
              this.yaDenuncio = true;  // Marcar que ya denunció
              this.resetFormulario();
            } catch (error) {
              console.error('Error al obtener URL de descarga:', error);
              alert('Error al subir el archivo.');
            }
          })
        ).subscribe({
          error: (uploadError) => {
            console.error('Error al subir archivo:', uploadError);
            alert('No se pudo subir el archivo de prueba.');
          }
        });

      } else {
        await this.afs.collection('denunciasUsuarios').add(denunciaBase);
        this.yaDenuncio = true;  // Marcar que ya denunció
        this.resetFormulario();
      }
    } catch (error) {
      console.error('Error al enviar la denuncia:', error);
      alert('Error al enviar la denuncia.');
    }
  }

  async resetFormulario() {
    this.mostrarPanelDenuncia = false;
    this.motivoDenuncia = '';
    this.detalleDenuncia = '';
    this.archivo = null;
    this.archivoUrl = null;

    const alerta = document.createElement('ion-alert');
    alerta.header = 'Denuncia enviada';
    alerta.message = 'Tu denuncia fue enviada y será revisada más tarde.';
    alerta.buttons = ['OK'];
    document.body.appendChild(alerta);
    await alerta.present();
  }

  enviarCalificacion() {
    if (this.calificacion < 1) {
      alert('Selecciona una calificación.');
      return;
    }

    if(this.yaCalifico) {
      alert('Ya has calificado a este usuario.');
      return;
    }

    const nuevaCalificacion = {
      calificacion: this.calificacion,
      comentario: this.comentario,
      fecha: new Date().toISOString(),
      evaluadorUid: this.usuarioDenuncianteUid
    };

    this.afs.collection('usuarios').doc(this.usuarioDenunciadoUid)
      .collection('calificaciones')
      .add(nuevaCalificacion)
      .then(async () => {
        this.yaCalifico = true;
        this.mostrarIsla = false;
        this.calificacion = 0;
        this.comentario = '';
        alert('¡Gracias por calificar!');

        // Aquí borramos la solicitud del usuario calificado
        await this.eliminarSolicitudCalificada();

        // Redirigir a seguridad/inicio
        this.router.navigate(['/inicio']);
      })
      .catch(error => {
        console.error('Error al guardar la calificación:', error);
        alert('Ocurrió un error al enviar la calificación.');
      });
  }

  eliminarPublicacion() {
    console.log('Eliminar publicación');
  }

  async eliminarSolicitudCalificada() {
    if (!this.usuarioDenuncianteUid || !this.usuarioDenunciadoUid) return;

    try {
      // La colección de solicitudes recibidas del creador (usuario actual)
      const solicitudesRef = this.afs.collection('Solicitudes').doc(this.usuarioDenuncianteUid).collection('solicitudesRecibidas', ref =>
        ref.where('solicitanteUid', '==', this.usuarioDenunciadoUid)
      );

      const snapshot = await solicitudesRef.get().toPromise();
      snapshot.forEach(doc => {
        doc.ref.delete();
      });
    } catch (error) {
      console.error('Error al eliminar solicitud calificada:', error);
    }
  }

}
