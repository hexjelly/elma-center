/* jshint esversion: 6 */

// battle API
const FLAGS = [
  { "mask": 1, "attr": "See others" },
  { "mask": 2, "attr": "See times" },
  { "mask": 4, "attr": "Allow starter" },
  { "mask": 8, "attr": "Apple bug" },
  { "mask": 16, "attr": "No volt" },
  { "mask": 32, "attr": "No turn" },
  { "mask": 64, "attr": "One turn" },
  { "mask": 128, "attr": "No brake" },
  { "mask": 256, "attr": "No throttle" },
  { "mask": 512, "attr": "Always throttle" },
  { "mask": 1024, "attr": "Drunk" },
  { "mask": 4096, "attr": "One wheel" },
  { "mask": 8192, "attr": "Multi" }
];

const TYPES = [
  "Normal", "One life", "First finish", "Slowness", "Survivor", "Last result", "Finish count", "1 Hour TT", "Flag tag", "Apple", "Speed"
];

// sets extension icon badge color based on time left of battle
function setTimeIndicatorIcon (time) {
  if (time === false) {
    chrome.browserAction.setBadgeText(null);
  }
  chrome.browserAction.setBadgeBackgroundColor({color:[106, 161, 33, 255]});
  chrome.browserAction.setBadgeText({text: "\u00A0"});
}

// TODO: remember to only fetch level info once for each lev hurr durr!
function getBattleInfo () {

}

// start watching for new battles
function startBackground () {
  setTimeIndicator(10);
}

// stop watching for new battles
function stopBackground () {
  setTimeIndicator(false);
}

// start background processing
startBackground();
