#!/usr/bin/env python
"""
Script para configurar Cloudflare WAF automáticamente
Configura reglas de seguridad específicas para Orta Novias
"""
import requests
import json
import os
from decouple import config

class CloudflareWAFConfigurator:
    """Configurador automático de Cloudflare WAF"""
    
    def __init__(self):
        self.api_token = config('CLOUDFLARE_API_TOKEN', default='')
        self.zone_id = config('CLOUDFLARE_ZONE_ID', default='')
        self.email = config('CLOUDFLARE_EMAIL', default='')
        
        if not self.api_token or not self.zone_id:
            raise ValueError("CLOUDFLARE_API_TOKEN y CLOUDFLARE_ZONE_ID son requeridos")
        
        self.headers = {
            'Authorization': f'Bearer {self.api_token}',
            'Content-Type': 'application/json'
        }
        
        self.base_url = 'https://api.cloudflare.com/client/v4'
    
    def create_waf_rules(self):
        """Crear reglas específicas de WAF para Orta Novias"""
        
        rules = [
            {
                'name': 'Block SQL Injection Attempts',
                'expression': '(http.request.uri.query contains "union select") or (http.request.uri.query contains "drop table") or (http.request.body contains "union select")',
                'action': 'block',
                'description': 'Bloquear intentos de inyección SQL'
            },
            {
                'name': 'Block XSS Attempts',
                'expression': '(http.request.uri.query contains "<script") or (http.request.body contains "<script") or (http.request.uri.query contains "javascript:")',
                'action': 'block',
                'description': 'Bloquear intentos de XSS'
            },
            {
                'name': 'Rate Limit API Endpoints',
                'expression': '(http.request.uri.path matches "^/api/")',
                'action': 'challenge',
                'description': 'Rate limiting para endpoints de API'
            },
            {
                'name': 'Block Admin Access from Outside Spain',
                'expression': '(http.request.uri.path matches "^/admin/") and (ip.geoip.country ne "ES")',
                'action': 'block',
                'description': 'Bloquear acceso a admin desde fuera de España'
            },
            {
                'name': 'Challenge Suspicious User Agents',
                'expression': '(http.user_agent contains "sqlmap") or (http.user_agent contains "nikto") or (http.user_agent contains "nmap")',
                'action': 'challenge',
                'description': 'Challenge a user agents sospechosos'
            },
            {
                'name': 'Block File Upload Attacks',
                'expression': '(http.request.uri.query contains "../") or (http.request.body contains "../") or (http.request.uri.path contains ".php")',
                'action': 'block',
                'description': 'Bloquear intentos de directory traversal y uploads maliciosos'
            }
        ]
        
        created_rules = []
        for rule in rules:
            try:
                created_rule = self._create_firewall_rule(rule)
                if created_rule:
                    created_rules.append(created_rule)
                    print(f"✅ Regla creada: {rule['name']}")
                else:
                    print(f"❌ Error creando regla: {rule['name']}")
            except Exception as e:
                print(f"❌ Error creando regla {rule['name']}: {e}")
        
        return created_rules
    
    def _create_firewall_rule(self, rule):
        """Crear una regla individual de firewall"""
        url = f"{self.base_url}/zones/{self.zone_id}/firewall/rules"
        
        payload = {
            'filter': {
                'expression': rule['expression'],
                'description': rule['description']
            },
            'action': rule['action'],
            'description': rule['name']
        }
        
        response = requests.post(url, headers=self.headers, json=payload)
        
        if response.status_code == 200:
            return response.json()['result']
        else:
            print(f"Error: {response.status_code} - {response.text}")
            return None
    
    def configure_security_settings(self):
        """Configurar ajustes generales de seguridad"""
        
        settings = [
            {'id': 'security_level', 'value': 'high'},
            {'id': 'ssl', 'value': 'strict'},
            {'id': 'min_tls_version', 'value': '1.2'},
            {'id': 'browser_integrity_check', 'value': 'on'},
            {'id': 'challenge_ttl', 'value': 1800},  # 30 minutos
            {'id': 'always_use_https', 'value': 'on'},
            {'id': 'automatic_https_rewrites', 'value': 'on'},
        ]
        
        for setting in settings:
            try:
                result = self._update_zone_setting(setting['id'], setting['value'])
                if result:
                    print(f"✅ Configuración actualizada: {setting['id']} = {setting['value']}")
                else:
                    print(f"❌ Error actualizando: {setting['id']}")
            except Exception as e:
                print(f"❌ Error configurando {setting['id']}: {e}")
    
    def _update_zone_setting(self, setting_id, value):
        """Actualizar una configuración específica de la zona"""
        url = f"{self.base_url}/zones/{self.zone_id}/settings/{setting_id}"
        
        payload = {'value': value}
        response = requests.patch(url, headers=self.headers, json=payload)
        
        if response.status_code == 200:
            return response.json()['result']
        else:
            print(f"Error updating {setting_id}: {response.status_code} - {response.text}")
            return None
    
    def create_rate_limiting_rules(self):
        """Crear reglas de rate limiting específicas"""
        
        rate_limits = [
            {
                'name': 'API Login Rate Limit',
                'match': {
                    'request': {
                        'methods': ['POST'],
                        'url': '*/api/token/*'
                    }
                },
                'threshold': 5,
                'period': 300,  # 5 minutos
                'action': {
                    'mode': 'ban',
                    'timeout': 900  # 15 minutos
                }
            },
            {
                'name': 'General API Rate Limit',
                'match': {
                    'request': {
                        'methods': ['GET', 'POST', 'PUT', 'DELETE'],
                        'url': '*/api/*'
                    }
                },
                'threshold': 100,
                'period': 300,  # 5 minutos
                'action': {
                    'mode': 'challenge',
                    'timeout': 300
                }
            },
            {
                'name': 'Contact Form Rate Limit',
                'match': {
                    'request': {
                        'methods': ['POST'],
                        'url': '*/api/appointments/*'
                    }
                },
                'threshold': 3,
                'period': 600,  # 10 minutos
                'action': {
                    'mode': 'ban',
                    'timeout': 1800  # 30 minutos
                }
            }
        ]
        
        for limit in rate_limits:
            try:
                result = self._create_rate_limit(limit)
                if result:
                    print(f"✅ Rate limit creado: {limit['name']}")
                else:
                    print(f"❌ Error creando rate limit: {limit['name']}")
            except Exception as e:
                print(f"❌ Error creando rate limit {limit['name']}: {e}")
    
    def _create_rate_limit(self, limit):
        """Crear una regla de rate limiting"""
        url = f"{self.base_url}/zones/{self.zone_id}/rate_limits"
        
        response = requests.post(url, headers=self.headers, json=limit)
        
        if response.status_code == 200:
            return response.json()['result']
        else:
            print(f"Error: {response.status_code} - {response.text}")
            return None
    
    def setup_page_rules(self):
        """Configurar reglas de página para optimización"""
        
        page_rules = [
            {
                'targets': [{'target': 'url', 'constraint': {'operator': 'matches', 'value': '*/static/*'}}],
                'actions': [
                    {'id': 'cache_level', 'value': 'cache_everything'},
                    {'id': 'edge_cache_ttl', 'value': 31536000},  # 1 año
                    {'id': 'browser_cache_ttl', 'value': 31536000}
                ]
            },
            {
                'targets': [{'target': 'url', 'constraint': {'operator': 'matches', 'value': '*/media/*'}}],
                'actions': [
                    {'id': 'cache_level', 'value': 'cache_everything'},
                    {'id': 'edge_cache_ttl', 'value': 7776000},  # 3 meses
                    {'id': 'browser_cache_ttl', 'value': 7776000}
                ]
            },
            {
                'targets': [{'target': 'url', 'constraint': {'operator': 'matches', 'value': '*/api/*'}}],
                'actions': [
                    {'id': 'cache_level', 'value': 'bypass'},
                    {'id': 'security_level', 'value': 'high'}
                ]
            }
        ]
        
        for rule in page_rules:
            try:
                result = self._create_page_rule(rule)
                if result:
                    print(f"✅ Page rule creada para: {rule['targets'][0]['constraint']['value']}")
                else:
                    print(f"❌ Error creando page rule")
            except Exception as e:
                print(f"❌ Error creando page rule: {e}")
    
    def _create_page_rule(self, rule):
        """Crear una regla de página"""
        url = f"{self.base_url}/zones/{self.zone_id}/pagerules"
        
        response = requests.post(url, headers=self.headers, json=rule)
        
        if response.status_code == 200:
            return response.json()['result']
        else:
            print(f"Error: {response.status_code} - {response.text}")
            return None

def main():
    """Función principal"""
    print("🛡️  CONFIGURADOR DE CLOUDFLARE WAF - ORTA NOVIAS")
    print("=" * 60)
    
    try:
        configurator = CloudflareWAFConfigurator()
        
        print("\n1. Configurando ajustes de seguridad generales...")
        configurator.configure_security_settings()
        
        print("\n2. Creando reglas de WAF...")
        configurator.create_waf_rules()
        
        print("\n3. Configurando rate limiting...")
        configurator.create_rate_limiting_rules()
        
        print("\n4. Configurando reglas de página...")
        configurator.setup_page_rules()
        
        print("\n✅ ¡Configuración de Cloudflare WAF completada!")
        print("\n💡 PRÓXIMOS PASOS:")
        print("  • Verifica las reglas en el dashboard de Cloudflare")
        print("  • Prueba el sitio para asegurar que funciona correctamente")
        print("  • Monitorea los logs de Cloudflare para ajustar reglas")
        print("  • Configura notificaciones de seguridad")
        
    except Exception as e:
        print(f"❌ Error durante la configuración: {e}")
        return 1
    
    return 0

if __name__ == '__main__':
    exit(main())
