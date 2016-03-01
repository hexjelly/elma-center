/* jshint esversion: 6 */

window.onload = () => {
  var els = document.querySelectorAll('nav > div');
  for (var i = 0; i < els.length; i++) {
    els[i].addEventListener('click', tabs, false);
  }

  loadBattleInfo();
};

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
      var timeLeft = duration + battle.start_delta;
      var html;

      html = '<a href="http://elmaonline.net/battles/' + battle.id + '"" id="levelFile" target="_blank">' + file + '</a> by <span id="designer">' + designer + '</span>';
      document.getElementById('levelInfo').innerHTML = html;

      html = '<div>' + type + ' battle</div><div>' + flags.join(', ') + '</div>';
      document.getElementById('battleType').innerHTML = html;

      html = '<span class="icon">&#xf017;</span> <span id="timeLeft">~' + Math.floor(timeLeft/60) + 'm</span> / <span id="battleTime">' + duration/60 + 'm</span>';
      document.getElementById('timer').innerHTML = html;

      html = '<img src="' + battle.map + '">';
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
function save_options() {
  var color = document.getElementById('color').value;
  var likesColor = document.getElementById('like').checked;
  chrome.storage.sync.set({
    favoriteColor: color,
    likesColor: likesColor
  }, function() {
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    favoriteColor: 'red',
    likesColor: true
  }, function(items) {
    document.getElementById('color').value = items.favoriteColor;
    document.getElementById('like').checked = items.likesColor;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
