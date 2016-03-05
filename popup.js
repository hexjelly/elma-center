/* jshint esversion: 6 */

var settings;

document.addEventListener('DOMContentLoaded', () => {
  var els = document.querySelectorAll('nav > div');
  for (var i = 0; i < els.length; i++) {
    els[i].addEventListener('click', tabs, false);
  }

  document.getElementById('save').addEventListener('click', saveOptions);

  loadPage();
});

// translation
function translate(message, defaultmessage) {
  if (!settings.localization) {
    return chrome.i18n.getMessage(message);
  }
  return defaultmessage;
}

// navigation in popup window
function tabs (event) {
  var actives = document.querySelectorAll('.activeTab');
  for (var i = 0; i < actives.length; i++){
    actives[i].className = '';
  }
  this.className = 'activeTab';
  document.getElementById(this.getAttribute('data-link')).className = 'activeTab';
}

// load battle info from background page and display it
function loadBattleInfo () {
  chrome.runtime.sendMessage('battle', battle => {
    if (battle && battle.id) { // there's a battle active
      var file = battle.file_name;
      var designer = battle.designer;
      var duration = battle.duration;
      var type = battle.battleType;
      var flags = battle.battleFlags;
      var timeReceived = battle.timeReceived;
      var timeLeft = (duration + battle.start_delta) - (Math.floor(Date.now() / 1000) - timeReceived);
      var mins = Math.floor(timeLeft / 60);
      var secs = timeLeft % 60;
      secs = secs < 10 ? '0' + secs : secs;
      var html;

      html = '<a href="http://elmaonline.net/battles/' + battle.id + '"" id="levelFile" target="_blank">' + file + '</a> ' + translate('by', 'by') + ' <span id="designer">' + designer + '</span>';
      document.getElementById('levelInfo').innerHTML = html;

      html = '<div>' + type + ' battle</div><div>' + flags.join(', ') + '</div>';
      document.getElementById('battleType').innerHTML = html;

      html = '<span class="icon">&#xf017;</span> <span id="timeLeft">' + (mins >= 0 ? mins : 0) + ':' + (secs >= 0 ? secs : '00') + '</span> / <span id="battleTime">' + duration/60 + 'm</span>';
      document.getElementById('timer').innerHTML = html;

      html = '<img src="' + battle.map + '">';
      document.getElementById('battleMap').innerHTML = html;

    } else { // no battle
      document.getElementById('levelInfo').innerHTML = translate("nobattle", "No battle active");
      document.getElementById('timer').innerHTML = '';
      document.getElementById('battleMap').innerHTML = '';
      document.getElementById('battleType').innerHTML = '';
    }
  });
}

// save and load settings
function saveOptions() {
  var settings = {
    battle: document.getElementById('settingBattle').checked,
    notification: document.getElementById('settingNotification').checked,
    icon: document.getElementById('settingIcon').checked,
    localization: document.getElementById('settingLocalization').checked,
  };
  chrome.storage.sync.set(settings, () => {
    var status = document.getElementById('status');
    status.className = 'fadein';
    setTimeout(() => {
      status.className = 'fadeout';
    }, 1000);
  });
}

function loadPage() {
  chrome.storage.sync.get({
    battle: true,
    notification: true,
    icon: true,
    localization: false
  }, items => {
    settings = items;
    document.getElementById('settingBattle').checked = items.battle;
    document.getElementById('settingNotification').checked = items.notification;
    document.getElementById('settingIcon').checked = items.icon;
    document.getElementById('settingLocalization').checked = items.localization;

    if (settings.battle) {
      loadBattleInfo();
    } else {
      document.getElementById('levelInfo').innerHTML = translate('disabled', 'Battle information disabled');
    }

    // translation stuff
    document.getElementById('navbattle').innerHTML = translate("navbattle", "Battle");
    document.getElementById('navoptions').innerHTML = translate("navoptions", "Options");
    document.getElementById('navinfo').innerHTML = translate("navinfo", "info");
    document.getElementById('optbattle').innerHTML = translate("optbattle", "Check for new battles");
    document.getElementById('optnotification').innerHTML = translate("optnotification", "Enable popup notifications");
    document.getElementById('opticon').innerHTML = translate("opticon", "Enable icon indicator");
    document.getElementById('save').innerHTML = translate("optbutton", "Save settings");
    document.getElementById('status').innerHTML = translate("optsaved", "Saved");
    document.getElementById('optlocalization').innerHTML = translate("optlocalization", "Disable localization");
    document.getElementById('source').innerHTML = translate("source", "Source code");
    document.getElementById('extension').innerHTML = translate("extension", "Extension page");
    document.getElementById('comments').innerHTML = translate("comments", "Comments, discussion, ideas");
  });
}
