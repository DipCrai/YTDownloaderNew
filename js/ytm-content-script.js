const serverUrl = "http://localhost:3000/";
let playerDownloadButton, playerDownloadButtonImage;
let playerToggleButton, playerToggleButtonImage;
let rightControls, playerBar, playlistName;
let playlistDownloadButtonIcon;
let videoElement;
let audioCtx, audioSource, gainNode;

function videoLoaded() 
{
    playerBar = document.getElementsByTagName("ytmusic-player-bar")[0];
    rightControls = document.querySelector(".right-controls-buttons.style-scope.ytmusic-player-bar");

    if (playerBar == null)
    {
        return;
    }
    if (rightControls == null)
    {
        return;
    }

    createDownloadButton();
    createPlayerToggleButton();
    modifyVolumeSlider();
    createSpeedSlider();

    if (videoElement.volume < 1)
    {
        gainNode.gain.value = 1;
    }
}

function createDownloadButton() 
{
    playerDownloadButton = document.getElementById("custom-download-button");

    if (playerDownloadButton != null)
    {
        playerDownloadButton.remove();
        createDownloadButton();
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
    playerToggleButton = document.getElementById("player-toggle-button");

    if (playerToggleButton != null)
    {
        playerToggleButton.remove();
        createPlayerToggleButton();
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
    let mainPanel = document.getElementById("main-panel");
    let sidePanel = document.getElementById("side-panel");
    if (mainPanel)
    {
        if (mainPanel.style.display == "none")
        {
            mainPanel.style.display = "";
            mainPanel.parentElement.style.justifyContent = "";
            sidePanel.style.width = "";
            playerToggleButtonImage.src = chrome.runtime.getURL("images/disable-player-button-24.png");
            return;
        }
        mainPanel.style.display = "none";
        mainPanel.parentElement.style.justifyContent = "center";
        sidePanel.style.width = "100%";
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
    if (volumeToggle == null)
    {
        return;
    }

    let enableVolumeSlider = () => {
        volumeSlider.style.opacity = "1";
        volumeSlider.classList.add("on-hover");
    }

    playerBar.addEventListener("mouseover", enableVolumeSlider);
    volumeToggle.addEventListener("mouseover", enableVolumeSlider);

    enableVolumeSlider();
    volumeSlider.style.width = "200px";
    volumeSlider.setAttribute("max", 200);

    let sliderBar = volumeSlider.querySelector("#sliderBar");
    let volumeValue = document.createElement("p");

    volumeValue.textContent = sliderBar.ariaValueNow + "%";
    volumeSlider.appendChild(volumeValue);

    let changeVolume = () => {   
        let volumeValueNow = sliderBar.ariaValueNow;
        volumeValue.textContent = volumeValueNow + "%";

        if (volumeValueNow >= 100)
        {
            videoElement.volume = 1;
            gainNode.gain.value = volumeValueNow/100;
        }
        else
        {
            gainNode.gain.value = 1;
        }
    };

    volumeSlider.addEventListener("immediate-value-change", changeVolume);
    volumeSlider.addEventListener("value-change", changeVolume)
}

function createSpeedSlider() 
{
    let sliderContainer = document.getElementById("custom-speed-slider-container");
    if (sliderContainer != null)
    {
        sliderContainer.remove();
        createSpeedSlider();
        return;
    }

    let leftControls = document.getElementsByClassName('left-controls')[0];
    if (leftControls == null)
    {
        return;
    }

    sliderContainer = document.createElement('div');
    sliderContainer.id = "custom-speed-slider-container";
    sliderContainer.className = "custom-speed-slider-container";

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
    speedValue.textContent = "1x";

    sliderContainer.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
    });

    leftControls.appendChild(sliderContainer);
    sliderContainer.appendChild(speedSlider);
    sliderContainer.appendChild(speedValue);

    let sliderBar = speedSlider.querySelector("#sliderBar");
    let valueChangeHanle = () => {
        speedValue.textContent = sliderBar.ariaValueNow + "x";
        videoElement.playbackRate = sliderBar.ariaValueNow;
    };

    speedSlider.addEventListener("immediate-value-change", valueChangeHanle);
    speedSlider.addEventListener("value-change", valueChangeHanle);
}

function playlistLoaded() 
{
    playlistName = document.querySelector("ytmusic-responsive-header-renderer > h1", ".style-scope.ytmusic-responsive-header-renderer");
    if (playlistName == null)
    {
        return;
    }

    modifyPlaylistName();
    createPlaylistDownloadButton();
}

function createPlaylistDownloadButton() 
{
    let playlistDownloadButton = document.getElementById("playlist-download-button");

    if (playlistDownloadButton != null)
    {
        playlistDownloadButton.remove();
        createPlaylistDownloadButton();
        return;
    }

    playlistDownloadButton = document.createElement("button");
    playlistDownloadButton.id = "playlist-download-button";
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

function createAudioContext() 
{
    audioCtx = new AudioContext();
    audioSource = audioCtx.createMediaElementSource(videoElement);
    gainNode = audioCtx.createGain();

    audioSource.connect(gainNode);
    gainNode.connect(audioCtx.destination);
}

(() => 
{
    let waitForVideo = setInterval(()=>{
        videoElement = document.querySelector('video');
        if (videoElement != null)
        {
            createAudioContext();
            videoElement.addEventListener("loadstart", videoLoaded);
            videoLoaded();
            clearInterval(waitForVideo);
        }
    }, 200);

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action == "playlistLoaded") 
        {
            playlistLoaded();
        }
    });

    playlistLoaded();
}
)();