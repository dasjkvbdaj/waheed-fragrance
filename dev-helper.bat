@echo off
REM Development helper script for Luxe Perfumes
REM This script helps with common development tasks

:menu
cls
echo ========================================
echo Luxe Perfumes Development Helper
echo ========================================
echo.
echo What would you like to do?
echo 1. Start development server (npm run dev)
echo 2. Build for production (npm run build)
echo 3. Start production server (npm start)
echo 4. Clean build cache (.next folder)
echo 5. Install dependencies (npm install)
echo 6. Lint code (npm run lint)
echo 7. Exit
echo.

set /p choice="Enter your choice [1-7]: "

if "%choice%"=="1" (
    echo.
    echo Starting development server...
    echo.
    call npm run dev
    goto menu
)

if "%choice%"=="2" (
    echo.
    echo Building for production...
    echo.
    call npm run build
    echo.
    pause
    goto menu
)

if "%choice%"=="3" (
    echo.
    echo Starting production server...
    echo.
    call npm start
    goto menu
)

if "%choice%"=="4" (
    echo.
    echo Cleaning build cache...
    if exist .next (
        rmdir /s /q .next
        echo Build cache cleaned!
    ) else (
        echo No build cache found.
    )
    echo.
    pause
    goto menu
)

if "%choice%"=="5" (
    echo.
    echo Installing dependencies...
    echo.
    call npm install
    echo.
    pause
    goto menu
)

if "%choice%"=="6" (
    echo.
    echo Running linter...
    echo.
    call npm run lint
    echo.
    pause
    goto menu
)

if "%choice%"=="7" (
    echo.
    echo Goodbye!
    exit /b
)

echo.
echo Invalid option. Please try again.
echo.
pause
goto menu
