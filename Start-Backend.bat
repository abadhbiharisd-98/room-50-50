@echo off
title RoomMates - Backend (Node.js API)
cd /d "%~dp0backend"
echo ==============================================
echo   RoomMates Backend Server (Port 5000)
echo ==============================================
echo.
call node server.js
pause

