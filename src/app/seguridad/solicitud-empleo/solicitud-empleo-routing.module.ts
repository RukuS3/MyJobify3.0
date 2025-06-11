import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SolicitudEmpleoPage } from './solicitud-empleo.page';

const routes: Routes = [
  {
    path: '',
    component: SolicitudEmpleoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SolicitudEmpleoPageRoutingModule {}
