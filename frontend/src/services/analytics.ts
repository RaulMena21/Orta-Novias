// Analytics API Service for Orta Novias
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const analyticsApi = axios.create({
  baseURL: `${API_BASE_URL}/analytics`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
analyticsApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Event tracking service
export const trackEvent = async (eventData: {
  event_name: string;
  event_category: string;
  event_label?: string;
  event_value?: number;
  page_url: string;
  page_title?: string;
  referrer?: string;
  session_id?: string;
  custom_parameters?: Record<string, any>;
}) => {
  try {
    const response = await analyticsApi.post('/events/', eventData);
    return response.data;
  } catch (error) {
    console.error('Error tracking event:', error);
    throw error;
  }
};

// Bulk event tracking
export const trackEventsBulk = async (events: Array<any>) => {
  try {
    const response = await analyticsApi.post('/events/bulk_create/', { events });
    return response.data;
  } catch (error) {
    console.error('Error tracking bulk events:', error);
    throw error;
  }
};

// Conversion tracking service
export const trackConversion = async (conversionData: {
  conversion_type: string;
  conversion_value?: number;
  currency?: string;
  source?: string;
  medium?: string;
  campaign?: string;
  conversion_data?: Record<string, any>;
  analytics_event_id?: number;
}) => {
  try {
    const response = await analyticsApi.post('/conversions/', conversionData);
    return response.data;
  } catch (error) {
    console.error('Error tracking conversion:', error);
    throw error;
  }
};

// Session management
export const startSession = async (sessionData: {
  session_id: string;
  referrer?: string;
}) => {
  try {
    const response = await analyticsApi.post('/sessions/start_session/', sessionData);
    return response.data;
  } catch (error) {
    console.error('Error starting session:', error);
    throw error;
  }
};

export const endSession = async (sessionId: string) => {
  try {
    const response = await analyticsApi.patch(`/sessions/${sessionId}/end_session/`);
    return response.data;
  } catch (error) {
    console.error('Error ending session:', error);
    throw error;
  }
};

// Analytics reports
export const getAnalyticsDashboard = async (params?: {
  start_date?: string;
  end_date?: string;
}) => {
  try {
    const response = await analyticsApi.get('/reports/dashboard/', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching analytics dashboard:', error);
    throw error;
  }
};

export const getBusinessInsights = async (params?: {
  start_date?: string;
  end_date?: string;
}) => {
  try {
    const response = await analyticsApi.get('/reports/business_insights/', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching business insights:', error);
    throw error;
  }
};

// Real-time analytics
export const getRealtimeMetrics = async () => {
  try {
    // Get events from the last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const response = await analyticsApi.get('/events/', {
      params: {
        timestamp__gte: oneHourAgo,
        ordering: '-timestamp'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching realtime metrics:', error);
    throw error;
  }
};

// Export all analytics functions
export default {
  trackEvent,
  trackEventsBulk,
  trackConversion,
  startSession,
  endSession,
  getAnalyticsDashboard,
  getBusinessInsights,
  getRealtimeMetrics,
};

// Types for analytics data
export interface AnalyticsEvent {
  id?: number;
  event_name: string;
  event_category: string;
  event_label?: string;
  event_value?: number;
  user?: number;
  session_id?: string;
  user_agent?: string;
  ip_address?: string;
  page_url: string;
  page_title?: string;
  referrer?: string;
  custom_parameters?: Record<string, any>;
  timestamp?: string;
  created_at?: string;
}

export interface ConversionEvent {
  id?: number;
  conversion_type: string;
  conversion_value: number;
  currency: string;
  user?: number;
  analytics_event?: number;
  source?: string;
  medium?: string;
  campaign?: string;
  conversion_data?: Record<string, any>;
  timestamp?: string;
  created_at?: string;
}

export interface UserSession {
  id?: number;
  session_id: string;
  user?: number;
  start_time?: string;
  end_time?: string;
  duration?: string;
  page_views: number;
  user_agent?: string;
  ip_address?: string;
  referrer?: string;
  country?: string;
  city?: string;
  bounce_rate?: number;
  engagement_score: number;
  is_converted: boolean;
  conversion_type?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AnalyticsDashboard {
  summary: {
    total_visitors: number;
    total_page_views: number;
    total_conversions: number;
    total_revenue: number;
    conversion_rate: number;
    avg_session_duration?: string;
  };
  popular_pages: Array<{
    page_url: string;
    views: number;
  }>;
  conversion_breakdown: Array<{
    conversion_type: string;
    count: number;
    revenue: number;
  }>;
  daily_trends: Array<{
    date: string;
    visitors: number;
    conversions: number;
    revenue: number;
    conversion_rate: number;
  }>;
  date_range: {
    start_date: string;
    end_date: string;
  };
}

export interface BusinessInsights {
  business_metrics: {
    appointment_conversions: number;
    dress_inquiries: number;
    testimonial_engagement: number;
  };
  traffic_sources: Array<{
    custom_parameters__referrer: string;
    count: number;
  }>;
  period: {
    start_date: string;
    end_date: string;
  };
}
