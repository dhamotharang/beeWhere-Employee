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
  public beaconScope;
  
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
    // console.log(this.beaconData);
  }
  

  callBeacon() {
    let delegate = this.ibeacon.Delegate();

    // Request permission to use location on iOS
    this.ibeacon.requestAlwaysAuthorization();
    console.log('testbeacon');

    // this.ibeacon.getMonitoredRegions().then((data) => {
    //   console.log('getMonitoredRegions');
    //   console.log(data);
    // });

    delegate.didRangeBeaconsInRegion().subscribe(
      data => { 
        var uniqueBeaconKey;
        data.beacons.forEach((beacon) =>{
          console.log('aabeacon');
          console.log(beacon);
          uniqueBeaconKey = beacon.uuid + ':' + beacon.major + ':' + beacon.minor;
          this.beaconScope.push(uniqueBeaconKey);
          
        })  

        console.log(this.beaconScope);
        console.log('didRangeBeaconsInRegion:', JSON.stringify(data));
      }
      );
    this.ibeacon.startRangingBeaconsInRegion(this.ibeacon.BeaconRegion('estimate-identifier', '323213213-0000-0000-0000-000000000000'));

    // create a new delegate and register it with the native layer

    // console.log(delegate);

    // Subscribe to some of the delegate's event handlers
    delegate.didRangeBeaconsInRegion()
      .subscribe(
        data => console.log('didRangeBeaconsInRegion: ', JSON.stringify(data)),
        error => console.error('error didRangeBeaconsInRegion', error)
      );
    delegate.didStartMonitoringForRegion()
      .subscribe(
        data => {
          console.log('didStartMonitoringForRegion: ', JSON.stringify(data));
          console.log(data.region['identifier']);
          console.log(data.region['uuid']);
          console.log(data.region['major']);
          console.log(data.region['minor']);
          this.beaconData.unregisteredList.push({
            identifer: data.region['identifier'],
            uuid: data.region['uuid'], 
            major: data.region['major'],
            minor: data.region['minor']
          });
          console.log('this.beaconData');
          console.log(this.beaconData);
        },
        // {"eventType":"didStartMonitoringForRegion","region":{"identifier":"beaconAtTheMacBooks","uuid":"00000000-0000-0000-0000-000000000000","major":"5","minor":"1000","typeName":"BeaconRegion"}}
        error => console.error('error didStartMonitoringForRegion', error)
      );
    delegate.didEnterRegion()
      .subscribe(
        data => {
          console.log('didEnterRegion: ', JSON.stringify(data));
        }
      );


    let beaconRegion = this.createBeacon();
    this.ibeacon.startMonitoringForRegion(beaconRegion)
      .then(
        () => {
          console.log('Native Beacon layer received the request to monitoring');
          console.log(JSON.stringify(beaconRegion));
          // {"identifier":"beaconAtTheMacBooks","uuid":"00000000-0000-0000-0000-000000000000","major":5,"minor":1000,"typeName":"BeaconRegion"}
        },
        error => console.error('Native Beacon layer failed to begin monitoring: ', error)
      );
  }

  // {"eventType":"didStartMonitoringForRegion","region":{"identifier":"beaconAtTheMacBooks",
  // "uuid":"00000000-0000-0000-0000-000000000000","major":"5","minor":"1000","typeName":"BeaconRegion"}}
  checkNearbyBeacon() {
    let delegate = this.ibeacon.Delegate();
    // Subscribe to some of the delegate's event handlers
    delegate.didRangeBeaconsInRegion()
    .subscribe(
      data => console.log('didRangeBeaconsInRegion: ', data),
      error => console.error('error didRangeBeaconsInRegion', error)
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

    // const mybeacon : any = [
    //   {
    //     identifier : "ionBeacon", 
    //     uuid:"74278bda-XXXX-XXXX-XXXX-720eaf059935",
    //     major: 65504,
    //     minor:65505,
    //     notifyEntryStateOnDisplay: true 
    //   },
    //   {
    //     identifier : "ionBeacon1", 
    //     uuid:"e2c56db5-XXXX-XXXX-XXXX-d0f5a71096e0",
    //     major: 0,
    //     minor:0,
    //     notifyEntryStateOnDisplay: true 
    //   }
    // ];

    // mybeacon.forEach(bcn => {
    //   let region = this.ibeacon.BeaconRegion(bcn.identifier, bcn.uuid, bcn.major, bcn.minor, bcn.notifyEntryStateOnDisplay  ); //
        
    //   //============== start ranging ============
    //   this.ibeacon.startRangingBeaconsInRegion(region);

    //   let delegate = this.ibeacon.Delegate();
    //   delegate = this.ibeacon.Delegate();
    //  this.ibeacon.startMonitoringForRegion(mybeacon)
    //   .then(data => {
          
    //       console.log('startMonitoringForRegion: ', JSON.stringify(data));
    //       // this.beaconData.unregisteredList.push({
    //       //   identifer: data['identifier'],
    //       //   uuid: data['uuid'], 
    //       //   major: data['major'],
    //       //   minor: data['minor']
    //       // });
    //       console.log('this.beaconData2');
    //       console.log(this.beaconData);
    //     });
    // });
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
