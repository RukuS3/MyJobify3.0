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
  ionViewWillEnter() {
    this.auth.currentUser.then(user => {
      if (user) {
        this.afs.collection(`Favoritos/${user.uid}/publicaciones`)
          .snapshotChanges()
          .subscribe(data => {
            this.publicacionesGuardadas = data.map(doc => {
              const pub = doc.payload.doc.data() as any;
              const id = doc.payload.doc.id;
              return { id, ...pub };
            });
          });
      }
    });
  }
}
