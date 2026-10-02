# Render a local HTML wireframe using an installed Chromium/Edge browser.
. (Join-Path $PSScriptRoot '../../../.github/hooks/ba-common.ps1')
function Find-WireframeBrowser {
    foreach ($name in @('msedge', 'chrome', 'google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser', 'microsoft-edge')) {
        $command = Get-Command $name -CommandType Application -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($command) { return $command.Source }
    }
    $locations = @()
    foreach ($base in @(${env:ProgramFiles(x86)}, $env:ProgramFiles, $env:LOCALAPPDATA)) {
        if ($base) {
            $locations += Join-Path $base 'Microsoft/Edge/Application/msedge.exe'
            $locations += Join-Path $base 'Google/Chrome/Application/chrome.exe'
        }
    }
    $locations += @('/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Chromium.app/Contents/MacOS/Chromium', '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/microsoft-edge', '/snap/bin/chromium')
    foreach ($path in $locations) { if ([IO.File]::Exists($path)) { return $path } }
    throw 'No Chromium or Edge browser executable found. Install one or supply --browser PATH.'
}
$profile = $null; $temporaryOutput = $null
try {
    $options = Read-BaArguments $args -Values @('input', 'output', 'viewport', 'scale', 'timeout', 'browser')
    if ($options.help) { [Console]::WriteLine('render_screenshot.ps1 --input PATH [--output PATH] [--viewport desktop|desktop-large|tablet|mobile|WIDTHxHEIGHT] [--scale N] [--timeout SECONDS] [--browser PATH]'); exit 0 }
    if (-not $options.input) { throw '--input is required.' }
    $inputPath = Resolve-BaPath $options.input
    if (-not [IO.File]::Exists($inputPath)) { throw "Input HTML file does not exist: $inputPath" }
    $outputPath = if ($options.output) { Resolve-BaPath $options.output } else { [IO.Path]::ChangeExtension($inputPath, '.png') }
    if ($inputPath -eq $outputPath) { throw 'Screenshot output must differ from the input HTML file.' }
    $presets = @{ desktop = @(1280, 800); 'desktop-large' = @(1440, 900); tablet = @(768, 1024); mobile = @(375, 812) }
    $viewport = if ($options.viewport) { $options.viewport.Trim().ToLowerInvariant() } else { 'desktop' }
    if ($presets.ContainsKey($viewport)) { $width = $presets[$viewport][0]; $height = $presets[$viewport][1] }
    elseif ($viewport -match '^(\d+)x(\d+)$' -and [int]$Matches[1] -gt 0 -and [int]$Matches[2] -gt 0) { $width = [int]$Matches[1]; $height = [int]$Matches[2] }
    else { throw 'Invalid viewport. Use a preset or positive WIDTHxHEIGHT.' }
    $scale = 1.0
    if ($options.scale -and (-not [double]::TryParse($options.scale, [Globalization.NumberStyles]::Float, [Globalization.CultureInfo]::InvariantCulture, [ref]$scale) -or $scale -le 0 -or [double]::IsNaN($scale) -or [double]::IsInfinity($scale))) { throw '--scale must be a positive finite number.' }
    $timeout = 15
    if ($options.timeout -and (-not [int]::TryParse($options.timeout, [ref]$timeout) -or $timeout -lt 1)) { throw '--timeout must be a positive integer.' }
    $browser = if ($options.browser) { Resolve-BaPath $options.browser } else { Find-WireframeBrowser }
    if (-not [IO.File]::Exists($browser)) { throw "Browser executable does not exist: $browser" }
    [void][IO.Directory]::CreateDirectory([IO.Path]::GetDirectoryName($outputPath))
    $profile = Join-Path ([IO.Path]::GetTempPath()) ('wf_render_' + [Guid]::NewGuid().ToString('N'))
    [void][IO.Directory]::CreateDirectory($profile)
    $temporaryOutput = $outputPath + '.' + [Guid]::NewGuid().ToString('N') + '.png'
    $browserArguments = @('--headless', '--disable-gpu', '--disable-dev-shm-usage', '--hide-scrollbars', "--user-data-dir=$profile", "--window-size=$width,$height", ('--force-device-scale-factor=' + $scale.ToString([Globalization.CultureInfo]::InvariantCulture)), "--screenshot=$temporaryOutput", ([Uri]$inputPath).AbsoluteUri)
    $result = Invoke-BaProcess $browser $browserArguments -TimeoutSeconds $timeout
    if ($result.exit_code -ne 0) { throw "Browser exited $($result.exit_code): $($result.stderr.Trim())" }
    if (-not [IO.File]::Exists($temporaryOutput)) { throw "Screenshot was not generated: $($result.stderr.Trim())" }
    $bytes = [IO.File]::ReadAllBytes($temporaryOutput)
    if ($bytes.Length -lt 24 -or [BitConverter]::ToString($bytes, 0, 8) -ne '89-50-4E-47-0D-0A-1A-0A') { throw 'Browser output is not a valid PNG screenshot.' }
    if ([IO.File]::Exists($outputPath)) { [IO.File]::Replace($temporaryOutput, $outputPath, [NullString]::Value, $true) }
    else { [IO.File]::Move($temporaryOutput, $outputPath) }
    [Console]::WriteLine("SUCCESS: Rendered screenshot (${width}x${height}, scale $scale): $outputPath")
    exit 0
} catch { [Console]::Error.WriteLine($_.Exception.Message); exit 1 }
finally {
    if ($temporaryOutput -and [IO.File]::Exists($temporaryOutput)) { [IO.File]::Delete($temporaryOutput) }
    if ($profile -and [IO.Directory]::Exists($profile)) {
        $tempRoot = [IO.Path]::GetFullPath([IO.Path]::GetTempPath()).TrimEnd([IO.Path]::DirectorySeparatorChar) + [IO.Path]::DirectorySeparatorChar
        if ([IO.Path]::GetFullPath($profile).StartsWith($tempRoot, [StringComparison]::OrdinalIgnoreCase) -and [IO.Path]::GetFileName($profile).StartsWith('wf_render_')) {
            try { [IO.Directory]::Delete($profile, $true) } catch { [Console]::Error.WriteLine("Could not remove browser profile: $profile") }
        }
    }
}
