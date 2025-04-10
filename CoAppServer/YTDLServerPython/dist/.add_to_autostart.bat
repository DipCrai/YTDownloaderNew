@echo off
set exe_path="%~dp0server.exe"
set reg_key="HKCU\Software\Microsoft\Windows\CurrentVersion\Run"

reg add "%reg_key%" /v "YTDL-server-by-DC" /t REG_SZ /d %exe_path% /f

echo server.exe added to autostart.
pause
