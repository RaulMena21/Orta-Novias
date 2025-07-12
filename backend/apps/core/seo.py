"""
SEO Configuration y URLs optimizadas para Orta Novias
"""
from django.http import JsonResponse, HttpResponse
from django.template.response import TemplateResponse
from django.views.decorators.cache import cache_page
from django.views.decorators.http import require_GET
from django.utils import timezone
from django.conf import settings
import json

# SEO Data para diferentes páginas
SEO_DATA = {
    'home': {
        'title': 'Orta Novias - Vestidos de Novia Exclusivos | Diseños Únicos',
        'description': 'Descubre la colección más exclusiva de vestidos de novia en Orta Novias. Diseños únicos, calidad premium y atención personalizada. ¡Reserva tu cita!',
        'keywords': 'vestidos de novia, trajes de novia, diseños exclusivos, novia, boda, matrimonio, vestidos únicos',
        'og_type': 'website',
        'canonical': 'https://ortanovias.com/'
    },
    'dresses': {
        'title': 'Colección de Vestidos de Novia | Orta Novias',
        'description': 'Explora nuestra exclusiva colección de vestidos de novia. Desde clásicos elegantes hasta diseños modernos. Encuentra tu vestido perfecto.',
        'keywords': 'colección vestidos novia, vestidos elegantes, vestidos modernos, vestidos clásicos, diseños novia',
        'og_type': 'website',
        'canonical': 'https://ortanovias.com/vestidos/'
    },
    'appointments': {
        'title': 'Reservar Cita - Atención Personalizada | Orta Novias',
        'description': 'Reserva tu cita personalizada en Orta Novias. Atención exclusiva, asesoramiento profesional y la mejor experiencia para encontrar tu vestido ideal.',
        'keywords': 'reservar cita novia, asesoramiento vestidos, atención personalizada, cita novia',
        'og_type': 'website',
        'canonical': 'https://ortanovias.com/cita/'
    },
    'testimonials': {
        'title': 'Testimonios de Novias Felices | Orta Novias',
        'description': 'Lee las experiencias de nuestras novias. Testimonios reales de clientas que encontraron su vestido perfecto en Orta Novias.',
        'keywords': 'testimonios novias, experiencias clientes, reseñas vestidos novia, novias felices',
        'og_type': 'website',
        'canonical': 'https://ortanovias.com/testimonios/'
    }
}

@require_GET
@cache_page(60 * 60)  # Cache por 1 hora
def sitemap_xml(request):
    """Generar sitemap.xml dinámico"""
    from backend.apps.store.models import Dress
    from backend.apps.testimonials.models import Testimonial
    
    # URLs estáticas principales
    urls = [
        {
            'loc': 'https://ortanovias.com/',
            'lastmod': timezone.now().date(),
            'changefreq': 'daily',
            'priority': '1.0'
        },
        {
            'loc': 'https://ortanovias.com/vestidos/',
            'lastmod': timezone.now().date(),
            'changefreq': 'weekly',
            'priority': '0.9'
        },
        {
            'loc': 'https://ortanovias.com/cita/',
            'lastmod': timezone.now().date(),
            'changefreq': 'monthly',
            'priority': '0.8'
        },
        {
            'loc': 'https://ortanovias.com/testimonios/',
            'lastmod': timezone.now().date(),
            'changefreq': 'weekly',
            'priority': '0.7'
        }
    ]
    
    # Agregar vestidos individuales
    dresses = Dress.objects.filter(is_available=True)
    for dress in dresses:
        urls.append({
            'loc': f'https://ortanovias.com/vestidos/{dress.id}/',
            'lastmod': dress.updated_at.date() if hasattr(dress, 'updated_at') else timezone.now().date(),
            'changefreq': 'monthly',
            'priority': '0.6'
        })
    
    # XML del sitemap
    xml_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    for url in urls:
        xml_content += f'  <url>\n'
        xml_content += f'    <loc>{url["loc"]}</loc>\n'
        xml_content += f'    <lastmod>{url["lastmod"]}</lastmod>\n'
        xml_content += f'    <changefreq>{url["changefreq"]}</changefreq>\n'
        xml_content += f'    <priority>{url["priority"]}</priority>\n'
        xml_content += f'  </url>\n'
    
    xml_content += '</urlset>'
    
    return HttpResponse(xml_content, content_type='application/xml')

@require_GET
@cache_page(60 * 60 * 24)  # Cache por 24 horas
def robots_txt(request):
    """Generar robots.txt optimizado"""
    content = f"""User-agent: *
Allow: /

# Sitemap
Sitemap: https://ortanovias.com/sitemap.xml

# Páginas importantes
Allow: /vestidos/
Allow: /cita/
Allow: /testimonios/

# Bloquear admin y archivos técnicos
Disallow: /admin/
Disallow: /api/
Disallow: /*.json$
Disallow: /*.xml$
Disallow: /static/admin/

# Tiempo de crawl (no sobrecargar)
Crawl-delay: 1

# Información adicional
# Contacto: admin@ortanovias.com
# Última actualización: {timezone.now().date()}
"""
    
    return HttpResponse(content, content_type='text/plain')

