'use client';

import React, { useState, useEffect } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement,
  BarElement,
  Title, 
  Tooltip, 
  Legend, 
  ChartData,
  ChartOptions
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { SalesAnalytics } from '@/app/api/marketplace/seller/analytics/route';
import { Spinner } from '@/components/ui/Spinner';
import { formatCurrency } from '@/utils/formatters';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SalesOverviewProps {
  period: 'week' | 'month' | 'quarter' | 'year' | 'custom';
  customDateRange?: {
    startDate: string;
    endDate: string;
  };
  className?: string;
}

const SalesOverview: React.FC<SalesOverviewProps> = ({ 
  period, 
  customDateRange,
  className = '' 
}) => {
  const [analytics, setAnalytics] = useState<SalesAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Build API URL with parameters
        let url = `/api/marketplace/seller/analytics?period=${period}`;
        
        if (period === 'custom' && customDateRange) {
          url += `&startDate=${customDateRange.startDate}&endDate=${customDateRange.endDate}`;
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch analytics data');
        }
        
        const data = await response.json();
        setAnalytics(data.data);
      } catch (err: any) {
        console.error('Error fetching sales analytics:', err);
        setError(err.message || 'An error occurred while fetching analytics data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, [period, customDateRange]);
  
  // Format period for display
  const formatPeriodTitle = () => {
    switch (period) {
      case 'week':
        return 'Past Week';
      case 'month':
        return 'Past Month';
      case 'quarter':
        return 'Past Quarter';
      case 'year':
        return 'Past Year';
      case 'custom':
        if (customDateRange) {
          return `${new Date(customDateRange.startDate).toLocaleDateString()} - ${new Date(customDateRange.endDate).toLocaleDateString()}`;
        }
        return 'Custom Period';
      default:
        return 'Sales Overview';
    }
  };
  
  // Prepare chart data for sales by day
  const getSalesByDayChartData = (): ChartData<'line'> => {
    if (!analytics || !analytics.salesByDay || analytics.salesByDay.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }
    
    return {
      labels: analytics.salesByDay.map(day => {
        // Format date for display (e.g., "Mar 15")
        const date = new Date(day.date);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }),
      datasets: [
        {
          label: 'Sales',
          data: analytics.salesByDay.map(day => day.amount),
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          tension: 0.3,
        },
        {
          label: 'Orders',
          data: analytics.salesByDay.map(day => day.orders),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          tension: 0.3,
          yAxisID: 'y1',
        }
      ]
    };
  };
  
  // Chart options for sales by day
  const salesByDayOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Sales ($)'
        }
      },
      y1: {
        beginAtZero: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'Order Count'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            
            if (label === 'Sales') {
              return `${label}: ${formatCurrency(value)}`;
            }
            
            return `${label}: ${value}`;
          }
        }
      }
    },
  };
  
  // Prepare chart data for top products
  const getTopProductsChartData = (): ChartData<'bar'> => {
    if (!analytics || !analytics.topProducts || analytics.topProducts.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }
    
    return {
      labels: analytics.topProducts.map(product => 
        product.title.length > 25 ? product.title.substring(0, 25) + '...' : product.title
      ),
      datasets: [
        {
          label: 'Revenue',
          data: analytics.topProducts.map(product => product.revenue),
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          borderColor: 'rgb(53, 162, 235)',
          borderWidth: 1,
        },
        {
          label: 'Units Sold',
          data: analytics.topProducts.map(product => product.totalSold),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 1,
          yAxisID: 'y1',
        }
      ]
    };
  };
  
  // Chart options for top products
  const topProductsOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Revenue ($)'
        }
      },
      y1: {
        beginAtZero: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'Units Sold'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            
            if (label === 'Revenue') {
              return `${label}: ${formatCurrency(value)}`;
            }
            
            return `${label}: ${value}`;
          }
        }
      }
    },
  };
  
  if (loading) {
    return (
      <div className={`p-6 bg-white dark:bg-gray-800 rounded-lg shadow ${className}`}>
        <div className="flex flex-col items-center justify-center h-80">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading sales analytics...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={`p-6 bg-white dark:bg-gray-800 rounded-lg shadow ${className}`}>
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700 dark:text-red-400">Error: {error}</p>
        </div>
        <button 
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }
  
  if (!analytics) {
    return (
      <div className={`p-6 bg-white dark:bg-gray-800 rounded-lg shadow ${className}`}>
        <p className="text-gray-600 dark:text-gray-400">No analytics data available.</p>
      </div>
    );
  }
  
  return (
    <div className={`p-6 bg-white dark:bg-gray-800 rounded-lg shadow ${className}`}>
      <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">{formatPeriodTitle()}</h2>
      
      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Sales</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(analytics.totalSales)}
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400">Orders</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {analytics.orderCount}
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400">Average Order Value</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(analytics.averageOrderValue)}
          </p>
        </div>
      </div>
      
      {/* Sales over time chart */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Sales Over Time</h3>
        <div className="h-80 w-full">
          {analytics.salesByDay.length > 0 ? (
            <Line 
              data={getSalesByDayChartData()} 
              options={salesByDayOptions}
            />
          ) : (
            <div className="flex justify-center items-center h-full bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">No sales data available for this period</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Top products chart */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Top Products</h3>
        <div className="h-80 w-full">
          {analytics.topProducts.length > 0 ? (
            <Bar 
              data={getTopProductsChartData()} 
              options={topProductsOptions}
            />
          ) : (
            <div className="flex justify-center items-center h-full bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">No product data available for this period</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Recent orders */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Recent Orders</h3>
        {analytics.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {analytics.recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {order.id.substring(0, 8)}...
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${order.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                         order.status === 'processing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 
                         order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                         'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatCurrency(order.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-gray-500 dark:text-gray-400">No recent orders found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesOverview; 