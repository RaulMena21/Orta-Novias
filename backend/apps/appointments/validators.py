"""
Servicio de validación y sanitización de datos para citas
"""
import re
import html
import logging
from datetime import datetime, date, time
from typing import Dict, List, Optional, Tuple
from django.core.exceptions import ValidationError
from django.core.validators import validate_email as django_validate_email
from django.utils import timezone

logger = logging.getLogger(__name__)

class DataValidator:
    """
    Clase para validar y sanitizar datos de entrada
    """
    
    # Patrones de validación
    NAME_PATTERN = re.compile(r'^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,100}$')
    PHONE_PATTERN = re.compile(r'^[+]?[\d\s\-()]{9,20}$')
    
    # Palabras prohibidas para detectar spam
    SPAM_KEYWORDS = [
        'viagra', 'casino', 'lottery', 'winner', 'congratulations',
        'click here', 'free money', 'make money', 'investment',
        'crypto', 'bitcoin', 'trading', 'forex'
    ]
    
    @staticmethod
    def sanitize_string(value: str) -> str:
        """
        Sanitizar string eliminando caracteres peligrosos
        """
        if not value:
            return ''
        
        # Escapar HTML
        sanitized = html.escape(value.strip())
        
        # Eliminar caracteres de control
        sanitized = ''.join(char for char in sanitized if ord(char) >= 32 or char in '\t\n\r')
        
        # Eliminar scripts y tags peligrosos
        dangerous_patterns = [
            r'<script[^>]*>.*?</script>',
            r'<iframe[^>]*>.*?</iframe>',
            r'javascript:',
            r'vbscript:',
            r'on\w+\s*=',
            r'data:',
        ]
        
        for pattern in dangerous_patterns:
            sanitized = re.sub(pattern, '', sanitized, flags=re.IGNORECASE | re.DOTALL)
        
        return sanitized[:500]  # Limitar longitud
    
    @classmethod
    def validate_name(cls, name: str) -> Tuple[bool, str]:
        """
        Validar nombre completo
        """
        if not name:
            return False, 'El nombre es requerido'
        
        sanitized_name = cls.sanitize_string(name)
        
        if not cls.NAME_PATTERN.match(sanitized_name):
            return False, 'El nombre debe tener entre 2 y 100 caracteres y solo contener letras'
        
        # Verificar que no sea spam
        if cls._is_spam_content(sanitized_name):
            return False, 'Nombre no válido'
        
        return True, sanitized_name
    
    @classmethod
    def validate_email(cls, email: str) -> Tuple[bool, str]:
        """
        Validar email
        """
        if not email:
            return False, 'Email requerido'
        
        sanitized_email = cls.sanitize_string(email).lower()
        
        try:
            django_validate_email(sanitized_email)
        except ValidationError:
            return False, 'Formato de email no válido'
        
        # Verificar dominios sospechosos
        suspicious_domains = [
            'tempmail.org', '10minutemail.com', 'guerrillamail.com',
            'mailinator.com', 'throwaway.email'
        ]
        
        domain = sanitized_email.split('@')[1] if '@' in sanitized_email else ''
        if domain in suspicious_domains:
            return False, 'No se permiten emails temporales'
        
        return True, sanitized_email
    
    @classmethod
    def validate_phone(cls, phone: str) -> Tuple[bool, str]:
        """
        Validar teléfono
        """
        if not phone:
            return False, 'Teléfono requerido'
        
        # Limpiar y sanitizar
        sanitized_phone = re.sub(r'[^\d+\s\-()]', '', phone.strip())
        
        if not cls.PHONE_PATTERN.match(sanitized_phone):
            return False, 'Formato de teléfono no válido'
        
        # Eliminar espacios para formato final
        clean_phone = re.sub(r'\s', '', sanitized_phone)
        
        return True, clean_phone
    
    @classmethod
    def validate_date(cls, appointment_date: str) -> Tuple[bool, str]:
        """
        Validar fecha de cita
        """
        if not appointment_date:
            return False, 'Fecha requerida'
        
        try:
            parsed_date = datetime.strptime(appointment_date, '%Y-%m-%d').date()
        except ValueError:
            return False, 'Formato de fecha no válido'
        
        today = timezone.now().date()
        
        # No permitir fechas pasadas
        if parsed_date < today:
            return False, 'No se pueden agendar citas en fechas pasadas'
        
        # No permitir fechas muy lejanas (más de 6 meses)
        from datetime import timedelta
        max_date = today + timedelta(days=180)
        if parsed_date > max_date:
            return False, 'No se pueden agendar citas con más de 6 meses de anticipación'
        
        # Verificar que sea día laborable (lunes a viernes)
        if parsed_date.weekday() >= 5:  # 5=sábado, 6=domingo
            return False, 'Solo se permiten citas de lunes a viernes'
        
        return True, appointment_date
    
    @classmethod
    def validate_time(cls, appointment_time: str) -> Tuple[bool, str]:
        """
        Validar hora de cita
        """
        if not appointment_time:
            return False, 'Hora requerida'
        
        try:
            parsed_time = datetime.strptime(appointment_time, '%H:%M').time()
        except ValueError:
            return False, 'Formato de hora no válido'
        
        # Horarios permitidos: 09:00-13:30 y 17:00-20:30
        morning_start = time(9, 0)
        morning_end = time(13, 30)
        afternoon_start = time(17, 0)
        afternoon_end = time(20, 30)
        
        is_morning = morning_start <= parsed_time <= morning_end
        is_afternoon = afternoon_start <= parsed_time <= afternoon_end
        
        if not (is_morning or is_afternoon):
            return False, 'Hora fuera del horario de atención'
        
        # Solo permitir intervalos de 30 minutos
        if parsed_time.minute not in [0, 30]:
            return False, 'Solo se permiten citas cada 30 minutos'
        
        return True, appointment_time
    
    @classmethod
    def validate_comment(cls, comment: str) -> Tuple[bool, str]:
        """
        Validar comentario
        """
        if not comment:
            return True, ''  # Comentario es opcional
        
        sanitized_comment = cls.sanitize_string(comment)
        
        if len(sanitized_comment) > 500:
            return False, 'El comentario no puede exceder 500 caracteres'
        
        # Verificar spam
        if cls._is_spam_content(sanitized_comment):
            return False, 'Comentario no válido'
        
        return True, sanitized_comment
    
    @classmethod
    def _is_spam_content(cls, content: str) -> bool:
        """
        Detectar contenido spam
        """
        content_lower = content.lower()
        
        for keyword in cls.SPAM_KEYWORDS:
            if keyword in content_lower:
                logger.warning(f"Spam keyword detected: {keyword}")
                return True
        
        # Detectar muchos caracteres repetidos
        if re.search(r'(.)\1{10,}', content):
            return True
        
        # Detectar muchas URLs
        url_count = len(re.findall(r'http[s]?://', content_lower))
        if url_count > 2:
            return True
        
        return False

