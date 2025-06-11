import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-solicitud-empleo',
  templateUrl: './solicitud-empleo.page.html',
  styleUrls: ['./solicitud-empleo.page.scss'],
})
export class SolicitudEmpleoPage implements OnInit {

  solicitudes: any[] = [];
  usuarioActualUid: string | null = null;
  solicitudesPendientesCount: number = 0; 

  constructor(
    private router: Router,
    private afs: AngularFirestore,
    private auth: AngularFireAuth,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    // Opcional: puedes dejarlo vacío o hacer algo que quieras al crear el componente
  }

  async ionViewWillEnter() {
    try {
      this.usuarioActualUid = await this.getUsuarioUid();
      console.log('UID actual (creador):', this.usuarioActualUid);

      if (this.usuarioActualUid) {
        this.afs.collection('Solicitudes').doc(this.usuarioActualUid)
          .collection('solicitudesRecibidas', ref => ref.orderBy('fechaSolicitud', 'desc'))
          .snapshotChanges()
          .subscribe({
            next: snaps => {
              this.solicitudes = snaps.map(snap => {
                const data = snap.payload.doc.data();
                const id = snap.payload.doc.id;
                return { id, ...data };
              });
              console.log('Solicitudes recibidas con ID:', this.solicitudes);
              this.solicitudesPendientesCount = this.solicitudes.filter(sol => sol.estado === 'pendiente').length;
            },
            error: err => {
              console.error('Error cargando solicitudes:', err);
            }
          });
      }
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
    }
  }

  private async getUsuarioUid(): Promise<string | null> {
    const user = await this.auth.currentUser;
    return user ? user.uid : null;
  }

  aceptarSolicitud(id: string, uidSolicitante: string) {
    if (!this.usuarioActualUid) return;

    this.afs.collection('Solicitudes').doc(this.usuarioActualUid)
      .collection('solicitudesRecibidas').doc(id)
      .update({ estado: 'aceptada' })
      .then(() => {
        // Agregar al listado de aceptados
        this.afs.collection('SolicitudesAceptadas').doc(this.usuarioActualUid)
          .collection('usuariosAceptados').doc(uidSolicitante).set({
            aceptado: true,
            fecha: new Date()
          });

        // Navegar a perfil detalle
        this.router.navigate(['/ver-perfil-detalle'], {
          queryParams: { uid: uidSolicitante }
        });
      })
      .catch(err => console.error('Error al aceptar solicitud:', err));
  }

  async confirmarRechazo(id: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar rechazo',
      message: '¿Estás seguro de que quieres rechazar esta solicitud?',
      cssClass: 'custom-alert',  
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-button-cancel'
        },
        {
          text: 'Rechazar',
          handler: () => {
            this.rechazarSolicitud(id);
          },
          cssClass: 'alert-button-confirm'
        }
      ]
    });

    await alert.present();
  }

  rechazarSolicitud(id: string) {
    if (!this.usuarioActualUid) return;

    this.afs.collection('Solicitudes').doc(this.usuarioActualUid)
      .collection('solicitudesRecibidas').doc(id)
      .update({ estado: 'rechazada' })
      .catch(err => console.error('Error al rechazar solicitud:', err));
  }

  verPerfil(uid: string) {
    this.router.navigate(['/ver-perfil-detalle'], {
      queryParams: { uid }
    });
  }

}
