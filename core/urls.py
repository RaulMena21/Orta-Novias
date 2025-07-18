"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.conf import settings
from django.conf.urls.static import static
# Importar vistas de monitoreo
from backend.apps.core.monitoring import health_check, detailed_health_check, metrics_endpoint
# Importar vistas de SEO
from backend.apps.core.seo import sitemap_xml, robots_txt, structured_data_json

def api_root(request):
    """Vista simple para la raíz que muestra información de la API"""
    return JsonResponse({
        'message': 'Bienvenido a la API de Orta Novias',
        'version': '1.0',
        'endpoints': {
            'admin': '/admin/',
            'api': '/api/',
            'health': '/api/health/',
            'metrics': '/api/metrics/',
            'monitoring': '/api/monitoring/'
        },
        'documentation': '/api/docs/'
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', api_root, name='api_root'),
    
    # API endpoints
    path('api/', include('backend.api_urls')),
    
    # Health checks y monitoreo
    path('api/health/', health_check, name='health_check'),
    path('api/monitoring/', detailed_health_check, name='detailed_health_check'), 
    path('api/metrics/', metrics_endpoint, name='metrics_endpoint'),
    
    # SEO URLs
    path('sitemap.xml', sitemap_xml, name='sitemap'),
    path('robots.txt', robots_txt, name='robots'),
    path('structured-data/<str:page>/', structured_data_json, name='structured_data'),
]

# Servir archivos de media en desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
