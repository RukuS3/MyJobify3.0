import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DenunciaDetallePage } from './denuncia-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: DenunciaDetallePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DenunciaDetallePageRoutingModule {}
