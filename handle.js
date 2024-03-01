chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

    if (message.action == "callExtensionFunction") {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            handleCopyClick(tabs[0].url)
        })
    }
    if (message.action == "callExtensionPaste"){}
        handlePasteClick()
});