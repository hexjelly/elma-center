/* jshint esversion: 6 */
window.onload = () => {
  translate('name', 'title', 'extName');
};

function translate (type, name, message) {
  if (type === 'name') document.getElementsByTagName(name)[0].innerHTML = chrome.i18n.getMessage(message);
  else if (type === 'id') document.getElementById(name).innerHTML = chrome.i18n.getMessage(message);
}

/*
chrome.browserAction.onClicked.addListener(function(tab) {

    var port = chrome.extension.connect({name: "Sample Communication"});
    port.postMessage("Hi BackGround");
    port.onMessage.addListener(function(msg) {
            console.log("message recieved"+ msg);
    });

}); */
