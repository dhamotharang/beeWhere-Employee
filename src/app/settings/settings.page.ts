import { AuthenticationService } from '@services/_services/authentication.service';
import { GlobalFnService } from '@services/global-fn.service';
import { APIService } from '@services/_services/api.service';
import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';

/**
 * This component for Settings page
 * @export
 * @class SettingsPage
 * @implements {OnInit}
 */
@Component({
  selector: "app-settings",
  templateUrl: "./settings.page.html",
  styleUrls: ["./settings.page.scss"],
})
export class SettingsPage implements OnInit {
  /**
   * To check opening of login activities list
   * @type {boolean}
   * @memberof SettingsPage
   */
  openLoginActivityList: boolean;

  /**
   * To check opening of view profile
   * @type {boolean}
   * @memberof SettingsPage
   */
  openViewMyProfile: boolean;

  /**
   * Bind value of login log
   * @memberof SettingsPage
   */
  public loginLog;

  /**
   * Bind option to show activites on log
   * @memberof SettingsPage
   */
  public isShowLoginActivitiesLog;

  /**
   * Bind index value of checking the show login log
   * @memberof SettingsPage
   */
  public checkShowLoginIndex;

  /**
   * Bind value of loginId from currSession in localStorage
   * @type {string}
   * @memberof SettingsPage
   */
  loginId: string;

  /**
   * Bind logged user info
   * @type {*}
   * @memberof SettingsPage
   */
  myProfileData: any;
  
  /**
   * Bind value of app's version code (on device only)
   * @type {string}
   * @memberof SettingsPage
   */
  public appVersion: string = null;
  
  
  public currTime: any = new Date().toISOString();
  geoLocError: string;
  locWatch: any;
  countTimeoutReqLocation: number = 0;
  locationTimerId: NodeJS.Timeout;
  latitude: number;
  longitude: number;
  formatted_address: any;

  public publicIp = require("public-ip");
  public gPlatform = require("platform");
  loginPublicIp: any;
  /**
   * Creates an instance of SettingsPage.
   * @param {APIService} stApi
   * @param {GlobalFnService} stFGlobal
   * @memberof SettingsPage
   */
  constructor(private stApi: APIService, private stFGlobal: GlobalFnService, public stAuth: AuthenticationService,
              private platform: Platform, private geoloc: Geolocation) {}

  /**
   * Initialize methods in this component
   * @memberof SettingsPage
   */
  ngOnInit() {


    (async () => {
      this.loginPublicIp = await this.publicIp.v4();
    })();
  }

  /**
   * Will be executed once this view was entered
   * @memberof SettingsPage
   */
  ionViewDidEnter() {
    this.loginLog = [];
    this.countTimeoutReqLocation = 0;
    this.getLoc();
    // this.versionCode
    this.platform.ready().then(() => {
      console.log('on device ready only');
      this.appVersion = localStorage.getItem("app_versionnumber");
      console.log(this.appVersion);
    });
  }

  /**
   * To return that will redirect url to beeSuite user web page
   * @param {*} redirectUrl
   * @returns
   * @memberof SettingsPage
   */
  navToOtherPage(redirectUrl) {
    return (window.location.href = redirectUrl);
  }

  /**
   * To get login log list based on userId. Will execute loading while waiting response
   * from db to get login log list. The loading component will dismissed once the log
   * finish the process
   * @memberof SettingsPage
   */
  toLoginActivity() {
    this.openLoginActivityList = true;
    this.stFGlobal.showLoading();
    this.stApi
      .getWithHeader(
        "/api/login-log/" + JSON.parse(localStorage.getItem("usr")).userId
      )
      .subscribe(
        (resLog: any) => {
          resLog.forEach((resItem) => {
            // resItem.LOGGED_TIMESTAMP = new Date(
            //   resItem.LOGGED_TIMESTAMP * 1000
            // );

            if (resItem.ACTIVITY !== null) {
              if (resItem.ACTIVITY.length === undefined) {
                resItem.ACTIVITY = [resItem.ACTIVITY];
              }

              // resItem.ACTIVITY.forEach((actItem) => {
              //   actItem.timestamp = new Date(actItem.timestamp * 1000);
              // });
            }
          });
          resLog.sort((a, b) => b.LOGGED_TIMESTAMP - a.LOGGED_TIMESTAMP);

          this.loginLog = resLog;
          this.loginId = localStorage.getItem("currSession");
          this.stFGlobal.dissmissLoading();
        },
        (error) => {
          console.log(error);
          this.stFGlobal.dissmissLoading();
          this.stFGlobal.showAlert(
            error.status + " " + error.statusText,
            error.error,
            "alert-error"
          );
        }
      );
  }

  toViewProfile() {
    console.log("toViewProfile");
    this.openViewMyProfile = true;
    this.myProfileData = localStorage.getItem('usr');
  }

  getLoc() {
    this.geoLocError = "";
    this.geoloc
      .getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0})
      .then((resp) => {
        console.log("resp");
        console.log(resp);
        this.stApi
          .getWithHeader(
            "/api/location/search/coordinate/" +
              resp.coords.latitude +
              "%2C" +
              resp.coords.longitude
          )
          .subscribe(
            (res) => {
              this.latitude = resp.coords.latitude;
              this.longitude = resp.coords.longitude;
              this.formatted_address = (res as any).results[0].formatted_address;

              console.log(this.locWatch);
            },
            (error) => {
              console.log(error);
            }
          );
      })
      .catch((error) => {
        this.geoLocError = "Error getting location. " + error.message;
        if (this.countTimeoutReqLocation < 10) {
          setTimeout(() => {
            this.getLoc();
            this.countTimeoutReqLocation++;
          }, 2000);

        }
      });
    // }
    this.locationTimerId = setTimeout(() => {
      this.getLoc();
    }, 300000);
    // }, 300000);
  }

}
