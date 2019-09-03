const unblockPage = tab => {
    const blockedPageUrl = tab.url;
    const queryStringIndex = blockedPageUrl.lastIndexOf("?");
    const isIrishTimesPage = new URL(blockedPageUrl).hostname.endsWith("irishtimes.com");

    if (isIrishTimesPage && queryStringIndex > -1) {
        const unblockedPageUrl = blockedPageUrl.substring(0, queryStringIndex);

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
};


// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(tab => unblockPage(tab));

// this message is sent by the content script
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