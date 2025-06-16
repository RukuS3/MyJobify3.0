import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { ModalBienvenidaComponent } from '../../components/modal-bienvenida/modal-bienvenida.component';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
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
    private modalCtrl: ModalController
  ) {}

  async ngOnInit() {

    // DESPUES DE TENER LISTO ESTO BORRAR ESTE CODIGO PARA QUE NO LO MUESTRE SIEMPRE
    // const modal = await this.modalCtrl.create({
    // component: ModalBienvenidaComponent,
    //backdropDismiss: false,
    // });
    //await modal.present();
    // Y LO MUESTRE SOLAMENTE UNA VEZ SI ES QUE APRIETA "NO VOLVER A MOSTRAR"
    
    const mostrarBienvenida = localStorage.getItem('mostrarBienvenida');
    console.log('mostrarBienvenida:', mostrarBienvenida);

    if (mostrarBienvenida !== 'false') {
      console.log('Mostrando modal de bienvenida...');
      const modal = await this.modalCtrl.create({
        component: ModalBienvenidaComponent,
        backdropDismiss: false,
      });

      modal.onDidDismiss().then(({ data }) => {
        // Si el usuario marca "no mostrar más", guardamos la preferencia
        if (data?.noMostrarMas) {
          localStorage.setItem('mostrarBienvenida', 'false');
        }
      });

      await modal.present();
    }

    // Cargar publicaciones
    const pubSub = this.afs.collection('Publicacion', ref => ref.orderBy('fecha', 'desc'))
      .snapshotChanges()
      .subscribe(data => {
        this.publicaciones = [];

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

    // Cargar favoritos
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
    this.subs.forEach(sub => sub.unsubscribe());
  }

  formatearComuna(comuna: string): string {
    return comuna.replace(/_/g, ' ').replace(/\b\w/g, letra => letra.toUpperCase());
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
    const normalizar = (texto: string): string =>
      texto
        .toLowerCase()
        .normalize('NFD')                 // Separa letras con tilde
        .replace(/[\u0300-\u036f]/g, '')  // Elimina tildes
        .trim();                          // Quita espacios al inicio/final
  
    const filtro = normalizar(this.filtroTexto);
  
    return this.publicaciones.filter(pub => {
      const titulo = normalizar(pub.titulo || '');
      const comuna = normalizar(pub.comuna || '');
      const categoria = pub.categoria || '';
  
      return (
        (this.categoriaSeleccionada === 'todas' || categoria === this.categoriaSeleccionada) &&
        (!filtro || filtro.split(' ').every(palabra =>
          titulo.includes(palabra) || comuna.includes(palabra)
        )));
    });
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

    for (let i = 0; i < entero; i++) estrellas.push('star');
    if (decimal >= 0.25 && decimal < 0.75) estrellas.push('star-half');
    else if (decimal >= 0.75) estrellas.push('star');

    while (estrellas.length < 5) estrellas.push('star-outline');

    return estrellas;
  }
}