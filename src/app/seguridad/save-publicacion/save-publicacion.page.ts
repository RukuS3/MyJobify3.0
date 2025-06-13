import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-save-publicacion',
  templateUrl: './save-publicacion.page.html',
  styleUrls: ['./save-publicacion.page.scss'],
})
export class SavePublicacionPage {
  publicacionesGuardadas: any[] = [];

  constructor(
    private afs: AngularFirestore,
    private auth: AngularFireAuth,
    private router: Router
  ) {}

  verDetalle(id: string) {
  this.router.navigate(['/trabajos/detalle-publicacion', id]);
}

formatearComuna(comuna: string): string {
  return comuna.replace(/_/g, ' ').replace(/\b\w/g, letra => letra.toUpperCase());
}

  ionViewWillEnter() {
    this.auth.currentUser.then(user => {
      if (user) {
        this.afs.collection(`Favoritos/${user.uid}/publicaciones`)
          .snapshotChanges()
          .subscribe(async data => {
            const favoritosConDatos = await Promise.all(data.map(async doc => {
              const pub = doc.payload.doc.data() as any;
              const id = doc.payload.doc.id;

              const publicacionDoc = await this.afs.collection('Publicacion').doc(id).get().toPromise();
              if (publicacionDoc.exists) {
                const publicacionData = publicacionDoc.data() as any;

                let nombreUsuario = '';
                if (publicacionData?.usuarioId) {
                  const usuarioDoc = await this.afs.collection('usuarios').doc(publicacionData.usuarioId).get().toPromise();
                  if (usuarioDoc.exists) {
                    const u = usuarioDoc.data() as any;
                    nombreUsuario = `${u?.nombre || ''} ${u?.apellido || ''}`.trim();
                  }
                }

                return {
                  id,
                  ...pub,
                  titulo: publicacionData?.titulo || pub.titulo,
                  comuna: publicacionData?.comuna || pub.comuna,
                  descripcion: publicacionData?.descripcion || '',
                  fecha: publicacionData?.fecha ? publicacionData.fecha.toDate() : null,
                  nombreUsuario
                };
              } else {
                await this.afs.collection(`Favoritos/${user.uid}/publicaciones`).doc(id).delete();
                return null;
              }
            }));

            this.publicacionesGuardadas = favoritosConDatos.filter(pub => pub !== null);
          });
      }
    });
  }


}
