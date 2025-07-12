#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

class SEOAnalyzer {
  constructor() {
    this.results = {
      critical: [],
      warnings: [],
      passed: [],
      score: 0
    };
  }

  log(level, message) {
    const timestamp = new Date().toISOString();
    const levelColors = {
      'error': colors.red,
      'warn': colors.yellow,
      'info': colors.blue,
      'success': colors.green
    };
    
    console.log(`${levelColors[level]}[${timestamp}] ${level.toUpperCase()}: ${message}${colors.reset}`);
  }

  async analyzeProject() {
    this.log('info', '🔍 Iniciando análisis SEO del proyecto...');
    
    await this.checkBackendSEO();
    await this.checkFrontendSEO();
    await this.checkContentSEO();
    await this.checkTechnicalSEO();
    
    this.generateReport();
  }

  async checkBackendSEO() {
    this.log('info', '📱 Analizando backend SEO...');
    
    // Verificar endpoints SEO
    const seoEndpoints = [
      'backend/apps/core/seo.py',
      'core/urls.py'
    ];
    
    for (const endpoint of seoEndpoints) {
      if (fs.existsSync(endpoint)) {
        this.results.passed.push(`✅ Backend SEO endpoint exists: ${endpoint}`);
      } else {
        this.results.critical.push(`❌ Missing backend SEO endpoint: ${endpoint}`);
      }
    }

    // Verificar comando de management
    const managementCommand = 'backend/apps/core/management/commands/seo_optimizer.py';
    if (fs.existsSync(managementCommand)) {
      this.results.passed.push('✅ SEO management command exists');
    } else {
      this.results.warnings.push('⚠️ SEO management command missing');
    }
  }

