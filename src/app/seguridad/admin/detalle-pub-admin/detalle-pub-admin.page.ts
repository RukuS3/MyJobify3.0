import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastController } from '@ionic/angular';

import { FirebaseService } from '../../../services/firebase.service';

@Component({
  selector: 'app-detalle-pub-admin',
  templateUrl: './detalle-pub-admin.page.html',
  styleUrls: ['./detalle-pub-admin.page.scss'],
})
export class DetallePubAdminPage implements OnInit {
  publicacion: any;
  usuarioCreador: any = null;
  idPublicacion: string;
  reportes: any[] = [];  

  constructor(
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    private toastController: ToastController,
    private router: Router,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit() {
    this.idPublicacion = this.route.snapshot.paramMap.get('id')!;
    this.cargarPublicacion();
    this.cargarReportes();
  }

  cargarPublicacion() {
    this.afs.collection('Publicacion').doc(this.idPublicacion).valueChanges().subscribe(pub => {
      if (pub) {
        this.publicacion = pub;
        this.publicacion.id = this.idPublicacion;

        if (this.publicacion.usuarioId) {
          this.cargarUsuarioCreador(this.publicacion.usuarioId);
        }
      } else {
        this.presentToast('Publicación no encontrada');
        this.router.navigate(['/admin']);
      }
    });
  }

  cargarUsuarioCreador(usuarioId: string) {
    this.afs.collection('usuarios').doc(usuarioId).valueChanges().subscribe(usuario => {
      this.usuarioCreador = usuario;
    });
  }

  cargarReportes() {
    this.afs.collection('Reportes', ref => ref.where('publicacionId', '==', this.idPublicacion))
      .valueChanges({ idField: 'id' })
      .subscribe(reportes => {
        this.reportes = reportes;
      });
  }

  async aprobarPublicacion() {
    // Aprobar publicación y eliminar reportes relacionados (falsos o no graves)
    try {
      await this.afs.collection('Publicacion').doc(this.idPublicacion).update({ aprobada: true });

      // Eliminar todos los reportes asociados a esta publicación
      for (const reporte of this.reportes) {
        await this.afs.collection('Reportes').doc(reporte.id).delete();
      }

      this.presentToast('Publicación aprobada y reportes eliminados');
      this.router.navigate(['/admin/panel']);
    } catch (err) {
      this.presentToast('Error al aprobar publicación: ' + err);
    }
  }

  async eliminarPublicacion() {
    try {
      const pubSnap = await this.afs.collection('Publicacion').doc(this.idPublicacion).get().toPromise();
      const pubData = pubSnap?.data() as any;

      if (!pubData || !pubData.usuarioId) {
        this.presentToast('Error: No se pudo encontrar al creador de la publicación.');
        return;
      }

      const usuarioId = pubData.usuarioId;

      // Eliminar la publicación
      await this.firebaseService.eliminarPublicacion(this.idPublicacion);

      // Enviar la notificación al usuario correcto
      await this.afs.collection('usuarios').doc(usuarioId)
        .collection('notificaciones').add({
          mensaje: `Tu publicación "${pubData.titulo || ''}" ha sido eliminada por incumplimiento de normas.`,
          fecha: new Date(),
          leida: false
        });

      // Eliminar los reportes relacionados
      await Promise.all(
        this.reportes.map(reporte => this.afs.collection('Reportes').doc(reporte.id).delete())
      );

      this.presentToast('Publicación eliminada, reportes borrados y notificación enviada.');
      this.router.navigate(['/admin/panel']);

    } catch (err) {
      this.presentToast('Error al eliminar publicación: ' + err);
    }
  }


  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  goBack() {
    this.router.navigate(['/admin/panel']);
  }
}
