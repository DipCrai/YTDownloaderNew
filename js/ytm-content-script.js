const serverUrl = "http://localhost:3000/";
let playerDownloadButton, playerDownloadButtonImage;
let playerToggleButton, playerToggleButtonImage;
let rightControls, playerBar, playlistName;
let playlistDownloadButtonIcon;

function newVideoLoaded() 
{
    playerBar = document.getElementsByTagName("ytmusic-player-bar")[0];
    rightControls = document.querySelector(".right-controls-buttons.style-scope.ytmusic-player-bar");
    createDownloadButton();
    createPlayerToggleButton();
    modifyVolumeSlider();
    createSpeedSlider();
}

function createDownloadButton() 
{
    if (document.getElementById("custom-download-button") != null)
    {
        return;
    }

    playerDownloadButton = document.createElement("custom-button");
    playerDownloadButton.id = "custom-download-button";
    playerDownloadButton.title = "Download";
    playerDownloadButton.addEventListener("click", downloadTrackEventHandler);

    playerDownloadButtonImage = document.createElement("img");
    playerDownloadButtonImage.src = chrome.runtime.getURL("images/grey-download-button-24.png");

    playerDownloadButton.appendChild(playerDownloadButtonImage);
    rightControls.appendChild(playerDownloadButton);
}

function createPlayerToggleButton() {
    if (document.getElementById("player-toggle-button") != null)
    {
        return;
    }

    playerToggleButton = document.createElement("custom-button");
    playerToggleButton.id = "player-toggle-button";
    playerToggleButton.title = "Toggle player";
    playerToggleButton.addEventListener("click", togglePlayer);

    playerToggleButtonImage = document.createElement("img");
    playerToggleButtonImage.src = chrome.runtime.getURL("images/disable-player-button-24.png");

    playerToggleButton.appendChild(playerToggleButtonImage);
    rightControls.appendChild(playerToggleButton);
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

function togglePlayer() 
{
    let player = document.querySelector("#player", ".style-scope.ytmusic-player-page");
    if (player)
    {
        if (player.style.display == "none")
        {
            player.style.display = "";
            playerToggleButtonImage.src = chrome.runtime.getURL("images/disable-player-button-24.png");
            return;
        }
        player.style.display = "none";
        playerToggleButtonImage.src = chrome.runtime.getURL("images/enable-player-button-24.png");
    }
}

async function downloadTrackEventHandler() 
{
    let url = window.location.href.split('&')[0];
    let videoTitle = document.getElementsByClassName("title style-scope ytmusic-player-bar")[0].textContent.trim() || "music";
    let isVideo = url.includes("/watch?v=");

    if (!isVideo)
    {
        playerBar.click();
        url = window.location.href.split('&')[0];
    }
    
    playerDownloadButtonImage.src = chrome.runtime.getURL("images/updating-download-button-24.png");

    let serverResponse = await pingServer();

    if (!serverResponse) 
    {
        playerDownloadButtonImage.src = chrome.runtime.getURL("images/server-error-24.png");
        return;
    }

    try 
    {
        let fetchUrl = serverUrl + "video?url=" + encodeURIComponent(url) +
            "&filename=" + encodeURIComponent(videoTitle);

        await fetch(fetchUrl);

        playerDownloadButtonImage.src = chrome.runtime.getURL("images/download-successful-24.png");
    }
    catch 
    {
        playerDownloadButtonImage.src = chrome.runtime.getURL("images/download-error-24.png");
    }
}

function modifyVolumeSlider() 
{
    let volumeSlider = document.querySelector("tp-yt-paper-slider", "#volume-slider");
    let volumeToggle = document.getElementsByClassName("volume style-scope ytmusic-player-bar")[0];

    if (volumeSlider == null)
    {
        return;
    }
    if (playerBar == null)
    {
        return;
    }

    let enableVolumeSlider = () => {
        volumeSlider.style.opacity = "1";
        volumeSlider.classList.add("on-hover");
    }

    playerBar.addEventListener("mouseover", () => {
        enableVolumeSlider();
    });
    volumeToggle.addEventListener("mouseover", () => {
        enableVolumeSlider();
    });

    enableVolumeSlider();
    volumeSlider.style.width = "200px";

    let volumeValue = document.createElement("p");
    volumeValue.innerHTML = volumeSlider.getAttribute("aria-valuenow") + "%";
    volumeSlider.appendChild(volumeValue);

    volumeSlider.addEventListener("immediate-value-change", () => {
        volumeValue.innerHTML = volumeSlider.getAttribute("aria-valuenow") + "%";
    });
    volumeSlider.addEventListener("value-change", () => {
        volumeValue.innerHTML = volumeSlider.getAttribute("aria-valuenow") + "%";
    })
}

function createSpeedSlider() 
{
    if (document.getElementById("custom-speed-slider") != null)
    {
        return;
    }

    let leftControls = document.getElementsByClassName('left-controls')[0];
    if (leftControls == null)
    {
        return;
    }

    let sliderContainer = document.createElement('div');
    sliderContainer.id = 'custom-speed-slider-container';
    sliderContainer.className = 'custom-speed-slider-container';

    let speedSlider = document.createElement("tp-yt-paper-slider");
    speedSlider.id = "custom-speed-slider";
    speedSlider.className = "custom-speed-slider style-scope ytmusic-player-bar";
    speedSlider.setAttribute("min", "0.5");
    speedSlider.setAttribute("max", "2.0");
    speedSlider.setAttribute("step", "0.05");
    speedSlider.setAttribute("value", "1.0");
    speedSlider.setAttribute("role", "slider");
    speedSlider.title = "Speed";

    let speedValue = document.createElement("p");
    speedValue.innerHTML = "1x";

    speedSlider.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
    });

    leftControls.appendChild(sliderContainer);
    sliderContainer.appendChild(speedSlider);
    sliderContainer.appendChild(speedValue);

    let sliderBar = speedSlider.querySelector("#sliderBar");
    let valueChangeHanle = () => {
        speedValue.innerHTML = sliderBar.ariaValueNow + "x";

        let video = document.querySelector('video');
        if (video != null)
        {
            video.playbackRate = sliderBar.ariaValueNow;
        }
    };

    speedSlider.addEventListener("immediate-value-change", () => {
        valueChangeHanle();
    });
    speedSlider.addEventListener("value-change", () => {
        valueChangeHanle();
    });
}

