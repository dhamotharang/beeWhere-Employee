import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IBeacon } from '@ionic-native/ibeacon/ngx';
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
    this.callBeacon();
    console.log(this.beaconData);
  }
  

  callBeacon() {
    // Request permission to use location on iOS
    this.ibeacon.requestAlwaysAuthorization();
    // create a new delegate and register it with the native layer
    console.log('testbeacon');

    let delegate = this.ibeacon.Delegate();
    console.log(delegate);

    // Subscribe to some of the delegate's event handlers
    // delegate.didRangeBeaconsInRegion()
    //   .subscribe(
    //     data => console.log('didRangeBeaconsInRegion: ', data),
    //     error => console.error()
    //   );
    // delegate.didStartMonitoringForRegion()
    //   .subscribe(
    //     data => console.log('didStartMonitoringForRegion: ', data),
    //     error => console.error()
    //   );
    // delegate.didEnterRegion()
    //   .subscribe(
    //     data => {
    //       console.log('didEnterRegion: ', data);
    //     }
    //   );


    let beaconRegion = this.createBeacon();

    this.ibeacon.startMonitoringForRegion(beaconRegion)
      .then(
        () => console.log('Native layer received the request to monitoring'),
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
      uuid: 'dummyuuid',
      major: 1234,
      minor: 12,
    });
    var json = JSON.stringify(this.beaconData);
    // this.fs.writeFile('myjsonfile.json', json);
    this.ibGlobalFn.showToast("Success Register New Device", "success");
  }
}
