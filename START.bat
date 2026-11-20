@echo off
title NutiFix arendusserver
cd /d "%~dp0"

if not exist "node_modules\react-scripts" (
  echo Paigaldan sõltuvused, oota...
  call npm install --no-audit --no-fund
)

echo.
echo Avan NutiFixi aadressil http://localhost:3000/
echo Sulgemiseks vajuta Ctrl+C.
echo.
call npm start
pause
