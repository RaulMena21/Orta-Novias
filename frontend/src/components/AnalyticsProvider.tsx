import React, { createContext, useContext, useEffect, type ReactNode } from 'react';
import { analytics } from '../lib/analytics';
import { useAnalytics } from '../hooks/useAnalytics';

interface AnalyticsContextValue {
  isInitialized: boolean;
  trackEvent: (eventName: string, parameters?: Record<string, any>) => void;
  trackConversion: (conversionType: string, value?: number) => void;
  setUserProperties: (properties: Record<string, string>) => void;
}

const AnalyticsContext = createContext<AnalyticsContextValue | undefined>(undefined);

interface AnalyticsProviderProps {
  children: ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ 
  children
}) => {
  const [isInitialized, setIsInitialized] = React.useState(false);

  // Use the analytics hooks for automatic tracking
  useAnalytics();

  useEffect(() => {
    // Initialize analytics when component mounts
    analytics.init();
    setIsInitialized(true);

    // Set initial user properties
    analytics.setUserProperty('business_type', 'bridal_boutique');
    analytics.setUserProperty('website_version', '2.0');
    analytics.setUserProperty('user_language', navigator.language);
    analytics.setUserProperty('user_timezone', Intl.DateTimeFormat().resolvedOptions().timeZone);

  }, []);

  const trackEvent = (eventName: string, parameters: Record<string, any> = {}) => {
    analytics.trackBusinessEvent({
      action: eventName,
      category: parameters.category || 'user_interaction',
      label: parameters.label,
      value: parameters.value,
      custom_parameters: parameters
    });
  };

  const trackConversion = (conversionType: string, value: number = 0) => {
    if (conversionType === 'appointment') {
      analytics.trackAppointmentConversion({
        appointment_type: 'consultation',
        service_category: 'bridal_consultation',
        estimated_value: value || 1000
      });
    } else {
      analytics.trackBusinessEvent({
        action: conversionType,
        category: 'conversions',
        value: value,
        custom_parameters: {
          conversion_type: conversionType,
          timestamp: new Date().toISOString()
        }
      });
    }
  };

  const setUserProperties = (properties: Record<string, string>) => {
    Object.entries(properties).forEach(([key, value]) => {
      analytics.setUserProperty(key, value);
    });
  };

  const contextValue: AnalyticsContextValue = {
    isInitialized,
    trackEvent,
    trackConversion,
    setUserProperties
  };

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalyticsContext = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalyticsContext must be used within an AnalyticsProvider');
  }
  return context;
};

// Higher-order component for automatic component tracking
export function withAnalytics<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
) {
  return function AnalyticsWrappedComponent(props: P) {
    const { trackEvent } = useAnalyticsContext();

    useEffect(() => {
      trackEvent('component_mount', {
        component_name: componentName,
        category: 'component_lifecycle'
      });

      return () => {
        trackEvent('component_unmount', {
          component_name: componentName,
          category: 'component_lifecycle'
        });
      };
    }, [trackEvent]);

    return <WrappedComponent {...props} />;
  };
}

export default AnalyticsProvider;
