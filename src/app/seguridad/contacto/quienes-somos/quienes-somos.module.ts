import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuienesSomosPageRoutingModule } from './quienes-somos-routing.module';

import { QuienesSomosPage } from './quienes-somos.page';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuienesSomosPageRoutingModule,
    SharedModule,
    ComponentsModule

  ],
  declarations: [QuienesSomosPage]
})
export class QuienesSomosPageModule {}
