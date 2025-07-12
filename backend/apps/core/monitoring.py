"""
Sistema de monitoreo y alertas para Orta Novias
"""
import psutil
try:
    import redis
    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False
import requests
from django.core.cache import cache
from django.db import connection
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_exempt
try:
    from celery import current_app
    from celery.app.control import Inspect
    CELERY_AVAILABLE = True
except ImportError:
    CELERY_AVAILABLE = False
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

class SystemMonitor:
    """Monitor del sistema para métricas de salud"""
    
    @staticmethod
    def get_system_metrics():
        """Obtener métricas del sistema"""
        try:
            # CPU y Memoria
            cpu_percent = psutil.cpu_percent(interval=1)
            memory = psutil.virtual_memory()
            disk = psutil.disk_usage('/')
            
            # Red
            network = psutil.net_io_counters()
            
            return {
                'cpu': {
                    'percent': cpu_percent,
                    'count': psutil.cpu_count()
                },
                'memory': {
                    'total': memory.total,
                    'available': memory.available,
                    'percent': memory.percent,
                    'used': memory.used
                },
                'disk': {
                    'total': disk.total,
                    'used': disk.used,
                    'free': disk.free,
                    'percent': (disk.used / disk.total) * 100
                },
                'network': {
                    'bytes_sent': network.bytes_sent,
                    'bytes_recv': network.bytes_recv,
                    'packets_sent': network.packets_sent,
                    'packets_recv': network.packets_recv
                }
            }
        except Exception as e:
            logger.error(f"Error obteniendo métricas del sistema: {e}")
            return None
    
    @staticmethod
    def check_database_health():
        """Verificar salud de la base de datos"""
        try:
            with connection.cursor() as cursor:
                # Test de conexión básico
                cursor.execute("SELECT 1")
                
                # Estadísticas de conexiones
                cursor.execute("""
                    SELECT count(*) as active_connections,
                           max_conn,
                           max_conn - count(*) as available_connections
                    FROM pg_stat_activity, 
                         (SELECT setting::int as max_conn FROM pg_settings WHERE name='max_connections') mc
                    WHERE state = 'active'
                    GROUP BY max_conn
                """)
                
                conn_stats = cursor.fetchone()
                
                # Tamaño de la base de datos
                cursor.execute("""
                    SELECT pg_size_pretty(pg_database_size(current_database())) as db_size,
                           pg_database_size(current_database()) as db_size_bytes
                """)
                
                size_stats = cursor.fetchone()
                
                return {
                    'status': 'healthy',
                    'active_connections': conn_stats[0] if conn_stats else 0,
                    'max_connections': conn_stats[1] if conn_stats else 0,
                    'available_connections': conn_stats[2] if conn_stats else 0,
                    'database_size': size_stats[0] if size_stats else 'Unknown',
                    'database_size_bytes': size_stats[1] if size_stats else 0,
                    'response_time_ms': 0  # Se puede medir el tiempo de respuesta
                }
                
        except Exception as e:
            logger.error(f"Error verificando salud de base de datos: {e}")
            return {
                'status': 'unhealthy',
                'error': str(e)
            }
    
    @staticmethod
    def check_redis_health():
        """Verificar salud de Redis"""
        try:
            if not REDIS_AVAILABLE:
                return {
                    'status': 'unavailable',
                    'message': 'Redis no está disponible'
                }
            
            # Test básico de Redis
            cache.set('health_check', 'ok', 30)
            result = cache.get('health_check')
            
            if result != 'ok':
                return {'status': 'unhealthy', 'error': 'Cache test failed'}
            
            # Conectar directamente a Redis para estadísticas si está configurado
            info = {}
            if hasattr(settings, 'CELERY_BROKER_URL'):
                redis_client = redis.from_url(settings.CELERY_BROKER_URL)
                info = redis_client.info()
            
            return {
                'status': 'healthy',
                'connected_clients': info.get('connected_clients', 0),
                'used_memory': info.get('used_memory', 0),
                'used_memory_human': info.get('used_memory_human', '0'),
                'total_commands_processed': info.get('total_commands_processed', 0),
                'uptime_in_seconds': info.get('uptime_in_seconds', 0)
            }
            
        except Exception as e:
            logger.error(f"Error verificando salud de Redis: {e}")
            return {
                'status': 'unhealthy',
                'error': str(e)
            }
    
    @staticmethod
    def check_celery_health():
        """Verificar salud de Celery"""
        try:
            if not CELERY_AVAILABLE:
                return {
                    'status': 'unavailable',
                    'message': 'Celery no está disponible'
                }
            
            i = current_app.control.inspect()
            
            # Workers activos
            active_workers = i.active()
            registered_tasks = i.registered()
            stats = i.stats()
            
            worker_count = len(active_workers) if active_workers else 0
            
            return {
                'status': 'healthy' if worker_count > 0 else 'warning',
                'active_workers': worker_count,
                'worker_names': list(active_workers.keys()) if active_workers else [],
                'total_tasks': sum(len(tasks) for tasks in active_workers.values()) if active_workers else 0,
                'registered_tasks_count': len(registered_tasks) if registered_tasks else 0
            }
            
        except Exception as e:
            logger.error(f"Error verificando salud de Celery: {e}")
            return {
                'status': 'unhealthy',
                'error': str(e)
            }

