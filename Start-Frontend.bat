@echo off
title RoomMates - Frontend (Expo)
cd /d "%~dp0frontend"
echo ==============================================
echo   RoomMates Mobile App (Expo Metro Bundler)
echo ==============================================
echo.
echo Press 'w' to open in Web Browser (Chrome/Edge)
echo Or scan QR Code from Expo Go app on your phone
echo.
call npx expo start
pause

