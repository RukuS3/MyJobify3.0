import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetallePublicacionPageRoutingModule } from './detalle-publicacion-routing.module';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { DetallePublicacionPage } from './detalle-publicacion.page';

import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetallePublicacionPageRoutingModule,
    SharedModule,
    ComponentsModule 
  ],
  declarations: [DetallePublicacionPage]
})
export class DetallePublicacionPageModule {}