class AppointmentValidator:
    """
    Validador específico para datos de citas
    """
    
    @staticmethod
    def validate_appointment_data(data: Dict) -> Tuple[bool, Dict, Dict]:
        """
        Validar todos los datos de una cita
        
        Returns:
            - bool: Si es válido
            - dict: Datos sanitizados
            - dict: Errores de validación
        """
        errors = {}
        sanitized_data = {}
        
        # Validar nombre
        if 'name' in data:
            is_valid, result = DataValidator.validate_name(data['name'])
            if is_valid:
                sanitized_data['name'] = result
            else:
                errors['name'] = result
        
        # Validar email (opcional)
        if 'email' in data and data['email']:
            is_valid, result = DataValidator.validate_email(data['email'])
            if is_valid:
                sanitized_data['email'] = result
            else:
                errors['email'] = result
        
        # Validar teléfono (opcional)
        if 'phone' in data and data['phone']:
            is_valid, result = DataValidator.validate_phone(data['phone'])
            if is_valid:
                sanitized_data['phone'] = result
            else:
                errors['phone'] = result
        
        # Validar que tenga al menos email o teléfono
        has_email = 'email' in sanitized_data
        has_phone = 'phone' in sanitized_data
        
        if not has_email and not has_phone:
            errors['contact'] = 'Debe proporcionar al menos un email o teléfono'
        
        # Validar método de confirmación
        confirmation_method = data.get('confirmation_method', 'email')
        if confirmation_method == 'email' and not has_email:
            errors['email'] = 'Email requerido para confirmación por email'
        elif confirmation_method == 'whatsapp' and not has_phone:
            errors['phone'] = 'Teléfono requerido para confirmación por WhatsApp'
        
        sanitized_data['confirmation_method'] = confirmation_method
        
        # Validar fecha
        if 'date' in data:
            is_valid, result = DataValidator.validate_date(data['date'])
            if is_valid:
                sanitized_data['date'] = result
            else:
                errors['date'] = result
        
        # Validar hora
        if 'time' in data:
            is_valid, result = DataValidator.validate_time(data['time'])
            if is_valid:
                sanitized_data['time'] = result
            else:
                errors['time'] = result
        
        # Validar comentario
        if 'notes' in data or 'comment' in data:
            comment = data.get('notes') or data.get('comment', '')
            is_valid, result = DataValidator.validate_comment(comment)
            if is_valid:
                if result:  # Solo agregar si no está vacío
                    sanitized_data['notes'] = result
            else:
                errors['comment'] = result
        
        is_valid = len(errors) == 0
        
        if is_valid:
            logger.info(f"Appointment data validated successfully for email: {sanitized_data.get('email', 'N/A')}")
        else:
            logger.warning(f"Appointment validation failed: {errors}")
        
        return is_valid, sanitized_data, errors
