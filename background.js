/* jshint esversion: 6 */

// battle API mode flags
const FLAGS = [
  { "mask": 1, "default": "See others", "i18n": "others" },
  { "mask": 2, "default": "See times", "i18n": "times" },
  { "mask": 4, "default": "Allow starter", "i18n": "starter" },
  { "mask": 8, "default": "Apple bug", "i18n": "bug" },
  { "mask": 16, "default": "No volt", "i18n": "novolt" },
  { "mask": 32, "default": "No turn", "i18n": "noturn" },
  { "mask": 64, "default": "One turn", "i18n": "oneturn" },
  { "mask": 128, "default": "No brake", "i18n": "nobrake" },
  { "mask": 256, "default": "No throttle", "i18n": "nothrottle" },
  { "mask": 512, "default": "Always throttle", "i18n": "throttle" },
  { "mask": 1024, "default": "Drunk", "i18n": "drunk" },
  { "mask": 4096, "default": "One-wheel", "i18n": "onewheel" },
  { "mask": 8192, "default": "Multi", "i18n": "multi" }
];

// battle API battle type
const TYPES = [
  { "default": "Normal", "i18n": "normal" },
  { "default": "One life", "i18n": "onelife" },
  { "default": "First finish", "i18n": "ff" },
  { "default": "Slowness", "i18n": "slow" },
  { "default": "Survivor", "i18n": "survivor" },
  { "default": "Last result", "i18n": "last" },
  { "default": "Finish Count", "i18n": "finishcount" },
  { "default": "1 hour TT", "i18n": "tt" },
  { "default": "Flag tag", "i18n": "flagtag" },
  { "default": "Apple", "i18n": "apple" },
  { "default": "Speed", "i18n": "speed" }
];

var APIurl = "http://108.61.164.75:8880/current_battle?json=1";
var EOLurl = "http://elmaonline.net/battles/";
var timer;
var battle = {};
var settings = {};

// translation
function translate(message, defaultmessage) {
  if (!settings.localization) {
    return chrome.i18n.getMessage(message);
  }
  return defaultmessage;
}

// XHR requests, with promises
function getURL(url, img) {
  return new Promise((resolve, reject) => {
    var req = new XMLHttpRequest();
    req.open('GET', url);
    if (img) {
      req.responseType = 'arraybuffer';
    }
    req.onload = () => {
      if (req.status == 200) {
        resolve(req.response);
      } else {
        reject(Error(req.status));
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
        battle.battleType = translate(TYPES[battle.battle_type].i18n, TYPES[battle.battle_type].default);
        FLAGS.forEach(flag => {
          if (battle.battle_attrs & flag.mask) {
            battle.battleFlags.push(translate(flag.i18n, flag.default));
          }
        });
        getMap(res.id).then(map => {
          battle.map = map;
          if (settings.notification) notifyBattle();
        });
      } else { // not new

      }
      if (settings.icon && settings.battle) setTimeIndicatorIcon([res.duration, res.start_delta]);
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
      getURL(map, true).then(mapdata => {
        var map = 'data:image/png;base64,' + btoa(String.fromCharCode.apply(null, new Uint8Array(mapdata)));
        resolve(map);
      });
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
    title: battle.file_name + " " + translate("by", "by") + " " + battle.designer,
    message: battle.battleType + " " + translate("battle", "battle") + " " + battle.duration/60 + 'm\n' + battle.battleFlags.join(', ')
  });
}

// start watching for new battles
function startBackground () {
  // load settings
  chrome.storage.sync.get({
    battle: true,
    notification: true,
    icon: true
  }, items => {
    settings = items;

    if (settings.battle) {
      timer = new BattleTimer();
      timer.start();
    }
  });
}

// stop watching for new battles
function stopBackground () {
  setTimeIndicatorIcon(false);
  if (timer) timer.stop();
  battle = {};
}

/** start background processing **/

// listen to storage changes for settings
chrome.storage.onChanged.addListener((changes) => {
  for (var val in changes) {
    settings[val] = changes[val].newValue;
    if (val === 'battle' && changes[val].newValue === false) {
      stopBackground();
    } else if (val === 'battle' && changes[val].newValue === true) {
      startBackground();
    } else if (val === 'icon' && changes[val].newValue === false) {
      setTimeIndicatorIcon(false);
    }
  }
});

// sends back battle information to popup page when requested
chrome.runtime.onMessage.addListener((request, sender, sendBattle) => {
  if (request == "battle") {
    sendBattle(battle);
  }
});

// start the stuff
startBackground();
