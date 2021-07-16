import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IBeacon, IBeaconPluginResult } from '@ionic-native/ibeacon/ngx';
import { GlobalFnService } from '@services/global-fn.service';

@Component({
  selector: 'app-register-ble',
  templateUrl: './register-ble.page.html',
  styleUrls: ['./register-ble.page.scss'],
})
export class RegisterBlePage implements OnInit {

  public beaconData = require("../beaconsampledata.json");
  // public fs = require('fs');
  public regform: FormGroup;
  public ibeaconInRegionList; 
  beacons: any;
  
  constructor(
    public ibeacon: IBeacon,
    public formbuilder: FormBuilder,
    public ibGlobalFn: GlobalFnService
    ) {
      this.regform = formbuilder.group({
        device: ["", Validators.required],
        name: ["", Validators.required],
      })
     }

  ngOnInit() {
    console.log(this.beaconData);
  }
  
  onDeviceReady() {
    this.callBeacon();
  }

  callBeacon() {
    this.ibeacon.requestAlwaysAuthorization();

    let delegate = this.ibeacon.Delegate();
    delegate.didRangeBeaconsInRegion()
      .subscribe(
        // data => console.log('didRangeBeaconsInRegion: ', JSON.stringify(data)),
        data => {          
          console.log('didRangeBeaconsInRegion: ', JSON.stringify(data));
          // console.log('uuid: ', data.region['uuid']);
          // console.log('uuid: ', data.beacons[]);
          if (data.beacons.length > 0) {
            data.beacons.forEach(beacon => {
              console.log('sdssdsdfafd;;');
              // console.log(beacon);
              console.log(beacon.uuid);
              console.log(beacon.major);
              console.log(beacon.minor);
              console.log(beacon.proximity);
              console.log(beacon.rssi);

              // this.ibeaconInRegionList.push({
              //   'uuid': beacon.uuid,
              //   'major': beacon.major,
              //   'minor': beacon.minor,
              //   'proximity': beacon.proximity,
              //   'rssi': beacon.rssi,


              // });

              // this.beaconData.unregisteredList.push({
              //       'uuid': beacon.uuid,
              //       'major': beacon.major,
              //       'minor': beacon.minor,
              //       'proximity': beacon.proximity,
              //       'rssi': beacon.rssi
              // });
              var lengthNo = this.beaconData.unregisteredList.length;
              this.beaconData.unregisteredList[lengthNo+1] = {
                    'uuid': beacon.uuid,
                    'major': beacon.major,
                    'minor': beacon.minor,
                    'proximity': beacon.proximity,
                    'rssi': beacon.rssi
              };
            });
          } 

          console.log('dsdss: ');
          console.log(JSON.stringify(this.ibeaconInRegionList));

        },
      // (pluginResult: IBeaconPluginResult) => {
      //   this.ibeaconInRegionList =pluginResult;
      //   console.log('didRangeBeaconsInRegion: ', pluginResult);


      // },
        // data => {
        //   console.log('dsdsd1');
        //   console.log('didRangeBeaconsInRegion: ', JSON.stringify(data));
        //   // var uniqueBeaconKey;
        //   // for(var i = 0; i < data.length; i++) {

        //   // }
        // },
        error => {
          console.log('dsdsd2');
          console.error('error didRangeBeaconsInRegion: ', JSON.stringify(error));
      }
      );

    let beaconRegion1 = this.ibeacon.BeaconRegion('WGX_iBeacon', 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825');
    // let beaconRegion1 = this.ibeacon.BeaconRegion('WGX_iBeacon', 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825');
    // let beaconRegion1 = this.ibeacon.BeaconRegion('WGX_iBeacon', 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825', 10035, 56498, true);

    this.ibeacon.startRangingBeaconsInRegion(beaconRegion1).then((value) => {
      console.log('startRangingBeaconsInRegion: ', JSON.stringify(value));
    });
    // this.ibeacon.startRangingBeaconsInRegion(beaconRegion2).then((value) => {
    //   console.log('startRangingBeaconsInRegion: ', JSON.stringify(value));
    // });

    delegate.didStartMonitoringForRegion()
      .subscribe(
        data => console.log('didStartMonitoringForRegion: ', JSON.stringify(data.region)),
        error => console.error()
      );
      console.log('this.ibeaconInRegionList: ', this.ibeaconInRegionList);
    // delegate.didEnterRegion()
    //   .subscribe(
    //     data => {
    //       console.log('didEnterRegion: ', JSON.stringify(data));
    //     }
    //   );


    // let beaconRegion = this.createBeacon();

    var uuid = 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825'; // mandatory
    var identifier = 'beaconAtTheMacBooks'; // mandatory
    var minor = 10035; // optional, defaults to wildcard if left empty
    var major = 56498; // optional, defaults to wildcard if left empty

    let beaconRegion = this.ibeacon.BeaconRegion(identifier,uuid, major, minor, true)
    this.ibeacon.startMonitoringForRegion(beaconRegion)
      .then(
        (data) => {
          console.log('Native layer received the request to monitoring, ', JSON.stringify(data));
          console.log(beaconRegion);
        },
        error => console.error('Native layer failed to begin monitoring: ', error)
      );
  }
  
  /**
   * Function that creates a BeaconRegion data transfer object.
   * 
   * @throws Error if the BeaconRegion parameters are not valid.
   */
  createBeacon() {

    var uuid = '00000000-0000-0000-0000-000000000000'; // mandatory
    var identifier = 'beaconAtTheMacBooks'; // mandatory
    var minor = 1000; // optional, defaults to wildcard if left empty
    var major = 5; // optional, defaults to wildcard if left empty

    console.log('createbeacon');

    return this.ibeacon.BeaconRegion(identifier,uuid,major,minor);
  } 

  startMonitoringSingleRegion() {
  }

  onDeleteRegisteredBeacon(arrayData, selectedArray, index) {
    const newlist = [];
    Object.entries(arrayData).forEach(([key, value]) => {
      if (Number(key) !== index) {
        newlist.push(value);
      }
    });
    this.ibGlobalFn.showToast("Success Delete " + selectedArray.name, "success");
    return (this.beaconData.registeredList = newlist);
  }

  registerNewDevice() {
    console.log('registerNewDevice');
    console.log(this.regform);
    console.log(this.regform.value.device);
    console.log(this.regform.value.name);
    this.beaconData.registeredList.push({
      name: this.regform.value.name,
      identifer:this.regform.value.device,
      uuid: 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825',
      major: 10035,
      minor: 56498,
    });
    // var json = JSON.stringify(this.beaconData);
    // this.fs.writeFile('myjsonfile.json', json);
    this.ibGlobalFn.showToast("Success Register New Device", "success");
    // this.regform.value.name = null;
    this.regform.reset();
  }
}
