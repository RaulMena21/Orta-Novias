import React from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: string;
  noIndex?: boolean;
}

const SEO: React.FC<SEOProps> = () => {
  // Temporarily disabled SEO component due to react-helmet-async compatibility issues with React 19
  // Will be re-enabled after resolving dependency conflicts
  return null;
};

export default SEO;
