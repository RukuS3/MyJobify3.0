import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrivacidadTerminosPage } from './privacidad-terminos.page';

const routes: Routes = [
  {
    path: '',
    component: PrivacidadTerminosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrivacidadTerminosPageRoutingModule {}
