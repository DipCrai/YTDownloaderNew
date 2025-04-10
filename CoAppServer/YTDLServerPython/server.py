from flask import Flask, request, jsonify
from flask_cors import CORS
import yt_dlp
import os

app = Flask(__name__)
CORS(app)

def get_download_folder():
    home = os.path.expanduser("~")
    return os.path.join(home, "Downloads")

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
            'outtmpl': output_path,
            'ignoreerrors': True
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([playlist_url])
            return jsonify({"message": "Плейлист успешно скачан"}), 200
        
    except Exception as e:
        return jsonify({"message": "Ошибка: " + str(e)}), 500

if __name__ == '__main__':
    app.run(port=3000)
