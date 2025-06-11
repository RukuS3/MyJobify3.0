import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}

  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password).then(async (cred) => {
      const uid = cred.user?.uid;
      const userDoc = await this.firestore.collection('usuarios').doc(uid).get().toPromise();
      const userData: any = userDoc?.data();

      localStorage.setItem('user', JSON.stringify(cred.user));
      localStorage.setItem('userRole', userData?.role || 'user');

      return cred;
    });
  }

  register(email: string, password: string, rut: string, nombre: string, apellido: string, telefono: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password).then(cred => {
      const uid = cred.user?.uid;

      const rol = email === 'admin@miapp.com' ? 'admin' : 'user';

      // Guardar datos en Firestore
      this.firestore.collection('usuarios').doc(uid).set({
        uid: uid,
        email: email,
        rut: rut,
        nombre: nombre,
        apellido: apellido,
        telefono: telefono,
        fotoUrl: '',
        fechaCreacion: new Date(),
        role: rol
      }).catch(err => {
        console.error('Error al registrar en Firestore:', err);
        throw err;
      });

      // Devuelve el userCredential para usarlo en el componente y enviar correo verificación
      return cred;
    });
  }

  resetPassword(email: string) {
    return this.afAuth.sendPasswordResetEmail(email);
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    return this.afAuth.signOut();
  }

  getUsuarioActual() {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          const uid = user.uid;
          return this.firestore.collection('usuarios').doc(uid).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  isLoggedIn(): boolean {
    return !!this.afAuth['auth'].currentUser;
  }

  checkRutExists(rut: string): Promise<boolean> {
    return this.firestore.collection('usuarios', ref => ref.where('rut', '==', rut))
      .get()
      .toPromise()
      .then(snapshot => !snapshot.empty);
  }

  checkEmailExists(email: string): Promise<boolean> {
    return this.firestore.collection('usuarios', ref => ref.where('email', '==', email))
      .get()
      .toPromise()
      .then(snapshot => !snapshot.empty);
  }

  checkTelefonoExists(telefono: string): Promise<boolean> {
    return this.firestore.collection('usuarios', ref => ref.where('telefono', '==', telefono))
      .get()
      .toPromise()
      .then(snapshot => !snapshot.empty);
  }
}
