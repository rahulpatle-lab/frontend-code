import React, { useEffect, useState } from 'react';
import { Card, Table, TableHeader, TableBody, TableRow, TableCell, TableHeaderCell, Badge, Button } from '../../components/ui';
import { SubscriptionHistoryResponse, Pagination } from '../../types';
import apiService from '../../services/api';
import { History, Calendar, Package } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CustomerHistoryPage: React.FC = () => {
  const [history, setHistory] = useState<SubscriptionHistoryResponse['history']>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, [pagination.page]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await apiService.getSubscriptionHistory(pagination.page, pagination.limit);
      setHistory(response.history);
      setPagination(response.pagination);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch subscription history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      requested: { color: 'warning', text: 'Requested' },
      approved: { color: 'info', text: 'Approved' },
      active: { color: 'success', text: 'Active' },
      inactive: { color: 'danger', text: 'Inactive' },
      expired: { color: 'neutral', text: 'Expired' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { color: 'neutral', text: status };
    return <Badge variant={config.color as any}>{config.text}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Subscription History</h1>
        <p className="mt-1 text-sm text-gray-500">
          View your subscription history and past activities
        </p>
      </div>

      <Card title="History">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Package</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Assigned</TableHeaderCell>
              <TableHeaderCell>Expired</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center">
                    <Package className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="font-medium">{item.pack_name}</span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(item.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    {new Date(item.assigned_at).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    {new Date(item.expires_at).toLocaleDateString()}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {history.length === 0 && !loading && (
          <div className="text-center py-8">
            <History className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No history</h3>
            <p className="mt-1 text-sm text-gray-500">
              You don't have any subscription history yet.
            </p>
          </div>
        )}

        {/* Pagination */}
        {pagination.total > 0 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} results
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === 1}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page * pagination.limit >= pagination.total}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CustomerHistoryPage;
