/**
 * Marketing y Social Media Integrations
 * Sistema completo de marketing para Orta Novias
 */

interface MarketingConfig {
  googleAnalytics: {
    measurementId: string;
    enabled: boolean;
  };
  facebookPixel: {
    pixelId: string;
    enabled: boolean;
  };
  googleAds: {
    conversionId: string;
    enabled: boolean;
  };
  hotjar: {
    siteId: string;
    enabled: boolean;
  };
}

class MarketingManager {
  private config: MarketingConfig;
  private isInitialized = false;

  constructor() {
    this.config = {
      googleAnalytics: {
        measurementId: import.meta.env.VITE_GA_MEASUREMENT_ID || '',
        enabled: !!import.meta.env.VITE_GA_MEASUREMENT_ID
      },
      facebookPixel: {
        pixelId: import.meta.env.VITE_FACEBOOK_PIXEL_ID || '',
        enabled: !!import.meta.env.VITE_FACEBOOK_PIXEL_ID
      },
      googleAds: {
        conversionId: import.meta.env.VITE_GOOGLE_ADS_CONVERSION_ID || '',
        enabled: !!import.meta.env.VITE_GOOGLE_ADS_CONVERSION_ID
      },
      hotjar: {
        siteId: import.meta.env.VITE_HOTJAR_SITE_ID || '',
        enabled: !!import.meta.env.VITE_HOTJAR_SITE_ID
      }
    };
  }

  /**
   * Inicializar todos los servicios de marketing
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    console.log('🚀 Inicializando servicios de marketing...');

    // Google Analytics 4
    if (this.config.googleAnalytics.enabled) {
      await this.initializeGoogleAnalytics();
    }

    // Facebook Pixel
    if (this.config.facebookPixel.enabled) {
      await this.initializeFacebookPixel();
    }

    // Google Ads
    if (this.config.googleAds.enabled) {
      await this.initializeGoogleAds();
    }

    // Hotjar
    if (this.config.hotjar.enabled) {
      await this.initializeHotjar();
    }

    this.isInitialized = true;
    console.log('✅ Marketing services initialized');
  }

  /**
   * Google Analytics 4
   */
  private async initializeGoogleAnalytics(): Promise<void> {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.googleAnalytics.measurementId}`;
    document.head.appendChild(script);

    // Inicializar gtag
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
      (window as any).dataLayer.push(args);
    }
    (window as any).gtag = gtag;

    gtag('js', new Date());
    gtag('config', this.config.googleAnalytics.measurementId, {
      page_title: document.title,
      page_location: window.location.href
    });

    console.log('📊 Google Analytics 4 initialized');
  }

  /**
   * Facebook Pixel
   */
  private async initializeFacebookPixel(): Promise<void> {
    const script = document.createElement('script');
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${this.config.facebookPixel.pixelId}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script);

    // NoScript fallback
    const noscript = document.createElement('noscript');
    noscript.innerHTML = `
      <img height="1" width="1" style="display:none"
           src="https://www.facebook.com/tr?id=${this.config.facebookPixel.pixelId}&ev=PageView&noscript=1"/>
    `;
    document.head.appendChild(noscript);

    console.log('📘 Facebook Pixel initialized');
  }

  /**
   * Google Ads Conversion Tracking
   */
  private async initializeGoogleAds(): Promise<void> {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.googleAds.conversionId}`;
    document.head.appendChild(script);

