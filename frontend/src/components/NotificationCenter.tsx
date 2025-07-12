import React, { useState, useEffect } from 'react';
import { Bell, Check, Mail, MessageCircle, Clock } from 'lucide-react';
import api from '../services/api';

interface Notification {
  id: number;
  title: string;
  message: string;
  notification_type: 'email' | 'whatsapp' | 'internal';
  status: 'pending' | 'sent' | 'failed' | 'read';
  sent_at: string | null;
  read_at: string | null;
  created_at: string;
  user_email: string;
  user_name: string;
  appointment_date: string | null;
  time_since_created: string;
}

interface NotificationStats {
  total_notifications: number;
  sent_count: number;
  failed_count: number;
  pending_count: number;
  unread_count: number;
  email_count: number;
  whatsapp_count: number;
  internal_count: number;
  success_rate: number;
}

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  useEffect(() => {
    fetchNotifications();
    fetchStats();
  }, [filter, showUnreadOnly]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filter !== 'all') {
        params.append('type', filter);
      }
      
      if (showUnreadOnly) {
        params.append('unread_only', 'true');
      }

      const response = await api.get(`/notifications/?${params.toString()}`);
      const data = response.data as { results?: Notification[] } | Notification[];
      setNotifications(Array.isArray(data) ? data : (data.results || []));
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/notifications/stats/');
      setStats(response.data as NotificationStats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      await api.post(`/notifications/${notificationId}/mark_as_read/`);
      setNotifications(notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read_at: new Date().toISOString(), status: 'read' }
          : notification
      ));
      fetchStats(); // Actualizar estadísticas
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications
        .filter(n => !n.read_at)
        .map(n => n.id);
      
      if (unreadIds.length === 0) return;

      await api.post('/notifications/mark_multiple_as_read/', {
        notification_ids: unreadIds
      });
      
      fetchNotifications();
      fetchStats();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const resendNotification = async (notificationId: number) => {
    try {
      await api.post(`/notifications/${notificationId}/resend/`, {
        force_resend: true
      });
      fetchNotifications();
      fetchStats();
    } catch (error) {
      console.error('Error resending notification:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'whatsapp':
        return <MessageCircle className="w-4 h-4" />;
      case 'internal':
        return <Bell className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
      case 'read':
        return 'text-green-600 bg-green-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sent':
        return 'Enviado';
      case 'failed':
        return 'Fallido';
      case 'pending':
        return 'Pendiente';
      case 'read':
        return 'Leído';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-gradient-to-r from-pink-600 to-pink-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Bell className="w-6 h-6 mr-2" />
            Centro de Notificaciones
          </h2>
          {stats && (
            <div className="text-pink-100 text-sm">
              {stats.unread_count} sin leer de {stats.total_notifications} total
            </div>
          )}
        </div>
      </div>

      {/* Estadísticas */}
      {stats && (
        <div className="bg-gray-50 px-6 py-4 border-b">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.sent_count}</div>
              <div className="text-sm text-gray-600">Enviadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending_count}</div>
              <div className="text-sm text-gray-600">Pendientes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.failed_count}</div>
              <div className="text-sm text-gray-600">Fallidas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.success_rate}%</div>
              <div className="text-sm text-gray-600">Éxito</div>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="px-6 py-4 border-b bg-white">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Tipo:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="all">Todos</option>
              <option value="email">Email</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="internal">Interno</option>
            </select>
          </div>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showUnreadOnly}
              onChange={(e) => setShowUnreadOnly(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Solo no leídas</span>
          </label>

          <button
            onClick={markAllAsRead}
            className="ml-auto px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors"
            disabled={notifications.filter(n => !n.read_at).length === 0}
          >
            Marcar todas como leídas
          </button>
        </div>
      </div>

      {/* Lista de notificaciones */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No hay notificaciones que mostrar</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-6 hover:bg-gray-50 transition-colors ${
                  !notification.read_at ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getTypeIcon(notification.notification_type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {notification.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(notification.status)}`}>
                          {getStatusText(notification.status)}
                        </span>
                        {!notification.read_at && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-green-600 hover:text-green-800"
                            title="Marcar como leída"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {notification.status === 'failed' && (
                          <button
                            onClick={() => resendNotification(notification.id)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Reenviar"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                      <span>Para: {notification.user_name || notification.user_email}</span>
                      <span>Hace {notification.time_since_created}</span>
                    </div>
                    
                    {notification.appointment_date && (
                      <div className="text-xs text-blue-600 mt-1">
                        Cita: {new Date(notification.appointment_date).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
