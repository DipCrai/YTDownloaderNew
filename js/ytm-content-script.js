(() => {
    let downloadButton;
    let playerButton;
    let downloadButtonDiv;
    let playerButtonDiv;

    const newVideoLoaded = () => {
        const downloadButtonExist = document.getElementsByClassName("download-btn")[0];
        const playerButtonExist = document.getElementsByClassName("player-toggle-btn")[0];
        const rightControls = document.querySelector(".right-controls-buttons.style-scope.ytmusic-player-bar");

        if (!downloadButtonExist) {
            downloadButtonDiv = document.createElement("div");
            downloadButtonDiv.className = "download-btn-div";
            downloadButton = document.createElement("img");
            downloadButton.src = chrome.runtime.getURL("images/grey-download-button-24.png");
            downloadButton.className = "download-btn";
            downloadButton.title = "Download";
            downloadButton.addEventListener("click", downloadEventHandler);

            downloadButtonDiv.appendChild(downloadButton)
            rightControls.appendChild(downloadButtonDiv);
            let currentUrl = location.href;

            setInterval(() => {
                    updateButtonState();
            }, 500);
        }
        if (!playerButtonExist) {
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
    };

    const downloadEventHandler = async () => {
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
        } catch (error) {
            console.warn("Ошибка при запросе к серверу:", error);
        }
    };

    const updateButtonState = () => {
        const url = window.location.href;
        const regexVideo = /https:\/\/music\.youtube\.com\/watch\?v=/i;

        if (url.match(regexVideo)) {
            downloadButton.classList.remove('disabled');
            downloadButton.addEventListener("click", downloadEventHandler);
            downloadButton.src = chrome.runtime.getURL("images/grey-download-button-24.png");
        } 
        else {
            downloadButton.classList.add('disabled');
            downloadButton.removeEventListener("click", downloadEventHandler);
            downloadButton.src = chrome.runtime.getURL("images/disabled-download-button-24.png");
        }
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
    }
    const playlistLoaded = () => {
        const playlistName = document.querySelector("ytmusic-responsive-header-renderer > h2", ".style-scope.ytmusic-responsive-header-renderer");
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
        plDlBtn.addEventListener("click", downloadPlaylistHandler);

        plDlBtnDiv.appendChild(plDlBtn);
        playlistName.appendChild(plDlBtnDiv);
    }
    const downloadPlaylistHandler = async () => {
        const url = window.location.href;
        const serverUrl = "http://localhost:3000/playlist?url=" + encodeURIComponent(url);
        try {
            const response = await fetch(serverUrl);
    
            const data = await response.json();
            console.log("Ответ от сервера:", data);
        } catch (error) {
            console.warn("Ошибка при запросе к серверу:", error);
        }
    }
    newVideoLoaded();
    playlistLoaded();
})();