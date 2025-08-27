Set WshShell = CreateObject("WScript.Shell")

WshShell.Run "cmd /c cd C:\kintaro-wifi-file-transfer\backend && node index.js", 0, False

WshShell.Run "cmd /c cd C:\kintaro-wifi-file-transfer\frontend && npm run dev", 0, False
