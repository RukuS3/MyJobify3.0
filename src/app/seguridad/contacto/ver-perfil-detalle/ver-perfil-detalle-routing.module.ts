import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerPerfilDetallePage } from './ver-perfil-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: VerPerfilDetallePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerPerfilDetallePageRoutingModule {}
