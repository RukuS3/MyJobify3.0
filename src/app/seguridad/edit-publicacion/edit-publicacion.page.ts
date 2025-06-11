import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-edit-publicacion',
  templateUrl: './edit-publicacion.page.html',
  styleUrls: ['./edit-publicacion.page.scss'],
})
export class EditPublicacionPage implements OnInit {
  publicacionForm: FormGroup;
  id: string = '';
  fotoPublicacion: string = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  usuarioActualId: string = '';

  constructor(
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    private fb: FormBuilder,
    private router: Router,
    private toastCtrl: ToastController,
    private afAuth: AngularFireAuth 
  ) {
    this.publicacionForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      montoPaga: ['', Validators.required],
      comuna: ['', Validators.required],
      categoria: ['', Validators.required],
      agregarfoto: [''],
      fecha: ['']
    });
  }

  async ngOnInit() {
    this.usuarioActualId = (await this.afAuth.currentUser)?.uid || '';
    this.id = this.route.snapshot.paramMap.get('id')!;

    this.afs.collection('Publicacion').doc(this.id).valueChanges().subscribe((data: any) => {
      if (data) {
        if (data.usuarioId !== this.usuarioActualId) {
          this.toastCtrl.create({
            message: 'No tienes permiso para editar esta publicación',
            duration: 2000,
            color: 'danger'
          }).then(t => t.present());
          this.router.navigate(['/crear-publicacion']);
          return;
        }

        this.fotoPublicacion = data.agregarfoto || this.fotoPublicacion;
        this.publicacionForm.patchValue(data);
      }
    });
  }

  async actualizarPublicacion() {
    const data = this.publicacionForm.value;
    data.agregarfoto = this.fotoPublicacion;

    try {
      await this.afs.collection('Publicacion').doc(this.id).update(data);
      const toast = await this.toastCtrl.create({
        message: 'Publicación actualizada con éxito',
        duration: 2000,
        color: 'success'
      });
      await toast.present();
      this.router.navigate(['/crear-publicacion']);
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: 'Error al actualizar la publicación',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
      console.error(error);
    }
  }

  seleccionarImagen() {
    this.fileInput.nativeElement.click();
  }

  seleccionarImagenDesdeInput(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.fotoPublicacion = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  goBack() {
    this.router.navigate(['/crear-publicacion']);
  }
}
