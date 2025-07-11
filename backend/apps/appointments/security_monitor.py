"""
Servicio de monitoreo de seguridad para detectar y responder a actividad sospechosa
"""
import logging
from datetime import datetime, timedelta
from typing import Dict, List
from django.core.cache import cache
from django.core.mail import mail_admins
from django.conf import settings
from collections import defaultdict

logger = logging.getLogger(__name__)

class SecurityMonitor:
    """
    Monitor de seguridad para detectar patrones sospechosos
    """
    
    # Umbrales de alerta
    SUSPICIOUS_THRESHOLDS = {
        'failed_validations_per_ip': 10,  # 10 validaciones fallidas por IP en 1 hora
        'rapid_requests_per_ip': 50,      # 50 requests por IP en 5 minutos
        'suspicious_patterns_per_ip': 5,  # 5 patrones sospechosos por IP en 1 hora
        'blocked_emails_per_ip': 3,       # 3 emails bloqueados por IP en 1 hora
    }
    
    @classmethod
    def log_failed_validation(cls, ip: str, validation_type: str, error_details: str):
        """
        Registrar validación fallida y verificar si es sospechoso
        """
        cache_key = f"failed_validations:{ip}"
        failures = cache.get(cache_key, [])
        
        # Agregar nueva falla
        failure_data = {
            'timestamp': datetime.now().isoformat(),
            'type': validation_type,
            'details': error_details
        }
        failures.append(failure_data)
        
        # Mantener solo las últimas horas
        one_hour_ago = datetime.now() - timedelta(hours=1)
        failures = [
            f for f in failures 
            if datetime.fromisoformat(f['timestamp']) > one_hour_ago
        ]
        
        cache.set(cache_key, failures, 3600)  # 1 hora
        
        # Verificar si excede el umbral
        if len(failures) >= cls.SUSPICIOUS_THRESHOLDS['failed_validations_per_ip']:
            cls._alert_suspicious_activity(
                'excessive_failed_validations',
                ip,
                f"IP {ip} ha tenido {len(failures)} validaciones fallidas en la última hora"
            )
        
        logger.warning(f"Validation failed for IP {ip}: {validation_type} - {error_details}")
    
    @classmethod
    def log_suspicious_pattern(cls, ip: str, pattern: str, request_data: str):
        """
        Registrar patrón sospechoso detectado
        """
        cache_key = f"suspicious_patterns:{ip}"
        patterns = cache.get(cache_key, [])
        
        pattern_data = {
            'timestamp': datetime.now().isoformat(),
            'pattern': pattern,
            'request_data': request_data[:200]  # Limitar datos para logs
        }
        patterns.append(pattern_data)
        
        # Mantener solo la última hora
        one_hour_ago = datetime.now() - timedelta(hours=1)
        patterns = [
            p for p in patterns 
            if datetime.fromisoformat(p['timestamp']) > one_hour_ago
        ]
        
        cache.set(cache_key, patterns, 3600)
        
        # Alerta inmediata para patrones críticos
        critical_patterns = ['union select', 'drop table', 'script>', '../']
        if any(crit in pattern.lower() for crit in critical_patterns):
            cls._alert_critical_security_event(ip, pattern, request_data)
        
        # Verificar umbral general
        if len(patterns) >= cls.SUSPICIOUS_THRESHOLDS['suspicious_patterns_per_ip']:
            cls._alert_suspicious_activity(
                'excessive_suspicious_patterns',
                ip,
                f"IP {ip} ha generado {len(patterns)} patrones sospechosos en la última hora"
            )
    
    @classmethod
    def log_blocked_email(cls, ip: str, email: str, reason: str):
        """
        Registrar email bloqueado
        """
        cache_key = f"blocked_emails:{ip}"
        blocked = cache.get(cache_key, [])
        
        blocked_data = {
            'timestamp': datetime.now().isoformat(),
            'email': email,
            'reason': reason
        }
        blocked.append(blocked_data)
        
        # Mantener solo la última hora
        one_hour_ago = datetime.now() - timedelta(hours=1)
        blocked = [
            b for b in blocked 
            if datetime.fromisoformat(b['timestamp']) > one_hour_ago
        ]
        
        cache.set(cache_key, blocked, 3600)
        
        if len(blocked) >= cls.SUSPICIOUS_THRESHOLDS['blocked_emails_per_ip']:
            cls._alert_suspicious_activity(
                'excessive_blocked_emails',
                ip,
                f"IP {ip} ha intentado usar {len(blocked)} emails bloqueados en la última hora"
            )
    
    @classmethod
    def get_ip_reputation(cls, ip: str) -> Dict:
        """
        Obtener reputación de una IP
        """
        reputation = {
            'risk_level': 'low',
            'failed_validations': 0,
            'suspicious_patterns': 0,
            'blocked_emails': 0,
            'last_activity': None
        }
        
        # Obtener datos de cache
        failed_validations = cache.get(f"failed_validations:{ip}", [])
        suspicious_patterns = cache.get(f"suspicious_patterns:{ip}", [])
        blocked_emails = cache.get(f"blocked_emails:{ip}", [])
        
        reputation['failed_validations'] = len(failed_validations)
        reputation['suspicious_patterns'] = len(suspicious_patterns)
        reputation['blocked_emails'] = len(blocked_emails)
        
        # Calcular nivel de riesgo
        total_score = (
            len(failed_validations) * 1 +
            len(suspicious_patterns) * 3 +
            len(blocked_emails) * 2
        )
        
        if total_score >= 20:
            reputation['risk_level'] = 'high'
        elif total_score >= 10:
            reputation['risk_level'] = 'medium'
        
        # Última actividad
        all_events = failed_validations + suspicious_patterns + blocked_emails
        if all_events:
            latest = max(all_events, key=lambda x: x['timestamp'])
            reputation['last_activity'] = latest['timestamp']
        
        return reputation
    
    @classmethod
    def is_ip_blocked(cls, ip: str) -> bool:
        """
        Verificar si una IP debe ser bloqueada
        """
        reputation = cls.get_ip_reputation(ip)
        
        # Bloquear IPs de alto riesgo
        if reputation['risk_level'] == 'high':
            return True
        
        # Bloquear si hay demasiados patrones sospechosos recientes
        if reputation['suspicious_patterns'] >= 5:
            return True
        
        return False
    
    @classmethod
    def _alert_suspicious_activity(cls, alert_type: str, ip: str, message: str):
        """
        Enviar alerta de actividad sospechosa
        """
        logger.critical(f"SECURITY ALERT [{alert_type}]: {message}")
        
        # En producción, enviar email a administradores
        if not settings.DEBUG:
            try:
                mail_admins(
                    subject=f"Alerta de Seguridad - {alert_type}",
                    message=f"""
                    Se ha detectado actividad sospechosa:
                    
                    Tipo: {alert_type}
                    IP: {ip}
                    Mensaje: {message}
                    Tiempo: {datetime.now()}
                    
                    Por favor, revisa los logs para más detalles.
                    """,
                    fail_silently=True
                )
            except Exception as e:
                logger.error(f"Failed to send security alert email: {e}")
    
    @classmethod
    def _alert_critical_security_event(cls, ip: str, pattern: str, request_data: str):
        """
        Alerta inmediata para eventos críticos de seguridad
        """
        message = f"CRITICAL: Potential attack from IP {ip} - Pattern: {pattern}"
        logger.critical(message)
        
        # Registrar en cache para análisis posterior
        cache_key = f"critical_events:{ip}"
        events = cache.get(cache_key, [])
        events.append({
            'timestamp': datetime.now().isoformat(),
            'pattern': pattern,
            'request_data': request_data[:500]
        })
        cache.set(cache_key, events, 86400)  # 24 horas
        
        # En producción, enviar alerta inmediata
        if not settings.DEBUG:
            try:
                mail_admins(
                    subject="🚨 ALERTA CRÍTICA DE SEGURIDAD",
                    message=f"""
                    POSIBLE ATAQUE DETECTADO
                    
                    IP: {ip}
                    Patrón detectado: {pattern}
                    Datos de request: {request_data[:200]}...
                    Tiempo: {datetime.now()}
                    
                    ⚠️ REVISAR INMEDIATAMENTE ⚠️
                    """,
                    fail_silently=True
                )
            except Exception as e:
                logger.error(f"Failed to send critical security alert: {e}")

class SecurityReporter:
    """
    Generador de reportes de seguridad
    """
    
    @classmethod
    def generate_security_summary(cls, hours: int = 24) -> Dict:
        """
        Generar resumen de seguridad para las últimas X horas
        """
        # Este sería un método más complejo que analiza todos los logs
        # Por ahora, retornamos un resumen básico
        
        summary = {
            'period_hours': hours,
            'timestamp': datetime.now().isoformat(),
            'total_alerts': 0,
            'blocked_ips': [],
            'top_suspicious_patterns': [],
            'recommendations': []
        }
        
        # En una implementación completa, aquí analizaríamos
        # todos los datos de cache y logs para generar estadísticas
        
        return summary
