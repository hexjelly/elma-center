
// battle notifier functions
function setTimeIndicator (time) {
  if (time === false) {
    chrome.browserAction.setBadgeText(null);
  }
  chrome.browserAction.setBadgeBackgroundColor({color:[106, 161, 33, 255]});
  chrome.browserAction.setBadgeText({text: "\u00A0"});
}


// misc functions
function startBackground () {
  setTimeIndicator(10);
}

function stopBackground () {
  setTimeIndicator(false);
}

// start background processing
startBackground();
