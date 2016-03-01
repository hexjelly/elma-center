/* jshint esversion: 6 */

window.onload = () => {
  var els = document.querySelectorAll('nav > div');
  for (var i = 0; i < els.length; i++) {
    els[i].addEventListener('click', tabs, false);
  }

  loadBattleInfo();
};

function tabs () {
  var actives = document.querySelectorAll('.activeTab');
  for (var i = 0; i < actives.length; i++){
    actives[i].className = '';
  }
  this.className = 'activeTab';
  document.getElementById(event.target.getAttribute('data-link')).className = 'activeTab';
}

function translate (type, name, message) {
  switch (type) {
    case 'name':
      document.getElementsByTagName(name)[0].innerHTML = chrome.i18n.getMessage(message);
      break;
    case 'id':
      document.getElementById(name).innerHTML = chrome.i18n.getMessage(message);
      break;
    case 'class':
      var elements = document.getElementsByClassName(name);
      for (var i = 0; i < elements.length; i++) {
        elements[i].innerHTML = chrome.i18n.getMessage(message);
      }
      break;
  }
}

// load battle info from storage and display it
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
