from flask import Flask, request, jsonify
from flask_cors import CORS
import yt_dlp
import re
import subprocess
import platform
import sys
import os

app = Flask(__name__)
CORS(app)

def get_download_folder():
    home = os.path.expanduser("~")
    return os.path.join(home, "Downloads")

def check_ffmpeg():
    try:
        subprocess.run(["ffmpeg", "-version"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except FileNotFoundError:
        install_ffmpeg()

def install_ffmpeg():
    system = platform.system()
    try:
        if system == "Windows":
            subprocess.run(["winget", "install", "ffmpeg"], check=True)
        elif system == "Linux":
            subprocess.run(["sudo", "apt-get", "install", "-y", "ffmpeg"], check=True)
        elif system == "Darwin":
            subprocess.run(["brew", "install", "ffmpeg"], check=True)
        else:
            print("Unsupported OS.")
            sys.exit(1)
    except Exception as e:
        print(f"Ошибка установки ffmpeg: {e}")
        sys.exit(1)

    print("ffmpeg успешно установлен. Перезапустите сервер")
    input()
    sys.exit(0)

def add_to_autostart():
    system = platform.system()
    script_path = os.path.abspath(sys.argv[0])

    if system == "Windows":
        import winreg as reg
        key = reg.OpenKey(reg.HKEY_CURRENT_USER, r"Software\Microsoft\Windows\CurrentVersion\Run", 0, reg.KEY_SET_VALUE)
        reg.SetValueEx(key, "YTDL-server-by-DC", 0, reg.REG_SZ, f'"{script_path}" -silent')
        print("Приложение добавлено в автозагрузку.")
    elif system == "Linux":
        autostart_dir = os.path.expanduser("~/.config/autostart")
        os.makedirs(autostart_dir, exist_ok=True)
        with open(os.path.join(autostart_dir, "ytdl_server_by_dc.desktop"), 'w') as f:
            f.write(f"""
[Desktop Entry]
Type=Application
Exec=python3 "{script_path}" &
Hidden=false
NoDisplay=true
X-GNOME-Autostart-enabled=true
Name=YTDL-server-by-DC
Comment=My Flask Application
""")
        print("Приложение добавлено в автозагрузку.")
    elif system == "Darwin":
        print("Добавление в автозагрузку для macOS требует дополнительных настроек.")
    else:
        print("Unsupported OS.")

@app.route('/')
def home():
    return "Добро пожаловать на простой сервер!"

@app.route('/video', methods=['GET'])
def download_video():
    video_url = request.args.get('url')
    quality = request.args.get('quality', 'best')

    if "music.youtube.com" in video_url:
        video_format = 'mp3'
        ydl_format = 'bestaudio'
    else:
        video_format = 'mp4'
        ydl_format = f'bestvideo[height<={quality}]+bestaudio'

    if not video_url:
        return jsonify({"message": "Отсутствует ссылка на видео"}), 400

    download_folder = get_download_folder()
    output_path = os.path.join(download_folder, f'DownloadedVideos/%(title)s.{video_format}')
    print(output_path)

    try:
        ydl_opts = {
            'format': ydl_format,
            'outtmpl': output_path,
            'merge_output_format': video_format
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([video_url])

        return jsonify({"message": "Видео успешно скачано"}), 200
    except Exception as e:
        return jsonify({"message": "Ошибка: " + str(e)}), 500

@app.route('/playlist', methods=['GET'])
def download_playlist():
    playlist_url = request.args.get("url")
    download_folder = get_download_folder()
    output_path = os.path.join(download_folder, f'DownloadedPlaylists/%(playlist_title)s/%(title)s.%(ext)s')
    try:
        ydl_opts = {
            'format': 'bestaudio/best',
            'noplaylist': False,
            'quiet': False,
            'extractaudio': True,
            'audioquality': 0,
            'outtmpl': output_path,
            'ignoreerrors': True,
            'postprocessors': [{
                'key': 'FFmpegMetadata',
                'add_metadata': True,
            }],
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([playlist_url])
            return jsonify({"message": "Плейлист успешно скачан"}), 200
        
    except Exception as e:
        return jsonify({"message": "Ошибка: " + str(e)}), 500

if __name__ == '__main__':
    check_ffmpeg()
    add_to_autostart()
    app.run(port=3000)
