import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/core/shared/shared.module';

import { SolicitudEmpleoPageRoutingModule } from './solicitud-empleo-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';

import { SolicitudEmpleoPage } from './solicitud-empleo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SolicitudEmpleoPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [SolicitudEmpleoPage]
})
export class SolicitudEmpleoPageModule {}
