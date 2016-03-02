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
var timer;
var battle = {};

// XHR requests, with promises
function getURL(url) {
  return new Promise((resolve, reject) => {
    var req = new XMLHttpRequest();
    req.open('GET', url);

    req.onload = () => {
      if (req.status == 200) {
        resolve(req.responseText);
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
  if (timeState) {
    var percentLeft = (timeState[0] + timeState[1]) / timeState[0];
    if (percentLeft >= 0.5) {
      chrome.browserAction.setBadgeText({text: "\u00A0"}); // invisible character
      chrome.browserAction.setBadgeBackgroundColor({color:[106, 161, 33, 255]});
    } else if (percentLeft >= 0.25) {
      chrome.browserAction.setBadgeText({text: "\u00A0"}); // invisible character
      chrome.browserAction.setBadgeBackgroundColor({color:[245, 219, 49, 255]});
    } else {
      chrome.browserAction.setBadgeText({text: "\u00A0"}); // invisible character
      chrome.browserAction.setBadgeBackgroundColor({color:[224, 27, 27, 255]});
    }
  } else {
    chrome.browserAction.setBadgeText({text: ''}); // empty string removes badge
  }
}

// get battle info from battle API and EOL
function getBattleInfo () {
  getURL(APIurl).then(response => {
    var res = JSON.parse(response);
    if (res.id) { // battle probably active if we get a battle id
      if (res.id !== battle.id) { // new battle
        battle = res;
        battle.timeReceived = Math.floor(Date.now() / 1000);
        battle.battleFlags = [];
        battle.battleType = TYPES[battle.battle_type];
        FLAGS.forEach(flag => {
          if (battle.battle_attrs & flag.mask) {
            battle.battleFlags.push(flag.attr);
          }
        });
        getMap(res.id).then(map => {
          battle.map = map;
          notifyBattle();
        });
      } else { // not new

      }
      setTimeIndicatorIcon([res.duration, res.start_delta]);
    } else { // no battle active
      battle = {};
      setTimeIndicatorIcon(false);
    }
  });
}

// get map from EOL
function getMap (id) {
  return new Promise((resolve, reject) => {
    getURL(EOLurl + id).then(response => {
      var tempDOM = document.createElement('div');
      tempDOM.innerHTML = response;
      // getElementById not working for whatever reason, ghetto querySelector instead
      var map = tempDOM.querySelector('#right').getElementsByTagName("img")[0].getAttribute("src");
      resolve(map);
    });
  });
}

function BattleTimer () {
}

BattleTimer.prototype.start = function () {
  this.active = true;
  this.tick();
};

BattleTimer.prototype.tick = function () {
  if (this.active) {
    getBattleInfo();
    setTimeout(() => {
      this.tick();
    }, 10000);
  }
};

BattleTimer.prototype.stop = function () {
  this.active = false;
};

// notifications
function notifyBattle () {
  chrome.notifications.create('NewBattle', {
    type: 'image',
    iconUrl: 'images/icon128.png',
    imageUrl: battle.map,
    title: battle.file_name + " by " + battle.designer,
    message: battle.battleType + " battle " + battle.duration/60 + 'm\n' + battle.battleFlags.join(', ')
  });
}

// start watching for new battles
function startBackground () {
  timer = new BattleTimer();
  timer.start();
}

// stop watching for new battles
function stopBackground () {
  setTimeIndicatorIcon(false);
  timer.stop();
  battle = {};
}

// start background processing
chrome.runtime.onMessage.addListener((request, sender, sendBattle) => {
  if (request == "battle") {
    sendBattle(battle);
  }
});
//startBackground();
