#!/usr/bin/env python
"""
Script para probar la funcionalidad de citas con horas ocupadas
"""
import os
import sys
import django
from datetime import date, time

# Añadir el directorio del proyecto al path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from backend.apps.appointments.models import Appointment

def create_test_appointments():
    """Crear citas de prueba para testing"""
    
    # Eliminar citas existentes de prueba
    Appointment.objects.filter(name__startswith='Test').delete()
    
    # Crear citas de prueba para hoy
    today = date.today()
    
    test_appointments = [
        {
            'name': 'Test User 1',
            'email': 'test1@example.com',
            'phone': '600111111',
            'confirmation_method': 'email',
            'date': today,
            'time': time(10, 0),  # 10:00
            'status': 'confirmed',
            'comment': 'Cita de prueba 1'
        },
        {
            'name': 'Test User 2',
            'email': 'test2@example.com',
            'phone': '600222222',
            'confirmation_method': 'whatsapp',
            'date': today,
            'time': time(11, 30),  # 11:30
            'status': 'confirmed',
            'comment': 'Cita de prueba 2'
        },
        {
            'name': 'Test User 3',
            'email': 'test3@example.com',
            'phone': '600333333',
            'confirmation_method': 'email',
            'date': today,
            'time': time(18, 0),  # 18:00
            'status': 'confirmed',
            'comment': 'Cita de prueba 3'
        }
    ]
    
    created_appointments = []
    for appointment_data in test_appointments:
        appointment = Appointment.objects.create(**appointment_data)
        created_appointments.append(appointment)
        print(f"✓ Creada cita: {appointment.name} - {appointment.date} {appointment.time}")
    
    return created_appointments

def test_availability_query():
    """Probar consulta de disponibilidad"""
    today = date.today()
    
    # Consultar citas confirmadas para hoy
    confirmed_appointments = Appointment.objects.filter(
        date=today,
        status='confirmed'
    ).order_by('time')
    
    print(f"\n📅 Citas confirmadas para {today}:")
    for appointment in confirmed_appointments:
        print(f"  - {appointment.time} | {appointment.name}")
    
    # Mostrar horas ocupadas
    booked_times = [appointment.time.strftime('%H:%M') for appointment in confirmed_appointments]
    print(f"\n⏰ Horas ocupadas: {', '.join(booked_times)}")
    
    # Mostrar horas disponibles
    all_times = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00',
        '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'
    ]
    
    available_times = [time for time in all_times if time not in booked_times]
    print(f"✅ Horas disponibles: {', '.join(available_times)}")
    
    return booked_times, available_times

if __name__ == '__main__':
    print("🏃 Iniciando pruebas de funcionalidad de citas...")
    
    # Crear citas de prueba
    print("\n1. Creando citas de prueba...")
    created_appointments = create_test_appointments()
    
    # Probar consulta de disponibilidad
    print("\n2. Probando consulta de disponibilidad...")
    booked_times, available_times = test_availability_query()
    
    print(f"\n✅ Pruebas completadas!")
    print(f"   - Citas creadas: {len(created_appointments)}")
    print(f"   - Horas ocupadas: {len(booked_times)}")
    print(f"   - Horas disponibles: {len(available_times)}")
    
    print("\n💡 Ahora puedes probar la funcionalidad en el frontend:")
    print("   1. Inicia el servidor de desarrollo")
    print("   2. Ve a la página de citas")
    print("   3. Selecciona la fecha de hoy")
    print("   4. Verifica que las horas ocupadas no aparezcan en el selector")
