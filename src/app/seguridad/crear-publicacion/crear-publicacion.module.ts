import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CrearPublicacionPageRoutingModule } from './crear-publicacion-routing.module';
import { CrearPublicacionPage } from './crear-publicacion.page';
import { SharedModule } from 'src/app/core/shared/shared.module';

import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CrearPublicacionPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [CrearPublicacionPage]
})
export class CrearPublicacionPageModule {}
