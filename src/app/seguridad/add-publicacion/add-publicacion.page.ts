import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActionSheetController, ActionSheetButton, isPlatform } from '@ionic/angular';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Camera, CameraResultType, CameraSource, CameraDirection } from '@capacitor/camera';

@Component({
  selector: 'app-add-publicacion',
  templateUrl: './add-publicacion.page.html',
  styleUrls: ['./add-publicacion.page.scss'],
})
export class AddPublicacionPage implements OnInit {

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement', { static: false }) canvasElement!: ElementRef<HTMLCanvasElement>;

  publicacionForm: FormGroup;
  fotoPublicacion: string = 'https://placehold.co/200x200?text=Agregar+foto';
  imagenFile: File | null = null;
  stream: MediaStream | null = null;
  mostrandoVideo: boolean = false;

  // Variables para manejar múltiples cámaras
  devices: MediaDeviceInfo[] = [];
  currentDeviceIndex = 0;

  constructor(
    private location: Location,
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private router: Router,
    private afAuth: AngularFireAuth,
    private actionSheetController: ActionSheetController
  ) {
    this.publicacionForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      montoPaga: ['', [Validators.required, Validators.min(0)]],
      comuna: ['', Validators.required],
      categoria: ['', Validators.required],
    });
  }

  ngOnInit() {
    // No abrimos cámara automáticamente, sólo listamos dispositivos para cambiar cámara si se abre
    this.obtenerDispositivos();
  }

  async obtenerDispositivos() {
    try {
      const dispositivos = await navigator.mediaDevices.enumerateDevices();
      this.devices = dispositivos.filter(device => device.kind === 'videoinput');
    } catch (error) {
      console.error('Error al obtener dispositivos de cámara:', error);
    }
  }

  async abrirOpcionesFoto() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Agregar Foto',
      buttons: [
        {
          text: 'Abrir Cámara',
          icon: 'camera',
          handler: () => {
            this.abrirCamaraDirecta();
          }
        },
        {
          text: 'Seleccionar desde Galería',
          icon: 'image',
          handler: () => {
            this.fileInput.nativeElement.click();
          }
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  async abrirCamaraDirecta() {
    if (isPlatform('capacitor')) {
      // Si es móvil con Capacitor, usar plugin cámara nativo
      const opciones = [
        { text: 'Cámara trasera', direction: CameraDirection.Rear },
        { text: 'Cámara frontal', direction: CameraDirection.Front }
      ];

      const buttons: ActionSheetButton[] = opciones.map(o => ({
        text: o.text,
        handler: async () => {
          try {
            const image = await Camera.getPhoto({
              quality: 90,
              allowEditing: false,
              resultType: CameraResultType.DataUrl,
              source: CameraSource.Camera,
              direction: o.direction,
              saveToGallery: false
            });

            if (image?.dataUrl) {
              this.fotoPublicacion = image.dataUrl;
              const blob = await (await fetch(image.dataUrl)).blob();
              this.imagenFile = new File([blob], 'foto.jpg', { type: blob.type });
            }
          } catch (error) {
            console.error('Error al abrir cámara:', error);
          }
        }
      }));

      buttons.push({
        text: 'Cancelar',
        role: 'cancel',
        handler: () => Promise.resolve()
      });

      const actionSheet = await this.actionSheetController.create({
        header: 'Elige cámara',
        buttons
      });

      await actionSheet.present();
    } else {
      // Navegador: abrir cámara web
      try {
        if (this.devices.length === 0) {
          await this.obtenerDispositivos();
        }
        if (this.devices.length > 0) {
          await this.iniciarCamara(this.devices[this.currentDeviceIndex].deviceId);
        } else {
          console.warn('No hay cámaras disponibles');
          this.fileInput.nativeElement.click();
        }
      } catch (error) {
        console.error('Error al acceder a la cámara web:', error);
        this.fileInput.nativeElement.click(); // fallback galería
      }
    }
  }

  async iniciarCamara(deviceId: string) {
    try {
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
      }
      this.mostrandoVideo = true; // primero mostrar el video en DOM

      // Esperamos que Angular actualice el DOM para que videoElement exista
      await new Promise(resolve => setTimeout(resolve, 100));

      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: deviceId } },
        audio: false
      });

      this.videoElement.nativeElement.srcObject = this.stream;
      await this.videoElement.nativeElement.play();

    } catch (error) {
      console.error('Error al iniciar cámara:', error);
      this.mostrandoVideo = false;
    }
  }

  cambiarCamaraWeb() {
    if (this.devices.length <= 1) return; // No hay otra cámara para cambiar
    this.currentDeviceIndex = (this.currentDeviceIndex + 1) % this.devices.length;
    this.iniciarCamara(this.devices[this.currentDeviceIndex].deviceId);
  }

  capturarFoto() {
    if (!this.stream) return;

    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    this.fotoPublicacion = canvas.toDataURL('image/png');

    fetch(this.fotoPublicacion)
      .then(res => res.blob())
      .then(blob => {
        this.imagenFile = new File([blob], 'foto.png', { type: blob.type });
      });

    this.detenerCamara();
    this.mostrandoVideo = false;
  }

  detenerCamara() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.mostrandoVideo = false;
  }

  seleccionarImagenDesdeInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.imagenFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.fotoPublicacion = reader.result as string;
        this.mostrandoVideo = false;
        this.detenerCamara();
      };
      reader.readAsDataURL(file);
    }
  }

  async publicar() {
    if (this.publicacionForm.invalid) return;

    let urlImagen = this.fotoPublicacion;

    if (this.imagenFile) {
      try {
        urlImagen = await this.firebaseService.subirImagen(this.imagenFile);
      } catch (error) {
        console.error("Error al subir imagen:", error);
        return;
      }
    }

    const user = await this.afAuth.currentUser;
    if (!user) {
      console.error("Usuario no autenticado.");
      return;
    }

    const form = this.publicacionForm.value;
    const nuevaPublicacion = {
      agregarfoto: urlImagen,
      titulo: form.titulo,
      descripcion: form.descripcion,
      montoPaga: Number(form.montoPaga),
      comuna: form.comuna,
      categoria: form.categoria,
      fecha: new Date(),
      usuarioId: user.uid
    };

    try {
      await this.firebaseService.crearPublicacion(nuevaPublicacion);
      this.router.navigate(['/crear-publicacion']);
    } catch (error) {
      console.error("Error al guardar la publicación:", error);
    }
  }

  goBack() {
    this.router.navigate(['/crear-publicacion']);
  }
}
