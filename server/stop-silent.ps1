$procs = Get-CimInstance Win32_Process -Filter "Name='node.exe'" |
  Where-Object { $_.CommandLine -match 'server[\\/]index\.mjs' }

if ($procs) {
  $procs | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
  Write-Output "STOPPED:$($procs.Count)"
} else {
  Write-Output "NOT_RUNNING"
}
