@echo off
set exe_path="%~dp0server.exe"
set reg_key="HKCU\Software\Microsoft\Windows\CurrentVersion\Run"

reg delete "%reg_key%" /v "YTDL-server-by-DC" /f

echo server.exe removed from autostart.
pause
