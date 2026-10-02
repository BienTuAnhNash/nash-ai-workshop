# Synchronize requirement inventories, knowledge indexes, and newest-first logs.
. (Join-Path $PSScriptRoot '../../../.github/hooks/ba-common.ps1')
function Set-SyncContent {
    param([string]$Path, [string]$Content)
    if (-not [IO.File]::Exists($Path) -or (Read-BaText $Path) -cne $Content) {
        if (-not $options['dry-run']) { [void](Write-BaText $Path $Content) }
        $changes.Add('Updated ' + (Get-BaRelativePath $Path $root))
    }
}
function Set-InventorySection {
    param([string]$Content, [string]$Heading, [string[]]$Entries)
    $pattern = '(?ms)(^##\s+' + [regex]::Escape($Heading) + '[ \t]*\n).*?(?=^##\s|\z)'
    $block = if ($Entries.Count) { $Entries -join "`n" } else { '* None recorded yet.' }
    # Evaluator replacement keeps backslashes and dollar signs in document titles literal.
    return [regex]::Replace($Content, $pattern, [Text.RegularExpressions.MatchEvaluator]{ param($m) $m.Groups[1].Value + "`n$block`n`n" })
}
try {
    $options = Read-BaArguments $args -Values @('root', 'target', 'log-entry') -Switches @('dry-run', 'json')
    if ($options.help) { [Console]::WriteLine('sync_indexes.ps1 [--root PATH] [--target PATH] [--dry-run] [--log-entry "Action|Path|Summary"] [--json]'); exit 0 }
    $root = Get-BaRoot $options.root
    $logParts = $null
    if ($options['log-entry']) {
        $logParts = $options['log-entry'].Split([char[]]'|', 3)
        if ($logParts.Count -ne 3 -or -not $logParts[0].Trim() -or -not $logParts[1].Trim() -or -not $logParts[2].Trim()) { throw '--log-entry must contain Action|ConceptPath|Summary.' }
    }
    if ($options.target) {
        $target = Resolve-BaPath $options.target $root
        $relativeTarget = Get-BaRelativePath $target $root
        if ($relativeTarget -match '^\.\./' -or [IO.Path]::IsPathRooted($relativeTarget)) { throw '--target must be inside --root.' }
    }
    $changes = New-Object 'System.Collections.Generic.List[string]'
    $output = Join-Path $root '.agent-artifacts/requirements/output'
    $kb = Join-Path $root '.agent-artifacts/project-knowledge-base'
    if ([IO.Directory]::Exists($output)) {
        $epics = @(Get-ChildItem -LiteralPath $output -Directory -Force | Where-Object { $_.Name -ne 'elicitation' -and -not $_.Name.StartsWith('.') } | Sort-Object Name)
        foreach ($epic in $epics) {
            $epicPath = Join-Path $epic.FullName 'epic.md'
            if (-not [IO.File]::Exists($epicPath)) { continue }
            $content = Read-BaText $epicPath
            foreach ($type in @(@('us-*.md', 'User Stories'), @('gui-*.md', 'GUI Specifications'), @('api-*.md', 'API Specifications'))) {
                $entries = @()
                foreach ($file in @(Get-ChildItem -LiteralPath $epic.FullName -Filter $type[0] -File | Sort-Object Name)) {
                    $info = Get-BaDocumentInfo $file.FullName
                    $entry = "* [$($info.title)]($($file.Name))"
                    if ($type[0] -eq 'us-*.md') {
                        if ($info.meta['external_key']) { $entry += ' `[' + $info.meta['external_key'] + ']`' }
                        $state = if ($info.meta['status']) { $info.meta['status'] } else { 'draft' }
                        $entry += " - *Status: $state*"
                    }
                    $entries += $entry
                }
                $content = Set-InventorySection $content $type[1] $entries
            }
            Set-SyncContent $epicPath $content
            foreach ($folder in @('wireframes', 'diagrams')) {
                $dir = Join-Path $epic.FullName $folder
                if (-not [IO.Directory]::Exists($dir)) { continue }
                $entries = @()
                foreach ($file in @(Get-ChildItem -LiteralPath $dir -File -Force | Where-Object { $_.Name -ne 'index.md' -and -not $_.Name.StartsWith('.') } | Sort-Object Name)) {
                    # Binary images are indexed by filename, never read as UTF-8 text.
                    $title = $file.BaseName
                    if ($file.Extension -in @('.md', '.txt', '.html', '.svg', '.drawio', '.bpmn')) { $title = (Get-BaDocumentInfo $file.FullName).title }
                    $entries += "* [$title]($($file.Name))"
                }
                if (-not $entries.Count) { $entries = @("* No $folder files created yet.") }
                $heading = [Globalization.CultureInfo]::InvariantCulture.TextInfo.ToTitleCase($folder)
                Set-SyncContent (Join-Path $dir 'index.md') ("# $heading - $($epic.Name)`n`n" + ($entries -join "`n") + "`n")
            }
        }
        $hierarchy = @()
        if ([IO.Directory]::Exists((Join-Path $output 'elicitation'))) { $hierarchy += '* [Elicitation](elicitation/) - Project-wide discovery notes & interview sessions.' }
        if ([IO.File]::Exists((Join-Path $output 'vision-scope.md'))) { $hierarchy += '* [Vision & Scope](vision-scope.md) - Overall product vision & boundary constraints.' }
        if ([IO.File]::Exists((Join-Path $output 'functional-decomposition.md'))) { $hierarchy += '* [Functional Decomposition](functional-decomposition.md) - Capability breakdown and story slices.' }
        foreach ($epic in $epics) {
            $path = Join-Path $epic.FullName 'epic.md'
            if ([IO.File]::Exists($path)) {
                $info = Get-BaDocumentInfo $path
                $description = if ($info.description) { $info.description } else { "Epic delivery package for $($info.title)." }
                $hierarchy += "* [$($info.title)]($($epic.Name)/epic.md) - $description"
            } else { $hierarchy += "* [$($epic.Name.Replace('-', ' '))]($($epic.Name)/)" }
        }
        $index = Join-Path $output 'index.md'
        $content = if ([IO.File]::Exists($index)) { Read-BaText $index } else { "# Requirements Output`n`nGenerated requirement hierarchy:`n" }
        $block = $hierarchy -join "`n"
        $pattern = '(?ms)(Generated requirement hierarchy:[ \t]*\n).*?(?=^Required hierarchy:|^##\s|\z)'
        if ($content -notmatch $pattern) { $content = $content.TrimEnd() + "`n`nGenerated requirement hierarchy:`n" }
        $content = [regex]::Replace($content, $pattern, [Text.RegularExpressions.MatchEvaluator]{ param($m) $m.Groups[1].Value + "`n$block`n`n" })
        Set-SyncContent $index $content
    }
    foreach ($name in @('solution-context', 'glossary', 'wiki')) {
        $base = Join-Path $kb $name
        if (-not [IO.Directory]::Exists($base)) { continue }
        $folders = @($base)
        $folders += @(Get-ChildItem -LiteralPath $base -Directory -Recurse | Where-Object { $_.Name -ne 'diagrams' -and -not $_.Name.StartsWith('.') } | Sort-Object FullName | ForEach-Object { $_.FullName })
        foreach ($folder in $folders) {
            $entries = @()
            foreach ($file in @(Get-ChildItem -LiteralPath $folder -Filter '*.md' -File | Where-Object { $_.Name -ne 'index.md' -and -not $_.Name.StartsWith('.') } | Sort-Object Name)) {
                $info = Get-BaDocumentInfo $file.FullName
                $entry = "* [$($info.title)]($($file.Name))"
                if ($info.description) { $entry += " - $($info.description)" }
                $entries += $entry
            }
            $index = Join-Path $folder 'index.md'
            $content = if ([IO.File]::Exists($index)) { Read-BaText $index } else { "# Knowledge Index`n`n## Pages`n" }
            if ($content -notmatch '(?m)^##\s+Pages[ \t]*$') { $content = $content.Replace('Add source-backed wiki pages here.', '').TrimEnd() + "`n`n## Pages`n" }
            $content = Set-InventorySection $content 'Pages' $entries
            Set-SyncContent $index $content
        }
    }
    if ($options['log-entry']) {
        $parts = $logParts
        $path = Join-Path $kb 'log.md'
        $content = if ([IO.File]::Exists($path)) { Read-BaText $path } else { "# Project Knowledge Base Update Log`n" }
        $date = (Get-Date).ToString('yyyy-MM-dd')
        $entry = '* **' + $parts[0].Trim() + '**: [' + $parts[1].Trim() + '] - ' + $parts[2].Trim()
        if ($content -match ('(?m)^## ' + $date + '\s*$')) {
            $pattern = '(?m)(^## ' + $date + '[ \t]*\n)'
            $regex = New-Object Text.RegularExpressions.Regex($pattern)
            $content = $regex.Replace($content, [Text.RegularExpressions.MatchEvaluator]{ param($m) $m.Value + "`n$entry`n" }, 1)
        } else {
            $regex = New-Object Text.RegularExpressions.Regex('(?m)(^#\s+Project Knowledge Base Update Log[ \t]*\n)')
            $content = $regex.Replace($content, [Text.RegularExpressions.MatchEvaluator]{ param($m) $m.Value + "`n## $date`n`n$entry`n" }, 1)
        }
        Set-SyncContent $path $content
    }
    if ($options.json) { Write-BaJson ([ordered]@{ workspace_root = $root; dry_run = [bool]$options['dry-run']; changes = @($changes.ToArray()) }) }
    else {
        [Console]::WriteLine("Index synchronization: $root | Dry run: $([bool]$options['dry-run'])")
        if ($changes.Count) { foreach ($change in $changes) { [Console]::WriteLine($change) } }
        else { [Console]::WriteLine('All indexes and inventories are already up to date. No changes needed.') }
    }
    exit 0
} catch { [Console]::Error.WriteLine($_.Exception.Message); exit 2 }
