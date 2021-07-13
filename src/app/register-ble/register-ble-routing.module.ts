import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterBlePage } from './register-ble.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterBlePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterBlePageRoutingModule {}
