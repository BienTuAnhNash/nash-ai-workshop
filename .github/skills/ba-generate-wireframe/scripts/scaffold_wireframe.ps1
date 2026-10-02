# Generate the responsive HTML shell with the skill's accessible CSS tokens.
. (Join-Path $PSScriptRoot '../../../.github/hooks/ba-common.ps1')
try {
    $options = Read-BaArguments $args -Values @('title', 'desc', 'output')
    if ($options.help) { [Console]::WriteLine('scaffold_wireframe.ps1 --title TITLE --output PATH [--desc DESCRIPTION]'); exit 0 }
    if (-not $options.title -or -not $options.output) { throw '--title and --output are required.' }
    $output = Resolve-BaPath $options.output
    $tokens = Join-Path $PSScriptRoot '../assets/wireframe-tokens.css'
    if (-not [IO.File]::Exists($tokens)) { throw "CSS tokens are missing: $tokens" }
    $css = Read-BaText $tokens
    $title = [Net.WebUtility]::HtmlEncode($options.title)
    $description = if ($options.desc) { [Net.WebUtility]::HtmlEncode($options.desc) } else { 'Mid-Fidelity Wireframe Specification' }
    $html = @"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>$title - Wireframe</title>
  <style>
$css
  </style>
</head>
<body>
  <header class="wf-navbar">
    <div class="wf-logo">AppLogo</div>
    <nav>
      <ul class="wf-nav-links">
        <li><a href="#" class="active">Overview</a></li>
        <li><a href="#">Details</a></li>
        <li><a href="#">Settings</a></li>
      </ul>
    </nav>
  </header>
  <main class="wf-container">
    <header class="wf-page-header">
      <h1 class="wf-page-title">$title</h1>
      <p class="wf-page-desc">$description</p>
    </header>
    <section class="wf-card">
      <h2 class="wf-card-header">Main Section</h2>
      <p>Placeholder content. Add form controls, tables, or cards here.</p>
    </section>
  </main>
</body>
</html>
"@ + "`n"
    [void](Write-BaText $output $html)
    [Console]::WriteLine("Scaffolded HTML wireframe at: $output")
    exit 0
} catch { [Console]::Error.WriteLine($_.Exception.Message); exit 2 }