@never_cache
@csrf_exempt
def health_check(request):
    """Endpoint de health check para load balancers"""
    try:
        # Verificación básica de base de datos
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        
        # Verificación básica de cache
        cache.set('health_check_basic', 'ok', 10)
        cache_result = cache.get('health_check_basic')
        
        if cache_result != 'ok':
            return JsonResponse({'status': 'unhealthy', 'cache': 'failed'}, status=500)
        
        return JsonResponse({
            'status': 'healthy',
            'timestamp': datetime.now().isoformat(),
            'service': 'ortanovias-backend'
        })
        
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return JsonResponse({
            'status': 'unhealthy',
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }, status=500)

@never_cache
def detailed_health_check(request):
    """Health check detallado con métricas completas"""
    monitor = SystemMonitor()
    
    # Recopilar todas las métricas
    system_metrics = monitor.get_system_metrics()
    db_health = monitor.check_database_health()
    redis_health = monitor.check_redis_health()
    celery_health = monitor.check_celery_health()
    
    # Determinar estado general
    overall_status = 'healthy'
    if (db_health.get('status') == 'unhealthy' or 
        redis_health.get('status') == 'unhealthy' or
        celery_health.get('status') == 'unhealthy'):
        overall_status = 'unhealthy'
    elif celery_health.get('status') == 'warning':
        overall_status = 'warning'
    
    response_data = {
        'status': overall_status,
        'timestamp': datetime.now().isoformat(),
        'service': 'ortanovias-backend',
        'version': '1.0.0',
        'uptime': system_metrics.get('uptime', 0) if system_metrics else 0,
        'system': system_metrics,
        'database': db_health,
        'redis': redis_health,
        'celery': celery_health,
        'environment': {
            'debug': settings.DEBUG,
            'allowed_hosts': settings.ALLOWED_HOSTS,
            'timezone': str(settings.TIME_ZONE)
        }
    }
    
    status_code = 200
    if overall_status == 'unhealthy':
        status_code = 500
    elif overall_status == 'warning':
        status_code = 200  # Warnings no son errores críticos
    
    return JsonResponse(response_data, status=status_code)

