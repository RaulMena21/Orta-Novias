"""
Tests unitarios para el sistema de citas
"""
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from datetime import date, time, datetime, timedelta
from backend.apps.appointments.models import Appointment
from backend.apps.appointments.business_hours import BusinessHoursService


class BusinessHoursServiceTest(TestCase):
    """Tests para el servicio de horarios de negocio"""
    
    def test_is_working_day(self):
        """Test para días laborables"""
        # Lunes (0) debe ser día laborable
        monday = date(2025, 7, 14)  # Un lunes
        self.assertTrue(BusinessHoursService.is_working_day(monday))
        
        # Sábado (5) no debe ser día laborable
        saturday = date(2025, 7, 12)  # Un sábado
        self.assertFalse(BusinessHoursService.is_working_day(saturday))
        
        # Domingo (6) no debe ser día laborable
        sunday = date(2025, 7, 13)  # Un domingo
        self.assertFalse(BusinessHoursService.is_working_day(sunday))
    
    def test_is_working_time(self):
        """Test para horarios de trabajo"""
        # Hora matutina válida
        morning_time = time(10, 30)
        self.assertTrue(BusinessHoursService.is_working_time(morning_time))
        
        # Hora vespertina válida
        evening_time = time(18, 0)
        self.assertTrue(BusinessHoursService.is_working_time(evening_time))
        
        # Hora no válida (14:00 ya no está disponible)
        invalid_time = time(14, 0)
        self.assertFalse(BusinessHoursService.is_working_time(invalid_time))
        
        # Hora muy temprana
        early_time = time(7, 0)
        self.assertFalse(BusinessHoursService.is_working_time(early_time))
    
    def test_get_working_time_slots(self):
        """Test para slots de tiempo disponibles"""
        slots = BusinessHoursService.get_working_time_slots()
        
        # Debe incluir slots matutinos
        self.assertIn('09:00', slots)
        self.assertIn('13:30', slots)
        
        # Debe incluir slots vespertinos
        self.assertIn('17:00', slots)
        self.assertIn('20:30', slots)
        
        # NO debe incluir 14:00
        self.assertNotIn('14:00', slots)


class AppointmentModelTest(TestCase):
    """Tests para el modelo de citas"""
    
    def test_create_valid_appointment(self):
        """Test para crear una cita válida"""
        appointment = Appointment.objects.create(
            name='Test User',
            email='test@example.com',
            phone='600123456',
            confirmation_method='email',
            date=date.today() + timedelta(days=1),  # Mañana
            time=time(10, 0),
            comment='Cita de prueba'
        )
        self.assertEqual(appointment.name, 'Test User')
        self.assertEqual(appointment.status, 'pending')
    
    def test_appointment_validation(self):
        """Test para validaciones del modelo"""
        from django.core.exceptions import ValidationError
        
        # Crear cita en fin de semana (debe fallar)
        saturday = date(2025, 7, 12)  # Un sábado
        appointment = Appointment(
            name='Test User',
            email='test@example.com',
            confirmation_method='email',
            date=saturday,
            time=time(10, 0)
        )
        
        with self.assertRaises(ValidationError):
            appointment.full_clean()


class AppointmentAPITest(APITestCase):
    """Tests para la API de citas"""
    
    def test_create_appointment_api(self):
        """Test para crear cita via API"""
        url = reverse('appointment-list')
        data = {
            'name': 'Test User API',
            'email': 'testapi@example.com',
            'phone': '600123456',
            'confirmation_method': 'email',
            'date': (date.today() + timedelta(days=1)).isoformat(),
            'time': '10:00',
            'comment': 'Cita via API'
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Appointment.objects.count(), 1)
    
    def test_validate_date_endpoint(self):
        """Test para endpoint de validación de fechas"""
        url = reverse('appointment-validate-date')
        
        # Fecha válida (día laborable)
        valid_date = (date.today() + timedelta(days=1)).isoformat()
        response = self.client.get(url, {'date': valid_date})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Fecha inválida (sábado)
        saturday = date(2025, 7, 12).isoformat()
        response = self.client.get(url, {'date': saturday})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data['is_valid'])
    
    def test_business_hours_endpoint(self):
        """Test para endpoint de horarios de negocio"""
        url = reverse('appointment-business-hours')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('available_slots', response.data)
        self.assertNotIn('14:00', response.data['available_slots'])


class AppointmentIntegrationTest(APITestCase):
    """Tests de integración completos"""
    
    def test_full_appointment_flow(self):
        """Test del flujo completo de creación de cita"""
        # 1. Obtener horarios de negocio
        business_hours_url = reverse('appointment-business-hours')
        response = self.client.get(business_hours_url)
        available_slots = response.data['available_slots']
        
        # 2. Validar una fecha
        valid_date = (date.today() + timedelta(days=1)).isoformat()
        validate_url = reverse('appointment-validate-date')
        response = self.client.get(validate_url, {'date': valid_date})
        self.assertTrue(response.data['is_valid'])
        
        # 3. Crear la cita
        create_url = reverse('appointment-list')
        data = {
            'name': 'Integration Test User',
            'email': 'integration@example.com',
            'confirmation_method': 'email',
            'date': valid_date,
            'time': available_slots[0],  # Primera hora disponible
            'comment': 'Cita de integración'
        }
        
        response = self.client.post(create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # 4. Verificar que la hora ya no está disponible
        booked_url = reverse('appointment-list')
        response = self.client.get(booked_url, {'date': valid_date})
        booked_times = [apt['time'][:5] for apt in response.data]
        self.assertIn(available_slots[0], booked_times)
