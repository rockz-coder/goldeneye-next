# One-shot local setup (Windows PowerShell). Run from the app folder:  powershell -File scripts/setup.ps1
$ErrorActionPreference = 'Stop'
if (-not (Test-Path .env)) {
  Copy-Item .env.example .env
  $secret = -join ((48..57 + 97..122) | Get-Random -Count 48 | ForEach-Object { [char]$_ })
  (Get-Content .env) -replace 'change-me-to-a-long-random-string', $secret | Set-Content .env
  Write-Host 'Created .env. Edit DATABASE_URL (Postgres password) and SEED_ADMIN_PASSWORD, then re-run this script.'
  exit 0
}
pnpm install
pnpm payload migrate
pnpm seed
Write-Host 'Done. Start with: pnpm dev  ->  http://localhost:3000  (admin: /admin)'
