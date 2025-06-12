import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-bienvenida',
  templateUrl: './modal-bienvenida.component.html',
  styleUrls: ['./modal-bienvenida.component.scss'],
})
export class ModalBienvenidaComponent {
  slideIndex = 0;
  noMostrarMas = false;

  // Aquí defines tus imágenes, títulos y descripciones
  slides = [
    {
      img: 'assets/valoracion.png',
      titulo: 'Cómo valorar un trabajador',
      descripcion: '1. Primero debes dar clic en "¿Tarea terminada?".'
    },
    {
      img: 'assets/valoracion1.png',
      titulo: 'Importancia de las valoraciones',
      descripcion: '1. Selecionas las estrellas. \n 2. Dejar un comentario adecuado. \n 3.Enviar tu calificación' 
    },
    // Agrega más slides si quieres
  ];

  constructor(private modalCtrl: ModalController) {}

  getDescripcionFormateada(): string {
  return this.slides[this.slideIndex].descripcion.replace(/\n/g, '<br>');
}

  anterior() {
    if (this.slideIndex > 0) {
      this.slideIndex--;
    }
  }

  siguiente() {
    if (this.slideIndex < this.slides.length - 1) {
      this.slideIndex++;
    }
  }

  cerrar() {
    // Guardas la preferencia para no mostrar más si está marcada
    if (this.noMostrarMas) {
      localStorage.setItem('mostrarBienvenida', 'false');
    }
    this.modalCtrl.dismiss();
  }
}
