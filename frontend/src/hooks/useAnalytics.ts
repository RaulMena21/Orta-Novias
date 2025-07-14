import { useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { 
  analytics, 
  trackPageView, 
  trackBusinessEvent, 
  trackEngagement,
  trackFormInteraction,
  trackError
} from '../lib/analytics';

// Hook for automatic page view tracking
export const usePageTracking = () => {
 // const location = useLocation();
  const navigationType = useNavigationType();
  const previousLocation = useRef<string>('');

  useEffect(() => {
    // Track page view when location changes
    if (location.pathname !== previousLocation.current) {
      const pageData = {
        page_path: location.pathname,
        page_search: location.search,
        page_hash: location.hash,
        navigation_type: navigationType,
        referrer: document.referrer || 'direct'
      };

      trackPageView(pageData);
      previousLocation.current = location.pathname;

      // Track time spent on previous page
      if (previousLocation.current) {
        trackEngagement({
          engagement_type: 'page_exit',
          content_type: getPageType(previousLocation.current),
          duration: getTimeOnPage()
        });
      }

      // Reset page start time
      sessionStorage.setItem('page_start_time', Date.now().toString());
    }
  }, [location, navigationType]);
};

// Hook for engagement tracking
export const useEngagementTracking = () => {
  const scrollDepthRef = useRef<number>(0);
  const timeOnPageRef = useRef<number>(Date.now());
  const engagementEventsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    timeOnPageRef.current = Date.now();

    // Scroll depth tracking
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollPercent > scrollDepthRef.current) {
        scrollDepthRef.current = scrollPercent;
        
        // Track milestone scroll depths
        const milestones = [25, 50, 75, 90];
        milestones.forEach(milestone => {
          if (scrollPercent >= milestone && !engagementEventsRef.current.has(`scroll_${milestone}`)) {
            engagementEventsRef.current.add(`scroll_${milestone}`);
            trackEngagement({
              engagement_type: 'scroll_depth',
              content_type: getPageType(window.location.pathname),
              depth: milestone
            });
          }
        });
      }
    };

    // Time on page tracking
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const timeSpent = Date.now() - timeOnPageRef.current;
        trackEngagement({
          engagement_type: 'time_on_page',
          content_type: getPageType(window.location.pathname),
          duration: timeSpent
        });
      } else {
        timeOnPageRef.current = Date.now();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return {
    trackCustomEngagement: useCallback((engagementData: any) => {
      trackEngagement({
        ...engagementData,
        duration: Date.now() - timeOnPageRef.current,
        depth: scrollDepthRef.current
      });
    }, [])
  };
};

// Hook for form analytics
export const useFormAnalytics = (formType: string) => {
  const formStartTime = useRef<number>(0);
  const fieldInteractions = useRef<Set<string>>(new Set());

  const trackFormStart = useCallback(() => {
    formStartTime.current = Date.now();
    trackFormInteraction(formType, 'form_start');
  }, [formType]);

  const trackFieldInteraction = useCallback((fieldName: string, action: 'focus' | 'blur' | 'change') => {
    trackFormInteraction(formType, action, fieldName);
    fieldInteractions.current.add(fieldName);
  }, [formType]);

  const trackFormSubmit = useCallback((success: boolean, errorMessage?: string) => {
    const fillTime = Date.now() - formStartTime.current;
    const fieldsInteracted = fieldInteractions.current.size;

    if (success) {
      trackFormInteraction(formType, 'form_submit_success');
      trackBusinessEvent({
        action: 'form_completion',
        category: 'conversions',
        label: formType,
        value: fillTime,
        custom_parameters: {
          fill_time: fillTime,
          fields_interacted: fieldsInteracted,
          completion_rate: 100
        }
      });
    } else {
      trackFormInteraction(formType, 'form_submit_error');
      trackError('form_error', errorMessage || 'Unknown form error', formType);
    }
  }, [formType]);

  const trackFormAbandonment = useCallback((lastField: string) => {
    const fillTime = Date.now() - formStartTime.current;
    trackBusinessEvent({
      action: 'form_abandonment',
      category: 'user_behavior',
      label: formType,
      value: fillTime,
      custom_parameters: {
        last_field: lastField,
        fields_completed: fieldInteractions.current.size,
        abandonment_point: lastField
      }
    });
  }, [formType]);

  return {
    trackFormStart,
    trackFieldInteraction,
    trackFormSubmit,
    trackFormAbandonment
  };
};

