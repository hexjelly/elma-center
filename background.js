/* jshint esversion: 6 */

// battle API mode flags
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

// battle API battle type
const TYPES = [
  "Normal", "One life", "First finish", "Slowness", "Survivor", "Last result", "Finish count", "1 Hour TT", "Flag tag", "Apple", "Speed"
];

var APIurl = "http://108.61.164.75:8880/current_battle?json=1";
var EOLurl = "http://elmaonline.net/battles/";

// XHR requests, with promises
function getURL(url) {
  return new Promise((resolve, reject) => {
    var req = new XMLHttpRequest();
    req.open('GET', url);

    req.onload = () => {
      if (req.status == 200) {
        resolve(req.response);
      } else {
        reject(Error(req.statusText));
      }
    };

    req.onerror = () => {
      reject(Error("Network Error"));
    };

    req.send();
  });
}

// sets extension icon badge color based on time left of battle
function setTimeIndicatorIcon (timeState) {
  switch (timeState) {
    case 'green':
      chrome.browserAction.setBadgeText({text: "\u00A0"}); // invisible character
      chrome.browserAction.setBadgeBackgroundColor({color:[106, 161, 33, 255]});
      break;
    case 'yellow':
      chrome.browserAction.setBadgeText({text: "\u00A0"}); // invisible character
      chrome.browserAction.setBadgeBackgroundColor({color:[245, 219, 49, 255]});
      break;
    case 'red':
      chrome.browserAction.setBadgeText({text: "\u00A0"}); // invisible character
      chrome.browserAction.setBadgeBackgroundColor({color:[224, 27, 27, 255]});
      break;
    default:
      chrome.browserAction.setBadgeText({text: ''}); // empty string removes badge
      break;
  }
}

// TODO: remember to only fetch level info once for each lev hurr durr!
function getBattleInfo () {
  getURL(APIurl).then(response => {
    var res = JSON.parse(response);

    // battle is currently active (probably)
    if (Object.keys(res).length > 0) {

    } else {

    }

    console.log(res);
  });
}

// start watching for new battles
function startBackground () {
  // TODO: put timers and stuff
}

// stop watching for new battles
function stopBackground () {
  setTimeIndicatorIcon(false);
  // TODO: remove timers etc. obv...
}

// start background processing
startBackground();
