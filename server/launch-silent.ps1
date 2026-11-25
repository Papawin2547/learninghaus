param(
  [switch]$NoBrowser
)

$codeDir = Split-Path -Parent $PSScriptRoot
$serverScript = Join-Path $PSScriptRoot "index.mjs"
$url = "http://127.0.0.1:8766/Code/learninghaus.html"

$nodeExe = "C:\Users\papaw\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if (-not (Test-Path $nodeExe)) {
  $nodeExe = "node"
}

function Test-ServerUp {
  try {
    $res = Invoke-WebRequest -Uri $url -Method Head -TimeoutSec 1 -UseBasicParsing
    return ($res.StatusCode -ge 200 -and $res.StatusCode -lt 500)
  } catch {
    return $false
  }
}

if (-not (Test-ServerUp)) {
  Start-Process -FilePath $nodeExe -ArgumentList @("`"$serverScript`"") -WorkingDirectory $codeDir -WindowStyle Hidden
  for ($i = 0; $i -lt 30; $i++) {
    Start-Sleep -Milliseconds 200
    if (Test-ServerUp) { break }
  }
}

if (-not $NoBrowser) {
  Start-Process $url
}
