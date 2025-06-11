import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { switchMap, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {

  solicitudesPendientesCount$: Observable<number> = of(0);

  constructor(private afs: AngularFirestore, private auth: AngularFireAuth) {
    this.solicitudesPendientesCount$ = this.auth.user.pipe(
      switchMap(user => {
        if (user?.uid) {
          return this.afs.collection('Solicitudes').doc(user.uid)
            .collection('solicitudesRecibidas', ref => ref.where('estado', '==', 'pendiente'))
            .valueChanges()
            .pipe(
              map(solicitudes => solicitudes.length)
            );
        } else {
          return of(0);
        }
      })
    );
  }
}
