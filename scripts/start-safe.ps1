# START_SAFE.ps1
# Starts Fortify WITHOUT wiping the database. Use this for daily work.

# FIX: Go up one level from the 'scripts' folder to find the project root
$RootPath = Split-Path -Parent $PSScriptRoot
$BackendPath = Join-Path $RootPath "backend"
$FrontendPath = Join-Path $RootPath "frontend"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   FORTIFY: SAFE START (NO DATA LOSS)" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

# 1. Ensure Docker DB is running
Write-Host "Checking Database..." -ForegroundColor Yellow
# FIX: Ensure we run docker-compose from the root where docker-compose.yml lives
Set-Location $RootPath
docker-compose up -d
Write-Host "Database is UP." -ForegroundColor Green

# 2. Kill ports 3000/8000 (Cleanup)
Function Kill-Port ($port) {
    $conn = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($conn) { Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue }
}
Kill-Port 8000
Kill-Port 3000

# 3. Start Servers
Write-Host "Starting Backend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$BackendPath'; Write-Host 'BACKEND (Port 8000)'; npm run dev"

Write-Host "Starting Frontend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$FrontendPath'; Write-Host 'FRONTEND (Port 3000)'; npm start"

Write-Host "Fortify is live! Happy coding." -ForegroundColor Cyan