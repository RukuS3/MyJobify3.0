import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContactanosPageRoutingModule } from './contactanos-routing.module';

import { ContactanosPage } from './contactanos.page';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContactanosPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [ContactanosPage]
})
export class ContactanosPageModule {}
