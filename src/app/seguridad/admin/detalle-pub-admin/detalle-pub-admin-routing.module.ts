import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetallePubAdminPage } from './detalle-pub-admin.page';

const routes: Routes = [
  {
    path: '',
    component: DetallePubAdminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetallePubAdminPageRoutingModule {}
