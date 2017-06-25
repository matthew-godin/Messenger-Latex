var FSEND = "https://www.facebook.com/messaging/send/*"
var FRECEIVE = "https://www.facebook.com/ajax/mercury/mark_seen.php*"
var FSWITCH = "https://www.facebook.com/ajax/bz"
var FSCROLL = "https://www.facebook.com/api/graphqlbatch/"
var MSEND = "https://www.messenger.com/messaging/send/*"
var MRECEIVE = "https://www.messenger.com/ajax/mercury/delivery_receipts.php*"
var MSWITCH = "https://www.messenger.com/ajax/bz"
var MSCROLL = "https://www.messenger.com/api/graphqlbatch/"
var FTAB = "https://www.facebook.com/ajax/mercury/tabs_presence.php*"

URLS = [
    FSEND,
    FRECEIVE,
    FSWITCH,
    FSCROLL,
    MSEND,
    MRECEIVE,
    MSWITCH,
    MSCROLL,
    FTAB,
];

function checkURL(url) {
    for (var i = 0; i < URLS.length; i++) {
        if (url.includes(URLS[i].replace("*", "")) || url == URLS[i]) {
            return URLS[i];
        };
    };
};

// Request a refresh when the page changes
chrome.webRequest.onCompleted.addListener(function(details) {
    console.log("onComplete")
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        url = checkURL(details.url)
        switch (url) {
            case FSEND:
            case MSEND:
                chrome.tabs.sendMessage(tabs[0].id, "sent");
                break;
            case FRECEIVE:
            case MRECEIVE:
                chrome.tabs.sendMessage(tabs[0].id, "received");
                break;
            case FSWITCH:
            case MSWITCH:
                chrome.tabs.sendMessage(tabs[0].id, "switched");
                break;
            case FSCROLL:
            case MSCROLL:
                chrome.tabs.sendMessage(tabs[0].id, "scrolled");
                break;
        }
          chrome.tabs.sendMessage(tabs[0].id, "refresh");
    });
}, {urls: URLS}
);
