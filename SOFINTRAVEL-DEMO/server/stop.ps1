$binary = Join-Path $PSScriptRoot 'miniserve.exe'
$pidFile = Join-Path $PSScriptRoot 'server.pid'

if (Test-Path $pidFile) {
  $serverId = 0
  [int]::TryParse((Get-Content $pidFile -Raw).Trim(), [ref]$serverId) | Out-Null
  if ($serverId -gt 0) {
    $server = Get-CimInstance Win32_Process -Filter "ProcessId = $serverId" -ErrorAction SilentlyContinue
    if ($server -and $server.ExecutablePath -eq $binary) {
      Stop-Process -Id $serverId -Force -ErrorAction SilentlyContinue
    }
  }
  Remove-Item $pidFile -Force -ErrorAction SilentlyContinue
}
