const unblockPage = tab => {
    const blockedPageUrl = tab.url;
    const {hostname} = new URL(blockedPageUrl);

    if (hostname.endsWith("irishtimes.com")) {
        // Remove any query string params from the URL before reloading it
        const queryStringIndex = blockedPageUrl.lastIndexOf("?");
        const unblockedPageUrl = queryStringIndex > -1 ? blockedPageUrl.substring(0, queryStringIndex) : blockedPageUrl;

        chrome.browsingData.remove({
                origins: [
                    "https://www.irishtimes.com",
                    "http://www.irishtimes.com"
                ]
            },
            {cookies: true},
            () => chrome.tabs.update(tab.id, {url: unblockedPageUrl})
        );
    }

    // We can't modify page content in this (background) script so we need to send a message to the content script
    // to do it instead
    chrome.tabs.sendMessage(tab.id, {"blockedPageHostname": hostname});
};


// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(tab => unblockPage(tab));

// listen for messages sent by the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

        /*
        Instead of looking up the Irish Times tab by URL, we could assume the currently active tab
        is the one that contains the blocked article

        chrome.tabs.query({'active': true, 'lastFocusedWindow': true})
         */
        chrome.tabs.query({url: request.blockedPageUrl},
            tabs => tabs.forEach(tab => unblockPage(tab)));
    }
);