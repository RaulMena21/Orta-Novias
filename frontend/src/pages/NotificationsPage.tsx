import React, { useState, useEffect } from 'react';
import { Send, Calendar, Settings, Bell, RefreshCw } from 'lucide-react';
import NotificationCenter from '../components/NotificationCenter';
import api from '../services/api';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

interface ReminderSchedule {
  id: number;
  appointment: number;
  reminder_type: string;
  hours_before: number;
  scheduled_time: string;
  is_sent: boolean;
  user_name: string;
  appointment_details: {
    id: number;
    date: string;
    service_type: string;
    user_email: string;
  };
  time_until_reminder: string | null;
}

const NotificationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('center');
  const [users, setUsers] = useState<User[]>([]);
  const [reminders, setReminders] = useState<ReminderSchedule[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Estado para enviar notificación de prueba
  const [testNotification, setTestNotification] = useState({
    user_id: '',
    notification_type: 'email',
    title: '',
    message: '',
    template_name: ''
  });

  useEffect(() => {
    fetchUsers();
    fetchReminders();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users/');
      const data = response.data as { results?: User[] } | User[];
      setUsers(Array.isArray(data) ? data : (data.results || []));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchReminders = async () => {
    try {
      const response = await api.get('/reminders/?pending_only=true');
      const data = response.data as { results?: ReminderSchedule[] } | ReminderSchedule[];
      setReminders(Array.isArray(data) ? data : (data.results || []));
    } catch (error) {
      console.error('Error fetching reminders:', error);
    }
  };

  const sendTestNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await api.post('/notifications/send_test/', testNotification);
      alert('Notificación de prueba enviada exitosamente');
      setTestNotification({
        user_id: '',
        notification_type: 'email',
        title: '',
        message: '',
        template_name: ''
      });
    } catch (error) {
      console.error('Error sending test notification:', error);
      alert('Error al enviar la notificación de prueba');
    } finally {
      setLoading(false);
    }
  };

  const sendReminders = async () => {
    setLoading(true);
    try {
      // Simular envío de recordatorios (en producción esto sería un comando automático)
      alert('Función de envío de recordatorios activada (comando: python manage.py send_reminders)');
      fetchReminders(); // Refrescar la lista
    } catch (error) {
      console.error('Error sending reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'center', label: 'Centro de Notificaciones', icon: Bell },
    { id: 'test', label: 'Enviar Prueba', icon: Send },
    { id: 'reminders', label: 'Recordatorios', icon: Calendar },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Notificaciones</h1>
          <p className="text-gray-600 mt-2">
            Administra el sistema de notificaciones automáticas de Orta Novias
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-pink-500 text-pink-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Contenido de las tabs */}
        {activeTab === 'center' && <NotificationCenter />}

        {activeTab === 'test' && (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Enviar Notificación de Prueba</h2>
            
            <form onSubmit={sendTestNotification} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Usuario de destino
                  </label>
                  <select
                    value={testNotification.user_id}
                    onChange={(e) => setTestNotification({
                      ...testNotification,
                      user_id: e.target.value
                    })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  >
                    <option value="">Seleccionar usuario...</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.first_name} {user.last_name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de notificación
                  </label>
                  <select
                    value={testNotification.notification_type}
                    onChange={(e) => setTestNotification({
                      ...testNotification,
                      notification_type: e.target.value
                    })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="email">Email</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="internal">Mensaje Interno</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={testNotification.title}
                  onChange={(e) => setTestNotification({
                    ...testNotification,
                    title: e.target.value
                  })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Título de la notificación..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje
                </label>
                <textarea
                  value={testNotification.message}
                  onChange={(e) => setTestNotification({
                    ...testNotification,
                    message: e.target.value
                  })}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Contenido del mensaje..."
                  required
                />
              </div>

              {testNotification.notification_type === 'email' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plantilla de email (opcional)
                  </label>
                  <select
                    value={testNotification.template_name}
                    onChange={(e) => setTestNotification({
                      ...testNotification,
                      template_name: e.target.value
                    })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="">Email simple (sin plantilla)</option>
                    <option value="appointment_confirmation">Confirmación de cita</option>
                    <option value="appointment_reminder">Recordatorio de cita</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-6 py-3 bg-pink-600 text-white font-medium rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Enviando...' : 'Enviar Notificación de Prueba'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'reminders' && (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recordatorios Programados</h2>
              <button
                onClick={sendReminders}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Procesar Recordatorios</span>
              </button>
            </div>

            {reminders.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No hay recordatorios pendientes</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usuario
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cita
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Programado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reminders.map((reminder) => (
                      <tr key={reminder.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {reminder.user_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {reminder.appointment_details.user_email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm text-gray-900">
                              {reminder.appointment_details.service_type}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(reminder.appointment_details.date).toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            {reminder.reminder_type} ({reminder.hours_before}h antes)
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(reminder.scheduled_time).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            reminder.is_sent
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {reminder.is_sent ? 'Enviado' : 'Pendiente'}
                          </span>
                          {reminder.time_until_reminder && (
                            <div className="text-xs text-gray-500 mt-1">
                              {reminder.time_until_reminder}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Configuración del Sistema</h2>
            
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración de Email</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Backend actual:</strong> Console (emails se muestran en consola para desarrollo)
                  </p>
                  <p className="text-sm text-gray-600">
                    Para producción, configurar las variables de entorno:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                    <li>EMAIL_HOST_USER: tu-email@gmail.com</li>
                    <li>EMAIL_HOST_PASSWORD: tu-contraseña-de-aplicación</li>
                    <li>DEFAULT_FROM_EMAIL: noreply@ortanovias.com</li>
                  </ul>
                </div>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración de WhatsApp</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-600 mb-2">
                    Configurar las variables de entorno de Twilio:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>TWILIO_ACCOUNT_SID: tu-account-sid</li>
                    <li>TWILIO_AUTH_TOKEN: tu-auth-token</li>
                    <li>TWILIO_WHATSAPP_FROM: whatsapp:+14155238886</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Comando de Recordatorios Automáticos</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-600 mb-2">
                    Para automatizar el envío de recordatorios, agregar este comando al cron:
                  </p>
                  <code className="block bg-gray-800 text-green-400 p-3 rounded text-sm mt-2">
                    # Cada 30 minutos<br/>
                    */30 * * * * cd /ruta/proyecto && python manage.py send_reminders
                  </code>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
