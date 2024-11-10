(() => {
    let youtubeMenuRenderer, youtubePlayer, buttonDiv;;
    let currentVideo = "";

    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type } = obj;
        if (type === "VIDEOLOADED") {
            newVideoLoaded();
        }
    })

    const newVideoLoaded = () => {
        const downloadButtonExist = document.getElementsByClassName("download-btn")[0];

        if(!downloadButtonExist)
        {
            buttonDiv = document.createElement("div");
            buttonDiv.className = "download-btn-div";
            const downloadButton = document.createElement("img");
            downloadButton.src = chrome.runtime.getURL("images/white-download-button-24.png");
            downloadButton.className = "download-btn";
            downloadButton.title = "Download";

            const waitForRenderer = setInterval(() => {
                youtubeMenuRenderer = document.querySelector('div ytd-menu-renderer.style-scope.ytd-watch-metadata[menu-active][has-items]');
                if(youtubeMenuRenderer !== null) {
                    clearInterval(waitForRenderer);
                    buttonDiv.appendChild(downloadButton)
                    youtubeMenuRenderer.appendChild(buttonDiv);
                }
            }, 500);
            youtubePlayer = document.getElementsByClassName("video-stream")[0];

            downloadButton.addEventListener("click", downloadEventHandler);
        }
    }
    const downloadEventHandler = async () => {
        const url = window.location.href.split('&')[0];
        let quality;
        console.log(url);
        try {
            quality = youtubePlayer.videoHeight;
        }
        catch {
            quality = "9999"
        }
        const serverUrl = "http://localhost:3000/video?url=" + encodeURIComponent(url) + "&quality=" + encodeURIComponent(quality);
        try {
            const response = await fetch(serverUrl);
    
            const data = await response.json();
            console.log("Ответ от сервера:", data);
        } catch (error) {
            console.warn("Ошибка при запросе к серверу:", error);
        }
    }
    newVideoLoaded();
})();