import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MiperfilPageRoutingModule } from './miperfil-routing.module';

import { MiperfilPage } from './miperfil.page';

import { SharedModule } from 'src/app/core/shared/shared.module';
import { ComponentsModule } from 'src/app/components/components.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MiperfilPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [MiperfilPage]
})
export class MiperfilPageModule {}
