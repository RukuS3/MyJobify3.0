import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SavePublicacionPage } from './save-publicacion.page';

const routes: Routes = [
  {
    path: '',
    component: SavePublicacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SavePublicacionPageRoutingModule {}
