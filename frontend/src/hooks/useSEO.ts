/*import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import seoContent from '../data/seo-content.json';

interface SEOData {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  breadcrumbs: Array<{ name: string; url: string }>;
  structuredData?: any;
  openGraph?: {
    title: string;
    description: string;
    image?: string;
    type: string;
  };
  twitter?: {
    card: string;
    title: string;
    description: string;
    image?: string;
  };
}

export const useSEO = (): SEOData => {
  const location = useLocation();
  
  const seoData = useMemo(() => {
    const path = location.pathname;
    const baseUrl = 'https://www.ortanovias.com';
    
    // Datos por defecto
    let defaultSEO: SEOData = {
      title: 'Orta Novias Madrid - Vestidos de Novia Únicos y Exclusivos',
      description: 'Descubre la colección más exclusiva de vestidos de novia en Madrid. Orta Novias ofrece diseños únicos, asesoramiento personalizado y la experiencia perfecta para tu día especial.',
      keywords: 'vestidos de novia Madrid, vestidos novia exclusivos, tienda vestidos novia',
      canonicalUrl: baseUrl + path,
      breadcrumbs: [{ name: 'Inicio', url: '/' }],
      openGraph: {
        title: 'Orta Novias Madrid - Vestidos de Novia Únicos y Exclusivos',
        description: 'Descubre la colección más exclusiva de vestidos de novia en Madrid.',
        type: 'website'
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Orta Novias Madrid - Vestidos de Novia Únicos y Exclusivos',
        description: 'Descubre la colección más exclusiva de vestidos de novia en Madrid.'
      }
    };

    // Mapear rutas a contenido SEO
    const routeMap: { [key: string]: any } = {
      '/': seoContent.pages.home,
      '/vestidos': seoContent.pages.dresses,
      '/cita': seoContent.pages.appointments,
      '/testimonios': seoContent.pages.testimonials
    };

    // Buscar contenido específico para la ruta
    const pageContent = routeMap[path];
    
    if (pageContent) {
      defaultSEO = {
        ...defaultSEO,
        title: pageContent.title,
        description: pageContent.description,
        keywords: pageContent.keywords,
        canonicalUrl: baseUrl + pageContent.canonicalUrl,
        breadcrumbs: pageContent.breadcrumbs || defaultSEO.breadcrumbs,
        openGraph: {
          ...defaultSEO.openGraph,
          title: pageContent.title,
          description: pageContent.description,
          type: 'website'
        },
        twitter: {
          ...defaultSEO.twitter,
          card: 'summary_large_image',
          title: pageContent.title,
          description: pageContent.description
        }
      };
    }

    // Agregar structured data específico según la página
    if (path === '/') {
      defaultSEO.structuredData = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': `${baseUrl}/#organization`,
            name: seoContent.business.name,
            description: seoContent.business.description,
            url: baseUrl,
            address: {
              '@type': 'PostalAddress',
              streetAddress: seoContent.business.address.street,
              addressLocality: seoContent.business.address.city,
              postalCode: seoContent.business.address.postalCode,
              addressCountry: seoContent.business.address.country
            },
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: seoContent.business.contact.phone,
              email: seoContent.business.contact.email,
              contactType: 'Customer Service'
            },
            sameAs: Object.values(seoContent.business.socialMedia)
          },
          {
            '@type': 'WebSite',
            '@id': `${baseUrl}/#website`,
            url: baseUrl,
            name: seoContent.business.name,
            description: seoContent.business.description,
            publisher: {
              '@id': `${baseUrl}/#organization`
            }
          },
          {
            '@type': 'FAQPage',
            mainEntity: seoContent.faq.map(item => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer
              }
            }))
          }
        ]
      };
    } else if (path === '/vestidos') {
      defaultSEO.structuredData = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: pageContent.title,
        description: pageContent.description,
        url: baseUrl + path,
        mainEntity: {
          '@type': 'ItemList',
          name: 'Vestidos de Novia',
          description: 'Colección exclusiva de vestidos de novia en Madrid',
          numberOfItems: 50 // Número estimado de vestidos
        }
      };
    } else if (path === '/testimonios') {
      defaultSEO.structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: seoContent.business.name,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '127',
          bestRating: '5'
        },
        review: [
          {
            '@type': 'Review',
            author: {
              '@type': 'Person',
              name: 'María González'
            },
            reviewRating: {
              '@type': 'Rating',
              ratingValue: '5'
            },
            reviewBody: 'Experiencia increíble en Orta Novias. El servicio personalizado y la calidad de los vestidos superó todas mis expectativas.'
          }
        ]
      };
    }

    return defaultSEO;
  }, [location.pathname]);

  return seoData;
};

// Hook para obtener contenido SEO de categorías específicas
export const useCategorySEO = (category: string) => {
  const baseUrl = 'https://www.ortanovias.com';
  
  const categoryData = useMemo(() => {
    const categoryContent = (seoContent.categories as any)[category.toLowerCase()];
    
    if (!categoryContent) {
      return null;
    }

    return {
      title: categoryContent.title,
      description: categoryContent.description,
      keywords: categoryContent.keywords,
      canonicalUrl: `${baseUrl}/vestidos?categoria=${category.toLowerCase()}`,
      content: categoryContent.content,
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'ProductCollection',
        name: categoryContent.content.heading,
        description: categoryContent.description,
        url: `${baseUrl}/vestidos?categoria=${category.toLowerCase()}`,
        category: category
      }
    };
  }, [category]);

  return categoryData;
};

// Hook para generar breadcrumbs dinámicos
export const useBreadcrumbs = () => {
  const location = useLocation();
  
  const breadcrumbs = useMemo(() => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);
    
    const breadcrumbMap: { [key: string]: string } = {
      'vestidos': 'Vestidos',
      'cita': 'Reservar Cita',
      'testimonios': 'Testimonios',
      'dashboard': 'Panel de Control'
    };

    const crumbs = [{ name: 'Inicio', url: '/' }];
    
    let currentPath = '';
    segments.forEach(segment => {
      currentPath += `/${segment}`;
      const name = breadcrumbMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      crumbs.push({ name, url: currentPath });
    });

    return crumbs;
  }, [location.pathname]);

  return breadcrumbs;
};

export default useSEO;*/