@never_cache
def metrics_endpoint(request):
    """Endpoint de métricas en formato Prometheus"""
    try:
        monitor = SystemMonitor()
        system_metrics = monitor.get_system_metrics()
        db_health = monitor.check_database_health()
        redis_health = monitor.check_redis_health()
        celery_health = monitor.check_celery_health()
        
        # Formato Prometheus
        metrics = []
        
        if system_metrics:
            metrics.extend([
                f'system_cpu_percent {system_metrics["cpu"]["percent"]}',
                f'system_memory_percent {system_metrics["memory"]["percent"]}',
                f'system_disk_percent {system_metrics["disk"]["percent"]}',
                f'system_memory_used_bytes {system_metrics["memory"]["used"]}',
                f'system_disk_used_bytes {system_metrics["disk"]["used"]}',
            ])
        
        if db_health.get('status') == 'healthy':
            metrics.extend([
                f'database_active_connections {db_health.get("active_connections", 0)}',
                f'database_max_connections {db_health.get("max_connections", 0)}',
                f'database_size_bytes {db_health.get("database_size_bytes", 0)}',
            ])
        
        if redis_health.get('status') == 'healthy':
            metrics.extend([
                f'redis_connected_clients {redis_health.get("connected_clients", 0)}',
                f'redis_used_memory_bytes {redis_health.get("used_memory", 0)}',
                f'redis_total_commands {redis_health.get("total_commands_processed", 0)}',
            ])
        
        if celery_health.get('status') in ['healthy', 'warning']:
            metrics.extend([
                f'celery_active_workers {celery_health.get("active_workers", 0)}',
                f'celery_total_tasks {celery_health.get("total_tasks", 0)}',
            ])
        
        # Status indicators (1 = healthy, 0 = unhealthy)
        metrics.extend([
            f'service_database_up {1 if db_health.get("status") == "healthy" else 0}',
            f'service_redis_up {1 if redis_health.get("status") == "healthy" else 0}',
            f'service_celery_up {1 if celery_health.get("status") == "healthy" else 0}',
        ])
        
        response = '\n'.join(metrics) + '\n'
        
        return JsonResponse(
            {'metrics': response},
            content_type='text/plain'
        )
        
    except Exception as e:
        logger.error(f"Error generando métricas: {e}")
        return JsonResponse({'error': str(e)}, status=500)

class AlertManager:
    """Gestor de alertas para eventos críticos"""
    
    @staticmethod
    def send_alert(level, message, details=None):
        """Enviar alerta por email/Slack/etc"""
        try:
            # Log local
            if level == 'critical':
                logger.critical(f"ALERT: {message}")
            elif level == 'warning':
                logger.warning(f"ALERT: {message}")
            else:
                logger.info(f"ALERT: {message}")
            
            # Enviar por email a admins
            if level in ['critical', 'warning']:
                from django.core.mail import send_mail
                from django.contrib.auth import get_user_model
                
                User = get_user_model()
                admin_emails = list(
                    User.objects.filter(is_staff=True).values_list('email', flat=True)
                )
                
                if admin_emails:
                    subject = f"[{level.upper()}] Orta Novias - {message}"
                    body = f"""
                    Nivel: {level.upper()}
                    Mensaje: {message}
                    Timestamp: {datetime.now().isoformat()}
                    
                    Detalles:
                    {details if details else 'No hay detalles adicionales'}
                    
                    Dashboard: https://ortanovias.com/admin/
                    """
                    
                    send_mail(
                        subject=subject,
                        message=body,
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=admin_emails,
                        fail_silently=True
                    )
            
        except Exception as e:
            logger.error(f"Error enviando alerta: {e}")

def check_and_alert():
    """Función para verificar sistema y enviar alertas si es necesario"""
    monitor = SystemMonitor()
    alert_manager = AlertManager()
    
    # Verificar métricas del sistema
    system_metrics = monitor.get_system_metrics()
    if system_metrics:
        if system_metrics['cpu']['percent'] > 90:
            alert_manager.send_alert(
                'warning',
                f'CPU usage alto: {system_metrics["cpu"]["percent"]}%'
            )
        
        if system_metrics['memory']['percent'] > 90:
            alert_manager.send_alert(
                'warning',
                f'Memoria usage alto: {system_metrics["memory"]["percent"]}%'
            )
        
        if system_metrics['disk']['percent'] > 85:
            alert_manager.send_alert(
                'critical',
                f'Espacio en disco bajo: {system_metrics["disk"]["percent"]}%'
            )
    
    # Verificar servicios
    db_health = monitor.check_database_health()
    if db_health.get('status') == 'unhealthy':
        alert_manager.send_alert(
            'critical',
            'Base de datos no disponible',
            db_health.get('error')
        )
    
    redis_health = monitor.check_redis_health()
    if redis_health.get('status') == 'unhealthy':
        alert_manager.send_alert(
            'critical',
            'Redis no disponible',
            redis_health.get('error')
        )
    
    celery_health = monitor.check_celery_health()
    if celery_health.get('status') == 'unhealthy':
        alert_manager.send_alert(
            'critical',
            'Celery workers no disponibles',
            celery_health.get('error')
        )
    elif celery_health.get('active_workers', 0) == 0:
        alert_manager.send_alert(
            'warning',
            'No hay Celery workers activos'
        )
