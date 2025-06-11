import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { AddPublicacionPageRoutingModule } from './add-publicacion-routing.module';
import { AddPublicacionPage } from './add-publicacion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, 
    IonicModule,
    AddPublicacionPageRoutingModule,
    SharedModule
  ],
  declarations: [AddPublicacionPage]
})
export class AddPublicacionPageModule {}
