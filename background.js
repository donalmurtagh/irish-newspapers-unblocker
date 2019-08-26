// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function (tab) {

    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {

        const blockedPageUrl = tab.url;
        const queryStringIndex = blockedPageUrl.lastIndexOf("?");
        const isIrishTimesPage = new URL(blockedPageUrl).hostname.endsWith("irishtimes.com");

        if (isIrishTimesPage && queryStringIndex > -1) {
            const unblockedPageUrl = blockedPageUrl.substring(0, queryStringIndex);
            chrome.windows.create({url: unblockedPageUrl, incognito: true});
        }
    });
});