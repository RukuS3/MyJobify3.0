import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../../services/firebase.service';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.page.html',
  styleUrls: ['./panel.page.scss'],
})
export class PanelPage implements OnInit {

  denuncias: any[] = [];
  reportesPublicacion: any[] = [];

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.cargarDenuncias();
    this.cargarReportes();
  }

  async cargarDenuncias() {
    this.firebaseService.obtenerDenuncias().subscribe({
      next: async (data: any[]) => {
        this.denuncias = await Promise.all(
          data.map(async denuncia => {
            const fechaDate = denuncia.fecha ? new Date(denuncia.fecha) : null;
            const denunciadoNombre = await this.firebaseService.obtenerNombreUsuario(denuncia.denunciadoUid);
            return {
              ...denuncia,
              fecha: fechaDate,
              denunciadoNombre: denunciadoNombre || 'Usuario desconocido',
              motivo: denuncia.motivo || 'Sin motivo',
              descripcion: denuncia.descripcion || '',
            };
          })
        );
        console.log('Denuncias cargadas:', this.denuncias);
      },
      error: (err) => {
        console.error('Error al cargar denuncias:', err);
      }
    });
  }

  async cargarReportes() {
    this.firebaseService.obtenerReportesPublicacion().subscribe(async (data) => {
      this.reportesPublicacion = await Promise.all(data.map(async reporte => {
        let imagen = '';

        try {
          const publicacionData = await this.firebaseService.obtenerPublicacionPorId(reporte.publicacionId);
          imagen = publicacionData?.agregarfoto || '';
        } catch (e) {
          console.warn('No se pudo obtener la publicación:', e);
        }

        return {
          ...reporte,
          imagen
        };
      }));
    });
  }

  eliminarPublicacion(idPublicacion: string) {
    if (confirm('¿Estás seguro de eliminar esta publicación?')) {
      this.firebaseService.eliminarPublicacion(idPublicacion)
        .then(() => alert('Publicación eliminada correctamente'))
        .catch(err => alert('Error al eliminar publicación: ' + err));
    }
  }
}
