import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import { HeartRateSensor } from "heart-rate";
import { BodyPresenceSensor } from "body-presence";
import { battery } from "power";
import { charger } from "power";
import { today } from "user-activity";

// Update the clock every second
clock.granularity = "seconds";

// Get a handle on the <text> element
const myLabel = document.getElementById("myLabel");
const todayDate = document.getElementById("todayDate");
const batteryLevel = document.getElementById("batteryLevel");
const batteryImg = document.getElementById("batteryImg");
const hrImg = document.getElementById("hrImg");

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  
  let today = evt.date;
  let hours = today.getHours();
  let day = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];
  let month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  let mins = util.zeroPad(today.getMinutes());
  let secs = util.zeroPad(today.getSeconds());
  let dd = util.zeroPad(today.getDate());
  let mm = util.zeroPad(today.getMonth());
  let yy = util.zeroPad(today.getFullYear());
  
  myLabel.text = `${hours}:${mins}:${secs}`;
  todayDate.text = day[Math.floor(util.zeroPad(today.getDay()))] + ", " + month[Math.floor(util.zeroPad(mm))] + " " + util.zeroPad(dd) + " " + util.zeroPad(yy);
}

// get heartrate data
let hrm = new HeartRateSensor();
let body = new BodyPresenceSensor();
let hrmData = document.getElementById("hrmData");

hrm.start();

function refreshHR() {
  hrImg.href = "./resources/images/bpm.png";
  hrmData.text = hrm.heartRate + " BPM";
};

setInterval(refreshHR, 1000);

// get battery data
function refreshBattery () {
  let batteryValue = Math.floor(battery.chargeLevel);
  
  function batteryIcon(batteryValue) {
    if (batteryValue >= 75) {
      return "./resources/images/battery4.png"
    } else if ((batteryValue < 75) && (batteryValue >= 50)) {
      return "./resources/images/battery3.png"
    } else if ((batteryValue < 50) && (batteryValue >= 25)) {
      return "./resources/images/battery2.png"
    } else {
      return "./resources/images/battery.png"
    }
  }
  
  batteryImg.href = batteryIcon(batteryValue);
  
  batteryLevel.text = " " + batteryValue + "%";
};

setInterval(refreshBattery, 1000);