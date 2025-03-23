## Attention
This extension is provided for educational and informational purposes only. The author does not endorse or promote copyright infringement in any form. Please ensure that you comply with all applicable laws regarding downloading and distributing digital content.

Serverside app uses <a href="http://ffmpeg.org">FFmpeg</a> (version 7.1.1-5-g276bd388f3) licensed under the <a href="http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html">LGPLv2.1</a>.  
Its source code can be downloaded <a href="https://github.com/FFmpeg/FFmpeg">here</a>.

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
