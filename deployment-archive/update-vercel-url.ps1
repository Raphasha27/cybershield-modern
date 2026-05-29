# PowerShell script to update Vercel URL across all files
# Usage: .\update-vercel-url.ps1 "your-actual-vercel-url"

param(
    [Parameter(Mandatory=$true)]
    [string]$NewUrl
)

$files = @(
    "README.md",
    "GETTING_STARTED.md",
    "FINAL_DEPLOYMENT_GUIDE.md",
    "DEPLOYMENT_SUMMARY.md",
    "READY_FOR_VERCEL.md",
    "VERCEL_DEPLOYMENT.md"
)

$oldUrl = "https://cybershield-soc.vercel.app"

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Updating $file..." -ForegroundColor Green
        (Get-Content $file) -replace [regex]::Escape($oldUrl), $NewUrl | Set-Content $file
    }
}

Write-Host "`nAll files updated successfully!" -ForegroundColor Cyan
Write-Host "New URL: $NewUrl" -ForegroundColor Yellow
Write-Host "`nDon't forget to commit and push:" -ForegroundColor Magenta
Write-Host "git add ." -ForegroundColor White
Write-Host "git commit -m 'Update Vercel URL to actual deployment'" -ForegroundColor White
Write-Host "git push origin master" -ForegroundColor White
