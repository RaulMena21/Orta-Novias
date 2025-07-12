"""
Servicio de WhatsApp Business API para Orta Novias
Soporte para Meta Business API y Twilio
"""
import os
import logging
import requests
from datetime import datetime
from typing import Optional, Dict, Any
from django.conf import settings

logger = logging.getLogger(__name__)


class WhatsAppService:
    """Servicio para envío de mensajes WhatsApp"""
    
    def __init__(self):
        self.use_twilio = getattr(settings, 'USE_TWILIO', False)
        self.meta_token = getattr(settings, 'WHATSAPP_API_TOKEN', None)
        self.phone_number_id = getattr(settings, 'WHATSAPP_PHONE_NUMBER_ID', None)
        
        if self.use_twilio:
            self._init_twilio()
        else:
            self._init_meta()
    
    def _init_twilio(self):
        """Inicializar cliente Twilio"""
        try:
            from twilio.rest import Client
            self.twilio_sid = getattr(settings, 'TWILIO_ACCOUNT_SID', None)
            self.twilio_token = getattr(settings, 'TWILIO_AUTH_TOKEN', None)
            self.twilio_from = getattr(settings, 'TWILIO_WHATSAPP_FROM', None)
            
            if not all([self.twilio_sid, self.twilio_token, self.twilio_from]):
                raise ValueError("Faltan credenciales de Twilio")
            
            self.client = Client(self.twilio_sid, self.twilio_token)
            logger.info("Cliente Twilio inicializado correctamente")
            
        except ImportError:
            logger.error("Instalar: pip install twilio")
            raise
        except Exception as e:
            logger.error(f"Error inicializando Twilio: {e}")
            raise
    
    def _init_meta(self):
        """Inicializar Meta Business API"""
        if not all([self.meta_token, self.phone_number_id]):
            raise ValueError("Faltan credenciales de Meta Business API")
        
        self.base_url = f"https://graph.facebook.com/v17.0/{self.phone_number_id}/messages"
        self.headers = {
            "Authorization": f"Bearer {self.meta_token}",
            "Content-Type": "application/json"
        }
        logger.info("Meta Business API inicializada correctamente")
    
    def format_phone_number(self, phone: str) -> str:
        """Formatear número de teléfono a formato internacional"""
        # Limpiar número
        phone = ''.join(filter(str.isdigit, phone))
        
        # Si empieza con 6, 7, 8, 9 asumir España (+34)
        if phone.startswith(('6', '7', '8', '9')) and len(phone) == 9:
            phone = f"34{phone}"
        
        # Si no empieza con código de país, asumir España
        if not phone.startswith('34') and len(phone) == 9:
            phone = f"34{phone}"
        
        return f"+{phone}"
    
    def send_message(self, phone: str, message: str) -> Dict[str, Any]:
        """Enviar mensaje de texto"""
        try:
            phone = self.format_phone_number(phone)
            
            if self.use_twilio:
                return self._send_twilio_message(phone, message)
            else:
                return self._send_meta_message(phone, message)
                
        except Exception as e:
            logger.error(f"Error enviando mensaje a {phone}: {e}")
            return {
                'success': False,
                'error': str(e),
                'message_id': None
            }
    
    def _send_twilio_message(self, phone: str, message: str) -> Dict[str, Any]:
        """Enviar mensaje usando Twilio"""
        try:
            message_obj = self.client.messages.create(
                body=message,
                from_=self.twilio_from,
                to=f'whatsapp:{phone}'
            )
            
            logger.info(f"Mensaje Twilio enviado: {message_obj.sid}")
            return {
                'success': True,
                'message_id': message_obj.sid,
                'provider': 'twilio'
            }
            
        except Exception as e:
            logger.error(f"Error Twilio: {e}")
            raise
    
    def _send_meta_message(self, phone: str, message: str) -> Dict[str, Any]:
        """Enviar mensaje usando Meta Business API"""
        try:
            # Remover el + del número para Meta API
            phone_clean = phone.replace('+', '')
            
            data = {
                "messaging_product": "whatsapp",
                "to": phone_clean,
                "text": {"body": message}
            }
            
            response = requests.post(
                self.base_url,
                headers=self.headers,
                json=data,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                message_id = result.get('messages', [{}])[0].get('id')
                
                logger.info(f"Mensaje Meta enviado: {message_id}")
                return {
                    'success': True,
                    'message_id': message_id,
                    'provider': 'meta'
                }
            else:
                error_msg = f"Error Meta API: {response.status_code} - {response.text}"
                logger.error(error_msg)
                raise Exception(error_msg)
                
        except Exception as e:
            logger.error(f"Error Meta API: {e}")
            raise
    
    def send_appointment_confirmation(self, phone: str, appointment_data: Dict) -> Dict[str, Any]:
        """Enviar confirmación de cita"""
        message = self._format_appointment_confirmation(appointment_data)
        return self.send_message(phone, message)
    
    def send_appointment_reminder(self, phone: str, appointment_data: Dict) -> Dict[str, Any]:
        """Enviar recordatorio de cita"""
        message = self._format_appointment_reminder(appointment_data)
        return self.send_message(phone, message)
    
    def send_follow_up(self, phone: str, client_name: str) -> Dict[str, Any]:
        """Enviar seguimiento post-cita"""
        message = self._format_follow_up(client_name)
        return self.send_message(phone, message)
    
    def _format_appointment_confirmation(self, data: Dict) -> str:
        """Template para confirmación de cita"""
        return f"""¡Hola {data.get('client_name', '')}! 👗

Tu cita en Orta Novias está confirmada:

📅 {data.get('date', '')} a las {data.get('time', '')}
📍 {data.get('address', 'Nuestro showroom')}
👩‍💼 Consultora: {data.get('consultant', 'Nuestro equipo')}

💡 Consejos para tu cita:
• Trae zapatos de tacón similar al que usarás
• Ropa interior sin costuras
• Acompañante de confianza (máx. 2 personas)

¿Alguna pregunta? ¡Responde a este mensaje!

✨ Orta Novias - Haciendo realidad tu sueño"""
    
    def _format_appointment_reminder(self, data: Dict) -> str:
        """Template para recordatorio de cita"""
        return f"""¡Hola {data.get('client_name', '')}! 💍

Te recordamos tu cita MAÑANA:
🕐 {data.get('time', '')} en Orta Novias

📋 Si tienes tus medidas, tráelas:
• Busto: ___
• Cintura: ___
• Cadera: ___

🚗 Dirección: {data.get('address', 'Nuestro showroom')}

¡Estamos emocionadas de verte!

✨ Orta Novias"""
    
    def _format_follow_up(self, client_name: str) -> str:
        """Template para seguimiento"""
        return f"""¡Hola {client_name}! ✨

¡Gracias por visitarnos hoy en Orta Novias!

💭 ¿Qué te pareció tu experiencia?
📸 Si tienes fotos del vestido, ¡envíanoslas!

🗓️ Próxima cita sugerida: 2-3 semanas
📞 Para citas: responde este mensaje

¡Seguimos haciendo realidad tu sueño!

💕 Equipo Orta Novias"""


# Función de utilidad para usar en views
def send_whatsapp_notification(phone: str, message_type: str, data: Dict = None) -> bool:
    """
    Enviar notificación WhatsApp
    
    Args:
        phone: Número de teléfono
        message_type: 'confirmation', 'reminder', 'follow_up', 'custom'
        data: Datos para el template
    
    Returns:
        bool: True si se envió correctamente
    """
    try:
        service = WhatsAppService()
        
        if message_type == 'confirmation':
            result = service.send_appointment_confirmation(phone, data or {})
        elif message_type == 'reminder':
            result = service.send_appointment_reminder(phone, data or {})
        elif message_type == 'follow_up':
            client_name = data.get('client_name', '') if data else ''
            result = service.send_follow_up(phone, client_name)
        elif message_type == 'custom':
            message = data.get('message', '') if data else ''
            result = service.send_message(phone, message)
        else:
            logger.error(f"Tipo de mensaje no válido: {message_type}")
            return False
        
        return result.get('success', False)
        
    except Exception as e:
        logger.error(f"Error enviando notificación WhatsApp: {e}")
        return False