// Hook for business conversion tracking
export const useConversionTracking = () => {
  const trackAppointmentIntent = useCallback((source: string) => {
    trackBusinessEvent({
      action: 'appointment_intent',
      category: 'conversions',
      label: source,
      custom_parameters: {
        intent_source: source,
        page_path: window.location.pathname,
        session_duration: getSessionDuration()
      }
    });
  }, []);

  const trackDressInterest = useCallback((dressId: string, action: string) => {
    trackBusinessEvent({
      action: 'dress_interest',
      category: 'product_engagement',
      label: action,
      custom_parameters: {
        dress_id: dressId,
        interest_type: action,
        page_path: window.location.pathname
      }
    });

    // Store for user type classification
    const viewedDresses = JSON.parse(localStorage.getItem('viewed_dresses') || '[]');
    if (!viewedDresses.includes(dressId)) {
      viewedDresses.push(dressId);
      localStorage.setItem('viewed_dresses', JSON.stringify(viewedDresses));
    }
  }, []);

  const trackTestimonialEngagement = useCallback((testimonialId: string, action: string) => {
    trackBusinessEvent({
      action: 'testimonial_engagement',
      category: 'content_engagement',
      label: action,
      custom_parameters: {
        testimonial_id: testimonialId,
        engagement_type: action
      }
    });
  }, []);

  const trackContactAttempt = useCallback((method: string, source: string) => {
    trackBusinessEvent({
      action: 'contact_attempt',
      category: 'conversions',
      label: method,
      custom_parameters: {
        contact_method: method,
        contact_source: source,
        page_path: window.location.pathname
      }
    });
  }, []);

  return {
    trackAppointmentIntent,
    trackDressInterest,
    trackTestimonialEngagement,
    trackContactAttempt
  };
};

// Hook for error tracking
export const useErrorTracking = () => {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      trackError(
        'javascript_error',
        event.message,
        `${event.filename}:${event.lineno}:${event.colno}`
      );
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      trackError(
        'unhandled_promise_rejection',
        event.reason?.toString() || 'Unknown promise rejection',
        window.location.pathname
      );
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const trackCustomError = useCallback((errorType: string, errorMessage: string, context?: string) => {
    trackError(errorType, errorMessage, context || window.location.pathname);
  }, []);

  return { trackCustomError };
};

// Hook for performance tracking
export const usePerformanceTracking = () => {
  useEffect(() => {
    // Track Core Web Vitals
    if ('web-vital' in window) {
      // This would require web-vitals library, but we'll simulate the important metrics
      
      // Track page load time
      window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        trackBusinessEvent({
          action: 'page_load_time',
          category: 'performance',
          label: window.location.pathname,
          value: loadTime,
          custom_parameters: {
            load_time: loadTime,
            dom_content_loaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart
          }
        });
      });

      // Track largest contentful paint (simulated)
      setTimeout(() => {
        const lcpTime = performance.now();
        trackBusinessEvent({
          action: 'largest_contentful_paint',
          category: 'performance',
          label: window.location.pathname,
          value: lcpTime,
          custom_parameters: {
            lcp_time: lcpTime
          }
        });
      }, 1000);
    }
  }, []);
};

// Utility functions
const getPageType = (pathname: string): string => {
  if (pathname.includes('/dresses')) return 'catalog';
  if (pathname.includes('/appointments')) return 'booking';
  if (pathname.includes('/testimonials')) return 'social_proof';
  if (pathname === '/') return 'homepage';
  return 'other';
};

const getTimeOnPage = (): number => {
  const pageStartTime = sessionStorage.getItem('page_start_time');
  if (!pageStartTime) return 0;
  return Date.now() - parseInt(pageStartTime);
};

const getSessionDuration = (): number => {
  const sessionStart = sessionStorage.getItem('session_start');
  if (!sessionStart) {
    sessionStorage.setItem('session_start', Date.now().toString());
    return 0;
  }
  return Date.now() - parseInt(sessionStart);
};

// Custom hook for initializing analytics
export const useAnalytics = () => {
  useEffect(() => {
    analytics.init();
  }, []);

  usePageTracking();
  useEngagementTracking();
  useErrorTracking();
  usePerformanceTracking();
};
