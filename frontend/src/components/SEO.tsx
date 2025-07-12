import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSEO, useBreadcrumbs } from '../hooks/useSEO';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: string;
  noIndex?: boolean;
}

const SEO: React.FC<SEOProps> = ({ 
  title: propTitle, 
  description: propDescription, 
  keywords: propKeywords,
  image,
  type = 'website',
  noIndex = false
}) => {
  const seoData = useSEO();
  const breadcrumbs = useBreadcrumbs();

  // Usar props si se proporcionan, sino usar datos del hook
  const title = propTitle || seoData.title;
  const description = propDescription || seoData.description;
  const keywords = propKeywords || seoData.keywords;
  const canonicalUrl = seoData.canonicalUrl;

  // Imagen por defecto
  const defaultImage = `${window.location.origin}/og-image.jpg`;
  const ogImage = image || defaultImage;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Orta Novias" />
      <meta property="og:locale" content="es_ES" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Additional Meta Tags */}
      <meta name="author" content="Orta Novias" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta httpEquiv="Content-Language" content="es" />
      
      {/* Structured Data */}
      {seoData.structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(seoData.structuredData)}
        </script>
      )}
      
      {/* Breadcrumbs Structured Data */}
      {breadcrumbs.length > 1 && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: breadcrumbs.map((crumb, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: crumb.name,
              item: `https://www.ortanovias.com${crumb.url}`
            }))
          })}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
