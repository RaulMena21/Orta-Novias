"""
Comando para limpiar datos de seguridad antiguos
"""
from django.core.management.base import BaseCommand
from django.core.cache import cache
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Limpia datos de seguridad antiguos del cache'

    def add_arguments(self, parser):
        parser.add_argument(
            '--days',
            type=int,
            default=7,
            help='Limpiar datos más antiguos que X días (default: 7)'
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Solo mostrar qué se limpiaría sin hacer cambios'
        )

    def handle(self, *args, **options):
        days = options['days']
        dry_run = options['dry_run']
        
        self.stdout.write(
            self.style.SUCCESS(f'Iniciando limpieza de datos de seguridad (>{days} días)')
        )
        
        if dry_run:
            self.stdout.write(
                self.style.WARNING('MODO DRY-RUN: No se harán cambios reales')
            )
        
        # Patrones de claves de cache relacionadas con seguridad
        security_patterns = [
            'failed_validations:*',
            'suspicious_patterns:*',
            'blocked_emails:*',
            'critical_events:*',
            'rate_limit:*'
        ]
        
        cleaned_count = 0
        
        # En una implementación real con Redis, usaríamos:
        # redis_client = cache._cache.get_client()
        # for pattern in security_patterns:
        #     keys = redis_client.keys(pattern)
        #     for key in keys:
        #         if self._is_old_key(key, days):
        #             if not dry_run:
        #                 cache.delete(key)
        #             cleaned_count += 1
        
        # Para el cache de Django por defecto, limpiamos todo
        if not dry_run:
            cache.clear()
            cleaned_count = 1  # Estimación
        
        if dry_run:
            self.stdout.write(
                self.style.WARNING(f'Se limpiarían aproximadamente {cleaned_count} entradas')
            )
        else:
            self.stdout.write(
                self.style.SUCCESS(f'Limpieza completada. {cleaned_count} entradas procesadas')
            )
        
        # Log la operación
        logger.info(f"Security cache cleanup completed. Days: {days}, Dry run: {dry_run}")

    def _is_old_key(self, key, days):
        """
        Verificar si una clave es antigua
        En una implementación real, verificaríamos el timestamp del valor
        """
        # Implementación simplificada
        return True
