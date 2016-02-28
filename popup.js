/* jshint esversion: 6 */
window.onload = () => {
  /* TODO: put in some if (localizationEnabled) block in case people who use non-english browser still wants english extension? */
  translate('name', 'title', 'extName');
  translate('id', 'battleLink', 'battle');
  translate('class', 'by', 'by');
  loadBattleInfo();
};

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
  chrome.storage.sync.get("battle", result => {
    if (result.battle.id) { // there's a battle active
      var file = result.battle.file_name;
      var designer = result.battle.designer;
      var html;

      html = '<a href="" id="levelFile">' + file + '</a> by <span id="designer">' + designer + '</span>';
      document.getElementById('levelInfo').innerHTML = html;

      html = '<span class="icon">&#xf017;</span> <span id="timeLeft"></span> / <span id="battleTime"></span>';
      document.getElementById('timer').innerHTML = html;

    } else { // no battle
      document.getElementById('levelInfo').innerHTML = "No battle active";
      document.getElementById('timer').innerHTML = '';
    }
  });
}
