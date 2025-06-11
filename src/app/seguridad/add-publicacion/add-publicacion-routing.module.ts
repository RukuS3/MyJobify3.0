import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddPublicacionPage } from './add-publicacion.page';

const routes: Routes = [
  {
    path: '',
    component: AddPublicacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddPublicacionPageRoutingModule {}
