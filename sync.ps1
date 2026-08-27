Write-Host "Starting SharePoint Sync..." -ForegroundColor Cyan

# 1. Open the SharePoint URL in default browser (will download the file automatically)
Start-Process "https://microgenesistechsoft.sharepoint.com/sites/Global-MarketSales/_layouts/15/download.aspx?sourcedoc=%7B6D3A78BD-FAA9-410E-80F2-AE2580A9187A%7D"

# 2. Wait for the download to finish
Write-Host "Waiting 6 seconds for browser download to complete..."
Start-Sleep -Seconds 6

# 3. Find the most recently downloaded MIS*.xlsx file in Downloads folder
$downloadsDir = "$env:USERPROFILE\Downloads"
$downloadedFile = Get-ChildItem -Path $downloadsDir -Filter "MIS*.xlsx" | Sort-Object LastWriteTime -Descending | Select-Object -First 1

if ($downloadedFile) {
    $destPath = "C:\Users\STMT1214\Downloads\HR Dashboard\HR Dashboard\public\data\MIS.xlsx"
    Copy-Item -Path $downloadedFile.FullName -Destination $destPath -Force
    # Clean it up from Downloads to keep the folder clean
    Remove-Item $downloadedFile.FullName -Force
    Write-Host "Success! Local data updated to match SharePoint." -ForegroundColor Green
    Write-Host "Target: $destPath" -ForegroundColor Gray
} else {
    Write-Host "Error: No newly downloaded MIS.xlsx found in Downloads." -ForegroundColor Red
}
