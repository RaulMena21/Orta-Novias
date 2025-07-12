#!/usr/bin/env pwsh

# 🔍 Script de Verificación de Dominio para Windows
# Orta Novias - Domain Verification

param(
    [Parameter(Mandatory=$true)]
    [string]$Domain
)

Write-Host "🔍 Verificando configuración para: $Domain" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Función para verificar DNS
function Test-DNS {
    param($Domain, $RecordType, $Expected = "any")
    
    Write-Host "Verificando $RecordType para $Domain... " -NoNewline
    
    try {
        if ($RecordType -eq "A") {
            $result = Resolve-DnsName -Name $Domain -Type A -ErrorAction SilentlyContinue
            if ($result) {
                Write-Host "✅ OK" -ForegroundColor Green -NoNewline
                Write-Host " ($($result.IPAddress))" -ForegroundColor White
                return $true
            }
        }
        elseif ($RecordType -eq "CNAME") {
            $result = Resolve-DnsName -Name "www.$Domain" -Type CNAME -ErrorAction SilentlyContinue
            if ($result) {
                Write-Host "✅ OK" -ForegroundColor Green -NoNewline
                Write-Host " ($($result.NameHost))" -ForegroundColor White
                return $true
            }
        }
        elseif ($RecordType -eq "NS") {
            $result = Resolve-DnsName -Name $Domain -Type NS -ErrorAction SilentlyContinue
            if ($result) {
                Write-Host "✅ OK" -ForegroundColor Green
                foreach ($ns in $result) {
                    Write-Host "   → $($ns.NameHost)" -ForegroundColor White
                }
                
                # Verificar si es CloudFlare
                $cfCheck = $result | Where-Object { $_.NameHost -like "*cloudflare*" }
                if ($cfCheck) {
                    Write-Host "   ☁️ CloudFlare detectado!" -ForegroundColor Cyan
                    return $true
                }
                return $true
            }
        }
        
        Write-Host "❌ No encontrado" -ForegroundColor Red
        return $false
    }
    catch {
        Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Función para verificar HTTP
function Test-HTTP {
    param($Url)
    
    Write-Host "Verificando $Url... " -NoNewline
    
    try {
        $response = Invoke-WebRequest -Uri $Url -Method Head -TimeoutSec 10 -ErrorAction SilentlyContinue
        $statusCode = $response.StatusCode
        
        if ($statusCode -eq 200 -or $statusCode -eq 301 -or $statusCode -eq 302) {
            Write-Host "✅ OK" -ForegroundColor Green -NoNewline
            Write-Host " ($statusCode)" -ForegroundColor White
            return $true
        }
        else {
            Write-Host "❌ $statusCode" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "❌ No accesible" -ForegroundColor Red
        return $false
    }
}

# Verificaciones principales
Write-Host "📡 VERIFICACIÓN DNS:" -ForegroundColor Blue
Write-Host "===================" -ForegroundColor Blue
Test-DNS -Domain $Domain -RecordType "A"
Test-DNS -Domain $Domain -RecordType "CNAME" 
Test-DNS -Domain $Domain -RecordType "NS"

Write-Host ""
Write-Host "🌐 VERIFICACIÓN WEB:" -ForegroundColor Blue
Write-Host "===================" -ForegroundColor Blue
Test-HTTP -Url "http://$Domain"
Test-HTTP -Url "https://$Domain"
Test-HTTP -Url "https://www.$Domain"

Write-Host ""
Write-Host "🔒 VERIFICACIÓN SSL:" -ForegroundColor Blue
Write-Host "===================" -ForegroundColor Blue

# Test SSL básico con PowerShell
try {
    $tcpClient = New-Object System.Net.Sockets.TcpClient
    $tcpClient.Connect($Domain, 443)
    $sslStream = New-Object System.Net.Security.SslStream($tcpClient.GetStream())
    $sslStream.AuthenticateAsClient($Domain)
    
    Write-Host "Verificando SSL para $Domain... " -NoNewline
    if ($sslStream.IsAuthenticated) {
        Write-Host "✅ SSL Válido" -ForegroundColor Green
        Write-Host "   → Protocolo: $($sslStream.SslProtocol)" -ForegroundColor White
        Write-Host "   → Cifrado: $($sslStream.CipherAlgorithm)" -ForegroundColor White
    }
    
    $sslStream.Close()
    $tcpClient.Close()
}
catch {
    Write-Host "Verificando SSL para $Domain... " -NoNewline
    Write-Host "❌ SSL no disponible" -ForegroundColor Red
}

Write-Host ""
Write-Host "📊 RESUMEN:" -ForegroundColor Cyan
Write-Host "===========" -ForegroundColor Cyan

# Determinar siguiente paso
$nsResult = Resolve-DnsName -Name $Domain -Type NS -ErrorAction SilentlyContinue
if ($nsResult) {
    $cfCheck = $nsResult | Where-Object { $_.NameHost -like "*cloudflare*" }
    if ($cfCheck) {
        Write-Host "✅ CloudFlare: Activo" -ForegroundColor Green
        Write-Host "🎯 Siguiente paso: Configurar registros DNS en CloudFlare" -ForegroundColor Cyan
    }
    else {
        Write-Host "⚠️ CloudFlare: No detectado" -ForegroundColor Yellow
        Write-Host "🎯 Siguiente paso: Cambiar nameservers a CloudFlare" -ForegroundColor Cyan
    }
}

Write-Host ""
Write-Host "🔗 ENLACES ÚTILES:" -ForegroundColor Blue
Write-Host "→ CloudFlare Dashboard: https://dash.cloudflare.com/" -ForegroundColor White
Write-Host "→ SSL Test: https://www.ssllabs.com/ssltest/analyze.html?d=$Domain" -ForegroundColor White
Write-Host "→ DNS Checker: https://dnschecker.org/#A/$Domain" -ForegroundColor White

Write-Host ""
Write-Host "✅ Verificación completada para $Domain" -ForegroundColor Green
