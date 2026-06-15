# Copies the latest REFLUX PRO installer into the gated private downloads folder.
$ErrorActionPreference = "Stop"

$proProject = "C:\Users\nothi\Desktop\! REFLUX PRO TWEAKING UTILITY"
$distDir = Join-Path $proProject "dist"
$destDir = Join-Path $PSScriptRoot "..\private\downloads"
$destFile = Join-Path $destDir "REFLUX-PRO-Setup.exe"
$legacyPublicFile = Join-Path $PSScriptRoot "..\public\downloads\REFLUX-PRO-Setup.exe"

Push-Location $proProject
try {
  npm run build
} finally {
  Pop-Location
}

$installer = Get-ChildItem -Path $distDir -Filter "REFLUX-PRO-Setup.exe" -ErrorAction SilentlyContinue |
  Sort-Object LastWriteTime -Descending |
  Select-Object -First 1

if (-not $installer) {
  $installer = Get-ChildItem -Path $distDir -Filter "REFLUX PRO Setup *.exe" -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -notmatch "portable" } |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 1
}

if (-not $installer) {
  throw "Build finished but no PRO installer was found in $distDir"
}

if ($installer.Length -lt 50000000) {
  throw "$($installer.Name) looks too small ($($installer.Length) bytes). Expected the NSIS installer."
}

New-Item -ItemType Directory -Force -Path $destDir | Out-Null
Copy-Item -Path $installer.FullName -Destination $destFile -Force
if (Test-Path $legacyPublicFile) {
  Remove-Item -Path $legacyPublicFile -Force
}
Write-Host "Synced $($installer.FullName) -> $destFile"
