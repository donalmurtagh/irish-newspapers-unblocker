const isBlockedPage = () => {
    const {host} = document.location;

    if (host.endsWith("irishtimes.com")) {
        return document.querySelector('#intercept-modal .meter-modal');

    } else if (host.endsWith("independent.ie")) {
        return document.querySelector('.datawallProtected');

    } else {
        return false;
    }
};

if (isBlockedPage()) {
    // send a message to the background script in case we need to do something with the browser (e.g remove cookies)
    // that we can't do in this (content) script
    chrome.runtime.sendMessage({
        "blockedPageUrl": document.location.href
    });
}

const setDisplayProperty = (selector, displayValue) => {
    const element = document.querySelector(selector);
    if (element) {
        element.style.display = displayValue;
    }
};

// listen for messages sent by the background script
chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        if (request.blockedPageHostname.endsWith("independent.ie")) {

            setDisplayProperty(".datawallProtected", "block");
            setDisplayProperty(".w136", "none");
        }

        const unblockedNotice = document.createElement("div");
        unblockedNotice.innerHTML = `This page was unblocked by the 
            <a href='https://github.com/donalmurtagh/irish-newspapers-unblocker' target='_blank'><u>Irish Newspapers Unblocker</u></a> 
            Chrome extension <small>(click to close)</small>`;

        unblockedNotice.style.cssText = `
            color:              darkslategray; 
            position:           fixed; 
            bottom:             0px; 
            margin:             0; 
            background-color:   white; 
            padding:            5px 5px; 
            font-size:          15px;
            border:             1px solid darkslategray;
            cursor:             pointer`;

        unblockedNotice.addEventListener("click", (event) => {
            document.body.removeChild(unblockedNotice);
        });

        document.body.appendChild(unblockedNotice);
    }
);
