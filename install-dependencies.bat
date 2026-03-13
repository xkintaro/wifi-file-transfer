@echo off
title Dependency Installer

echo Frontend...
cd frontend
call npm install
cd ..

echo Backend...
cd backend
call npm install
cd ..

echo ============================
echo All dependencies installed!
echo ============================
pause
