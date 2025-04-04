chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url && changeInfo.url.includes("music.youtube.com/playlist")) {
        chrome.tabs.sendMessage(tabId, { action: "playlistLoaded" });
    }
});