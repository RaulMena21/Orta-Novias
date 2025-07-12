"""
Sistema de backups automáticos para Orta Novias
"""
import os
import subprocess
import boto3
from datetime import datetime, timedelta
from django.conf import settings
from django.core.management.base import BaseCommand
from celery import shared_task
import logging

logger = logging.getLogger(__name__)

@shared_task(bind=True)
def backup_database(self):
    """Crear backup de la base de datos PostgreSQL"""
    try:
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_filename = f"ortanovias_backup_{timestamp}.sql"
        backup_path = f"/backups/{backup_filename}"
        
        # Comando para crear backup
        pg_dump_cmd = [
            'pg_dump',
            f"--host={settings.DATABASES['default']['HOST']}",
            f"--port={settings.DATABASES['default']['PORT']}",
            f"--username={settings.DATABASES['default']['USER']}",
            f"--dbname={settings.DATABASES['default']['NAME']}",
            '--verbose',
            '--clean',
            '--no-owner',
            '--no-privileges',
            f"--file={backup_path}"
        ]
        
        # Configurar variable de entorno para password
        env = os.environ.copy()
        env['PGPASSWORD'] = settings.DATABASES['default']['PASSWORD']
        
        # Ejecutar backup
        result = subprocess.run(
            pg_dump_cmd,
            env=env,
            capture_output=True,
            text=True,
            check=True
        )
        
        # Comprimir backup
        gzip_cmd = ['gzip', backup_path]
        subprocess.run(gzip_cmd, check=True)
        backup_path_gz = f"{backup_path}.gz"
        
        # Subir a S3 si está configurado
        if getattr(settings, 'USE_S3', False):
            upload_to_s3(backup_path_gz, backup_filename + '.gz')
        
        # Limpiar backups antiguos (mantener últimos 7 días)
        cleanup_old_backups()
        
        logger.info(f"Backup creado exitosamente: {backup_filename}.gz")
        return backup_filename
        
    except subprocess.CalledProcessError as e:
        logger.error(f"Error creando backup: {e.stderr}")
        raise self.retry(exc=e, countdown=300)
    except Exception as e:
        logger.error(f"Error inesperado en backup: {e}")
        raise

def upload_to_s3(file_path, s3_key):
    """Subir backup a Amazon S3"""
    try:
        s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION_NAME
        )
        
        bucket_name = f"{settings.AWS_STORAGE_BUCKET_NAME}-backups"
        
        with open(file_path, 'rb') as f:
            s3_client.upload_fileobj(
                f, 
                bucket_name, 
                f"database/{s3_key}",
                ExtraArgs={
                    'ServerSideEncryption': 'AES256',
                    'StorageClass': 'STANDARD_IA'  # Cheaper storage for backups
                }
            )
        
        logger.info(f"Backup subido a S3: s3://{bucket_name}/database/{s3_key}")
        
    except Exception as e:
        logger.error(f"Error subiendo a S3: {e}")
        raise

def cleanup_old_backups():
    """Eliminar backups antiguos (más de 7 días)"""
    try:
        backup_dir = "/backups"
        cutoff_date = datetime.now() - timedelta(days=7)
        
        for filename in os.listdir(backup_dir):
            if filename.startswith('ortanovias_backup_'):
                file_path = os.path.join(backup_dir, filename)
                file_mtime = datetime.fromtimestamp(os.path.getmtime(file_path))
                
                if file_mtime < cutoff_date:
                    os.remove(file_path)
                    logger.info(f"Backup antiguo eliminado: {filename}")
        
    except Exception as e:
        logger.error(f"Error limpiando backups antiguos: {e}")

@shared_task(bind=True)
def backup_media_files(self):
    """Backup de archivos de media"""
    try:
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_filename = f"media_backup_{timestamp}.tar.gz"
        backup_path = f"/backups/{backup_filename}"
        
        # Crear archivo tar comprimido de media
        tar_cmd = [
            'tar',
            '-czf',
            backup_path,
            '-C',
            '/app',
            'media'
        ]
        
        subprocess.run(tar_cmd, check=True)
        
        # Subir a S3 si está configurado
        if getattr(settings, 'USE_S3', False):
            upload_media_to_s3(backup_path, backup_filename)
        
        logger.info(f"Backup de media creado: {backup_filename}")
        return backup_filename
        
    except Exception as e:
        logger.error(f"Error en backup de media: {e}")
        raise

