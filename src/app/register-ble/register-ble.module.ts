import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterBlePageRoutingModule } from './register-ble-routing.module';

import { RegisterBlePage } from './register-ble.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RegisterBlePageRoutingModule
  ],
  declarations: [RegisterBlePage]
})
export class RegisterBlePageModule {}
