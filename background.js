// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(tab => {

    const blockedPageUrl = tab.url;
    const queryStringIndex = blockedPageUrl.lastIndexOf("?");
    const isIrishTimesPage = new URL(blockedPageUrl).hostname.endsWith("irishtimes.com");

    if (isIrishTimesPage && queryStringIndex > -1) {
        const unblockedPageUrl = blockedPageUrl.substring(0, queryStringIndex);

        chrome.browsingData.remove({
                "origins": [
                    "https://www.irishtimes.com",
                    "http://www.irishtimes.com"
                ]
            },
            {"cookies": true},
            () => chrome.tabs.update(tab.id, {url: unblockedPageUrl})
        );
    }
});
