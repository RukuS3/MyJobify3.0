import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TerminosCondicionesPageRoutingModule } from './terminos-condiciones-routing.module';

import { TerminosCondicionesPage } from './terminos-condiciones.page';

import { SharedModule } from 'src/app/core/shared/shared.module';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TerminosCondicionesPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [TerminosCondicionesPage]
})
export class TerminosCondicionesPageModule {}