@require_GET
def structured_data_json(request, page='home'):
    """Generar datos estructurados JSON-LD para SEO"""
    
    # Datos base de la empresa
    business_data = {
        "@context": "https://schema.org",
        "@type": "BridalShop",
        "name": "Orta Novias",
        "description": "Tienda especializada en vestidos de novia exclusivos con diseños únicos y atención personalizada",
        "url": "https://ortanovias.com",
        "logo": "https://ortanovias.com/static/images/logo.png",
        "image": "https://ortanovias.com/static/images/tienda.jpg",
        "telephone": "+34-XXX-XXX-XXX",
        "email": "info@ortanovias.com",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Calle Principal, 123",
            "addressLocality": "Madrid",
            "addressRegion": "Madrid",
            "postalCode": "28001",
            "addressCountry": "ES"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "40.4168",
            "longitude": "-3.7038"
        },
        "openingHours": [
            "Mo-Fr 10:00-20:00",
            "Sa 10:00-14:00"
        ],
        "priceRange": "€€€",
        "servesCuisine": [],
        "acceptsReservations": True,
        "sameAs": [
            "https://www.facebook.com/ortanovias",
            "https://www.instagram.com/ortanovias",
            "https://www.pinterest.com/ortanovias"
        ]
    }
    
    if page == 'home':
        # Página principal con WebSite schema
        structured_data = [
            business_data,
            {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "Orta Novias",
                "url": "https://ortanovias.com",
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://ortanovias.com/buscar?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                }
            }
        ]
    
    elif page == 'dresses':
        # Página de vestidos con ItemList
        from backend.apps.store.models import Dress
        dresses = Dress.objects.filter(is_available=True)[:10]
        
        items = []
        for i, dress in enumerate(dresses, 1):
            items.append({
                "@type": "ListItem",
                "position": i,
                "item": {
                    "@type": "Product",
                    "name": dress.name,
                    "description": dress.description,
                    "image": f"https://ortanovias.com{dress.image.url}" if dress.image else "",
                    "url": f"https://ortanovias.com/vestidos/{dress.id}/",
                    "category": "Vestidos de Novia",
                    "brand": {
                        "@type": "Brand",
                        "name": "Orta Novias"
                    }
                }
            })
        
        structured_data = [
            business_data,
            {
                "@context": "https://schema.org",
                "@type": "ItemList",
                "name": "Colección de Vestidos de Novia",
                "description": "Nuestra exclusiva colección de vestidos de novia",
                "numberOfItems": len(items),
                "itemListElement": items
            }
        ]
    
    elif page == 'testimonials':
        # Página de testimonios con Review schema
        from backend.apps.testimonials.models import Testimonial
        testimonials = Testimonial.objects.filter(is_published=True)[:10]
        
        reviews = []
        for testimonial in testimonials:
            reviews.append({
                "@type": "Review",
                "author": {
                    "@type": "Person",
                    "name": testimonial.client_name
                },
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": testimonial.rating,
                    "bestRating": "5"
                },
                "reviewBody": testimonial.comment,
                "datePublished": testimonial.created_at.isoformat()
            })
        
        business_data["review"] = reviews
        structured_data = [business_data]
    
    else:
        structured_data = [business_data]
    
    return JsonResponse(structured_data, safe=False)

def get_seo_meta(page='home'):
    """Obtener metadatos SEO para una página específica"""
    return SEO_DATA.get(page, SEO_DATA['home'])

def generate_meta_tags(page='home', custom_data=None):
    """Generar meta tags HTML para SEO"""
    seo_data = get_seo_meta(page)
    
    if custom_data:
        seo_data.update(custom_data)
    
    meta_tags = f'''
    <!-- SEO Meta Tags -->
    <title>{seo_data['title']}</title>
    <meta name="description" content="{seo_data['description']}">
    <meta name="keywords" content="{seo_data['keywords']}">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="{seo_data['canonical']}">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:type" content="{seo_data['og_type']}">
    <meta property="og:title" content="{seo_data['title']}">
    <meta property="og:description" content="{seo_data['description']}">
    <meta property="og:url" content="{seo_data['canonical']}">
    <meta property="og:site_name" content="Orta Novias">
    <meta property="og:image" content="https://ortanovias.com/static/images/og-image.jpg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:locale" content="es_ES">
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{seo_data['title']}">
    <meta name="twitter:description" content="{seo_data['description']}">
    <meta name="twitter:image" content="https://ortanovias.com/static/images/twitter-image.jpg">
    <meta name="twitter:site" content="@ortanovias">
    
    <!-- Additional SEO Meta Tags -->
    <meta name="author" content="Orta Novias">
    <meta name="geo.region" content="ES-MD">
    <meta name="geo.placename" content="Madrid">
    <meta name="geo.position" content="40.4168;-3.7038">
    <meta name="ICBM" content="40.4168, -3.7038">
    
    <!-- Business Information -->
    <meta name="business:contact_data:street_address" content="Calle Principal, 123">
    <meta name="business:contact_data:locality" content="Madrid">
    <meta name="business:contact_data:region" content="Madrid">
    <meta name="business:contact_data:postal_code" content="28001">
    <meta name="business:contact_data:country_name" content="España">
    '''
    
    return meta_tags
