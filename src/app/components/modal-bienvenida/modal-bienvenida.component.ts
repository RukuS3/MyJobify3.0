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
      img: 'assets/foto1.jpeg',
      titulo: 'Cómo valorar un trabajo',
      descripcion: 'Aprende a dar una calificación justa y honesta a los trabajos realizados.'
    },
    {
      img: 'assets/foto2.jpg',
      titulo: 'Importancia de las valoraciones',
      descripcion: 'Las valoraciones ayudan a mejorar la calidad y confianza en el sistema.'
    },
    // Agrega más slides si quieres
  ];

  constructor(private modalCtrl: ModalController) {}

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
