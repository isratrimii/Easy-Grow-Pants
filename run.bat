@echo off
cls
echo ========================================================
echo    Easy Grow Plants - Django Application Launcher
echo ========================================================
echo.

:: Change to project directory
cd /d "%~dp0"

:: ============================================
:: STEP 1: Check Python Installation
:: ============================================
echo [1/5] Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH.
    echo Please install Python 3.10+ from python.org
    pause
    exit /b 1
)
echo Python found!
echo.

:: ============================================
:: STEP 2: Activate Virtual Environment
:: ============================================
echo [2/5] Activating virtual environment...
if not exist ".venv\Scripts\activate.bat" (
    echo Virtual environment not found. Creating one...
    python -m venv .venv
    if %errorlevel% neq 0 (
        echo ERROR: Failed to create virtual environment.
        pause
        exit /b 1
    )
)

call .venv\Scripts\activate.bat
if %errorlevel% neq 0 (
    echo ERROR: Failed to activate virtual environment.
    pause
    exit /b 1
)
echo Virtual environment activated!
echo.

:: ============================================
:: STEP 3: Install Dependencies
:: ============================================
echo [3/5] Installing/Updating dependencies...
pip install --upgrade pip >nul 2>&1
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies.
    pause
    exit /b 1
)
echo Dependencies installed!
echo.

:: ============================================
:: STEP 4: Run Migrations
:: ============================================
echo [4/5] Running database migrations...
python manage.py makemigrations
python manage.py migrate
if %errorlevel% neq 0 (
    echo ERROR: Database migration failed.
    pause
    exit /b 1
)
echo Database is up to date!
echo.

:: ============================================
:: STEP 5: Start Django Server
:: ============================================
echo [5/5] Starting Django development server...
echo.
echo ========================================================
echo    Server will start at: http://127.0.0.1:8000
echo    Press CTRL+C to stop the server
echo ========================================================
echo.

python manage.py runserver 8000

:: If server stops, pause to show any error messages
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Server failed to start.
    pause
)
