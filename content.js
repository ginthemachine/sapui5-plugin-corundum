const s = document.createElement('script');
s.src = chrome.runtime.getURL('my-script.js');
s.onload = function () { this.remove(); };
// see also "Dynamic values in the injected code" section in this answer
(document.head || document.documentElement).appendChild(s);

let PLUGIN_STATE = "stop_plugin";

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    PLUGIN_STATE = request.action;
    if (request.action === 'start_plugin') {
        console.log('received start plugin...', PLUGIN_STATE);
        sendResponse({ message: 'Website converted to black and white.' });
    } else if (request.action === 'stop_plugin') {
        console.log('received stop plugin...', PLUGIN_STATE);
        sendResponse({ message: 'Website reset to original colors.' });
    }
});