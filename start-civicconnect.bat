@echo off
title CivicConnect Launcher
echo =========================================================
echo       CIVICCONNECT - Full Stack Application Launcher
echo =========================================================
echo.
echo [1/2] Starting Spring Boot Backend on http://localhost:8080 ...
start "CivicConnect Backend" cmd /k "cd /d ""%~dp0backend"" && .\mvnw.cmd spring-boot:run"

echo [2/2] Starting React Vite Frontend on http://localhost:5173 ...
start "CivicConnect Frontend" cmd /k "cd /d ""%~dp0frontend"" && npm.cmd run dev"

echo.
echo =========================================================
echo Applications are launching:
echo - Frontend UI:     http://localhost:5173
echo - Backend API/UI:  http://localhost:8080
echo =========================================================
echo Press any key to exit this window (servers will keep running).
pause > nul
