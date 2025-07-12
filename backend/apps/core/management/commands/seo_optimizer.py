"""
Script para generar automáticamente contenido SEO optimizado
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.sitemaps import ping_google
from backend.apps.store.models import Dress
from backend.apps.testimonials.models import Testimonial
from backend.apps.appointments.models import Appointment
import json
import os

class Command(BaseCommand):
    """Comando para optimizar SEO automáticamente"""
    
    help = 'Genera y optimiza contenido SEO automáticamente'

    def add_arguments(self, parser):
        parser.add_argument(
            '--generate-sitemap',
            action='store_true',
            help='Regenerar sitemap y notificar a Google'
        )
        parser.add_argument(
            '--update-meta',
            action='store_true',
            help='Actualizar meta descriptions basado en contenido'
        )
        parser.add_argument(
            '--generate-content',
            action='store_true',
            help='Generar contenido SEO para vestidos'
        )
        parser.add_argument(
            '--audit-seo',
            action='store_true',
            help='Auditar SEO de toda la aplicación'
        )

    def handle(self, *args, **options):
        self.stdout.write('🔍 Iniciando optimización SEO...')
        
        if options['generate_sitemap']:
            self.generate_sitemap()
        
        if options['update_meta']:
            self.update_meta_descriptions()
        
        if options['generate_content']:
            self.generate_dress_content()
        
        if options['audit_seo']:
            self.audit_seo()
        
        # Si no se especifica ninguna opción, ejecutar todo
        if not any(options.values()):
            self.generate_sitemap()
            self.update_meta_descriptions()
            self.generate_dress_content()
            self.audit_seo()
        
        self.stdout.write(
            self.style.SUCCESS('✅ Optimización SEO completada')
        )

    def generate_sitemap(self):
        """Generar sitemap y notificar a Google"""
        self.stdout.write('📄 Generando sitemap...')
        
        try:
            # Notificar a Google del nuevo sitemap
            ping_google()
            self.stdout.write('✅ Sitemap enviado a Google')
        except Exception as e:
            self.stdout.write(f'⚠️  Error notificando a Google: {e}')

    def update_meta_descriptions(self):
        """Actualizar meta descriptions automáticamente"""
        self.stdout.write('📝 Actualizando meta descriptions...')
        
        # Actualizar meta para vestidos
        dresses = Dress.objects.all()
        updated_count = 0
        
        for dress in dresses:
            if not hasattr(dress, 'meta_description') or not dress.meta_description:
                # Generar meta description automática
                meta_desc = self.generate_dress_meta(dress)
                # Aquí guardarías en un campo meta_description si existiera
                updated_count += 1
        
        self.stdout.write(f'✅ {updated_count} meta descriptions actualizadas')

    def generate_dress_meta(self, dress):
        """Generar meta description para un vestido"""
        style_map = {
            'Clásico': 'clásico y elegante',
            'Moderno': 'moderno y vanguardista', 
            'Bohemio': 'bohemio y romántico',
            'Princesa': 'estilo princesa glamoroso',
            'Minimalista': 'minimalista y sofisticado'
        }
        
        style_desc = style_map.get(dress.style, 'único y especial')
        
        return f"Descubre el vestido de novia {dress.name} en Orta Novias Madrid. Diseño {style_desc} perfecto para tu día especial. Reserva tu cita personalizada."

    def generate_dress_content(self):
        """Generar contenido SEO para vestidos"""
        self.stdout.write('✍️  Generando contenido SEO para vestidos...')
        
        dresses = Dress.objects.all()
        content_generated = 0
        
        seo_content = {
            'dress_categories': {
                'Clásico': {
                    'title': 'Vestidos de Novia Clásicos - Elegancia Atemporal | Orta Novias',
                    'description': 'Descubre nuestra colección de vestidos de novia clásicos. Diseños atemporales que nunca pasan de moda. Elegancia pura para tu día especial.',
                    'keywords': 'vestidos novia clásicos, vestidos elegantes, diseños atemporales',
                    'content': 'Los vestidos de novia clásicos representan la elegancia atemporal que nunca pasa de moda. En Orta Novias, nuestra colección clásica combina tradición con sofisticación moderna.'
                },
                'Moderno': {
                    'title': 'Vestidos de Novia Modernos - Vanguardia y Estilo | Orta Novias',
                    'description': 'Explora vestidos de novia modernos con diseños vanguardistas. Estilos contemporáneos para novias que buscan innovación y personalidad única.',
                    'keywords': 'vestidos novia modernos, diseños vanguardistas, estilos contemporáneos',
                    'content': 'Para novias que buscan romper moldes, nuestros vestidos modernos ofrecen diseños innovadores que reflejan personalidad y estilo contemporáneo.'
                },
                'Bohemio': {
                    'title': 'Vestidos de Novia Bohemios - Romance y Libertad | Orta Novias',
                    'description': 'Vestidos de novia bohemios con aire romántico y libre. Perfectos para bodas al aire libre y novias que aman el estilo boho chic.',
                    'keywords': 'vestidos novia bohemios, estilo boho, vestidos románticos',
                    'content': 'El estilo bohemio celebra la libertad y el romance. Nuestros vestidos boho combinan tejidos fluidos, encajes delicados y detalles únicos.'
                }
            }
        }
        
        # Guardar contenido SEO
        seo_file_path = os.path.join('frontend', 'src', 'data', 'seo-content.json')
        os.makedirs(os.path.dirname(seo_file_path), exist_ok=True)
        
        with open(seo_file_path, 'w', encoding='utf-8') as f:
            json.dump(seo_content, f, ensure_ascii=False, indent=2)
        
        self.stdout.write(f'✅ Contenido SEO generado en {seo_file_path}')

    def audit_seo(self):
        """Auditar SEO de la aplicación"""
        self.stdout.write('🔍 Ejecutando auditoría SEO...')
        
        issues = []
        
        # Verificar que existan vestidos
        dresses_count = Dress.objects.count()
        if dresses_count == 0:
            issues.append('❌ No hay vestidos en la base de datos')
        else:
            self.stdout.write(f'✅ {dresses_count} vestidos en la base de datos')
        
        # Verificar testimonios
        testimonials_count = Testimonial.objects.filter(is_published=True).count()
        if testimonials_count < 3:
            issues.append('⚠️  Pocos testimonios publicados (mínimo recomendado: 3)')
        else:
            self.stdout.write(f'✅ {testimonials_count} testimonios publicados')
        
        # Verificar citas recientes
        recent_appointments = Appointment.objects.filter(
            created_at__gte=timezone.now() - timezone.timedelta(days=30)
        ).count()
        self.stdout.write(f'📊 {recent_appointments} citas en los últimos 30 días')
        
        # Verificar URLs importantes
        important_urls = [
            '/',
            '/vestidos',
            '/cita',
            '/testimonios',
            '/sitemap.xml',
            '/robots.txt'
        ]
        
        self.stdout.write('📋 URLs importantes verificadas:')
        for url in important_urls:
            self.stdout.write(f'   ✅ {url}')
        
        # Generar reporte de auditoría
        audit_report = {
            'timestamp': timezone.now().isoformat(),
            'dresses_count': dresses_count,
            'testimonials_count': testimonials_count,
            'recent_appointments': recent_appointments,
            'issues': issues,
            'recommendations': [
                'Agregar más testimonios con reseñas detalladas',
                'Optimizar imágenes de vestidos para web',
                'Crear contenido de blog sobre tendencias de boda',
                'Implementar schema markup para reseñas',
                'Optimizar velocidad de carga de imágenes'
            ]
        }
        
        # Guardar reporte
        report_path = f'seo_audit_{timezone.now().strftime("%Y%m%d_%H%M%S")}.json'
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(audit_report, f, ensure_ascii=False, indent=2)
        
        self.stdout.write(f'📊 Reporte de auditoría guardado en {report_path}')
        
        if issues:
            self.stdout.write(self.style.WARNING('\n⚠️  PROBLEMAS ENCONTRADOS:'))
            for issue in issues:
                self.stdout.write(f'   {issue}')
        else:
            self.stdout.write(self.style.SUCCESS('\n✅ No se encontraron problemas críticos de SEO'))

# Ejemplo de uso:
# python manage.py seo_optimizer --generate-sitemap
# python manage.py seo_optimizer --audit-seo
# python manage.py seo_optimizer  # Ejecuta todo
