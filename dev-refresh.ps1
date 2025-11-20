# dev-refresh.ps1

# 1. DEFINE PATHS
$RootPath = $PSScriptRoot
$BackendPath = Join-Path $RootPath "backend"
$FrontendPath = Join-Path $RootPath "frontend"
$BackendPort = 8000
$FrontendPort = 3000

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   FORTIFY DEV ENVIRONMENT LAUNCHER" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

# 2. CLEANUP: Kill existing processes on ports 3000 and 8000
# This allows you to double-click this script again to "Refresh" everything
Function Kill-Port ($port) {
    $connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connection) {
        $pid_num = $connection.OwningProcess
        $process = Get-Process -Id $pid_num -ErrorAction SilentlyContinue
        if ($process) {
            Write-Host "Killing existing process on port $port (PID: $pid_num)..." -ForegroundColor Yellow
            Stop-Process -Id $pid_num -Force
        }
    }
}

Write-Host "Checking for running processes..."
Kill-Port $BackendPort
Kill-Port $FrontendPort

# 3. BACKEND SETUP & DB REFRESH
Write-Host "`n--- Setting up Backend ---" -ForegroundColor Green
Set-Location $BackendPath

# Install dependencies if missing
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing Backend Dependencies..."
    npm install
}

# Refresh Database (Migrate Reset drops the DB, re-applies schema, and runs seed.js)
# Note: This wipes data. Remove this block if you want to keep data between refreshes.
Write-Host "Refreshing PostgreSQL Database (Reset & Seed)..." -ForegroundColor Magenta
try {
    # Using --force to skip confirmation prompts
    cmd /c "npx prisma migrate reset --force" 
}
catch {
    Write-Error "Database refresh failed. Is Postgres running?"
    Read-Host "Press Enter to exit..."
    exit
}

# 4. FRONTEND SETUP
Write-Host "`n--- Setting up Frontend ---" -ForegroundColor Green
Set-Location $FrontendPath

# Install dependencies if missing
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing Frontend Dependencies..."
    npm install
}

# 5. LAUNCH SERVERS
Write-Host "`n--- Launching Application ---" -ForegroundColor Cyan

# Start Backend in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$BackendPath'; Write-Host 'BACKEND (Port $BackendPort)'; npm run dev"

# Start Frontend in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$FrontendPath'; Write-Host 'FRONTEND (Port $FrontendPort)'; npm start"

Write-Host "Done! The app is opening in new windows." -ForegroundColor Green
Start-Sleep -Seconds 3