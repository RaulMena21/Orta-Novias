from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'events', views.AnalyticsEventViewSet)
router.register(r'conversions', views.ConversionEventViewSet)
router.register(r'sessions', views.UserSessionViewSet)
router.register(r'reports', views.AnalyticsReportViewSet, basename='analytics-reports')

urlpatterns = [
    path('', include(router.urls)),
]
