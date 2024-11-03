(() => {
    let downloadButton;
    let buttonDiv;
    console.log("INIIITTT");

    const newVideoLoaded = () => {
        const downloadButtonExist = document.getElementsByClassName("download-btn")[0];

        if (!downloadButtonExist) {
            buttonDiv = document.createElement("div");
            buttonDiv.className = "download-btn-div";
            downloadButton = document.createElement("img");
            downloadButton.src = chrome.runtime.getURL("images/grey-download-button-24.png");
            downloadButton.className = "download-btn";
            downloadButton.title = "Download";
            downloadButton.addEventListener("click", downloadEventHandler);

            const rightControls = document.querySelector(".right-controls-buttons.style-scope.ytmusic-player-bar");
            buttonDiv.appendChild(downloadButton)
            rightControls.appendChild(buttonDiv);
            let currentUrl = location.href;

            setInterval(() => {
                    updateButtonState();
            }, 500);
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
        const serverUrl = "http://localhost:3000/download?url=" + encodeURIComponent(url) + "&filename=" + videoTitle;
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
            downloadButton.src = chrome.runtime.getURL("images/disabled-download-button-24.png"); // Убедитесь, что у вас есть изображение для отключенной кнопки
        }
    };
    const monitorUrlChanges = () => {
        const pushState = history.pushState;
        history.pushState = function(state) {
            pushState.apply(history, arguments);
            updateButtonState();
        };

        window.addEventListener('popstate', updateButtonState);
    };
    newVideoLoaded();
})();