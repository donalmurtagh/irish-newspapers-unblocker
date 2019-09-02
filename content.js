// if the page contains the modal dialog that indicates the article
// quota has been reached, send a message to the background script
if (document.querySelector('#intercept-modal .meter-modal')) {

    chrome.runtime.sendMessage({
        "blockedPageUrl": document.location.href
    });
}