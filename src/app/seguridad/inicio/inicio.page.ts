import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Subscription, forkJoin } from 'rxjs';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: false
})
export class InicioPage implements OnInit, OnDestroy {
  publicaciones: any[] = [];
  filtroTexto: string = '';
  limite: number = 5;
  favoritosIds: string[] = [];
  categoriaSeleccionada: string = 'todas';

  private subs: Subscription[] = [];

  constructor(
    private afs: AngularFirestore,
    private router: Router,
    private auth: AngularFireAuth,
  ) {}

  ngOnInit() {
    // Cargar publicaciones
    const pubSub = this.afs.collection('Publicacion', ref => ref.orderBy('fecha', 'desc'))
      .snapshotChanges()
      .subscribe(data => {
        this.publicaciones = [];

        // Por cada publicación, armamos el objeto y pedimos calificaciones
        data.forEach(async doc => {
          const pub = doc.payload.doc.data() as any;
          const id = doc.payload.doc.id;
          const item: any = {
            id,
            ...pub,
            fecha: pub['fecha']?.toDate ? pub['fecha'].toDate() : pub['fecha'],
            montoPaga: Number(pub.montoPaga) || 0,
            promedioCalificacion: null
          };

          if (item.usuarioId) {
            // Suscribirse a las calificaciones del usuario para cada publicación
            const califSub = this.afs.collection(`usuarios/${item.usuarioId}/calificaciones`)
              .valueChanges()
              .subscribe((calificaciones: any[]) => {
                if (calificaciones.length > 0) {
                  const total = calificaciones.reduce((sum, cal) => sum + (cal.calificacion || 0), 0);
                  const promedio = total / calificaciones.length;
                  item.promedioCalificacion = Number(promedio.toFixed(1));
                } else {
                  item.promedioCalificacion = null;
                }
              });
            this.subs.push(califSub);
          }

          this.publicaciones.push(item);
        });
      });

    this.subs.push(pubSub);

    // Cargar favoritos del usuario actual
    this.auth.currentUser.then(user => {
      if (user) {
        const favSub = this.afs.collection(`Favoritos/${user.uid}/publicaciones`)
          .snapshotChanges()
          .subscribe(favs => {
            this.favoritosIds = favs.map(f => f.payload.doc.id);
          });
        this.subs.push(favSub);
      }
    });
  }

  ngOnDestroy() {
    // Limpiar todas las suscripciones
    this.subs.forEach(sub => sub.unsubscribe());
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
    const filtro = this.filtroTexto.toLowerCase();
    return this.publicaciones
      .filter(pub =>
        (this.categoriaSeleccionada === 'todas' || pub.categoria === this.categoriaSeleccionada) &&
        (!filtro || pub.titulo.toLowerCase().includes(filtro) || pub.comuna.toLowerCase().includes(filtro))
      );
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

  obtenerEstrellas(promedio: number): string[] {
    const estrellas: string[] = [];
    const entero = Math.floor(promedio);
    const decimal = promedio - entero;

    for (let i = 0; i < entero; i++) {
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
