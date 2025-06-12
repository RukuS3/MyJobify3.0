import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms'; // 👈 importante para ngModel
import { RouterModule } from '@angular/router';

import { FooterComponent } from './footer/footer.component';
import { ModalBienvenidaComponent } from './modal-bienvenida/modal-bienvenida.component'; // 👈 agrega tu componente aquí

@NgModule({
  declarations: [
    FooterComponent,
    ModalBienvenidaComponent // 👈 decláralo
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule, // 👈 necesario para [(ngModel)]
    RouterModule
  ],
  exports: [
    FooterComponent,
    ModalBienvenidaComponent // 👈 opcional, por si lo usas en otras partes
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // 👈 permite usar elementos de Ionic como 'ion-slide'
})
export class ComponentsModule {}