import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DenunciaDetallePageRoutingModule } from './denuncia-detalle-routing.module';

import { DenunciaDetallePage } from './denuncia-detalle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DenunciaDetallePageRoutingModule
  ],
  declarations: [DenunciaDetallePage]
})
export class DenunciaDetallePageModule {}
