import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../../../services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-denuncia-detalle',
  templateUrl: './denuncia-detalle.page.html',
  styleUrls: ['./denuncia-detalle.page.scss'],
})
export class DenunciaDetallePage implements OnInit {
  denuncia: any;

  constructor(
    private route: ActivatedRoute,
    private firebaseService: FirebaseService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.firebaseService.obtenerDenunciaPorId(id).subscribe(async data => {
        if (data) {
          const fecha = data['fecha']?.toDate ? data['fecha'].toDate() : data['fecha'];
          const denunciadoUid = data['denunciadoUid'];
          const denunciadoNombre = await this.firebaseService.obtenerNombreUsuario(denunciadoUid);

          this.denuncia = {
            id,
            ...data,
            fecha,
            denunciadoNombre: denunciadoNombre || 'Usuario desconocido'
          };
        }
      });
    }
  }

  aprobarDenuncia() {
    if (!this.denuncia) return;

    const { denuncianteUid, denunciadoUid, denunciadoNombre, id } = this.denuncia;

    if (!denuncianteUid || !denunciadoUid) {
      alert('Error: Faltan datos del denunciante o denunciado.');
      return;
    }

    Promise.all([
      this.firebaseService.enviarNotificacion(denuncianteUid, `Tu denuncia contra ${denunciadoNombre} ha sido aprobada.`),
      this.firebaseService.enviarNotificacion(denunciadoUid, `Se ha aprobado una denuncia en tu contra. Por favor revisa tu cuenta.`)
    ])
    .then(() => this.firebaseService.eliminarDenuncia(id))
    .then(() => {
      alert('Denuncia aprobada y notificaciones enviadas correctamente.');
      this.goBack();
    })
    .catch(err => {
      console.error('Error al procesar la denuncia:', err);
      alert('Error al aprobar la denuncia.');
    });
  }

  rechazarDenuncia() {
    if (!this.denuncia) return;

    this.firebaseService.eliminarDenuncia(this.denuncia.id)
      .then(() => this.firebaseService.enviarNotificacion(
          this.denuncia.denuncianteUid,
          `Tu denuncia contra ${this.denuncia.denunciadoNombre} fue rechazada.`
        ))
      .then(() => {
        alert('Denuncia rechazada y notificación enviada.');
        this.goBack();
      })
      .catch(error => {
        console.error('Error al rechazar denuncia', error);
        alert('Error al rechazar la denuncia.');
      });
  }

  goBack() {
    this.router.navigate(['admin/panel']);
  }

  esImagen = (url: string): boolean => {
    return /\.(jpeg|jpg|png|gif|webp)$/i.test(url);
  }
}
