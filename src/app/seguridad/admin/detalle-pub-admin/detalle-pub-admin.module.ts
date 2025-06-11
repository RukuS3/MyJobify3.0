import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetallePubAdminPageRoutingModule } from './detalle-pub-admin-routing.module';

import { DetallePubAdminPage } from './detalle-pub-admin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetallePubAdminPageRoutingModule
  ],
  declarations: [DetallePubAdminPage]
})
export class DetallePubAdminPageModule {}
