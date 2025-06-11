import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InformacionPageRoutingModule } from './informacion-routing.module';

import { InformacionPage } from './informacion.page';

import { SharedModule } from 'src/app/core/shared/shared.module';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InformacionPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [InformacionPage]
})
export class InformacionPageModule {}
