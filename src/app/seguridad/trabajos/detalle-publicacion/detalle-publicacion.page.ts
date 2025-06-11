import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavController, AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-detalle-publicacion',
  templateUrl: './detalle-publicacion.page.html',
  styleUrls: ['./detalle-publicacion.page.scss'],
})
export class DetallePublicacionPage implements OnInit {
  publicacion: any;
  usuarioActualUid: string | null = null;
  solicitudEnviada: boolean = false;
  estadoSolicitud: string | null = null;
  datosCargados: boolean = false;
  usuarioCreador: any = null;
  reporteEnviado: boolean = false;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    private auth: AngularFireAuth,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  goBack() {
    this.navCtrl.back();
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.auth.currentUser.then(user => {
      this.usuarioActualUid = user ? user.uid : null;

      if (id) {
        this.afs.collection('Publicacion').doc(id).valueChanges().subscribe(pub => {
          this.publicacion = pub;

          if (this.publicacion) {
            this.publicacion.id = id;
          }

          if (this.publicacion?.usuarioId) {
            this.cargarUsuarioCreador(this.publicacion.usuarioId);
            this.cargarSolicitud();
            this.verificarReporte();
          }
        });
      }
    });
  }

  cargarUsuarioCreador(usuarioId: string) {
    this.afs.collection('usuarios').doc(usuarioId).valueChanges().subscribe(usuario => {
      this.usuarioCreador = usuario;

      // Obtener promedio de calificaciones del usuario
      this.afs.collection(`usuarios/${usuarioId}/calificaciones`)
        .valueChanges()
        .subscribe((calificaciones: any[]) => {
          if (calificaciones.length > 0) {
            const total = calificaciones.reduce((sum, cal) => sum + (cal.calificacion || 0), 0);
            const promedio = total / calificaciones.length;
            this.usuarioCreador.promedioCalificacion = Number(promedio.toFixed(1));
          } else {
            this.usuarioCreador.promedioCalificacion = null;
          }
        });
    });
  }

  cargarSolicitud() {
    if (this.usuarioActualUid && this.publicacion?.usuarioId && this.publicacion.id) {
      this.afs.collection('Solicitudes').doc(this.publicacion.usuarioId)
        .collection('solicitudesRecibidas', ref =>
          ref
            .where('solicitanteUid', '==', this.usuarioActualUid)
            .where('publicacionId', '==', this.publicacion.id)
        )
        .valueChanges({ idField: 'id' })
        .subscribe(solicitudes => {
          if (solicitudes.length > 0) {
            this.solicitudEnviada = true;
            this.estadoSolicitud = solicitudes[0]['estado'];
          } else {
            this.solicitudEnviada = false;
            this.estadoSolicitud = null;
          }
          this.datosCargados = true;
        }, error => {
          console.error('Error al cargar solicitud:', error);
          this.datosCargados = true;
        });
    } else {
      this.datosCargados = true;
    }
  }

  verificarReporte() {
    if (!this.usuarioActualUid || !this.publicacion?.id) {
      this.reporteEnviado = false;
      return;
    }

    this.afs.collection('Reportes', ref =>
      ref.where('publicacionId', '==', this.publicacion.id)
         .where('reportanteUid', '==', this.usuarioActualUid)
    ).valueChanges().subscribe(reportes => {
      this.reporteEnviado = reportes.length > 0;
    }, error => {
      console.error('Error al verificar reporte:', error);
      this.reporteEnviado = false;
    });
  }

  async enviarSolicitud() {
    if (!this.usuarioActualUid || !this.publicacion) return;
    if (this.usuarioActualUid === this.publicacion.usuarioId) return;
    if (this.solicitudEnviada && this.estadoSolicitud === 'rechazada') return;
    if (this.solicitudEnviada) return;

    try {
      const usuarioDoc = await this.afs.collection('usuarios').doc(this.usuarioActualUid).get().toPromise();
      const usuarioData = usuarioDoc?.data() as {
        nombre: string;
        apellido: string;
        fotoUrl: string;
      };

      if (!usuarioData) return;

      const solicitud = {
        publicacionId: this.publicacion.id,
        solicitanteUid: this.usuarioActualUid,
        fechaSolicitud: new Date(),
        estado: 'pendiente',
        solicitanteNombre: usuarioData.nombre || '',
        solicitanteApellido: usuarioData.apellido || '',
        solicitanteFoto: usuarioData.fotoUrl || '',
        agregarfoto: this.publicacion.agregarfoto || ''
      };

      await this.afs.collection('Solicitudes')
        .doc(this.publicacion.usuarioId)
        .collection('solicitudesRecibidas')
        .add(solicitud);

      this.solicitudEnviada = true;
      this.estadoSolicitud = 'pendiente';

    } catch (error) {
      console.error('Error al enviar solicitud:', error);
    }
  }

  async abrirDialogoReporte() {
    const alert = await this.alertCtrl.create({
      header: 'Reportar publicación',
      cssClass: 'custom-alert',
      inputs: [
        {
          name: 'motivo',
          type: 'textarea',
          placeholder: 'Describe el motivo del reporte...',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-button-cancel'
        },
        {
          text: 'Enviar',
          cssClass: 'alert-button-confirm',
          handler: (data) => {
            if (!data.motivo || data.motivo.trim().length < 5) {
              this.mostrarToast('Debes ingresar un motivo válido para reportar.', 'warning');
              return false;
            }
            this.enviarReporte(data.motivo.trim());
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  async enviarReporte(motivo: string) {
    if (!this.usuarioActualUid || !this.publicacion) return;

    try {
      const reporte = {
        publicacionId: this.publicacion.id,
        reportanteUid: this.usuarioActualUid,
        motivo: motivo,
        fechaReporte: new Date(),
        estado: 'pendiente',
        titulo: this.publicacion.titulo,
        descripcion: this.publicacion.descripcion,
        agregarfoto: this.publicacion.agregarfoto || ''
      };

      await this.afs.collection('Reportes').add(reporte);
      this.mostrarToast('Gracias por tu reporte. Será revisado pronto.', 'success');

      this.reporteEnviado = true;

    } catch (error) {
      console.error('Error al enviar reporte:', error);
      this.mostrarToast('Hubo un error al enviar el reporte.', 'danger');
    }
  }

  async mostrarToast(mensaje: string, color: 'success' | 'warning' | 'danger') {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      color: color,
      position: 'bottom'
    });
    toast.present();
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



}
