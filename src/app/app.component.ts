import { Component, OnDestroy } from '@angular/core'; 
import { Platform } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnDestroy {
  notificaciones: any[] = [];
  mostrarNotificacionesFlag = false;
  uid: string = '';
  routerSub: Subscription;
  notificacionesSub: Subscription | null = null;

  rutasSinNotificaciones = [
    '/detalle-pub-admin',
    '/denuncia-detalle',
    '/admin/panel',
    '/forgot-password',
    '/register',
    '/auth'
  ];

  constructor(
    private platform: Platform,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {
    this.platform.ready().then(() => {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
    });

    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.uid = user.uid;
        this.chequearRutaYCargarNotificaciones(this.router.url);
      } else {
        this.notificaciones = [];
        this.mostrarNotificacionesFlag = false;
        this.uid = '';
        this.unsubscribeNotificaciones();
      }
    });

    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.chequearRutaYCargarNotificaciones(event.urlAfterRedirects);
      }
    });
  }

  private chequearRutaYCargarNotificaciones(url: string) {
    const bloquear = this.rutasSinNotificaciones.some(ruta => url.startsWith(ruta));

    if (bloquear) {
      // Ruta bloqueada: ocultar UI y cancelar suscripción para no recargar
      this.mostrarNotificacionesFlag = false;
      this.unsubscribeNotificaciones();
    } else {
      // Ruta permitida: cargar notificaciones si hay usuario
      if (this.uid) {
        this.cargarNotificaciones();
      }
    }
  }

  cargarNotificaciones() {
    // Cancelar subscripción previa para evitar múltiples suscripciones
    this.unsubscribeNotificaciones();

    this.notificacionesSub = this.afs.collection('usuarios')
      .doc(this.uid)
      .collection('notificaciones', ref => ref.orderBy('fecha', 'desc'))
      .valueChanges({ idField: 'id' })
      .subscribe(nots => {
        this.notificaciones = nots.map(not => ({
          ...not,
          fecha: not['fecha']?.toDate ? not['fecha'].toDate() : not['fecha']
        }));

        if (this.notificaciones.length > 0) {
          const ultimaFechaCierreStr = localStorage.getItem('ultimaFechaCierreNotificaciones');
          const ultimaFechaCierre = ultimaFechaCierreStr ? new Date(ultimaFechaCierreStr) : null;
          const fechaNotificacionMasReciente = this.notificaciones[0].fecha;

          this.mostrarNotificacionesFlag = !ultimaFechaCierre || fechaNotificacionMasReciente > ultimaFechaCierre;
        } else {
          this.mostrarNotificacionesFlag = false;
        }
      });
  }

  private unsubscribeNotificaciones() {
    if (this.notificacionesSub) {
      this.notificacionesSub.unsubscribe();
      this.notificacionesSub = null;
    }
  }

  async eliminarNotificacion(id: string) {
    await this.afs
      .collection('usuarios')
      .doc(this.uid)
      .collection('notificaciones')
      .doc(id)
      .delete();

    this.notificaciones = this.notificaciones.filter(n => n.id !== id);
  }

  cerrarNotificaciones() {
    this.mostrarNotificacionesFlag = false;

    if (this.notificaciones.length > 0) {
      const fechaMasReciente = this.notificaciones[0].fecha;
      localStorage.setItem('ultimaFechaCierreNotificaciones', fechaMasReciente.toISOString());
    } else {
      localStorage.setItem('ultimaFechaCierreNotificaciones', new Date().toISOString());
    }
  }

  ngOnDestroy() {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
    this.unsubscribeNotificaciones();
  }
}
