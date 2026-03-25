@echo off
echo Starting Habibi Full Stack...

:: Start Backend
start "Habibi Backend" node server/index.js

:: Start Frontend
start "Habibi Frontend" node node_modules/vite/bin/vite.js

echo.
echo ----------------------------------------------------
echo Habibi is launching in two separate windows.
echo.
echo Backend API : http://localhost:3001
echo Frontend UI : http://localhost:5173
echo.
echo Check the new windows for logs.
echo ----------------------------------------------------
pause
