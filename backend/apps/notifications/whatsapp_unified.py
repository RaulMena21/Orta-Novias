"""
Servicio unificado de WhatsApp con múltiples proveedores
Incluye opción GRATUITA (PyWhatKit) y opciones de pago
"""
import os
import logging
from typing import Optional, Dict, Any
from django.conf import settings

logger = logging.getLogger(__name__)


class UnifiedWhatsAppService:
    """Servicio unificado que maneja múltiples proveedores de WhatsApp"""
    
    def __init__(self):
        # Determinar proveedor desde configuración
        self.provider = getattr(settings, 'WHATSAPP_PROVIDER', 'free').lower()
        self.use_free = getattr(settings, 'USE_FREE_WHATSAPP', True)
        
        if self.provider == 'free' or self.use_free:
            self._init_free_service()
        elif self.provider == 'twilio':
            self._init_twilio_service()
        else:
            self._init_meta_service()
        
        logger.info(f"WhatsApp inicializado con proveedor: {self.provider}")
    
    def _init_free_service(self):
        """Inicializar servicio gratuito"""
        try:
            from .whatsapp_free import FreeWhatsAppService
            self.service = FreeWhatsAppService()
            self.provider = 'free'
        except ImportError:
            logger.error("PyWhatKit no instalado. Ejecutar: pip install pywhatkit")
            self._fallback_to_meta()
    
    def _init_twilio_service(self):
        """Inicializar servicio Twilio"""
        try:
            from .whatsapp_service import WhatsAppService
            os.environ['USE_TWILIO'] = 'True'
            self.service = WhatsAppService()
            self.provider = 'twilio'
        except Exception as e:
            logger.error(f"Error inicializando Twilio: {e}")
            self._fallback_to_free()
    
    def _init_meta_service(self):
        """Inicializar servicio Meta Business API"""
        try:
            from .whatsapp_service import WhatsAppService
            os.environ['USE_TWILIO'] = 'False'
            self.service = WhatsAppService()
            self.provider = 'meta'
        except Exception as e:
            logger.error(f"Error inicializando Meta: {e}")
            self._fallback_to_free()
    
    def _fallback_to_free(self):
        """Fallback al servicio gratuito"""
        try:
            from .whatsapp_free import FreeWhatsAppService
            self.service = FreeWhatsAppService()
            self.provider = 'free'
            logger.info("Fallback a servicio gratuito")
        except Exception as e:
            logger.error(f"Error en fallback: {e}")
            self.service = None
    
    def _fallback_to_meta(self):
        """Fallback a Meta Business API"""
        try:
            self._init_meta_service()
        except Exception:
            self.service = None
    
    def is_available(self) -> bool:
        """Verificar si el servicio está disponible"""
        return self.service is not None
    
    def get_provider_info(self) -> Dict[str, Any]:
        """Obtener información del proveedor actual"""
        provider_info = {
            'free': {
                'name': 'PyWhatKit (Gratuito)',
                'cost': '€0.00',
                'limits': 'Sin límites',
                'setup': 'Automático',
                'reliability': 'Media'
            },
            'meta': {
                'name': 'Meta Business API',
                'cost': '1000 gratis/mes, después €0.05-0.15',
                'limits': '1000 conversaciones/mes gratis',
                'setup': 'Requiere configuración',
                'reliability': 'Alta'
            },
            'twilio': {
                'name': 'Twilio',
                'cost': '€0.05 por mensaje',
                'limits': 'Sin límites',
                'setup': 'Fácil',
                'reliability': 'Alta'
            }
        }
        
        return {
            'current_provider': self.provider,
            'available': self.is_available(),
            'info': provider_info.get(self.provider, {}),
            'all_providers': provider_info
        }
    
    def send_message(self, phone: str, message: str) -> Dict[str, Any]:
        """Enviar mensaje usando el proveedor configurado"""
        if not self.is_available():
            return {
                'success': False,
                'error': 'Servicio WhatsApp no disponible',
                'provider': self.provider
            }
        
        try:
            if self.provider == 'free':
                result = self.service.send_message_now(phone, message)
            else:
                result = self.service.send_message(phone, message)
            
            # Agregar información del proveedor
            result['provider'] = self.provider
            return result
            
        except Exception as e:
            logger.error(f"Error enviando mensaje con {self.provider}: {e}")
            return {
                'success': False,
                'error': str(e),
                'provider': self.provider
            }
    
    def send_appointment_confirmation(self, phone: str, appointment_data: Dict) -> Dict[str, Any]:
        """Enviar confirmación de cita"""
        if not self.is_available():
            return {'success': False, 'error': 'Servicio no disponible'}
        
        try:
            result = self.service.send_appointment_confirmation(phone, appointment_data)
            result['provider'] = self.provider
            return result
        except Exception as e:
            logger.error(f"Error enviando confirmación: {e}")
            return {'success': False, 'error': str(e)}
    
    def send_appointment_reminder(self, phone: str, appointment_data: Dict) -> Dict[str, Any]:
        """Enviar recordatorio de cita"""
        if not self.is_available():
            return {'success': False, 'error': 'Servicio no disponible'}
        
        try:
            result = self.service.send_appointment_reminder(phone, appointment_data)
            result['provider'] = self.provider
            return result
        except Exception as e:
            logger.error(f"Error enviando recordatorio: {e}")
            return {'success': False, 'error': str(e)}
    
    def send_follow_up(self, phone: str, client_name: str) -> Dict[str, Any]:
        """Enviar seguimiento post-cita"""
        if not self.is_available():
            return {'success': False, 'error': 'Servicio no disponible'}
        
        try:
            result = self.service.send_follow_up(phone, client_name)
            result['provider'] = self.provider
            return result
        except Exception as e:
            logger.error(f"Error enviando seguimiento: {e}")
            return {'success': False, 'error': str(e)}


# Función de utilidad principal
def send_whatsapp_notification(phone: str, message_type: str, data: Dict = None) -> bool:
    """
    Función principal para enviar notificaciones WhatsApp
    Usa automáticamente el mejor proveedor disponible
    
    Args:
        phone: Número de teléfono
        message_type: 'confirmation', 'reminder', 'follow_up', 'custom'
        data: Datos para el template
    
    Returns:
        bool: True si se envió correctamente
    """
    try:
        service = UnifiedWhatsAppService()
        
        if not service.is_available():
            logger.error("Ningún proveedor de WhatsApp disponible")
            return False
        
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
        
        success = result.get('success', False)
        if success:
            logger.info(f"WhatsApp enviado via {result.get('provider', 'unknown')}")
        
        return success
        
    except Exception as e:
        logger.error(f"Error en servicio unificado WhatsApp: {e}")
        return False


def get_whatsapp_status() -> Dict[str, Any]:
    """Obtener estado y información de los proveedores WhatsApp"""
    try:
        service = UnifiedWhatsAppService()
        return service.get_provider_info()
    except Exception as e:
        return {
            'current_provider': 'none',
            'available': False,
            'error': str(e)
        }