    console.log('🎯 Google Ads tracking initialized');
  }

  /**
   * Hotjar User Behavior Analytics
   */
  private async initializeHotjar(): Promise<void> {
    const script = document.createElement('script');
    script.innerHTML = `
      (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:${this.config.hotjar.siteId},hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
      })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    `;
    document.head.appendChild(script);

    console.log('🔥 Hotjar tracking initialized');
  }

  /**
   * Track conversions - Citas agendadas
   */
  trackAppointmentBooking(appointmentData: any): void {
    // Google Analytics
    if (this.config.googleAnalytics.enabled && (window as any).gtag) {
      (window as any).gtag('event', 'appointment_booking', {
        event_category: 'conversion',
        event_label: 'appointment_scheduled',
        value: 1,
        custom_parameters: {
          service_type: appointmentData.serviceType,
          appointment_date: appointmentData.date
        }
      });
    }

    // Facebook Pixel
    if (this.config.facebookPixel.enabled && (window as any).fbq) {
      (window as any).fbq('track', 'Schedule', {
        content_name: 'Appointment Booking',
        content_category: 'Service',
        value: 1,
        currency: 'EUR'
      });
    }

    // Google Ads Conversion
    if (this.config.googleAds.enabled && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        send_to: `${this.config.googleAds.conversionId}/appointment_booking`,
        value: 1.0,
        currency: 'EUR'
      });
    }

    console.log('📈 Appointment booking tracked');
  }

  /**
   * Track dress views
   */
  trackDressView(dressData: any): void {
    // Google Analytics
    if (this.config.googleAnalytics.enabled && (window as any).gtag) {
      (window as any).gtag('event', 'view_item', {
        event_category: 'engagement',
        event_label: 'dress_view',
        custom_parameters: {
          item_id: dressData.id,
          item_name: dressData.name,
          item_category: dressData.category,
          price: dressData.price
        }
      });
    }

    // Facebook Pixel
    if (this.config.facebookPixel.enabled && (window as any).fbq) {
      (window as any).fbq('track', 'ViewContent', {
        content_ids: [dressData.id],
        content_name: dressData.name,
        content_category: dressData.category,
        content_type: 'product'
      });
    }
  }

  /**
   * Track contact form submissions
   */
  trackContactForm(formData: any): void {
    // Google Analytics
    if (this.config.googleAnalytics.enabled && (window as any).gtag) {
      (window as any).gtag('event', 'form_submit', {
        event_category: 'engagement',
        event_label: 'contact_form',
        custom_parameters: {
          form_type: formData.type,
          form_location: formData.location
        }
      });
    }

    // Facebook Pixel
    if (this.config.facebookPixel.enabled && (window as any).fbq) {
      (window as any).fbq('track', 'Contact', {
        content_name: 'Contact Form Submission'
      });
    }
  }

  /**
   * Track page views
   */
  trackPageView(pagePath: string, pageTitle: string): void {
    // Google Analytics
    if (this.config.googleAnalytics.enabled && (window as any).gtag) {
      (window as any).gtag('config', this.config.googleAnalytics.measurementId, {
        page_path: pagePath,
        page_title: pageTitle
      });
    }

    // Facebook Pixel
    if (this.config.facebookPixel.enabled && (window as any).fbq) {
      (window as any).fbq('track', 'PageView');
    }
  }

  /**
   * Track social media clicks
   */
  trackSocialClick(platform: string, action: string): void {
    if (this.config.googleAnalytics.enabled && (window as any).gtag) {
      (window as any).gtag('event', 'social_click', {
        event_category: 'social_media',
        event_label: platform,
        custom_parameters: {
          social_platform: platform,
          social_action: action
        }
      });
    }
  }

  /**
   * Track testimonial interactions
   */
  trackTestimonialView(testimonialId: string): void {
    if (this.config.googleAnalytics.enabled && (window as any).gtag) {
      (window as any).gtag('event', 'testimonial_view', {
        event_category: 'engagement',
        event_label: 'testimonial_interaction',
        custom_parameters: {
          testimonial_id: testimonialId
        }
      });
    }
  }
}

// Singleton instance
export const marketingManager = new MarketingManager();

// Hook para React
export const useMarketing = () => {
  return {
    trackAppointmentBooking: marketingManager.trackAppointmentBooking.bind(marketingManager),
    trackDressView: marketingManager.trackDressView.bind(marketingManager),
    trackContactForm: marketingManager.trackContactForm.bind(marketingManager),
    trackPageView: marketingManager.trackPageView.bind(marketingManager),
    trackSocialClick: marketingManager.trackSocialClick.bind(marketingManager),
    trackTestimonialView: marketingManager.trackTestimonialView.bind(marketingManager)
  };
};

export default marketingManager;