def upload_media_to_s3(file_path, s3_key):
    """Subir backup de media a S3"""
    try:
        s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION_NAME
        )
        
        bucket_name = f"{settings.AWS_STORAGE_BUCKET_NAME}-backups"
        
        with open(file_path, 'rb') as f:
            s3_client.upload_fileobj(
                f,
                bucket_name,
                f"media/{s3_key}",
                ExtraArgs={
                    'ServerSideEncryption': 'AES256',
                    'StorageClass': 'GLACIER'  # Cheapest storage for media backups
                }
            )
        
        logger.info(f"Media backup subido a S3: s3://{bucket_name}/media/{s3_key}")
        
    except Exception as e:
        logger.error(f"Error subiendo media a S3: {e}")
        raise

@shared_task(bind=True)
def restore_database(self, backup_filename):
    """Restaurar base de datos desde backup"""
    try:
        backup_path = f"/backups/{backup_filename}"
        
        # Descomprimir si es necesario
        if backup_filename.endswith('.gz'):
            gunzip_cmd = ['gunzip', backup_path]
            subprocess.run(gunzip_cmd, check=True)
            backup_path = backup_path[:-3]  # Remove .gz extension
        
        # Comando para restaurar
        psql_cmd = [
            'psql',
            f"--host={settings.DATABASES['default']['HOST']}",
            f"--port={settings.DATABASES['default']['PORT']}",
            f"--username={settings.DATABASES['default']['USER']}",
            f"--dbname={settings.DATABASES['default']['NAME']}",
            f"--file={backup_path}"
        ]
        
        # Configurar variable de entorno para password
        env = os.environ.copy()
        env['PGPASSWORD'] = settings.DATABASES['default']['PASSWORD']
        
        # Ejecutar restauración
        result = subprocess.run(
            psql_cmd,
            env=env,
            capture_output=True,
            text=True,
            check=True
        )
        
        logger.info(f"Base de datos restaurada desde: {backup_filename}")
        return True
        
    except subprocess.CalledProcessError as e:
        logger.error(f"Error restaurando base de datos: {e.stderr}")
        raise
    except Exception as e:
        logger.error(f"Error inesperado en restauración: {e}")
        raise

class Command(BaseCommand):
    """Comando de Django para gestión manual de backups"""
    help = 'Gestionar backups de la base de datos'

    def add_arguments(self, parser):
        parser.add_argument(
            '--action',
            type=str,
            choices=['backup', 'restore', 'list'],
            help='Acción a realizar'
        )
        parser.add_argument(
            '--filename',
            type=str,
            help='Nombre del archivo para restaurar'
        )

    def handle(self, *args, **options):
        action = options['action']
        
        if action == 'backup':
            self.stdout.write('Creando backup...')
            result = backup_database()
            self.stdout.write(
                self.style.SUCCESS(f'Backup creado: {result}')
            )
            
        elif action == 'restore':
            filename = options['filename']
            if not filename:
                self.stdout.write(
                    self.style.ERROR('Especifica --filename para restaurar')
                )
                return
            
            self.stdout.write(f'Restaurando desde {filename}...')
            restore_database(filename)
            self.stdout.write(
                self.style.SUCCESS('Restauración completada')
            )
            
        elif action == 'list':
            self.stdout.write('Backups disponibles:')
            try:
                backup_dir = "/backups"
                for filename in sorted(os.listdir(backup_dir)):
                    if filename.startswith('ortanovias_backup_'):
                        file_path = os.path.join(backup_dir, filename)
                        file_size = os.path.getsize(file_path)
                        file_mtime = datetime.fromtimestamp(
                            os.path.getmtime(file_path)
                        )
                        self.stdout.write(
                            f"  {filename} ({file_size} bytes) - {file_mtime}"
                        )
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Error listando backups: {e}')
                )

# Programar backups automáticos en celery.py:
# 'backup-database': {
#     'task': 'backend.apps.core.tasks.backup_database',
#     'schedule': crontab(hour=2, minute=0),  # Cada día a las 2:00 AM
# },
# 'backup-media': {
#     'task': 'backend.apps.core.tasks.backup_media_files', 
#     'schedule': crontab(hour=3, minute=0, day_of_week=0),  # Domingos a las 3:00 AM
# },
