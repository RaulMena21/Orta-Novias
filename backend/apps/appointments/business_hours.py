"""
Servicio para manejar horarios de negocio y validaciones de tiempo
"""
from datetime import datetime, date, time as datetime_time
from typing import List, Tuple

class BusinessHoursService:
    """Servicio para gestionar horarios de negocio de Orta Novias"""
    
    # Horarios de atención
    MORNING_START = datetime_time(9, 0)
    MORNING_END = datetime_time(13, 30)
    EVENING_START = datetime_time(17, 0)
    EVENING_END = datetime_time(20, 30)
    
    # Días laborables (0=lunes, 6=domingo)
    WORKING_DAYS = [0, 1, 2, 3, 4]  # Lunes a viernes
    
    @classmethod
    def is_working_day(cls, date_obj: date) -> bool:
        """Verificar si una fecha es día laborable"""
        return date_obj.weekday() in cls.WORKING_DAYS
    
    @classmethod
    def is_working_time(cls, time_obj: datetime_time) -> bool:
        """Verificar si una hora está dentro del horario de atención"""
        return (
            (cls.MORNING_START <= time_obj <= cls.MORNING_END) or
            (cls.EVENING_START <= time_obj <= cls.EVENING_END)
        )
    
    @classmethod
    def is_valid_appointment_datetime(cls, date_obj: date, time_obj: datetime_time) -> Tuple[bool, str]:
        """
        Verificar si una fecha y hora son válidas para una cita
        Returns: (is_valid, error_message)
        """
        # Verificar fecha pasada
        if date_obj < datetime.now().date():
            return False, "No se pueden programar citas en fechas pasadas."
        
        # Verificar día laborable
        if not cls.is_working_day(date_obj):
            return False, "No se pueden programar citas los fines de semana. Por favor, selecciona un día entre lunes y viernes."
        
        # Verificar horario de atención
        if not cls.is_working_time(time_obj):
            return False, "La hora seleccionada está fuera del horario de atención. Horarios disponibles: 09:00-13:30 y 17:00-20:30."
        
        return True, ""
    
    @classmethod
    def get_working_time_slots(cls) -> List[str]:
        """Obtener todos los slots de tiempo disponibles en formato HH:MM"""
        slots = []
        
        # Generar slots matutinos (cada 30 minutos)
        current_time = cls.MORNING_START
        while current_time <= cls.MORNING_END:
            slots.append(current_time.strftime('%H:%M'))
            # Agregar 30 minutos
            total_minutes = current_time.hour * 60 + current_time.minute + 30
            if total_minutes < cls.MORNING_END.hour * 60 + cls.MORNING_END.minute:
                current_time = datetime_time(total_minutes // 60, total_minutes % 60)
            else:
                break
        
        # Generar slots vespertinos (cada 30 minutos)
        current_time = cls.EVENING_START
        while current_time <= cls.EVENING_END:
            slots.append(current_time.strftime('%H:%M'))
            # Agregar 30 minutos
            total_minutes = current_time.hour * 60 + current_time.minute + 30
            if total_minutes <= cls.EVENING_END.hour * 60 + cls.EVENING_END.minute:
                current_time = datetime_time(total_minutes // 60, total_minutes % 60)
            else:
                break
        
        return slots
    
    @classmethod
    def get_next_working_day(cls, from_date: date = None) -> date:
        """Obtener el próximo día laborable"""
        if from_date is None:
            from_date = datetime.now().date()
        
        current_date = from_date
        while not cls.is_working_day(current_date):
            current_date = date.fromordinal(current_date.toordinal() + 1)
        
        return current_date
    
    @classmethod
    def get_business_hours_info(cls) -> dict:
        """Obtener información sobre los horarios de negocio"""
        return {
            'working_days': ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
            'morning_hours': f"{cls.MORNING_START.strftime('%H:%M')} - {cls.MORNING_END.strftime('%H:%M')}",
            'evening_hours': f"{cls.EVENING_START.strftime('%H:%M')} - {cls.EVENING_END.strftime('%H:%M')}",
            'available_slots': cls.get_working_time_slots()
        }
