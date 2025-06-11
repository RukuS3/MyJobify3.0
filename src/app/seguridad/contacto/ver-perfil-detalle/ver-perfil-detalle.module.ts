import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/core/shared/shared.module';

import { IonicModule } from '@ionic/angular';

import { VerPerfilDetallePageRoutingModule } from './ver-perfil-detalle-routing.module';

import { VerPerfilDetallePage } from './ver-perfil-detalle.page';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerPerfilDetallePageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [VerPerfilDetallePage]
})
export class VerPerfilDetallePageModule {}
