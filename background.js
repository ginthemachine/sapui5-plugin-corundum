chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
        text: 'OFF',
    });
});

// When the user clicks on the extension action
chrome.action.onClicked.addListener(async (tab) => {
    // We retrieve the action badge to check if the extension is 'ON' or 'OFF'
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    // Next state will always be the opposite
    const nextState = prevState === 'ON' ? 'OFF' : 'ON';

    // Set the action badge to the next state
    await chrome.action.setBadgeText({
        tabId: tab.id,
        text: nextState,
    });

    if (nextState === 'ON') {
        console.log('starting plugin...');
        chrome.tabs.sendMessage(
            tab.id,
            { action: 'start_plugin' },
            function (response) {
                console.log(response);
            }
        );
    } else if (nextState === 'OFF') {
        console.log('stopping plugin...');
        chrome.tabs.sendMessage(
            tab.id,
            { action: 'stop_plugin' },
            function (response) {
                console.log(response);
            }
        );
    }
});
