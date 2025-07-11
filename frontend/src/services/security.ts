import api from './api';

export interface IPReputation {
  risk_level: 'low' | 'medium' | 'high';
  failed_validations: number;
  suspicious_patterns: number;
  blocked_emails: number;
  last_activity: string | null;
}

export interface SecurityStatus {
  ip: string;
  reputation: IPReputation;
  is_blocked: boolean;
  timestamp: string;
}

export interface SecuritySummary {
  period_hours: number;
  timestamp: string;
  total_alerts: number;
  blocked_ips: string[];
  top_suspicious_patterns: string[];
  recommendations: string[];
}

export class SecurityService {
  /**
   * Obtener estado de seguridad para una IP específica (solo admin)
   */
  static async getIPSecurityStatus(ip: string): Promise<SecurityStatus> {
    try {
      const response = await api.get(`/appointments/security_status/?ip=${encodeURIComponent(ip)}`);
      return response.data as SecurityStatus;
    } catch (error) {
      console.error('Error fetching IP security status:', error);
      throw new Error('Error al obtener estado de seguridad de la IP');
    }
  }

  /**
   * Obtener resumen de seguridad (solo admin)
   */
  static async getSecuritySummary(hours: number = 24): Promise<SecuritySummary> {
    try {
      const response = await api.get(`/appointments/security_summary/?hours=${hours}`);
      return response.data as SecuritySummary;
    } catch (error) {
      console.error('Error fetching security summary:', error);
      throw new Error('Error al obtener resumen de seguridad');
    }
  }

  /**
   * Obtener color según nivel de riesgo
   */
  static getRiskLevelColor(riskLevel: string): string {
    switch (riskLevel) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
      default:
        return 'text-green-600 bg-green-50';
    }
  }

  /**
   * Obtener descripción del nivel de riesgo
   */
  static getRiskLevelDescription(riskLevel: string): string {
    switch (riskLevel) {
      case 'high':
        return 'Alto Riesgo - Requiere atención inmediata';
      case 'medium':
        return 'Riesgo Medio - Monitorear de cerca';
      case 'low':
      default:
        return 'Riesgo Bajo - Actividad normal';
    }
  }

  /**
   * Formatear fecha para mostrar
   */
  static formatDate(dateString: string | null): string {
    if (!dateString) return 'Nunca';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Fecha inválida';
    }
  }

  /**
   * Validar formato de IP
   */
  static isValidIP(ip: string): boolean {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    
    if (ipv4Regex.test(ip)) {
      // Validar rangos IPv4
      const parts = ip.split('.');
      return parts.every(part => {
        const num = parseInt(part, 10);
        return num >= 0 && num <= 255;
      });
    }
    
    return ipv6Regex.test(ip);
  }

  /**
   * Obtener recomendaciones de seguridad basadas en el estado
   */
  static getSecurityRecommendations(status: SecurityStatus): string[] {
    const recommendations: string[] = [];
    const { reputation, is_blocked } = status;

    if (is_blocked) {
      recommendations.push('🚫 IP bloqueada - Considerar revisión manual');
    }

    if (reputation.risk_level === 'high') {
      recommendations.push('⚠️ Revisar actividad reciente de esta IP');
      recommendations.push('🔍 Considerar bloqueo temporal si es necesario');
    }

    if (reputation.failed_validations > 5) {
      recommendations.push('📊 Alta tasa de validaciones fallidas - Posible actividad automatizada');
    }

    if (reputation.suspicious_patterns > 0) {
      recommendations.push('🔍 Patrones sospechosos detectados - Revisar logs detallados');
    }

    if (reputation.blocked_emails > 0) {
      recommendations.push('📧 Intentos de uso de emails bloqueados - Monitorear');
    }

    if (recommendations.length === 0) {
      recommendations.push('✅ Actividad normal - Sin acciones requeridas');
    }

    return recommendations;
  }
}
