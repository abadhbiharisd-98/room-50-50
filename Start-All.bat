@echo off
title RoomMates Launcher
echo ==============================================
echo   RoomMates App Launcher (Full Stack)
echo ==============================================
echo.
echo 1. Launching Backend on Port 5000...
start "RoomMates Backend" cmd /c "%~dp0Start-Backend.bat"
timeout /t 2 /nobreak >nul
echo 2. Launching Frontend on Expo...
start "RoomMates Frontend" cmd /c "%~dp0Start-Frontend.bat"
echo.
echo Done! Two windows opened for Backend and Frontend.

