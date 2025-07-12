#!/bin/bash

# 🌐 Script de Verificación de Dominio y CloudFlare
# Orta Novias - Production Domain Setup

echo "🌐 Verificación de Configuración de Dominio"
echo "=========================================="
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Función para verificaciones
check_dns() {
    local domain=$1
    local record_type=$2
    local expected=$3
    
    echo -n "Verificando $record_type para $domain... "
    
    if command -v dig >/dev/null 2>&1; then
        result=$(dig +short $record_type $domain | head -1)
    elif command -v nslookup >/dev/null 2>&1; then
        result=$(nslookup -type=$record_type $domain | grep -A1 "answer:" | tail -1 | awk '{print $NF}')
    else
        echo -e "${RED}❌ No se encontró dig ni nslookup${NC}"
        return 1
    fi
    
    if [[ "$result" == *"$expected"* ]] || [[ "$expected" == "any" ]]; then
        echo -e "${GREEN}✅ OK${NC} ($result)"
        return 0
    else
        echo -e "${RED}❌ FAIL${NC} (Expected: $expected, Got: $result)"
        return 1
    fi
}

check_ssl() {
    local domain=$1
    echo -n "Verificando SSL para $domain... "
    
    if command -v openssl >/dev/null 2>&1; then
        ssl_info=$(echo | openssl s_client -connect $domain:443 -servername $domain 2>/dev/null | openssl x509 -noout -subject 2>/dev/null)
        
        if [[ $? -eq 0 ]]; then
            echo -e "${GREEN}✅ SSL Válido${NC}"
            return 0
        else
            echo -e "${RED}❌ SSL Inválido${NC}"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠️ OpenSSL no disponible${NC}"
        return 2
    fi
}

check_http_status() {
    local url=$1
    echo -n "Verificando HTTP status para $url... "
    
    if command -v curl >/dev/null 2>&1; then
        status=$(curl -s -o /dev/null -w "%{http_code}" $url)
        
        if [[ "$status" == "200" ]] || [[ "$status" == "301" ]] || [[ "$status" == "302" ]]; then
            echo -e "${GREEN}✅ OK${NC} ($status)"
            return 0
        else
            echo -e "${RED}❌ FAIL${NC} ($status)"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠️ cURL no disponible${NC}"
        return 2
    fi
}

# Solicitar dominio
read -p "🌐 Ingresa tu dominio (ej: ortanovias.com): " DOMAIN

if [[ -z "$DOMAIN" ]]; then
    echo -e "${RED}❌ Dominio requerido${NC}"
    exit 1
fi

echo ""
echo "🔍 Verificando configuración para: $DOMAIN"
echo "============================================"

# 1. Verificar DNS básico
echo ""
echo "📡 VERIFICACIÓN DNS:"
check_dns $DOMAIN A any
check_dns "www.$DOMAIN" CNAME $DOMAIN

# 2. Verificar si está en CloudFlare
echo ""
echo "☁️ VERIFICACIÓN CLOUDFLARE:"
echo -n "Verificando nameservers CloudFlare... "

nameservers=$(dig +short NS $DOMAIN | head -2)
if echo "$nameservers" | grep -q "cloudflare"; then
    echo -e "${GREEN}✅ CloudFlare detectado${NC}"
    cloudflare_active=true
else
    echo -e "${YELLOW}⚠️ CloudFlare no detectado${NC}"
    cloudflare_active=false
fi

# 3. Verificar SSL
echo ""
echo "🔒 VERIFICACIÓN SSL:"
check_ssl $DOMAIN
check_ssl "www.$DOMAIN"

# 4. Verificar HTTP/HTTPS
echo ""
echo "🌐 VERIFICACIÓN WEB:"
check_http_status "http://$DOMAIN"
check_http_status "https://$DOMAIN"
check_http_status "https://www.$DOMAIN"

# 5. Verificar API si existe
echo ""
echo "🔧 VERIFICACIÓN API:"
check_http_status "https://api.$DOMAIN"
check_http_status "https://api.$DOMAIN/api/"

# 6. Verificar headers de CloudFlare
echo ""
echo "📊 VERIFICACIÓN HEADERS CLOUDFLARE:"
if command -v curl >/dev/null 2>&1; then
    echo -n "Verificando headers CF... "
    cf_ray=$(curl -s -I https://$DOMAIN | grep -i "cf-ray")
    cf_server=$(curl -s -I https://$DOMAIN | grep -i "server: cloudflare")
    
    if [[ -n "$cf_ray" ]] || [[ -n "$cf_server" ]]; then
        echo -e "${GREEN}✅ Headers CloudFlare detectados${NC}"
    else
        echo -e "${YELLOW}⚠️ Headers CloudFlare no detectados${NC}"
    fi
fi

# 7. Test de velocidad básico
echo ""
echo "⚡ TEST DE VELOCIDAD:"
if command -v curl >/dev/null 2>&1; then
    echo -n "Midiendo tiempo de respuesta... "
    response_time=$(curl -o /dev/null -s -w "%{time_total}" https://$DOMAIN)
    
    if (( $(echo "$response_time < 1.0" | bc -l) )); then
        echo -e "${GREEN}✅ Rápido${NC} (${response_time}s)"
    elif (( $(echo "$response_time < 3.0" | bc -l) )); then
        echo -e "${YELLOW}⚠️ Aceptable${NC} (${response_time}s)"
    else
        echo -e "${RED}❌ Lento${NC} (${response_time}s)"
    fi
fi

# 8. Verificar registros de email
echo ""
echo "📧 VERIFICACIÓN EMAIL:"
check_dns $DOMAIN MX any
check_dns $DOMAIN TXT "v=spf1"

# Resumen final
echo ""
echo "📋 RESUMEN:"
echo "==========="

if [[ $cloudflare_active == true ]]; then
    echo -e "☁️ CloudFlare: ${GREEN}✅ Activo${NC}"
else
    echo -e "☁️ CloudFlare: ${YELLOW}⚠️ No detectado${NC}"
fi

echo ""
echo "🔗 ENLACES ÚTILES:"
echo "- CloudFlare Dashboard: https://dash.cloudflare.com/"
echo "- SSL Test: https://www.ssllabs.com/ssltest/analyze.html?d=$DOMAIN"
echo "- DNS Checker: https://dnschecker.org/#A/$DOMAIN"
echo "- PageSpeed: https://pagespeed.web.dev/report?url=https://$DOMAIN"

echo ""
echo "✅ Verificación completada para $DOMAIN"

# Sugerencias
echo ""
echo "💡 PRÓXIMOS PASOS:"
if [[ $cloudflare_active == false ]]; then
    echo "1. Configurar CloudFlare si no está activo"
fi
echo "2. Verificar SSL score en SSLLabs"
echo "3. Optimizar velocidad si es necesario"
echo "4. Configurar monitoreo (UptimeRobot)"
echo "5. Setup Google Search Console"
