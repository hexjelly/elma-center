/* jshint esversion: 6 */
window.onload = () => {
  /* TODO: put in some if (localizationEnabled) block in case people who use non-english browser still wants english extension? */
  translate('name', 'title', 'extName');
  translate('id', 'battleLink', 'battle');
  translate('id', 'battleType', 'normalBattle');
  translate('class', 'by', 'by');
};

function translate (type, name, message) {
  if (type === 'name') document.getElementsByTagName(name)[0].innerHTML = chrome.i18n.getMessage(message);
  else if (type === 'id') document.getElementById(name).innerHTML = chrome.i18n.getMessage(message);
  else if (type === 'class') {
    var elements = document.getElementsByClassName(name);
    console.log(elements.length);
    for (var i = 0; i < elements.length; i++) {
      elements[i].innerHTML = chrome.i18n.getMessage(message);
    }
  }
}

/*
chrome.browserAction.onClicked.addListener(function(tab) {

    var port = chrome.extension.connect({name: "Sample Communication"});
    port.postMessage("Hi BackGround");
    port.onMessage.addListener(function(msg) {
            console.log("message recieved"+ msg);
    });

}); */
