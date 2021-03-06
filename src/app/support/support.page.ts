// import { Refresher } from '@ionic/angular';
import { GlobalFnService } from '@services/global-fn.service';
import { APIService } from '@services/_services/api.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { GlobalService } from '@services/_providers/global.service';

@Component({
  selector: "app-support",
  templateUrl: "./support.page.html",
  styleUrls: ["./support.page.scss"],
})
export class SupportPage implements OnInit {
  /**
   * Bind current time in ISO format
   * @memberof SupportPage
   */
  public curSTime = new Date().toISOString();

  /**
   * Get sample data from json
   * @memberof SupportPage
   */
  public data = require("../sampledata.json");
  public globalData = require("@services/_providers/global.json");

  /**
   * Bind support type either requestForm or suggestionForm. Initialized as requestForm
   * @memberof SupportPage
   */
  public supportType = "requestForm";

  /**
   * Bind form values
   * @type {FormGroup}
   * @memberof SupportPage
   */
  public mform: FormGroup;

  public reqDetails: FormGroup;

  /**
   * Form to bind file uploads
   * @private
   * @memberof SupportPage
   */
  private formData = new FormData();

  public choosenFile = "No file chosen";

  public uploadErr = null;
  public disablesubmitbutton: boolean = false;
  /**
   * Creates an instance of SupportPage.
   * @param {FormBuilder} formbuilder get methods from FormBuilder
   * @memberof SupportPage
   */
  constructor(
    public formbuilder: FormBuilder,
    private sApi: APIService,
    private sGFn: GlobalFnService,
    private sGlobal: GlobalService
  ) {
    this.mform = formbuilder.group({
      supportType: this.supportType,
      requestForm: this.formbuilder.group({
        type: ["", Validators.required],
        title: ["", Validators.required],
        supportDoc: [""],
        description: "",
      }),
      suggestionForm: this.formbuilder.group({
        title: ["", Validators.required],
        description: "",
      }),
    });

    this.reqDetails = formbuilder.group({
      clocksTime: ["", Validators.required],
      inTime: ["", Validators.required], 
      outTime: ["", Validators.required],
    });
  }

  /**
   * Initialize methods in this page
   * @memberof SupportPage
   */
  ngOnInit() {
    this.sStartTime();
  }

  /**
   *  To update time lively
   * @memberof ClockInPage
   */
  sStartTime() {
    this.curSTime = new Date().toISOString();

    setTimeout(() => {
      this.sStartTime();
    }, 1000);
  }



  /**
   * Will be executed once submit button is pressed.
   * Get the validated form then post it
   * @memberof SupportPage
   */
  submitForm() { 
    this.disablesubmitbutton = true;
    console.log(this.globalData.userInfo);
    console.log(this.data);
    console.log(this.mform);
    console.log(this.reqDetails.value);
    console.log(this.reqDetails.value.inTime);
    console.log(new Date(this.reqDetails.value.outTime).valueOf());
    let tempObj;
    switch (this.mform.get("supportType").value) {
      case "suggestion":
        if (this.mform.get("suggestionForm").valid) {
          console.log(this.mform.get("suggestionForm").value);
          tempObj = {
            requestType: "suggestions",
            subject: this.mform.get("suggestionForm").value.title,
            starttime: null,
            endtime: null,
            supportingDoc: "",
            description:
              this.mform.get("suggestionForm").value.description === null
                ? ""
                : this.mform.get("suggestionForm").value.description,
            userGuid: this.globalData.userInfo.userId,
            userEmail: this.globalData.userInfo.email,
          };

          console.log(tempObj);
          // this.sApi.postWithHeader('/support', tempObj).subscribe((postRes) => {
          //   console.log(postRes);
          //   this.sGFn.showToast('Subitted', 'success');
          //   this.mform.get("suggestionForm").reset();
          //   console.log(this.mform.get("suggestionForm").value);
          // });
          this.postObj(tempObj);
        } else {
          this.sGFn.showToast("Please fill in required fields ", "error");
        }
        break;

      default:
        console.log(this.mform.get("requestForm").value.description);
        console.log(this.choosenFile);
        if (this.mform.get("requestForm").valid) {
          tempObj = {
            requestType: this.mform.get("requestForm").value.type,
            subject: this.mform.get("requestForm").value.title,
            starttime: (new Date(this.reqDetails.value.inTime).valueOf() / 1000),
            endtime: (new Date(this.reqDetails.value.outTime).valueOf() / 1000),
            supportingDoc: "",
            description:
              this.mform.get("requestForm").value.description === null
                ? ""
                : this.mform.get("requestForm").value.description,
            userGuid: JSON.parse(localStorage.getItem("usr")).userId,
            userEmail: JSON.parse(localStorage.getItem("usr")).email,
          };
          this.choosenFile !== "No file chosen"
            ? this.postUploadImg()
            : this.sGFn.showToast("Supporting document is required", "error"); // this.postObj(tempObj);
          // this.postUploadImg();
        } else {
          this.sGFn.showToast("Please fill in required fields ", "error");
        }
        break;
    }
  }