  async checkFrontendSEO() {
    this.log('info', '🎨 Analizando frontend SEO...');
    
    // Verificar React Helmet
    const packageJson = JSON.parse(fs.readFileSync('frontend/package.json', 'utf8'));
    if (packageJson.dependencies['react-helmet-async']) {
      this.results.passed.push('✅ React Helmet Async installed');
    } else {
      this.results.critical.push('❌ React Helmet Async not installed');
    }

    // Verificar componente SEO
    const seoComponent = 'frontend/src/components/SEO.tsx';
    if (fs.existsSync(seoComponent)) {
      this.results.passed.push('✅ SEO component exists');
      
      // Analizar contenido del componente
      const seoContent = fs.readFileSync(seoComponent, 'utf8');
      
      const seoFeatures = [
        { pattern: /meta.*description/g, name: 'Meta descriptions' },
        { pattern: /meta.*keywords/g, name: 'Meta keywords' },
        { pattern: /property="og:/g, name: 'Open Graph tags' },
        { pattern: /name="twitter:/g, name: 'Twitter Card tags' },
        { pattern: /application\/ld\+json/g, name: 'Structured data' }
      ];
      
      seoFeatures.forEach(feature => {
        if (feature.pattern.test(seoContent)) {
          this.results.passed.push(`✅ ${feature.name} implemented`);
        } else {
          this.results.warnings.push(`⚠️ ${feature.name} missing`);
        }
      });
      
    } else {
      this.results.critical.push('❌ SEO component missing');
    }

    // Verificar hook personalizado
    const seoHook = 'frontend/src/hooks/useSEO.ts';
    if (fs.existsSync(seoHook)) {
      this.results.passed.push('✅ Custom SEO hook exists');
    } else {
      this.results.warnings.push('⚠️ Custom SEO hook missing');
    }
  }

  async checkContentSEO() {
    this.log('info', '📝 Analizando contenido SEO...');
    
    // Verificar archivo de contenido SEO
    const seoContentFile = 'frontend/src/data/seo-content.json';
    if (fs.existsSync(seoContentFile)) {
      this.results.passed.push('✅ SEO content data file exists');
      
      try {
        const content = JSON.parse(fs.readFileSync(seoContentFile, 'utf8'));
        
        // Verificar estructura del contenido
        const requiredSections = ['pages', 'categories', 'faq', 'business'];
        requiredSections.forEach(section => {
          if (content[section]) {
            this.results.passed.push(`✅ SEO content section: ${section}`);
          } else {
            this.results.warnings.push(`⚠️ Missing SEO content section: ${section}`);
          }
        });
        
        // Verificar páginas principales
        const mainPages = ['home', 'dresses', 'appointments', 'testimonials'];
        mainPages.forEach(page => {
          if (content.pages && content.pages[page]) {
            this.results.passed.push(`✅ SEO data for page: ${page}`);
          } else {
            this.results.warnings.push(`⚠️ Missing SEO data for page: ${page}`);
          }
        });
        
      } catch (error) {
        this.results.critical.push(`❌ Invalid JSON in SEO content file: ${error.message}`);
      }
    } else {
      this.results.critical.push('❌ SEO content data file missing');
    }
    
    // Verificar páginas con SEO implementado
    const pages = [
      'frontend/src/pages/HomePage.tsx',
      'frontend/src/pages/DressesPage.tsx',
      'frontend/src/pages/AppointmentsPage.tsx',
      'frontend/src/pages/TestimonialsPage.tsx'
    ];
    
    pages.forEach(page => {
      if (fs.existsSync(page)) {
        const content = fs.readFileSync(page, 'utf8');
        if (content.includes('SEO') || content.includes('useSEO')) {
          this.results.passed.push(`✅ SEO implemented in: ${path.basename(page)}`);
        } else {
          this.results.warnings.push(`⚠️ SEO not implemented in: ${path.basename(page)}`);
        }
      }
    });
  }

  async checkTechnicalSEO() {
    this.log('info', '⚙️ Analizando SEO técnico...');
    
    // Verificar sitemap
    const sitemapCheck = fs.existsSync('backend/apps/core/seo.py');
    if (sitemapCheck) {
      const seoContent = fs.readFileSync('backend/apps/core/seo.py', 'utf8');
      if (seoContent.includes('sitemap_xml')) {
        this.results.passed.push('✅ Sitemap generation implemented');
      } else {
        this.results.warnings.push('⚠️ Sitemap generation missing');
      }
      
      if (seoContent.includes('robots_txt')) {
        this.results.passed.push('✅ Robots.txt generation implemented');
      } else {
        this.results.warnings.push('⚠️ Robots.txt generation missing');
      }
    }
    
    // Verificar configuración de Vite para SEO
    const viteConfig = 'frontend/vite.config.ts';
    if (fs.existsSync(viteConfig)) {
      this.results.passed.push('✅ Vite configuration exists');
    } else {
      this.results.warnings.push('⚠️ Vite configuration missing');
    }
    
    // Verificar App.tsx para HelmetProvider
    const appFile = 'frontend/src/App.tsx';
    if (fs.existsSync(appFile)) {
      const appContent = fs.readFileSync(appFile, 'utf8');
      if (appContent.includes('HelmetProvider')) {
        this.results.passed.push('✅ HelmetProvider configured in App.tsx');
      } else {
        this.results.critical.push('❌ HelmetProvider not configured in App.tsx');
      }
    }
  }

  generateReport() {
    this.log('info', '📊 Generando reporte SEO...');
    
    // Calcular score
    const totalChecks = this.results.critical.length + this.results.warnings.length + this.results.passed.length;
    const passedWeight = this.results.passed.length * 3;
    const warningWeight = this.results.warnings.length * 1;
    const criticalWeight = this.results.critical.length * 0;
    
    this.results.score = Math.round((passedWeight + warningWeight) / (totalChecks * 3) * 100);
    
    // Mostrar reporte
    console.log('\n' + '='.repeat(60));
    console.log(`${colors.cyan}         🚀 REPORTE DE ANÁLISIS SEO 🚀${colors.reset}`);
    console.log('='.repeat(60));
    
    console.log(`\n${colors.magenta}📊 PUNTUACIÓN SEO: ${this.results.score}/100${colors.reset}`);
    
    if (this.results.score >= 90) {
      console.log(`${colors.green}🎉 ¡Excelente! Tu SEO está muy bien optimizado.${colors.reset}`);
    } else if (this.results.score >= 70) {
      console.log(`${colors.yellow}✨ Buen trabajo, pero hay oportunidades de mejora.${colors.reset}`);
    } else {
      console.log(`${colors.red}⚡ Necesitas trabajar en la optimización SEO.${colors.reset}`);
    }
    
    // Mostrar problemas críticos
    if (this.results.critical.length > 0) {
      console.log(`\n${colors.red}🚨 PROBLEMAS CRÍTICOS (${this.results.critical.length})${colors.reset}`);
      this.results.critical.forEach(issue => console.log(`  ${issue}`));
    }
    
    // Mostrar advertencias
    if (this.results.warnings.length > 0) {
      console.log(`\n${colors.yellow}⚠️  ADVERTENCIAS (${this.results.warnings.length})${colors.reset}`);
      this.results.warnings.forEach(warning => console.log(`  ${warning}`));
    }
    
    // Mostrar elementos correctos
    if (this.results.passed.length > 0) {
      console.log(`\n${colors.green}✅ VERIFICACIONES PASADAS (${this.results.passed.length})${colors.reset}`);
      this.results.passed.forEach(passed => console.log(`  ${passed}`));
    }
    
    // Recomendaciones
    console.log(`\n${colors.blue}💡 RECOMENDACIONES${colors.reset}`);
    console.log('  • Ejecuta regularmente el comando: python manage.py seo_optimizer');
    console.log('  • Verifica que todas las páginas tengan meta descriptions únicas');
    console.log('  • Asegúrate de que las imágenes tengan atributos alt descriptivos');
    console.log('  • Implementa datos estructurados para todos los productos');
    console.log('  • Configura Google Search Console y Analytics');
    console.log('  • Realiza pruebas de velocidad con Lighthouse');
    
    // Siguientes pasos
    console.log(`\n${colors.cyan}🔜 SIGUIENTES PASOS${colors.reset}`);
    console.log('  1. Corregir problemas críticos identificados');
    console.log('  2. Implementar mejoras recomendadas');
    console.log('  3. Configurar SSL y dominio personalizado');
    console.log('  4. Enviar sitemap a Google Search Console');
    console.log('  5. Configurar monitoreo de rendimiento SEO');
    
    console.log('\n' + '='.repeat(60));
    
    // Guardar reporte
    const reportData = {
      timestamp: new Date().toISOString(),
      score: this.results.score,
      critical: this.results.critical,
      warnings: this.results.warnings,
      passed: this.results.passed,
      recommendations: [
        'Ejecutar comando SEO optimizer regularmente',
        'Verificar meta descriptions únicas',
        'Implementar atributos alt en imágenes',
        'Configurar Google Search Console'
      ]
    };
    
    const reportPath = `seo-analysis-${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
    this.log('success', `📄 Reporte guardado en: ${reportPath}`);
  }
}

// Ejecutar análisis
const analyzer = new SEOAnalyzer();
analyzer.analyzeProject().catch(error => {
  console.error(`${colors.red}Error durante el análisis: ${error.message}${colors.reset}`);
  process.exit(1);
});
