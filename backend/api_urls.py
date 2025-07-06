from django.urls import path
from rest_framework import routers
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from backend.apps.users.views import UserViewSet
from backend.apps.store.views import DressViewSet
from backend.apps.appointments.views import AppointmentViewSet
from backend.apps.testimonials.views import BrideTestimonialViewSet

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'dresses', DressViewSet)
router.register(r'appointments', AppointmentViewSet)
router.register(r'testimonials', BrideTestimonialViewSet)

urlpatterns = router.urls

urlpatterns += [
    # JWT endpoints
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
