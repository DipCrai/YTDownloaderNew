const serverUrl = "http://localhost:3000";
let buttonContainer, downloadButton, icon

function newVideoLoaded() {
    if (document.getElementById("custom-download-button") != null)
    {
        return;
    }

    buttonContainer = document.createElement("yt-button-shape");
    buttonContainer.id = "custom-download-button";
    buttonContainer.className = "custom-download-button-container";

    downloadButton = document.createElement("button");
    downloadButton.className = "custom-download-button";
    downloadButton.title = "Download";
    downloadButton.addEventListener("click", downloadEventHandler);

    icon = document.createElement("img");
    icon.className = "custom-download-button-icon";
    icon.src = chrome.runtime.getURL("images/white-download-button-24.png");

    const waitForRenderer = setInterval(() => {
        youtubeMenuRenderer = document.querySelector('div ytd-menu-renderer.style-scope.ytd-watch-metadata[menu-active][has-items]');
        if(youtubeMenuRenderer != null) {
            clearInterval(waitForRenderer);
            youtubeMenuRenderer.appendChild(buttonContainer);
            buttonContainer.appendChild(downloadButton);
            downloadButton.appendChild(icon);
        }
    }, 500);
}
async function downloadEventHandler() {
    icon.src = chrome.runtime.getURL("images/updating-download-button-24.png");

    let response = await pingServer();

    if (!response)
    {
        icon.src = chrome.runtime.getURL("images/server-error-24.png");
        return;
    }

    try {
        let url = window.location.href.split('&')[0];
        let youtubePlayer = document.getElementsByClassName("video-stream")[0];
    
        let fetchUrl = serverUrl + "/video?url=" + 
            encodeURIComponent(url) + 
            "&quality=" + encodeURIComponent(youtubePlayer.videoHeight);

        await fetch(fetchUrl);
        icon.src = chrome.runtime.getURL("images/download-successful-24.png");
    }
    catch {
        icon.src = chrome.runtime.getURL("images/download-error-24.png");
    }
}

async function pingServer() 
{
    let serverResponse;

    try
    {
        await fetch(serverUrl);
        serverResponse = true;
    }
    catch
    {
        serverResponse = false;
    }

    return serverResponse;
}

(() => { newVideoLoaded(); })();