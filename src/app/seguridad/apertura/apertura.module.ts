import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AperturaPageRoutingModule } from './apertura-routing.module';

import { AperturaPage } from './apertura.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AperturaPageRoutingModule
  ],
  declarations: [AperturaPage]
})
export class AperturaPageModule {}
