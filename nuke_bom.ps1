# Script para ELIMINAR el BOM (Byte Order Mark) de todos los archivos Java
# Usa System.Text.UTF8Encoding($false) para asegurar que NO se escribe firma.

$files = Get-ChildItem -Path "src" -Filter "*.java" -Recurse

if ($files.Count -eq 0) {
    Write-Host "¡No encuentro archivos .java en la carpeta src! ¿Estás en la carpeta correcta?" -ForegroundColor Red
    exit
}

$Utf8NoBom = New-Object System.Text.UTF8Encoding($false)

foreach ($file in $files) {
    # Leer el contenido tal cual está
    $content = [System.IO.File]::ReadAllText($file.FullName)
    
    # Sobrescribir el archivo forzando UTF-8 SIN BOM
    [System.IO.File]::WriteAllText($file.FullName, $content, $Utf8NoBom)
    
    Write-Host "Limpiado: $($file.Name)" -ForegroundColor Green
}

Write-Host "✅ ¡Limpieza completada! Todos los archivos están ahora en UTF-8 puro." -ForegroundColor Cyan