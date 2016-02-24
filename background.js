
function setTimeIndicator (time) {
  chrome.browserAction.setBadgeBackgroundColor({color:[106, 161, 33, 255]});
  chrome.browserAction.setBadgeText({text: "\u00A0"});
}

setTimeIndicator();

// •
