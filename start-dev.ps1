# Startup Script
Write-Host "Starting SpectraFlow System..." -ForegroundColor Green

# 1. Start Backend Services (Exclude frontend container to avoid port conflict)
Write-Host "1. Launching Backend Infrastructure (app, db, redis, queue, nginx)..."
docker-compose up -d app db redis queue web

# Ensure docker frontend is not holding the port
docker-compose stop frontend

# 2. Start Frontend Locally
Write-Host "2. Starting Frontend Dev Server..."
Set-Location frontend
npm run dev

Write-Host "System started successfully!" -ForegroundColor Green
