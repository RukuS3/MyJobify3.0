import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PanelPage } from './panel.page';

const routes: Routes = [
  {
    path: '',
    component: PanelPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PanelPageRoutingModule {}
