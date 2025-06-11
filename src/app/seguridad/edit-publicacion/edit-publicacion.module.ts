import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/core/shared/shared.module';

import { EditPublicacionPageRoutingModule } from './edit-publicacion-routing.module';
import { EditPublicacionPage } from './edit-publicacion.page';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, 
    IonicModule,
    EditPublicacionPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [EditPublicacionPage]
})
export class EditPublicacionPageModule {}
