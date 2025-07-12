#!/usr/bin/env pwsh

# 🌐 Script de Configuración Post-Compra de Dominio
# Orta Novias - CloudFlare Setup

param(
    [Parameter(Mandatory=$true)]
    [string]$Domain,
    
    [Parameter(Mandatory=$false)]
    [string]$Registrar = "unknown"
)

Write-Host "🌐 Configuración de CloudFlare para: $Domain" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Colores
$Green = "Green"
$Red = "Red" 
$Yellow = "Yellow"
$Blue = "Blue"
$Cyan = "Cyan"

Write-Host "📋 PASOS A SEGUIR:" -ForegroundColor $Blue
Write-Host ""

Write-Host "1. 🏗️ CREAR CUENTA CLOUDFLARE" -ForegroundColor $Green
Write-Host "   → Ve a: https://cloudflare.com/sign-up" -ForegroundColor White
Write-Host "   → Email: tu email principal" -ForegroundColor White
Write-Host "   → Plan: FREE (por ahora)" -ForegroundColor White
Write-Host ""

Write-Host "2. 🌐 AÑADIR SITIO A CLOUDFLARE" -ForegroundColor $Green
Write-Host "   → Add Site: $Domain" -ForegroundColor White
Write-Host "   → Scan DNS records" -ForegroundColor White
Write-Host "   → Select FREE plan" -ForegroundColor White
Write-Host ""

Write-Host "3. 📡 CAMBIAR NAMESERVERS" -ForegroundColor $Green
Write-Host "   → CloudFlare te dará 2 nameservers" -ForegroundColor White
Write-Host "   → Ejemplo: brad.ns.cloudflare.com" -ForegroundColor White
Write-Host "   → Ejemplo: luna.ns.cloudflare.com" -ForegroundColor White
Write-Host ""

if ($Registrar -eq "namecheap") {
    Write-Host "   💡 PARA NAMECHEAP:" -ForegroundColor $Yellow
    Write-Host "   → Domain List → Manage → Nameservers" -ForegroundColor White
    Write-Host "   → Custom DNS → Pegar los 2 nameservers" -ForegroundColor White
}
elseif ($Registrar -eq "godaddy") {
    Write-Host "   💡 PARA GODADDY:" -ForegroundColor $Yellow
    Write-Host "   → My Products → DNS → Nameservers" -ForegroundColor White
    Write-Host "   → Change → Custom → Pegar nameservers" -ForegroundColor White
}
else {
    Write-Host "   💡 EN TU REGISTRADOR:" -ForegroundColor $Yellow
    Write-Host "   → Buscar 'Nameservers' o 'DNS'" -ForegroundColor White
    Write-Host "   → Cambiar a 'Custom' y pegar los de CloudFlare" -ForegroundColor White
}

Write-Host ""
Write-Host "4. ⏰ ESPERAR PROPAGACIÓN" -ForegroundColor $Green
Write-Host "   → DNS tarda 24-48 horas en propagar" -ForegroundColor White
Write-Host "   → Puedes verificar con: nslookup $Domain" -ForegroundColor White
Write-Host ""

Write-Host "5. 🔧 CONFIGURAR DNS EN CLOUDFLARE" -ForegroundColor $Green
Write-Host "   → Añadir registros A y CNAME" -ForegroundColor White
Write-Host "   → Activar 'Proxied' (nube naranja)" -ForegroundColor White
Write-Host ""

Write-Host "⚡ MIENTRAS TANTO, PUEDES:" -ForegroundColor $Cyan
Write-Host "✅ Configurar cuentas de marketing" -ForegroundColor $Green
Write-Host "✅ Preparar servidor para producción" -ForegroundColor $Green
Write-Host "✅ Configurar variables de entorno" -ForegroundColor $Green
Write-Host ""

Write-Host "🔗 ENLACES ÚTILES:" -ForegroundColor $Blue
Write-Host "→ CloudFlare: https://cloudflare.com/" -ForegroundColor White
Write-Host "→ DNS Checker: https://dnschecker.org/" -ForegroundColor White
Write-Host "→ SSL Test: https://www.ssllabs.com/ssltest/" -ForegroundColor White
Write-Host ""

Write-Host "📞 ¿Necesitas ayuda? Ejecuta:" -ForegroundColor $Cyan
Write-Host "   ./scripts/verify-domain.ps1 -Domain $Domain" -ForegroundColor White
Write-Host ""

Write-Host "🎯 SIGUIENTE PASO:" -ForegroundColor $Green
Write-Host "   Ve a CloudFlare y añade tu dominio $Domain" -ForegroundColor White
