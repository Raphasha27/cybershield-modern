Write-Host "Installing frontend dependencies..."
npm install

Write-Host "Installing backend dependencies..."
Push-Location server
npm install
Pop-Location

Write-Host "Setup complete! Run the following commands:"
Write-Host "Terminal 1: npm start (frontend on port 4200)"
Write-Host "Terminal 2: npm run server (backend on port 3000)"
