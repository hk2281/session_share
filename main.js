const OMNIBOX_KEYWORD = "session_paste";
const MENU_SESSION_COPY_ID = "MENU_SESSION_COPY";
const MENU_SESSION_PASTE_ID = "SESSION_PARSE";
const AES_KEY = "iLFB0yJSLsObtH6tNcfXMqo7L8qcEHqZ";
const MENU_TEXT_COPY = "Copy Session in This Page to Clipboard";
const MENU_TEXT_PASTE = "Parse Session from Clipboard in New Tab";

var backgroundPage = chrome.extension.getBackgroundPage();
backgroundPage.handleCopyClick = handleCopyClick;
backgroundPage.handlePasteClick = handlePasteClick;

// контекстное меню для копирования
chrome.contextMenus.create({
    id: MENU_SESSION_COPY_ID,
    title: MENU_TEXT_COPY,
});

// контекстное меню для вставки 
chrome.contextMenus.create({
    id: MENU_SESSION_PASTE_ID,
    title: MENU_TEXT_PASTE
});




var copyToClipboard = function(text) {
    // var backgroundPage = chrome.extension.getBackgroundPage();
    var clipboard = backgroundPage.document.getElementById("clipboard");
    clipboard.value = text;
    clipboard.select();
    backgroundPage.document.execCommand("Copy");
};


var pasteFromClipboard = function() {
    // var backgroundPage = chrome.extension.getBackgroundPage();
    var clipboard = backgroundPage.document.getElementById("clipboard");
    clipboard.value = text;
    clipboard.select();
    var text = '';
    if (document.execCommand('paste')) {
        text = clipboard.value;
    }
    clipboard.value = '';
    return text;
}


function handleCopyClick(pageUrl) {
    var cookie_data = getDomainCookies(pageUrl, function(cookies) {
        cookies = JSON.stringify(cookies);
        var encrypted = CryptoJS.AES.encrypt(cookies, AES_KEY);
        copyToClipboard(
            // 这里加入关键字
            OMNIBOX_KEYWORD + " " + encrypted
        );
    });
}


function handlePasteClick() {
    var text = pasteFromClipboard();
    if (text.indexOf(OMNIBOX_KEYWORD) !== 0) {
        return false;
    }
    solveSessionPaste(text.substr(OMNIBOX_KEYWORD.length + 1));
}


chrome.contextMenus.onClicked.addListener(function(info, tab) {
    switch (info.menuItemId) {
        case MENU_SESSION_COPY_ID:
            handleCopyClick(info.pageUrl);
            break;
        case MENU_SESSION_PASTE_ID:
            handlePasteClick();
            break;
        default:
    }
});


function solveSessionPaste(text) {
    try {
        var decrypted = CryptoJS.AES.decrypt(text, AES_KEY);
        text = decrypted.toString(CryptoJS.enc.Utf8);
        var data = JSON.parse(text);
        var url = loadCookies(data);
        chrome.tabs.update({
            url: url
        });
    } catch (err) {
        alert("Catch an error when paste session: " + err.toString());
    }
}


chrome.omnibox.onInputEntered.addListener(solveSessionPaste);


var updateOmniboxSuggestion = function(text) {
    var description = "Paste Session Here";
    if (text) {
        try {
            var cookie_data = JSON.parse(text);
            if (cookie_data && cookie_data.url) {
                description = "Paste Session <url>" + cookie_data.url + "</url>";
            }
        } catch (e) {
            console.warn('Session Share paste maybe catch an error~', e);
        }
    }
    chrome.omnibox.setDefaultSuggestion({
        description: description
    });
};
updateOmniboxSuggestion();

chrome.omnibox.onInputStarted.addListener(updateOmniboxSuggestion);
chrome.omnibox.onInputChanged.addListener(updateOmniboxSuggestion);
