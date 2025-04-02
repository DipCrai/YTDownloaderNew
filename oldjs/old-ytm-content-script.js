(() => {
    let downloadButton;
    let playerButton;
    let downloadButtonDiv;
    let playerButtonDiv;
    let valueInterval;

    const newVideoLoaded = () => {

        const downloadButtonExist = document.getElementsByClassName("download-btn")[0];
        const playerButtonExist = document.getElementsByClassName("player-toggle-btn")[0];
        const volumeValueExist = document.getElementsByClassName("ytdl-volume-value")[0];
        const rightControls = document.querySelector(".right-controls-buttons.style-scope.ytmusic-player-bar");
        const volumeSlider = document.querySelector("tp-yt-paper-slider", "#volume-slider");

        const createDownloadButton = () => {
            if (!downloadButtonExist && rightControls) {
                downloadButtonDiv = document.createElement("div");
                downloadButtonDiv.className = "download-btn-div";
                downloadButton = document.createElement("img");
                downloadButton.src = chrome.runtime.getURL("images/disabled-download-button-24.png");
                downloadButton.className = "download-btn";
                downloadButton.title = "Download";
                downloadButtonDiv.appendChild(downloadButton);
                rightControls.appendChild(downloadButtonDiv);
                downloadButton.classList.add('disabled');
            }
        }

        const createPlayerToggleButton = () => {
            if (!playerButtonExist && rightControls) {
                playerButtonDiv = document.createElement("div");
                playerButtonDiv.className = "player-toggle-btn-div";
                playerButton = document.createElement("img");
                playerButton.src = chrome.runtime.getURL("images/disable-player-button-24.png");
                playerButton.className = "player-toggle-btn";
                playerButton.title = "Toggle player";
                playerButton.addEventListener("click", togglePlayer);
    
                playerButtonDiv.appendChild(playerButton);
                rightControls.appendChild(playerButtonDiv);
            }
        }

        const modifyVolumeSlider = () => {
            if (!volumeValueExist && volumeSlider)
            {
                if (valueInterval)
                {
                    clearInterval(valueInterval);
                }
                const volumeValue = document.createElement("p");
                volumeValue.innerHTML = volumeSlider.getAttribute("aria-valuenow") + "%";
                volumeSlider.appendChild(volumeValue);
                volumeSlider.style.width = "200px";
        
                const playerBar = document.querySelector("ytmusic-player-bar", ".style-scope.ytmusic-app");
                if (playerBar) {
                    playerBar.addEventListener("mouseover", () => {
                        volumeSlider.style.opacity = "1";
                        volumeSlider.classList.add("on-hover");
                    });
                }
        
                valueInterval = setInterval(() => {
                    volumeValue.innerHTML = volumeSlider.getAttribute("aria-valuenow") + "%";
                    volumeSlider.classList.add("on-hover");
                }, 200);            
            }
        }

        const createSpeedSlider = () => {
            if (!document.getElementById('custom-speed-slider')) {
                const leftControls = document.querySelector('.left-controls');
                if (!leftControls) {
                    console.error('Cannot find left-controls.');
                    return;
                }
            
                const sliderContainer = document.createElement('div');
                sliderContainer.id = 'custom-speed-slider-container';
                sliderContainer.className = 'custom-speed-slider-container';
            
                const slider = document.createElement('tp-yt-paper-slider');
                slider.id = 'custom-speed-slider';
                slider.className = 'custom-speed-slider style-scope ytmusic-player-bar';
                slider.setAttribute('min', '0.5');
                slider.setAttribute('max', '2.0');
                slider.setAttribute('step', '0.05');
                slider.setAttribute('value', '1.0');
                slider.setAttribute('aria-label', 'Song speed');
            
                const speedValue = document.createElement("p");
                speedValue.innerHTML = slider.value + "x";
    
                sliderContainer.appendChild(speedValue);
                sliderContainer.appendChild(slider);
                leftControls.appendChild(sliderContainer);
    
                let video = document.querySelector('video');
                slider.addEventListener('immediate-value-change', function(event) 
                {
                    console.log(event.target.immediateValue);
                });

                sliderContainer.addEventListener("click", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                });
    
                sliderContainer.addEventListener('wheel', (event) => {
                    event.preventDefault();
                    const step = parseFloat(slider.getAttribute('step'));
                    let currentValue = parseFloat(slider.value || slider.getAttribute('value'));
                    const min = parseFloat(slider.getAttribute('min'));
                    const max = parseFloat(slider.getAttribute('max'));
            
                    if (event.deltaY < 0) {
                        currentValue = Math.min(currentValue + step, max);
                    } else {
                        currentValue = Math.max(currentValue - step, min);
                    }
            
                    slider.value = currentValue.toFixed(2);
                    slider.setAttribute('value', currentValue.toFixed(2));
                    try
                    {
                        video.playbackRate = currentValue;
                    }
                    catch { }
                    speedValue.innerHTML = currentValue.toFixed(2) + "x";
                });
            }
        }

        createDownloadButton();
        updateButtonState();

        createPlayerToggleButton();

        modifyVolumeSlider();

        createSpeedSlider();
    };

    const downloadEventHandler = async () => {

        downloadButton.src = chrome.runtime.getURL("images/updating-download-button-24.png");

        await updateButtonState();

        if (downloadButton.classList.contains('disabled'))
        {
            return;
        }

        downloadButton.src = chrome.runtime.getURL("images/updating-download-button-24.png");

        const url = window.location.href.split('&')[0];
        let videoTitle;

        const videoTitleElement = document.getElementsByClassName("title style-scope ytmusic-player-bar")[0];
        if (videoTitleElement) {
            videoTitle = videoTitleElement.textContent.trim();
        }
        else {
            videoTitle = "music";
        }
        const serverUrl = "http://localhost:3000/video?url=" + encodeURIComponent(url) + "&filename=" + encodeURIComponent(videoTitle);
        try {
            const response = await fetch(serverUrl);
    
            const data = await response.json();
            console.log("Ответ от сервера:", data);

            downloadButton.src = chrome.runtime.getURL("images/download-successful-24.png");
        } catch (error) {
            await updateButtonState();
            downloadButton.src = chrome.runtime.getURL("images/download-error-24.png");
            console.log("Ошибка при запросе к серверу:", error);
        }
    };

    const updateButtonState = async() => {
        const url = window.location.href;
        const regexVideo = /https:\/\/music\.youtube\.com\/watch\?v=/i;
        const serverUrl = "http://localhost:3000/";

        const disableButton = () => {
            downloadButton.classList.add('disabled');
            downloadButton.removeEventListener("click", downloadEventHandler);
            downloadButton.src = chrome.runtime.getURL("images/disabled-download-button-24.png");
        }
        const enableButton = () => {
            downloadButton.classList.remove('disabled');
            downloadButton.addEventListener("click", downloadEventHandler);
            downloadButton.src = chrome.runtime.getURL("images/grey-download-button-24.png");
        }

        await fetch(serverUrl, { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    if (url.match(regexVideo)) {
                        enableButton();
                    } 
                    else {
                        disableButton();
                    }
                }
                else {
                    disableButton();
                    downloadButton.src = chrome.runtime.getURL("images/server-error-24.png");
                }
            })
            .catch(error => {
                disableButton();
                downloadButton.src = chrome.runtime.getURL("images/server-error-24.png");
            });
    };

    const togglePlayer = () => {
        const player = document.querySelector("#player", ".style-scope.ytmusic-player-page");

        if (player)
        {
            if (player.style.display === "") {
                player.style.display = "none";
                playerButton.src = chrome.runtime.getURL("images/enable-player-button-24.png");
            }
            else if (player.style.display === "none"){
                player.style.display = "";
                playerButton.src = chrome.runtime.getURL("images/disable-player-button-24.png");
            }
        }
    };

    const playlistLoaded = () => {
        if (window.location.href.includes("music.youtube.com/playlist"))
        {
            createPlaylistDownloadButton();
        }
    };

    const createPlaylistDownloadButton = () => {
        const downloadButtonExist = document.getElementsByClassName("pl-dl-btn")[0];
        const playlistName = document.querySelector("ytmusic-responsive-header-renderer > h1", ".style-scope.ytmusic-responsive-header-renderer");

        if (!downloadButtonExist && playlistName) {
            playlistName.style.display = "inline-flex";
            playlistName.style.justifyContent = "center";
            playlistName.style.width = "100%";

            const plDlBtnDiv = document.createElement("div");
            plDlBtnDiv.className = "pl-dl-btn-div";

            const plDlBtn = document.createElement("img");
            plDlBtn.className = "pl-dl-btn";
            plDlBtn.src = chrome.runtime.getURL("images/white-download-button-24.png");
            plDlBtn.title = "Download playlist";
            plDlBtn.style.verticalAlign = "middle";
            plDlBtn.style.cursor = "pointer";
            plDlBtn.addEventListener("click", downloadPlaylistHandler);

            plDlBtnDiv.appendChild(plDlBtn);
            playlistName.appendChild(plDlBtnDiv);
        }
    }

    const downloadPlaylistHandler = async () => {
        const url = window.location.href;
        const serverUrl = "http://localhost:3000/playlist?url=" + encodeURIComponent(url);
        try {
            const response = await fetch(serverUrl);
    
            const data = await response.json();
            console.log("Ответ от сервера:", data);
        } catch (error) {
            console.log("Ошибка при запросе к серверу:", error);
        }
    };
    
    onUrlChange = () => {
        updateButtonState();
        playlistLoaded();
    }
    
    let lastUrl = window.location.href;
    setInterval(() => {
        const currentUrl = window.location.href;
        if (currentUrl !== lastUrl) {
            onUrlChange();
            lastUrl = currentUrl;
        }
    }, 100);

    newVideoLoaded();
    playlistLoaded();
})();
