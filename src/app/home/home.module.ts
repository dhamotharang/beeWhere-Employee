import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
// import { IBeacon } from '@ionic-native/ibeacon/ngx';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    // IBeacon,
    HomePageRoutingModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
