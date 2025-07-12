import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Phone, Mail, Star, Heart, Award, CheckCircle, Loader, Users, AlertCircle } from 'lucide-react';
import { appointmentService } from '../services/appointments';
import { formSubmissionRateLimiter } from '../utils/rateLimiter';
import SEO from '../components/SEO';

// Funciones de validación y sanitización
const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>\"'&]/g, '');
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[\d\s\-()]{9,20}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

const validateName = (name: string): boolean => {
  return name.length >= 2 && name.length <= 100 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name);
};

const AppointmentsPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    comment: '',
    confirmation_method: 'email' as 'email' | 'whatsapp'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [businessHours, setBusinessHours] = useState<string[]>([]);
  const [dateValidation, setDateValidation] = useState<{isValid: boolean; message: string} | null>(null);

  // Función para cargar horarios de negocio
  const loadBusinessHours = async () => {
    try {
      const response = await appointmentService.getBusinessHours();
      // Manejar ambos formatos del API
      const slots = response.available_slots || response.time_slots || [];
      setBusinessHours(slots);
      console.log('📅 Horarios de negocio cargados:', slots);
    } catch (error) {
      console.error('❌ Error al cargar horarios de negocio:', error);
      // Usar horarios por defecto si falla la carga
      setBusinessHours([
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
        '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'
      ]);
    }
  };

  // Función para validar una fecha
  const validateSelectedDate = async (selectedDate: string) => {
    if (!selectedDate) {
      setDateValidation(null);
      return;
    }

    // Validación local como respaldo
    const dateObj = new Date(selectedDate);
    const dayOfWeek = dateObj.getDay(); // 0 = domingo, 1 = lunes, ..., 6 = sábado
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // domingo o sábado

    try {
      console.log('🔍 Validando fecha:', selectedDate);
      console.log('📅 Día de la semana:', dayOfWeek, isWeekend ? '(fin de semana)' : '(día laborable)');
      
      const validation = await appointmentService.validateDate(selectedDate);
      console.log('📋 Respuesta de validación del backend:', validation);
      
      setDateValidation({
        isValid: validation.is_valid,
        message: validation.message
      });
    } catch (error) {
      console.error('❌ Error al validar fecha con backend:', error);
      
      // Si falla el backend, usar validación local
      if (isWeekend) {
        setDateValidation({
          isValid: false,
          message: 'Los fines de semana no están disponibles para citas. Por favor, selecciona un día de lunes a viernes.'
        });
      } else {
        setDateValidation({
          isValid: true,
          message: 'Fecha disponible para citas'
        });
      }
    }
  };

  // Función para cargar las horas ocupadas cuando cambie la fecha
  const loadBookedTimes = async (selectedDate: string) => {
    if (!selectedDate) {
      setBookedTimes([]);
      return;
    }

    console.log('🗓️ Cargando horas ocupadas para:', selectedDate);
    setLoadingTimes(true);
    try {
      const booked = await appointmentService.getBookedAppointments(selectedDate);
      console.log('✅ Horas ocupadas cargadas:', booked);
      setBookedTimes(booked);
    } catch (error) {
      console.error('❌ Error al cargar horas ocupadas:', error);
      setBookedTimes([]);
    } finally {
      setLoadingTimes(false);
    }
  };

  // Effect para cargar horarios de negocio al montar el componente
  useEffect(() => {
    loadBusinessHours();
  }, []);

  // Effect para validar fecha y cargar horas ocupadas cuando cambie la fecha
  useEffect(() => {
    if (formData.date) {
      validateSelectedDate(formData.date);
      loadBookedTimes(formData.date);
    } else {
      setDateValidation(null);
      setBookedTimes([]);
    }
  }, [formData.date]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Sanitizar input según el tipo de campo
    let sanitizedValue = value;
    if (name === 'name') {
      sanitizedValue = sanitizeInput(value);
    } else if (name === 'email') {
      sanitizedValue = value.toLowerCase().trim();
    } else if (name === 'phone') {
      sanitizedValue = value.replace(/[^\d+\s\-()]/g, '');
    } else if (name === 'comment') {
      sanitizedValue = sanitizeInput(value);
    }
    
    // Si cambió la fecha, resetear la hora seleccionada
    if (name === 'date') {
      setFormData(prev => ({
        ...prev,
        [name]: sanitizedValue,
        time: '' // Resetear la hora cuando cambie la fecha
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: sanitizedValue
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setValidationErrors({});
    
    // Verificar rate limiting basado en IP/sesión
    const clientId = 'form_submission'; // En producción, usar IP o ID de sesión
    
    if (!formSubmissionRateLimiter.isAllowed(clientId)) {
      const timeUntilReset = Math.ceil(formSubmissionRateLimiter.getTimeUntilReset(clientId) / 1000);
      setError(`Has enviado demasiadas solicitudes. Intenta de nuevo en ${timeUntilReset} segundos.`);
      setIsSubmitting(false);
      return;
    }
    
    // Validación robusta del frontend
    const errors: {[key: string]: string} = {};
    
    // Validar nombre
    if (!formData.name) {
      errors.name = 'El nombre es requerido.';
    } else if (!validateName(formData.name)) {
      errors.name = 'El nombre debe tener entre 2 y 100 caracteres y solo contener letras.';
    }
    
    // Validar que tenga al menos email o teléfono
    if (!formData.email && !formData.phone) {
      errors.contact = 'Debe proporcionar al menos un email o un teléfono.';
    }
    
    // Validar email si se proporciona
    if (formData.email && !validateEmail(formData.email)) {
      errors.email = 'El formato del email no es válido.';
    }
    
    // Validar teléfono si se proporciona
    if (formData.phone && !validatePhone(formData.phone)) {
      errors.phone = 'El formato del teléfono no es válido.';
    }
    
    // Validar que el método de confirmación coincida con los datos
    if (formData.confirmation_method === 'email' && !formData.email) {
      errors.email = 'Para confirmación por email, debe proporcionar un email válido.';
    }
    
    if (formData.confirmation_method === 'whatsapp' && !formData.phone) {
      errors.phone = 'Para confirmación por WhatsApp, debe proporcionar un teléfono válido.';
    }
    
    // Validar fecha
    if (!formData.date) {
      errors.date = 'La fecha es requerida.';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        errors.date = 'No se pueden agendar citas en fechas pasadas.';
      }
    }
    
    // Validar hora
    if (!formData.time) {
      errors.time = 'La hora es requerida.';
    }
    
    // Validar comentarios (límite de caracteres)
    if (formData.comment && formData.comment.length > 500) {
      errors.comment = 'El comentario no puede exceder 500 caracteres.';
    }
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Registrar el intento de envío
      formSubmissionRateLimiter.recordAttempt(clientId);
      
      // Crear la cita usando la API real con datos sanitizados
      const appointmentData = {
        user: 1, // Por ahora usamos un user por defecto
        name: sanitizeInput(formData.name),
        email: formData.email ? formData.email.toLowerCase().trim() : undefined,
        phone: formData.phone ? formData.phone.replace(/\s/g, '') : undefined,
        confirmation_method: formData.confirmation_method,
        date: formData.date,
        time: formData.time,
        notes: formData.comment ? sanitizeInput(formData.comment) : undefined,
        status: 'pending' as const
      };

      const response = await appointmentService.createAppointment(appointmentData);
      console.log('Cita creada:', response);
      
      setSubmitted(true);
      
    } catch (err: any) {
      console.error('Error al crear cita:', err);
      
      // Manejar errores de validación del backend
      if (err?.response?.data) {
        const backendErrors = err.response.data;
        if (typeof backendErrors === 'object') {
          setValidationErrors(backendErrors);
        } else {
          setError(backendErrors || 'Error al agendar la cita.');
        }
      } else {
        setError('Error al agendar la cita. Por favor, intenta de nuevo.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Usar horarios de negocio o por defecto
  const timeSlots = (businessHours && businessHours.length > 0) ? businessHours : [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'
  ];

  // Filtrar horas disponibles eliminando las ya ocupadas y considerando validación de fecha
  const availableTimeSlots = dateValidation?.isValid !== false 
    ? timeSlots.filter(time => !bookedTimes.includes(time))
    : [];
  
  // Log para debugging
  console.log('🕐 Todas las horas:', timeSlots);
  console.log('🚫 Horas ocupadas:', bookedTimes);
  console.log('✅ Horas disponibles:', availableTimeSlots);

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F5F2] to-[#FAF7F4] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#8A2E3B] mb-4">
            ¡Gracias!
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Hemos recibido tu solicitud de cita. Te contactaremos muy pronto para confirmar todos los detalles.
          </p>
          <div className="space-y-3 text-sm text-gray-600 mb-8">
            <p>📧 Te enviaremos un email de confirmación</p>
            <p>📞 Nos pondremos en contacto contigo en 24 horas</p>
            <p>💝 ¡Estamos emocionadas de conocerte!</p>
          </div>
          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({
                name: '',
                email: '',
                phone: '',
                date: '',
                time: '',
                comment: '',
                confirmation_method: 'email'
              });
            }}
            className="w-full px-6 py-3 bg-[#8A2E3B] text-white font-semibold rounded-lg hover:bg-[#A13347] transition-colors"
          >
            Agendar Otra Cita
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F5F2] to-[#FAF7F4]">
      {/* SEO Component */}
      <SEO />
      
      {/* Encabezado cálido y personal */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#8A2E3B] mb-6 tracking-tight">
            Reserva tu Cita
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed max-w-3xl mx-auto">
            Será un placer atenderte y ayudarte a encontrar el vestido de tus sueños. 
            <br className="hidden md:block" />
            <span className="text-[#D4B483] font-medium">¡Agenda tu visita con nosotras!</span>
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Formulario de reserva */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#8A2E3B] mb-8 text-center">
                Completa tus datos
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Error message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="text-red-600 text-sm">
                      ❌ {error}
                    </div>
                  </div>
                )}

                {/* Validation error for contact methods */}
                {validationErrors.contact && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="text-red-600 text-sm">
                      ❌ {validationErrors.contact}
                    </div>
                  </div>
                )}

                {/* Nombre completo */}
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    maxLength={100}
                    className={`w-full px-6 py-4 text-lg border-2 rounded-xl focus:ring-2 focus:ring-[#D4B483] focus:border-[#D4B483] transition-all duration-300 ${
                      validationErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                    placeholder="Tu nombre completo"
                  />
                  {validationErrors.name && (
                    <p className="text-red-600 text-sm mt-1">{validationErrors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3">
                    Email
                    <span className="text-sm text-gray-500 font-normal"> (requerido si eliges confirmación por email)</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-6 py-4 text-lg border-2 rounded-xl focus:ring-2 focus:ring-[#D4B483] focus:border-[#D4B483] transition-all duration-300 ${
                      validationErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                    placeholder="tu@email.com"
                  />
                  {validationErrors.email && (
                    <p className="text-red-600 text-sm mt-1">{validationErrors.email}</p>
                  )}
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3">
                    Teléfono
                    <span className="text-sm text-gray-500 font-normal"> (requerido si eliges confirmación por WhatsApp)</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-6 py-4 text-lg border-2 rounded-xl focus:ring-2 focus:ring-[#D4B483] focus:border-[#D4B483] transition-all duration-300 ${
                      validationErrors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                    placeholder="+34 123 456 789"
                  />
                  {validationErrors.phone && (
                    <p className="text-red-600 text-sm mt-1">{validationErrors.phone}</p>
                  )}
                </div>

                {/* Método de confirmación */}
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3">
                    ¿Cómo prefieres que te confirmemos la cita? *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-[#D4B483] transition-colors">
                      <input
                        type="radio"
                        name="confirmation_method"
                        value="email"
                        checked={formData.confirmation_method === 'email'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-[#8A2E3B] focus:ring-[#D4B483]"
                      />
                      <Mail className="w-5 h-5 text-gray-600" />
                      <span className="text-lg">Email</span>
                    </label>
                    <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-[#D4B483] transition-colors">
                      <input
                        type="radio"
                        name="confirmation_method"
                        value="whatsapp"
                        checked={formData.confirmation_method === 'whatsapp'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-[#8A2E3B] focus:ring-[#D4B483]"
                      />
                      <Phone className="w-5 h-5 text-gray-600" />
                      <span className="text-lg">WhatsApp</span>
                    </label>
                  </div>
                </div>

                {/* Fecha y hora en grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Fecha preferida */}
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-3">
                      Fecha preferida *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-4 w-6 h-6 text-gray-400" />
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className={`w-full pl-14 pr-6 py-4 text-lg border-2 rounded-xl focus:ring-2 focus:ring-[#D4B483] focus:border-[#D4B483] transition-all duration-300 ${
                          dateValidation?.isValid === false || validationErrors.date
                            ? 'border-red-300 bg-red-50' 
                            : 'border-gray-200'
                        }`}
                      />
                    </div>
                    
                    {/* Validación de fecha */}
                    {validationErrors.date && (
                      <p className="text-red-600 text-sm mt-1">{validationErrors.date}</p>
                    )}
                    {dateValidation && !validationErrors.date && (
                      <div className={`mt-2 p-3 rounded-lg flex items-center gap-2 ${
                        dateValidation.isValid 
                          ? 'bg-green-50 text-green-700' 
                          : 'bg-red-50 text-red-700'
                      }`}>
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm">{dateValidation.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Hora preferida */}
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-3">
                      Hora preferida *
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-4 w-6 h-6 text-gray-400" />
                      <select
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        required
                        disabled={!formData.date || loadingTimes}
                        className={`w-full pl-14 pr-6 py-4 text-lg border-2 rounded-xl focus:ring-2 focus:ring-[#D4B483] focus:border-[#D4B483] transition-all duration-300 appearance-none disabled:bg-gray-100 disabled:cursor-not-allowed ${
                          validationErrors.time ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        }`}
                      >
                        <option value="">
                          {!formData.date ? 'Primero selecciona una fecha' : 
                           dateValidation?.isValid === false ? 'Fecha no disponible para citas' :
                           loadingTimes ? 'Cargando horas disponibles...' : 
                           availableTimeSlots.length === 0 ? 'No hay horas disponibles' :
                           'Selecciona una hora'}
                        </option>
                        {availableTimeSlots.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                    {validationErrors.time && (
                      <p className="text-red-600 text-sm mt-1">{validationErrors.time}</p>
                    )}
                  </div>
                  
                  {/* Información sobre disponibilidad */}
                  {formData.date && !loadingTimes && (
                    <div className="mt-3">
                      {dateValidation?.isValid === false && (
                        <p className="text-sm text-red-600 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Esta fecha no está disponible para citas. Por favor, selecciona una fecha de lunes a viernes.
                        </p>
                      )}
                      {dateValidation?.isValid !== false && bookedTimes.length > 0 && availableTimeSlots.length > 0 && (
                        <p className="text-sm text-amber-600 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Hay {bookedTimes.length} hora{bookedTimes.length !== 1 ? 's' : ''} ya reservada{bookedTimes.length !== 1 ? 's' : ''} para esta fecha
                        </p>
                      )}
                      {dateValidation?.isValid !== false && bookedTimes.length > 0 && availableTimeSlots.length === 0 && (
                        <p className="text-sm text-red-600 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Lo sentimos, no hay horas disponibles para esta fecha. Por favor, selecciona otra fecha.
                        </p>
                      )}
                      {bookedTimes.length === 0 && (
                        <p className="text-sm text-green-600 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          ¡Todas las horas están disponibles para esta fecha!
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Mensaje adicional */}
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3">
                    Mensaje adicional
                    <span className="text-sm text-gray-500 font-normal"> (máximo 500 caracteres)</span>
                  </label>
                  <textarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleInputChange}
                    rows={4}
                    maxLength={500}
                    className={`w-full px-6 py-4 text-lg border-2 rounded-xl focus:ring-2 focus:ring-[#D4B483] focus:border-[#D4B483] transition-all duration-300 resize-none ${
                      validationErrors.comment ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                    placeholder="Cuéntanos sobre tu boda, estilo preferido, o cualquier pregunta que tengas..."
                  />
                  <div className="flex justify-between items-center mt-1">
                    {validationErrors.comment && (
                      <p className="text-red-600 text-sm">{validationErrors.comment}</p>
                    )}
                    <p className="text-gray-500 text-sm ml-auto">
                      {formData.comment.length}/500 caracteres
                    </p>
                  </div>
                </div>

                {/* Botón de envío */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-8 py-6 bg-[#8A2E3B] text-white text-xl font-semibold rounded-xl shadow-lg hover:bg-[#A13347] transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="w-6 h-6 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Calendar className="w-6 h-6" />
                        Reservar mi Cita
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Información lateral */}
          <div className="space-y-8">
            {/* Información de contacto */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-serif font-bold text-[#8A2E3B] mb-6">
                Información de Contacto
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#D4B483] rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#8A2E3B] mb-1">Dirección</h4>
                    <p className="text-gray-600">Calle Gorrion Nº13<br />Puerto Serrano</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#D4B483] rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#8A2E3B] mb-1">Teléfono</h4>
                    <p className="text-gray-600">+34 123 456 789<br />+34 123 456 789</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#D4B483] rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#8A2E3B] mb-1">Email</h4>
                    <p className="text-gray-600">info@ortanovias.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#D4B483] rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#8A2E3B] mb-1">Horarios</h4>
                    <p className="text-gray-600">Lun-Vie: 09:00-13:30/17:00-20:30</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-4">Contacto directo:</p>
                <div className="flex gap-3">
                  <a
                    href="tel:+34123456789"
                    className="flex-1 px-4 py-3 bg-[#25D366] text-white rounded-lg text-center font-semibold hover:bg-[#22c55e] transition-colors"
                  >
                    WhatsApp
                  </a>
                  <a
                    href="tel:+34123456789"
                    className="flex-1 px-4 py-3 bg-[#8A2E3B] text-white rounded-lg text-center font-semibold hover:bg-[#A13347] transition-colors"
                  >
                    Llamar
                  </a>
                </div>
              </div>
            </div>

            {/* Experiencia personalizada */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-serif font-bold text-[#8A2E3B] mb-6">
                Tu Experiencia VIP
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#D4B483] rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-700">Asesoramiento exclusivo y personalizado</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#D4B483] rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-700">Atención privada sin prisas</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#D4B483] rounded-full flex items-center justify-center flex-shrink-0">
                    <Award className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-700">Ambiente exclusivo con champagne</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-[#F8F5F2] rounded-lg">
                <p className="text-sm text-gray-600 italic">
                  "Nos pondremos en contacto contigo para confirmar la cita y preparar todo para tu visita especial."
                </p>
              </div>
            </div>

            {/* Testimonio */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 text-[#D4B483] fill-current" />
                ))}
              </div>
              
              <p className="text-gray-700 italic mb-4">
                "Desde el momento en que entré, me sentí como una princesa. La atención fue increíble y encontré el vestido perfecto."
              </p>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#D4B483] rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-[#8A2E3B]">Ana Martínez</p>
                  <p className="text-sm text-gray-600">Novia 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsPage;
