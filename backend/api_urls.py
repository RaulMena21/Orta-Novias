from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.views import TokenObtainPairView
from backend.apps.users.jwt_serializers import CustomTokenObtainPairSerializer
from backend.apps.users.views import UserViewSet
from backend.apps.store.views import DressViewSet
from backend.apps.appointments.views import AppointmentViewSet
from backend.apps.testimonials.views import BrideTestimonialViewSet

# Vista personalizada para el token
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'dresses', DressViewSet)
router.register(r'appointments', AppointmentViewSet)
router.register(r'testimonials', BrideTestimonialViewSet)

urlpatterns = router.urls

urlpatterns += [
    # JWT endpoints
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Notifications API
    path('', include('backend.apps.notifications.urls')),
    # Analytics API
    path('analytics/', include('backend.apps.analytics.urls')),
]
