import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: false
})
export class InicioPage implements OnInit {
  publicaciones: any[] = [];
  filtroTexto: string = '';
  limite: number = 5;
  favoritosIds: string[] = [];
  categoriaSeleccionada: string = 'todas';

  constructor(
    private afs: AngularFirestore,
    private router: Router,
    private auth: AngularFireAuth,
  ) {}

  ngOnInit() {
    this.afs.collection('Publicacion', ref => ref.orderBy('fecha', 'desc'))
      .snapshotChanges()
      .subscribe(data => {
        this.publicaciones = data.map(doc => {
          const pub = doc.payload.doc.data() as any;
          const id = doc.payload.doc.id;
          return {
            id,
            ...pub,
            fecha: pub['fecha']?.toDate ? pub['fecha'].toDate() : pub['fecha'],
            montoPaga: Number(pub.montoPaga) || 0
          };
        });
      });

    this.auth.currentUser.then(user => {
      if (user) {
        this.afs.collection(`Favoritos/${user.uid}/publicaciones`)
          .snapshotChanges()
          .subscribe(favs => {
            this.favoritosIds = favs.map(f => f.payload.doc.id);
          });
      }
    });
  }

  verDetalle(id: string) {
    this.router.navigate(['/trabajos/detalle-publicacion', id]);
  }

  async guardarPublicacion(item: any) {
    const user = await this.auth.currentUser;
    if (user) {
      const favRef = this.afs
        .collection('Favoritos')
        .doc(user.uid)
        .collection('publicaciones')
        .doc(item.id);

      const doc = await favRef.get().toPromise();
      if (doc?.exists) {
        await favRef.delete();
      } else {
        await favRef.set(item);
      }
    }
  }

  estaGuardada(pub: any): boolean {
    return this.favoritosIds.includes(pub.id);
  }

  get publicacionesFiltradas() {
    if (this.categoriaSeleccionada === 'todas') {
      return this.publicaciones;
    }
    return this.publicaciones.filter(pub => pub.categoria === this.categoriaSeleccionada);
  }

  cargarMas(event: any) {
    setTimeout(() => {
      this.limite += 5;
      event.target.complete();
      if (this.limite >= this.publicaciones.length) {
        event.target.disabled = true;
      }
    }, 500);
  }
}
