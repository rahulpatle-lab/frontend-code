import React, { useEffect, useState } from 'react';
import { Card, LoadingSpinner } from '../../components/ui';
import { DashboardData } from '../../types';
import apiService from '../../services/api';
import { Users, CreditCard, Clock, DollarSign, TrendingUp } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await apiService.getDashboard();
        setDashboardData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No dashboard data available</p>
      </div>
    );
  }

  const stats = [
    {
      name: 'Total Customers',
      value: dashboardData.total_customers,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      name: 'Active Subscriptions',
      value: dashboardData.active_subscriptions,
      icon: CreditCard,
      color: 'bg-green-500',
    },
    {
      name: 'Pending Requests',
      value: dashboardData.pending_requests,
      icon: Clock,
      color: 'bg-yellow-500',
    },
    {
      name: 'Total Revenue',
      value: `$${dashboardData.total_revenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your license management system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="relative overflow-hidden">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`${stat.color} p-3 rounded-md`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activities */}
      <Card title="Recent Activities">
        <div className="flow-root">
          <ul className="-mb-8">
            {dashboardData.recent_activities.map((activity, activityIdx) => (
              <li key={activityIdx}>
                <div className="relative pb-8">
                  {activityIdx !== dashboardData.recent_activities.length - 1 ? (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                        <TrendingUp className="h-4 w-4 text-white" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium text-gray-900">{activity.customer}</span>{' '}
                          {activity.type.replace('_', ' ')} for{' '}
                          <span className="font-medium text-gray-900">{activity.pack}</span>
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        <time dateTime={activity.timestamp}>
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