  postObj(obj) {
    console.log(obj)
    this.sApi.postWithHeader("/support", obj).subscribe((postRes) => {
      console.log(postRes);
      this.sGlobal.addLoginActivity((obj.requestType === "clocks") ? "Clocks request" : "Overtime request");
      this.sGFn.showToast("Submitted", "success");
      this.mform.get("suggestionForm").reset();
      // this.mform.get("reqDetails").reset();
      this.mform.get("requestForm").reset();
      this.reqDetails.reset();
      this.choosenFile = "No file chosen";
      this.formData = new FormData();
      this.disablesubmitbutton = false;

    }, (error) => {
      if (error.status === 401 && error.statusText === "Unauthorized") {
        this.sGlobal.reauthUser();
      }
    });
  }
  /**
   * on change segment event either request or suggestion then update it into form (supportType)
   * @memberof SupportPage
   */
  changeSegmentType() {
    console.log(this.mform.value.supportType);
    this.supportType = this.mform.value.supportType;
    this.mform.reset();
    this.mform.controls.supportType.setValue(this.supportType);
  }

  /**
   * Get form validation states based on type (request or suggestion)
   * @param {*} type
   * @returns
   * @memberof SupportPage
   */
  getFormControls(type) {
    return type === "request"
      ? (this.mform.get("requestForm") as FormArray).controls
      : (this.mform.get("suggestionForm") as FormArray).controls;
  }

  upload(evt) {
    console.log("upload");
    console.log(evt);

    // const fileToUpload = evt.item(0);
    // console.log(formData);
    const file = (event as any).target.files[0];
    console.log(file);
    this.uploadErr = (file.size > 5000000) ? "File uploaded is to big (" + (file.size/1000000).toFixed(2) + "MB)"  : null;
    this.choosenFile = file.name;
    this.formData.append("file", file, file.name);
    console.log(evt);
  }

  postUploadImg() {
    this.sApi
      .postUpload("/api/azure/upload", this.formData)
      .subscribe((resp) => {
        console.log(resp);
        const obj = {
          requestType: this.mform.get("requestForm").value.type,
          subject: this.mform.get("requestForm").value.title,
          starttime: (new Date(this.reqDetails.value.inTime).valueOf() / 1000),
          endtime: (new Date(this.reqDetails.value.outTime).valueOf() / 1000),
          supportingDoc: (resp as any).filename,
          description:
            this.mform.get("requestForm").value.description === null
              ? ""
              : this.mform.get("requestForm").value.description,
          userGuid: JSON.parse(localStorage.getItem("usr")).userId,
          userEmail: JSON.parse(localStorage.getItem("usr")).email,
        };
        console.log(obj);
        this.postObj(obj);
      }, (error) => {
        if (error.status === 401 && error.statusText === "Unauthorized") {
          this.sGlobal.reauthUser();
        }
      });
  }

  refreshSupportPage(event) {
  // refreshSupportPage(event: Refresher) {
    this.mform.reset();
    this.reqDetails.reset();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }
}
