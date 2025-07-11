/**
 * Utilidad para rate limiting en el frontend
 * Previene spam de solicitudes
 */

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number; // en milisegundos
}

class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  /**
   * Verifica si una acción está permitida para una clave específica
   */
  isAllowed(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];

    // Filtrar intentos dentro de la ventana de tiempo
    const validAttempts = attempts.filter(
      timestamp => now - timestamp < this.config.windowMs
    );

    // Actualizar el registro
    this.attempts.set(key, validAttempts);

    return validAttempts.length < this.config.maxAttempts;
  }

  /**
   * Registra un intento para una clave específica
   */
  recordAttempt(key: string): void {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    attempts.push(now);
    this.attempts.set(key, attempts);
  }

  /**
   * Obtiene el tiempo restante hasta que se permita el siguiente intento
   */
  getTimeUntilReset(key: string): number {
    const attempts = this.attempts.get(key) || [];
    if (attempts.length === 0) return 0;

    const oldestAttempt = Math.min(...attempts);
    const timeUntilReset = this.config.windowMs - (Date.now() - oldestAttempt);
    
    return Math.max(0, timeUntilReset);
  }

  /**
   * Limpia intentos antiguos para liberar memoria
   */
  cleanup(): void {
    const now = Date.now();
    
    for (const [key, attempts] of this.attempts.entries()) {
      const validAttempts = attempts.filter(
        timestamp => now - timestamp < this.config.windowMs
      );
      
      if (validAttempts.length === 0) {
        this.attempts.delete(key);
      } else {
        this.attempts.set(key, validAttempts);
      }
    }
  }
}

// Configuraciones predefinidas
export const appointmentRateLimiter = new RateLimiter({
  maxAttempts: 3, // máximo 3 intentos
  windowMs: 60 * 1000, // en 1 minuto
});

export const formSubmissionRateLimiter = new RateLimiter({
  maxAttempts: 5, // máximo 5 envíos
  windowMs: 5 * 60 * 1000, // en 5 minutos
});

// Limpiar intentos antiguos cada 5 minutos
setInterval(() => {
  appointmentRateLimiter.cleanup();
  formSubmissionRateLimiter.cleanup();
}, 5 * 60 * 1000);

export { RateLimiter };
