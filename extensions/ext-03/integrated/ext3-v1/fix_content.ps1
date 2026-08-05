$f = 'content\content.js'
$all = [System.IO.File]::ReadAllLines($f, [System.Text.Encoding]::UTF8)
# Keep lines 0..1685 (0-indexed = file lines 1..1686) and 2051..end
$keep = $all[0..1685] + $all[2051..($all.Length - 1)]
[System.IO.File]::WriteAllLines($f, $keep, [System.Text.Encoding]::UTF8)
Write-Host "Done. Lines remaining: $($keep.Length)"