function playlistLoaded() 
{
    const waitForName = setInterval(() => {
        playlistName = document.querySelector("ytmusic-responsive-header-renderer > h1", ".style-scope.ytmusic-responsive-header-renderer");
        if(playlistName != null) {
            clearInterval(waitForName);
            modifyPlaylistName();
            createPlaylistDownloadButton();
        }
    }, 500);
}

function createPlaylistDownloadButton() 
{
    if (document.getElementById("playlist-download-button") != null)
    {
        return;
    }
    if (playlistName == null)
    {
        return;
    }

    let playlistDownloadButton = document.createElement("button");
    playlistDownloadButton.className = "playlist-download-button";
    playlistDownloadButton.title = "Download";
    playlistDownloadButton.addEventListener("click", playlistDownloadEventHandler);

    playlistDownloadButtonIcon = document.createElement("img");
    playlistDownloadButtonIcon.className = "playlist-download-button-icon";
    playlistDownloadButtonIcon.src = chrome.runtime.getURL("images/white-download-button-24.png");
    
    playlistName.appendChild(playlistDownloadButton);
    playlistDownloadButton.appendChild(playlistDownloadButtonIcon);
}

function modifyPlaylistName() 
{
    if (playlistName == null)
    {
        return;
    }

    playlistName.style.display = "inline-flex";
    playlistName.style.justifyContent = "center";
    playlistName.style.width = "100%";
    playlistName.style.marginRight = "8px";
}

async function playlistDownloadEventHandler() {
    let url = window.location.href.split('&')[0];

    playlistDownloadButtonIcon.src = chrome.runtime.getURL("images/updating-download-button-24.png");

    let serverResponse = await pingServer();

    if (!serverResponse) 
    {
        playlistDownloadButtonIcon.src = chrome.runtime.getURL("images/server-error-24.png");
        return;
    }

    try 
    {
        let fetchUrl = serverUrl + "playlist?url=" + encodeURIComponent(url);

        await fetch(fetchUrl);

        playlistDownloadButtonIcon.src = chrome.runtime.getURL("images/download-successful-24.png");
    }
    catch 
    {
        playlistDownloadButtonIcon.src = chrome.runtime.getURL("images/download-error-24.png");
    }
}

(() => 
{ 
    newVideoLoaded(); 
    playlistLoaded();

    navigation.addEventListener('navigate', () => {
        if (window.location.href.includes("music.youtube.com/playlist"))
        {
            playlistLoaded();
        }
    });
})();