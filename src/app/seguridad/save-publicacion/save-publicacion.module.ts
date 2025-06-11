import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/components/components.module';


import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { SavePublicacionPageRoutingModule } from './save-publicacion-routing.module';

import { SavePublicacionPage } from './save-publicacion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SavePublicacionPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [SavePublicacionPage]
})
export class SavePublicacionPageModule {}
