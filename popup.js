/* jshint esversion: 6 */

document.addEventListener('DOMContentLoaded', () => {
  var els = document.querySelectorAll('nav > div');
  for (var i = 0; i < els.length; i++) {
    els[i].addEventListener('click', tabs, false);
  }

  document.getElementById('save').addEventListener('click', saveOptions);

  loadBattleInfo();
  loadOptions();
});


// navigation in popup window
function tabs () {
  var actives = document.querySelectorAll('.activeTab');
  for (var i = 0; i < actives.length; i++){
    actives[i].className = '';
  }
  this.className = 'activeTab';
  document.getElementById(event.target.getAttribute('data-link')).className = 'activeTab';
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

      html = '<a href="http://elmaonline.net/battles/' + battle.id + '"" id="levelFile" target="_blank">' + file + '</a> by <span id="designer">' + designer + '</span>';
      document.getElementById('levelInfo').innerHTML = html;

      html = '<div>' + type + ' battle</div><div>' + flags.join(', ') + '</div>';
      document.getElementById('battleType').innerHTML = html;

      html = '<span class="icon">&#xf017;</span> <span id="timeLeft">' + (mins >= 0 ? mins : 0) + ':' + (secs >= 0 ? secs : '00') + '</span> / <span id="battleTime">' + duration/60 + 'm</span>';
      document.getElementById('timer').innerHTML = html;

      html = '<img src="' + localStorage.map + '">';
      document.getElementById('battleMap').innerHTML = html;

    } else { // no battle
      document.getElementById('levelInfo').innerHTML = "No battle active";
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
  };
  chrome.storage.sync.set(settings, () => {
    var status = document.getElementById('status');
    status.className = 'fadein';
    setTimeout(() => {
      status.className = 'fadeout';
    }, 1000);
  });
}

function loadOptions() {
  chrome.storage.sync.get({
    battle: true,
    notification: true,
    icon: true
  }, items => {
    document.getElementById('settingBattle').checked = items.battle;
    document.getElementById('settingNotification').checked = items.notification;
    document.getElementById('settingIcon').checked = items.icon;
  });
}
