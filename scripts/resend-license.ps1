# Re-sends a buyer's existing REFLUX PRO license key + download link via email.
# Does NOT create a new key — looks up the latest active license in Supabase.
#
# Required env (or pass -Secret):
#   LICENSE_RESEND_SECRET  — or LICENSE_UPDATE_SECRET works too
#   NEXT_PUBLIC_SITE_URL   — defaults to https://www.refluxtweaks.com
#
# Examples:
#   .\scripts\resend-license.ps1 -Email "buyer@example.com"
#   .\scripts\resend-license.ps1 -Email "buyer@example.com" -DryRun
#   $env:LICENSE_UPDATE_SECRET = "your-secret"; .\scripts\resend-license.ps1 -Email "buyer@example.com"

param(
  [Parameter(Mandatory = $true)][string]$Email,
  [switch]$DryRun,
  [string]$Secret = $env:LICENSE_RESEND_SECRET,
  [string]$SiteUrl = $env:NEXT_PUBLIC_SITE_URL
)

$ErrorActionPreference = "Stop"

if (-not $Secret) {
  $Secret = $env:LICENSE_UPDATE_SECRET
}

if (-not $Secret) {
  throw "Set LICENSE_RESEND_SECRET or LICENSE_UPDATE_SECRET, or pass -Secret."
}

if (-not $SiteUrl) {
  $SiteUrl = "https://www.refluxtweaks.com"
}

$body = @{
  email = $Email.Trim()
  dryRun = [bool]$DryRun
}

$json = $body | ConvertTo-Json -Compress
$uri = "$($SiteUrl.TrimEnd('/'))/api/admin/resend-license"

try {
  $response = Invoke-RestMethod `
    -Method POST `
    -Uri $uri `
    -Headers @{ Authorization = "Bearer $Secret" } `
    -ContentType "application/json" `
    -Body $json

  $response | ConvertTo-Json -Depth 6
}
catch {
  if ($_.Exception.Response) {
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    $detail = $reader.ReadToEnd()
    if ($detail) {
      Write-Error $detail
    }
  }
  throw
}
