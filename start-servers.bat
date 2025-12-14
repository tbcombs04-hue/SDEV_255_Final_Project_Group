@echo off
echo ==========================================
echo    Starting SDEV 255 Final Project
echo ==========================================
echo.
echo Starting Backend Server (Port 5000)...
start "Backend Server" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server (Port 5173)...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ==========================================
echo    Servers Starting...
echo ==========================================
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
echo.
echo Test Accounts:
echo    Teacher: teacher@test.com / password123
echo    Student: student@test.com / password123
echo.
echo Close this window when done.
echo To stop servers, close the server windows.
echo.
pause

