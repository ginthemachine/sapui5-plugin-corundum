const PLUGIN_PREFIX = 'what-the-sap';

function injectScripTag() {
    const scriptTag = document.createElement('script');
    scriptTag.src = chrome.runtime.getURL(`${PLUGIN_PREFIX}.js`);
    scriptTag.onload = function () { this.remove(); };
    // see also "Dynamic values in the injected code" section in this answer
    (document.head || document.documentElement).appendChild(scriptTag);
}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.action === 'start_plugin') {
        injectScripTag();

        sendResponse({ message: 'starting plugin' });
    } else if (request.action === 'stop_plugin') {
        if (!confirm("Are you sure you want disable the plugin?\nThis will refresh the page.")) {
            sendResponse({ message: 'resuming plugin', state: "ON" });
            return;
        }

        sendResponse({ message: 'stopping plugin', state: "OFF" });
        window.location.reload();
    }
});