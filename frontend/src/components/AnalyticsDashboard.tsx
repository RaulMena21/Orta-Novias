import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  Calendar, 
  Users, 
  Eye, 
  TrendingUp, 
  Target,
  MousePointer
} from 'lucide-react';
import { getAnalyticsDashboard, getBusinessInsights, type AnalyticsDashboard, type BusinessInsights } from '../services/analytics';

const AnalyticsDashboardComponent: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<AnalyticsDashboard | null>(null);
  const [businessData, setBusinessData] = useState<BusinessInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [dashboard, business] = await Promise.all([
        getAnalyticsDashboard(dateRange),
        getBusinessInsights(dateRange)
      ]);
      
      setDashboardData(dashboard as AnalyticsDashboard);
      setBusinessData(business as BusinessInsights);
    } catch (err) {
      setError('Error loading analytics data');
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (field: string, value: string) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#8A2E3B] mx-auto mb-4"></div>
          <p className="text-[#8A2E3B] text-lg">Cargando analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button 
            onClick={fetchAnalyticsData}
            className="mt-4 px-4 py-2 bg-[#8A2E3B] text-white rounded hover:bg-[#7A2635]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#8A2E3B] mb-2">Analytics Dashboard</h1>
              <p className="text-gray-600">Métricas completas de Orta Novias</p>
            </div>
            
            {/* Date Range Selector */}
            <div className="flex gap-4 mt-4 md:mt-0">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
                <input
                  type="date"
                  value={dateRange.start_date}
                  onChange={(e) => handleDateRangeChange('start_date', e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
                <input
                  type="date"
                  value={dateRange.end_date}
                  onChange={(e) => handleDateRangeChange('end_date', e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        {dashboardData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-[#8A2E3B]" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Visitantes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardData.summary.total_visitors.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Eye className="h-8 w-8 text-[#D4B483]" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Páginas Vistas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardData.summary.total_page_views.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Target className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Conversiones</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardData.summary.total_conversions.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Tasa de Conversión</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardData.summary.conversion_rate}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Daily Trends Chart */}
          {dashboardData && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencias Diarias</h3>
              <div className="space-y-4">
                {dashboardData.daily_trends.slice(-7).map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(day.date).toLocaleDateString('es-ES')}
                      </span>
                      <span className="text-xs text-gray-500">
                        {day.visitors} visitantes
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-bold text-[#8A2E3B]">
                        {day.conversions} conversiones
                      </span>
                      <span className="text-xs text-gray-500">
                        {day.conversion_rate.toFixed(1)}% tasa
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conversion Breakdown */}
          {dashboardData && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tipos de Conversión</h3>
              <div className="space-y-4">
                {dashboardData.conversion_breakdown.map((conversion, index) => {
                  const colors = ['bg-[#8A2E3B]', 'bg-[#D4B483]', 'bg-gray-400', 'bg-blue-500', 'bg-green-500'];
                  const percentage = dashboardData.summary.total_conversions > 0 
                    ? (conversion.count / dashboardData.summary.total_conversions * 100).toFixed(1)
                    : '0';
                  
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full ${colors[index % colors.length]} mr-3`}></div>
                        <div>
                          <span className="text-sm font-medium text-gray-900">
                            {conversion.conversion_type}
                          </span>
                          <div className="text-xs text-gray-500">
                            {conversion.count} conversiones
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-gray-900">
                          €{conversion.revenue.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {percentage}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Business Insights */}
        {businessData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <Calendar className="h-6 w-6 text-[#8A2E3B] mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Citas Agendadas</h3>
              </div>
              <p className="text-3xl font-bold text-[#8A2E3B]">
                {businessData.business_metrics.appointment_conversions}
              </p>
              <p className="text-sm text-gray-600 mt-2">Conversiones de citas</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <MousePointer className="h-6 w-6 text-[#D4B483] mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Consultas de Vestidos</h3>
              </div>
              <p className="text-3xl font-bold text-[#D4B483]">
                {businessData.business_metrics.dress_inquiries}
              </p>
              <p className="text-sm text-gray-600 mt-2">Interés en productos</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <Eye className="h-6 w-6 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Engagement Testimonios</h3>
              </div>
              <p className="text-3xl font-bold text-green-600">
                {businessData.business_metrics.testimonial_engagement}
              </p>
              <p className="text-sm text-gray-600 mt-2">Visualizaciones de testimonios</p>
            </div>
          </div>
        )}

        {/* Popular Pages */}
        {dashboardData && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Páginas Más Populares</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Página
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Visualizaciones
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Porcentaje
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dashboardData.popular_pages.map((page, index) => {
                    const percentage = (page.views / dashboardData.summary.total_page_views * 100).toFixed(1);
                    return (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {page.page_url}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {page.views.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {percentage}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboardComponent;
