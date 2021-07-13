import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BeaconPageRoutingModule } from './beacon-routing.module';

import { BeaconPage } from './beacon.page';
import { IBeacon } from '@ionic-native/ibeacon';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    // IBeacon,
    BeaconPageRoutingModule
  ],
  declarations: [BeaconPage]
})
export class BeaconPageModule {}
