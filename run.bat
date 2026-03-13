@echo off
title Frontend + Backend Starter

echo Frontend...
start cmd /k "cd frontend && npm run dev"

echo Backend...
start cmd /k "cd backend && node index.js"

echo ============================
echo all services started!
echo ============================
pause
