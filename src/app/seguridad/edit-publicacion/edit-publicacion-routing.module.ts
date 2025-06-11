import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditPublicacionPage } from './edit-publicacion.page';

const routes: Routes = [
  {
    path: '',
    component: EditPublicacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditPublicacionPageRoutingModule {}