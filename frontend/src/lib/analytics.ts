// Analytics Configuration and Utilities for Orta Novias
// Comprehensive tracking for bridal boutique business metrics

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export interface AnalyticsConfig {
  measurementId: string;
  debug: boolean;
  cookieFlags: string;
}

export interface EventData {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

export interface ConversionEvent {
  event_name: string;
  currency?: string;
  value?: number;
  transaction_id?: string;
  items?: Array<{
    item_id: string;
    item_name: string;
    category: string;
    quantity?: number;
    price?: number;
  }>;
}

class Analytics {
  private config: AnalyticsConfig;
  private isInitialized: boolean = false;
  private debugMode: boolean = false;

  constructor() {
    this.config = {
      measurementId: 'G-JTHPB8J5L7', // Orta Novias Measurement ID
      debug: import.meta.env.DEV || false,
      cookieFlags: 'SameSite=None; Secure'
    };
    this.debugMode = this.config.debug;
  }

  // Initialize Google Analytics 4
  init(): void {
    if (this.isInitialized || typeof window === 'undefined') {
      return;
    }

    try {
      // Load Google Analytics script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.measurementId}`;
      document.head.appendChild(script);

      // Initialize dataLayer
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };

      // Configure GA4
      window.gtag('js', new Date());
      window.gtag('config', this.config.measurementId, {
        cookie_flags: this.config.cookieFlags,
        debug_mode: this.config.debug,
        send_page_view: false // We'll handle page views manually
      });

      this.isInitialized = true;
      this.log('Analytics initialized successfully');

      // Track initial page view
      this.trackPageView();

    } catch (error) {
      console.error('Failed to initialize analytics:', error);
    }
  }

  // Enhanced page view tracking with SEO data
  trackPageView(additionalData?: Record<string, any>): void {
    if (!this.isInitialized || typeof window === 'undefined') {
      return;
    }

    const pageData = {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname,
      content_group1: this.getContentCategory(),
      content_group2: this.getUserType(),
      ...additionalData
    };

    window.gtag('event', 'page_view', pageData);
    this.log('Page view tracked:', pageData);
  }

  // Business-specific event tracking
  trackBusinessEvent(eventData: EventData): void {
    if (!this.isInitialized) {
      this.log('Analytics not initialized, queuing event:', eventData);
      return;
    }

    const enhancedData = {
      event_category: eventData.category,
      event_label: eventData.label,
      value: eventData.value,
      business_type: 'bridal_boutique',
      timestamp: new Date().toISOString(),
      ...eventData.custom_parameters
    };

    window.gtag('event', eventData.action, enhancedData);
    this.log('Business event tracked:', eventData.action, enhancedData);
  }

  // Conversion tracking for appointments
  trackAppointmentConversion(appointmentData: {
    appointment_type: string;
    service_category: string;
    estimated_value?: number;
    source?: string;
  }): void {
    const conversionData: ConversionEvent = {
      event_name: 'appointment_scheduled',
      currency: 'EUR',
      value: appointmentData.estimated_value || 1000, // Default estimated value
      transaction_id: `apt_${Date.now()}`,
      items: [{
        item_id: 'appointment',
        item_name: appointmentData.appointment_type,
        category: appointmentData.service_category,
        quantity: 1,
        price: appointmentData.estimated_value || 1000
      }]
    };

    this.trackConversion(conversionData);
    
    // Also track as a general business event
    this.trackBusinessEvent({
      action: 'appointment_scheduled',
      category: 'conversions',
      label: appointmentData.appointment_type,
      value: appointmentData.estimated_value,
      custom_parameters: {
        service_category: appointmentData.service_category,
        traffic_source: appointmentData.source || 'direct'
      }
    });
  }

  // Enhanced conversion tracking
  trackConversion(conversionData: ConversionEvent): void {
    if (!this.isInitialized) {
      return;
    }

    window.gtag('event', conversionData.event_name, {
      currency: conversionData.currency,
      value: conversionData.value,
      transaction_id: conversionData.transaction_id,
      items: conversionData.items
    });

    this.log('Conversion tracked:', conversionData);
  }

  // User engagement tracking
  trackEngagement(engagementData: {
    engagement_type: string;
    content_type: string;
    duration?: number;
    depth?: number;
  }): void {
    this.trackBusinessEvent({
      action: 'user_engagement',
      category: 'engagement',
      label: engagementData.engagement_type,
      value: engagementData.duration,
      custom_parameters: {
        content_type: engagementData.content_type,
        scroll_depth: engagementData.depth,
        session_duration: this.getSessionDuration()
      }
    });
  }

  // E-commerce tracking for dress inquiries
  trackDressInquiry(dressData: {
    dress_id: string;
    dress_name: string;
    category: string;
    price?: number;
    designer?: string;
  }): void {
    this.trackBusinessEvent({
      action: 'dress_inquiry',
      category: 'product_interest',
      label: dressData.dress_name,
      value: dressData.price,
      custom_parameters: {
        dress_id: dressData.dress_id,
        dress_category: dressData.category,
        designer: dressData.designer,
        inquiry_source: window.location.pathname
      }
    });

    // Enhanced e-commerce tracking
    window.gtag('event', 'view_item', {
      currency: 'EUR',
      value: dressData.price || 0,
      items: [{
        item_id: dressData.dress_id,
        item_name: dressData.dress_name,
        category: dressData.category,
        price: dressData.price || 0,
        designer: dressData.designer
      }]
    });
  }

  // Social media tracking
  trackSocialInteraction(platform: string, action: string, target: string): void {
    this.trackBusinessEvent({
      action: 'social_interaction',
      category: 'social_media',
      label: `${platform}_${action}`,
      custom_parameters: {
        social_platform: platform,
        social_action: action,
        social_target: target
      }
    });
  }

  // Form tracking
  trackFormInteraction(formType: string, action: string, fieldName?: string): void {
    this.trackBusinessEvent({
      action: 'form_interaction',
      category: 'forms',
      label: `${formType}_${action}`,
      custom_parameters: {
        form_type: formType,
        form_action: action,
        field_name: fieldName,
        page_path: window.location.pathname
      }
    });
  }

  // Error tracking
  trackError(errorType: string, errorMessage: string, errorLocation: string): void {
    this.trackBusinessEvent({
      action: 'error_occurred',
      category: 'errors',
      label: errorType,
      custom_parameters: {
        error_message: errorMessage,
        error_location: errorLocation,
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString()
      }
    });
  }

  // Performance tracking
  trackPerformance(metricName: string, value: number, unit: string = 'ms'): void {
    this.trackBusinessEvent({
      action: 'performance_metric',
      category: 'performance',
      label: metricName,
      value: value,
      custom_parameters: {
        metric_unit: unit,
        page_path: window.location.pathname
      }
    });
  }

  // Custom dimensions helpers
  private getContentCategory(): string {
    const path = window.location.pathname;
    if (path.includes('/dresses')) return 'dresses';
    if (path.includes('/appointments')) return 'appointments';
    if (path.includes('/testimonials')) return 'testimonials';
    if (path === '/') return 'homepage';
    return 'other';
  }

  private getUserType(): string {
    // Logic to determine user type based on behavior
    const hasViewedDresses = localStorage.getItem('viewed_dresses');
    const hasScheduledAppointment = localStorage.getItem('scheduled_appointment');
    
    if (hasScheduledAppointment) return 'converted_customer';
    if (hasViewedDresses) return 'engaged_visitor';
    return 'new_visitor';
  }

  private getSessionDuration(): number {
    const sessionStart = sessionStorage.getItem('session_start');
    if (!sessionStart) {
      sessionStorage.setItem('session_start', Date.now().toString());
      return 0;
    }
    return Date.now() - parseInt(sessionStart);
  }

  private log(message: string, ...args: any[]): void {
    if (this.debugMode) {
      console.log(`[Analytics] ${message}`, ...args);
    }
  }

  // Utility methods for manual tracking
  setUserProperty(propertyName: string, value: string): void {
    if (this.isInitialized) {
      window.gtag('config', this.config.measurementId, {
        custom_map: { [propertyName]: value }
      });
    }
  }

  setUserDemographics(demographics: {
    age_range?: string;
    location?: string;
    wedding_date?: string;
    budget_range?: string;
  }): void {
    Object.entries(demographics).forEach(([key, value]) => {
      if (value) {
        this.setUserProperty(key, value);
      }
    });
  }
}

// Export singleton instance
export const analytics = new Analytics();

// Export utility functions
export const trackPageView = (additionalData?: Record<string, any>) => 
  analytics.trackPageView(additionalData);

export const trackBusinessEvent = (eventData: EventData) => 
  analytics.trackBusinessEvent(eventData);

export const trackAppointmentConversion = (appointmentData: any) => 
  analytics.trackAppointmentConversion(appointmentData);

export const trackDressInquiry = (dressData: any) => 
  analytics.trackDressInquiry(dressData);

export const trackEngagement = (engagementData: any) => 
  analytics.trackEngagement(engagementData);

export const trackFormInteraction = (formType: string, action: string, fieldName?: string) => 
  analytics.trackFormInteraction(formType, action, fieldName);

export const trackError = (errorType: string, errorMessage: string, errorLocation: string) => 
  analytics.trackError(errorType, errorMessage, errorLocation);

export const initAnalytics = () => analytics.init();

export default analytics;
