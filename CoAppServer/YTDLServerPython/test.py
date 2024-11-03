import os
import platform
import subprocess
import sys
import requests
import zipfile

def install_ffmpeg():
    system = platform.system()

    if system == "Windows":
        install_ffmpeg_windows()
    elif system == "Linux":
        install_ffmpeg_linux()
    elif system == "Darwin":  # macOS
        install_ffmpeg_macos()
    else:
        print("Неизвестная операционная система. Поддерживаются Windows, Linux и macOS.")
        sys.exit(1)

def install_ffmpeg_windows():
    print("Установка FFmpeg для Windows...")
    
    # Поиск последней версии FFmpeg на GitHub
    url = "https://github.com/BtbN/FFmpeg-Builds/releases/latest/download/ffmpeg-release-essentials.zip"
    output_path = "ffmpeg.zip"

    # Загрузка FFmpeg
    try:
        print("Загрузка FFmpeg...")
        response = requests.get(url)
        response.raise_for_status()

        with open(output_path, 'wb') as f:
            f.write(response.content)
        print("FFmpeg загружен.")
    except Exception as e:
        print(f"Ошибка при загрузке FFmpeg: {e}")
        return

    # Распаковка
    try:
        print("Распаковка FFmpeg...")
        with zipfile.ZipFile(output_path, 'r') as zip_ref:
            zip_ref.extractall("ffmpeg")
        print("FFmpeg успешно распакован.")
    except Exception as e:
        print(f"Ошибка при распаковке FFmpeg: {e}")
        return

    # Добавление в PATH
    ffmpeg_path = os.path.join(os.getcwd(), "ffmpeg", "bin")
    os.environ["PATH"] += os.pathsep + ffmpeg_path
    print("FFmpeg добавлен в PATH. Вы можете использовать его из командной строки.")

def install_ffmpeg_linux():
    print("Установка FFmpeg для Linux...")
    try:
        subprocess.run(["sudo", "apt-get", "update"], check=True)
        subprocess.run(["sudo", "apt-get", "install", "-y", "ffmpeg"], check=True)
        print("FFmpeg успешно установлен.")
    except Exception as e:
        print(f"Ошибка при установке FFmpeg: {e}")

def install_ffmpeg_macos():
    print("Установка FFmpeg для macOS...")
    try:
        subprocess.run(["brew", "install", "ffmpeg"], check=True)
        print("FFmpeg успешно установлен.")
    except Exception as e:
        print(f"Ошибка при установке FFmpeg: {e}")

if __name__ == "__main__":
    install_ffmpeg()
