import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Phone, Mail, Star, Heart, Award, CheckCircle, Loader, Users } from 'lucide-react';

const AppointmentsPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    message: '',
    howDidYouKnow: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular envío del formulario
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'
  ];

  const howDidYouKnowOptions = [
    'Redes sociales (Instagram/Facebook)',
    'Recomendación de una amiga',
    'Búsqueda en Google',
    'Publicidad online',
    'Revista o periódico',
    'Pasé por la tienda',
    'Otro'
  ];

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
                fullName: '',
                email: '',
                phone: '',
                preferredDate: '',
                preferredTime: '',
                message: '',
                howDidYouKnow: ''
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
                {/* Nombre completo */}
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4B483] focus:border-[#D4B483] transition-all duration-300"
                    placeholder="Tu nombre completo"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4B483] focus:border-[#D4B483] transition-all duration-300"
                    placeholder="tu@email.com"
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4B483] focus:border-[#D4B483] transition-all duration-300"
                    placeholder="+34 123 456 789"
                  />
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
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleInputChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full pl-14 pr-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4B483] focus:border-[#D4B483] transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Hora preferida */}
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-3">
                      Hora preferida *
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-4 w-6 h-6 text-gray-400" />
                      <select
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-14 pr-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4B483] focus:border-[#D4B483] transition-all duration-300 appearance-none"
                      >
                        <option value="">Selecciona una hora</option>
                        {timeSlots.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Mensaje adicional */}
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3">
                    Mensaje adicional
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4B483] focus:border-[#D4B483] transition-all duration-300 resize-none"
                    placeholder="Cuéntanos sobre tu boda, estilo preferido, o cualquier pregunta que tengas..."
                  />
                </div>

                {/* ¿Cómo nos conociste? */}
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3">
                    ¿Cómo nos conociste?
                  </label>
                  <select
                    name="howDidYouKnow"
                    value={formData.howDidYouKnow}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4B483] focus:border-[#D4B483] transition-all duration-300"
                  >
                    <option value="">Selecciona una opción</option>
                    {howDidYouKnowOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
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
                    <p className="text-gray-600">Lun-Sáb: 09:00-14:00/17:00-21:00</p>
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
