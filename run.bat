@echo off
echo Backend ve Frontend başlatılıyor...
echo -------------------------------

REM Backend başlatılıyor
start cmd /k "cd backend && node index.js"

REM Frontend başlatılıyor
start cmd /k "cd frontend && npm run dev"

echo Tüm servisler başlatıldı.
