# Sends REFLUX PRO update emails with replacement license keys to active customers.
param(
  [Parameter(Mandatory = $true)][string]$Version,
  [string]$Notes = "",
  [string]$Email = "",
  [switch]$DryRun,
  [string]$Secret = $env:LICENSE_UPDATE_SECRET,
  [string]$SiteUrl = $env:NEXT_PUBLIC_SITE_URL
)

$ErrorActionPreference = "Stop"

if (-not $Secret) {
  throw "Set LICENSE_UPDATE_SECRET or pass -Secret."
}

if (-not $SiteUrl) {
  $SiteUrl = "https://www.refluxtweaks.com"
}

$body = @{
  version = $Version
  dryRun = [bool]$DryRun
}

if ($Notes) { $body.notes = $Notes }
if ($Email) { $body.email = $Email }

$json = $body | ConvertTo-Json -Compress
$uri = "$($SiteUrl.TrimEnd('/'))/api/admin/license-updates"

$response = Invoke-RestMethod `
  -Method POST `
  -Uri $uri `
  -Headers @{ Authorization = "Bearer $Secret" } `
  -ContentType "application/json" `
  -Body $json

$response | ConvertTo-Json -Depth 6
