@echo off
:: Tạo task chạy nền mỗi 30 phút, run với quyền admin
schtasks /create ^
 /tn "RunGetIP" ^
 /tr "powershell.exe -ExecutionPolicy Bypass -File \"C:\Users\mhqb365\ip-monitor\getip.ps1\"" ^
 /sc minute ^
 /mo 30 ^
 /ru SYSTEM
echo Task created successfully.
pause
