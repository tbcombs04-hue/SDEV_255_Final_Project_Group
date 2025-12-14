@echo off
echo ==========================================
echo    SDEV 255 Final Project - Setup Script
echo ==========================================
echo.

echo [1/4] Creating backend .env file...
(
echo PORT=5000
echo MONGODB_URI=mongodb+srv://apullum3_db_user:Ryker0129@aubriedrinwalter.tnwddos.mongodb.net/course_management?retryWrites=true
echo JWT_SECRET=super_secret_jwt_key_12345
echo JWT_EXPIRE=7d
echo NODE_ENV=development
) > backend\.env
echo      .env file created!
echo.

echo [2/4] Installing backend dependencies...
cd backend
call npm install
cd ..
echo      Backend dependencies installed!
echo.

echo [3/4] Installing frontend dependencies...
call npm install
echo      Frontend dependencies installed!
echo.

echo ==========================================
echo    Setup Complete!
echo ==========================================
echo.
echo To start the application:
echo    1. Run 'start-servers.bat'
echo    OR
echo    2. Open two terminals:
echo       - Terminal 1: cd backend ^&^& npm run dev
echo       - Terminal 2: npm run dev
echo.
echo Test Accounts:
echo    Teacher: teacher@test.com / password123
echo    Student: student@test.com / password123
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
echo.
pause

