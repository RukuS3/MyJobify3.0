import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { InicioPageRoutingModule } from './inicio-routing.module';
import { SharedModule } from 'src/app/core/shared/shared.module';

import { InicioPage } from './inicio.page';


import { UserNotificationsModule } from '../../components/user-notifications/user-notifications.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InicioPageRoutingModule,
    SharedModule,
    UserNotificationsModule,
    ComponentsModule  
  ],
  declarations: [InicioPage]
})
export class InicioPageModule {}