from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NotificationViewSet, EmailTemplateViewSet, ReminderScheduleViewSet

router = DefaultRouter()
router.register(r'notifications', NotificationViewSet)
router.register(r'email-templates', EmailTemplateViewSet)
router.register(r'reminders', ReminderScheduleViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
