## Attention
This extension is intended only for informational and educational purposes. The author does not encourage piracy in any way. Please be aware that downloading and distributing copyrighted materials without the consent of the copyright holder may result in legal consequences.

## Installation
### Chromium-based browsers
1. Download the latest `YTDownloaderNew.zip` and unpack the archive.
2. Go to `chrome://extensions/` (or `about:extensions`).
3. Enable Developer Mode.
4. Click on the "Load unpacked" button and select the folder where you extracted `YTDownloaderNew.zip`.
5. Run `server.exe` and follow the on-screen instructions.

### Firefox-based browsers
1. Download the latest `FFYoutubeDownloader.zip` and unpack the archive.
2. Go to `about:addons`.
3. Click the gear icon in the top-right corner.
4. Click on the "Install Add-on From File" and select `YTDLext.xpi` from the folder where you extracted `FFYoutubeDownloader.zip`.
5. Run `server.exe` and follow the on-screen instructions.

## Reinstallation
### Chromium-based browsers
1. Delete all downloaded files.
2. Go to `chrome://extensions/` (or `about:extensions`) and remove the YTDL extension.
3. Install extension as usual.

### Firefox-based browsers
1. Delete all downloaded files.
2. Go to `about:addons` and remove the YTDL extension.
3. Install extension as usual.

## Uninstallation
1. Delete all downloaded files.
2. Go to `chrome://extensions/` (or `about:extensions`) and remove the YTDL extension.
3. Open **Command Prompt** (cmd).
4. Type the command `winget remove ffmpeg` and press Enter.
5. Open **Registry Editor** (regedit).
6. Go to `HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run`.
7. Delete the variable named `YTDL-server-by-DC`.
8. Restart your computer.
