# Copies the latest REFLUX FREE installer into the website public folder.
$ErrorActionPreference = "Stop"

$freeProject = "C:\Users\nothi\Desktop\! REFLUX FREE TWEAKING UTILITY"
$distDir = Join-Path $freeProject "dist-free"
$destDir = Join-Path $PSScriptRoot "..\public\downloads"
$destFile = Join-Path $destDir "REFLUX-FREE-Setup.exe"

Push-Location $freeProject
try {
  npm run build
} finally {
  Pop-Location
}

$installer = Get-ChildItem -Path $distDir -Filter "REFLUX-FREE-Setup.exe" -ErrorAction SilentlyContinue |
  Sort-Object LastWriteTime -Descending |
  Select-Object -First 1

if (-not $installer) {
  throw "Build finished but REFLUX-FREE-Setup.exe was not found in $distDir"
}

if ($installer.Length -lt 76200000) {
  throw "REFLUX-FREE-Setup.exe looks too small ($($installer.Length) bytes). Expected the NSIS installer, not the portable build."
}

New-Item -ItemType Directory -Force -Path $destDir | Out-Null
Copy-Item -Path $installer.FullName -Destination $destFile -Force
Write-Host "Synced $($installer.FullName) -> $destFile"
