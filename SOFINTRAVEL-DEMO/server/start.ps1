$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Windows.Forms
$root = Split-Path -Parent $PSScriptRoot
$site = Join-Path $root 'site'
$binary = Join-Path $PSScriptRoot 'miniserve.exe'
$pidFile = Join-Path $PSScriptRoot 'server.pid'
$url = 'http://127.0.0.1:4173/'

try {
  $listener = $null
  try {
    $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Parse('127.0.0.1'), 4173)
    $listener.Start()
    $listener.Stop()
    $listener = $null
  } catch {
    if (Test-Path $pidFile) {
      $existingId = [int](Get-Content $pidFile -Raw)
      $existing = Get-CimInstance Win32_Process -Filter "ProcessId = $existingId" -ErrorAction SilentlyContinue
      if ($existing -and $existing.ExecutablePath -eq $binary) {
        Start-Process $url
        exit 0
      }
    }
    [System.Windows.Forms.MessageBox]::Show('Не удалось запустить демо: порт 4173 уже занят. Закройте другие демо и попробуйте снова.', 'SOFINTRAVEL DEMO') | Out-Null
    exit 1
  }

  $arguments = @('--quiet', '--spa', '--index', 'index.html', '--interfaces', '127.0.0.1', '--port', '4173', ('"' + $site + '"'))
  $process = Start-Process -FilePath $binary -ArgumentList $arguments -WindowStyle Hidden -PassThru
  Set-Content -Path $pidFile -Value $process.Id -Encoding ASCII

  $ready = $false
  for ($attempt = 0; $attempt -lt 30; $attempt++) {
    Start-Sleep -Milliseconds 300
    try {
      $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2
      if ($response.StatusCode -eq 200) {
        $ready = $true
        break
      }
    } catch {}
    if ($process.HasExited) { break }
  }

  if (-not $ready) {
    if (-not $process.HasExited) { Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue }
    Remove-Item $pidFile -Force -ErrorAction SilentlyContinue
    [System.Windows.Forms.MessageBox]::Show('Не удалось запустить сайт. Попробуйте еще раз.', 'SOFINTRAVEL DEMO') | Out-Null
    exit 1
  }

  Start-Process $url
} catch {
  [System.Windows.Forms.MessageBox]::Show('Не удалось запустить демо. Попробуйте еще раз.', 'SOFINTRAVEL DEMO') | Out-Null
  exit 1
}
