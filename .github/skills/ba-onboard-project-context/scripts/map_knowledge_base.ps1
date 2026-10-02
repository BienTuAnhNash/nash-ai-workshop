# Map authoritative Markdown/text documents to progressive knowledge stubs.
. (Join-Path $PSScriptRoot '../../../.github/hooks/ba-common.ps1')
try {
    $options = Read-BaArguments $args -Values @('root', 'source') -Switches @('dry-run', 'json')
    if ($options.help) { [Console]::WriteLine('map_knowledge_base.ps1 --source PATH [--root PATH] [--dry-run] [--json]'); exit 0 }
    if (-not $options.source) { throw '--source is required.' }
    $root = Get-BaRoot $options.root
    $source = Resolve-BaPath $options.source $root
    if (-not (Test-Path -LiteralPath $source)) { throw "Source path does not exist: $source" }
    if ([IO.File]::Exists($source)) {
        if ([IO.Path]::GetExtension($source).ToLowerInvariant() -notin @('.md', '.txt')) { throw 'Only Markdown and text sources are supported.' }
        $files = @(Get-Item -LiteralPath $source)
    } else { $files = @(Get-BaFiles $source -Extensions @('.md', '.txt') -Ignore @('node_modules', 'dist', 'build') -SkipHidden | Sort-Object FullName) }
    $wiki = Join-Path $root '.agent-artifacts/project-knowledge-base/wiki'
    $reserved = @{}; $items = New-Object 'System.Collections.Generic.List[object]'
    $timestamp = [DateTime]::UtcNow.ToString('yyyy-MM-ddTHH:mm:ssZ')
    foreach ($file in $files) {
        try {
            # Never recursively ingest generated stubs or replace hand-authored knowledge.
            $relative = Get-BaRelativePath $file.FullName $root
            $wikiRelative = Get-BaRelativePath $file.FullName $wiki
            if ($wikiRelative -notmatch '^\.\./' -and -not [IO.Path]::IsPathRooted($wikiRelative)) { continue }
            $info = Get-BaDocumentInfo $file.FullName
            # The mapper uses the first H1 as the source title, as the original utility did.
            $sourceHeading = [regex]::Match($info.body, '^#\s+(.+)$', 'Multiline')
            $title = if ($sourceHeading.Success) { $sourceHeading.Groups[1].Value.Trim() } else { $info.title }
            $slug = [regex]::Replace($title.ToLowerInvariant(), '[^\w\s-]', '').Trim()
            $slug = [regex]::Replace($slug, '[-\s]+', '-')
            if ($slug.Length -gt 50) { $slug = $slug.Substring(0, 50) }
            if (-not $slug) { $slug = 'untitled' }
            $candidate = $slug; $suffix = 1
            while ($true) {
                $target = Join-Path $wiki ($candidate + '.md')
                if ($reserved.ContainsKey($target)) { $sameSource = $reserved[$target] -ceq $relative }
                elseif ([IO.File]::Exists($target)) {
                    $existing = (ConvertFrom-BaFrontmatter (Read-BaText $target)).meta
                    $sameSource = $existing['source_type'] -eq 'external-mapped' -and $existing['source_path'] -ceq $relative
                } else { break }
                if ($sameSource) { break }
                $suffix++; $candidate = "$slug-$suffix"
            }
            $reserved[$target] = $relative
            $headings = @([regex]::Matches($info.body, '^#{1,4}\s+(.+)$', 'Multiline') | Select-Object -First 10 | ForEach-Object { '- ' + $_.Groups[1].Value.Trim() })
            if (-not $headings.Count) { $headings = @('- Document Body') }
            $paragraph = New-Object 'System.Collections.Generic.List[string]'
            foreach ($line in ($info.body -split "`n")) {
                $line = $line.Trim()
                if ($line.StartsWith('#')) { if ($paragraph.Count) { break }; continue }
                if ($line) { $paragraph.Add($line); if ($paragraph.Count -ge 3) { break } }
                elseif ($paragraph.Count) { break }
            }
            $summary = $paragraph -join ' '
            if (-not $summary) { $summary = 'No executive summary available in source document.' }
            if ($summary.Length -gt 400) { $summary = $summary.Substring(0, 397) + '...' }
            $quotedTitle = ConvertTo-Json -InputObject $title -Compress
            $quotedSource = ConvertTo-Json -InputObject $relative -Compress
            $sourceUri = ([Uri]$file.FullName).AbsoluteUri
            $stub = @"
---
id: KB-$candidate
title: $quotedTitle
source_type: external-mapped
source_path: $quotedSource
last_synced: "$timestamp"
status: active
tags:
  - imported-knowledge
  - external-reference
---

# $title

> [!NOTE]
> **Hybrid Progressive Knowledge Stub**: This article is mapped from existing project documentation.
> - **Source File**: [$relative]($sourceUri)
> - **Last Synced**: ``$timestamp``

## Executive Summary

$summary

## Key Topics & Structure

$($headings -join "`n")

## Retrieval Guidance

- To inspect the complete document content, open the authoritative source: ``$relative``.
- When referencing rules or context from this document, cite ``$relative`` in deliverable frontmatter.
"@ + "`n"
            if (-not $options['dry-run']) { [void](Write-BaText $target $stub) }
            $items.Add([ordered]@{ source = $relative; title = $title; stub_path = Get-BaRelativePath $target $root; status = if ($options['dry-run']) { 'dry-run' } else { 'created' } })
        } catch { $items.Add(@{ source = $file.FullName; status = "error: $($_.Exception.Message)" }) }
    }
    $index = Join-Path $wiki 'index.md'
    $indexContent = if ([IO.File]::Exists($index)) { Read-BaText $index } else { "# Wiki Knowledge Index`n" }
    $entries = @()
    foreach ($item in $items) {
        if ($item.status -notin @('created', 'dry-run')) { continue }
        $name = [IO.Path]::GetFileName($item.stub_path)
        if (-not $indexContent.Contains("]($name)")) {
            $entries += "- [$($item.title)]($name) - *Mapped from ``$($item.source)``*"
        }
    }
    if ($entries.Count -and -not $options['dry-run']) {
        if (-not $indexContent.Contains('## External Mapped Knowledge')) { $indexContent = $indexContent.TrimEnd() + "`n`n## External Mapped Knowledge`n" }
        [void](Write-BaText $index ($indexContent.TrimEnd() + "`n" + ($entries -join "`n") + "`n"))
    }
    if ($options.json) { Write-BaJson ([ordered]@{ mapped_count = $items.Count; items = @($items.ToArray()) }) }
    else {
        [Console]::WriteLine("Knowledge mapping: $source | Target: $wiki | Articles: $($items.Count)")
        foreach ($item in $items) { [Console]::WriteLine("[$($item.status)] $($item.source) -> $($item.stub_path)") }
    }
    if (@($items | Where-Object { $_.status -like 'error:*' }).Count) { exit 1 }
    exit 0
} catch { [Console]::Error.WriteLine($_.Exception.Message); exit 2 }
