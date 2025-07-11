from backend.apps.appointments.models import Appointment
from datetime import date, time

# Crear citas de prueba para testing
today = date.today()
Appointment.objects.filter(name__startswith='Test').delete()

appointment1 = Appointment.objects.create(
    name='Test User 1',
    email='test1@example.com',
    phone='600111111',
    confirmation_method='email',
    date=today,
    time=time(10, 0),
    status='confirmed',
    comment='Cita de prueba 1'
)

appointment2 = Appointment.objects.create(
    name='Test User 2',
    email='test2@example.com',
    phone='600222222',
    confirmation_method='whatsapp',
    date=today,
    time=time(11, 30),
    status='confirmed',
    comment='Cita de prueba 2'
)

appointment3 = Appointment.objects.create(
    name='Test User 3',
    email='test3@example.com',
    phone='600333333',
    confirmation_method='email',
    date=today,
    time=time(18, 0),
    status='confirmed',
    comment='Cita de prueba 3'
)

print(f'✓ Creada cita: {appointment1.name} - {appointment1.date} {appointment1.time}')
print(f'✓ Creada cita: {appointment2.name} - {appointment2.date} {appointment2.time}')
print(f'✓ Creada cita: {appointment3.name} - {appointment3.date} {appointment3.time}')

print('\n📅 Citas confirmadas para hoy:')
confirmed_appointments = Appointment.objects.filter(date=today, status='confirmed').order_by('time')
for appointment in confirmed_appointments:
    print(f'  - {appointment.time} | {appointment.name}')
