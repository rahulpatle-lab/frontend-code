import React, { useEffect, useState } from 'react';
import { Button, Card, Table, TableHeader, TableBody, TableRow, TableCell, TableHeaderCell, Badge, Modal, Input } from '../../components/ui';
import { Subscription, Pagination, SubscriptionStatus } from '../../types';
import apiService from '../../services/api';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const SubscriptionsPage: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<SubscriptionStatus | ''>('');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [packId, setPackId] = useState('');

  useEffect(() => {
    fetchSubscriptions();
  }, [pagination.page, statusFilter]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await apiService.getSubscriptions(
        pagination.page, 
        pagination.limit, 
        statusFilter || undefined
      );
      setSubscriptions(response.subscriptions);
      setPagination(response.pagination);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveSubscription = async (subscriptionId: number) => {
    try {
      await apiService.approveSubscription(subscriptionId);
      toast.success('Subscription approved successfully');
      fetchSubscriptions();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to approve subscription');
    }
  };

  const handleAssignSubscription = async () => {
    if (!selectedCustomerId || !packId) return;
    
    try {
      await apiService.assignSubscription(selectedCustomerId, { pack_id: parseInt(packId) });
      toast.success('Subscription assigned successfully');
      setIsAssignModalOpen(false);
      setSelectedCustomerId(null);
      setPackId('');
      fetchSubscriptions();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to assign subscription');
    }
  };

  const handleUnassignSubscription = async (customerId: number, subscriptionId: number) => {
    if (!window.confirm('Are you sure you want to unassign this subscription?')) return;
    
    try {
      await apiService.unassignSubscription(customerId, subscriptionId);
      toast.success('Subscription unassigned successfully');
      fetchSubscriptions();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to unassign subscription');
    }
  };

  const getStatusBadge = (status: SubscriptionStatus) => {
    const statusConfig = {
      requested: { color: 'warning', icon: Clock },
      approved: { color: 'info', icon: CheckCircle },
      active: { color: 'success', icon: CheckCircle },
      inactive: { color: 'danger', icon: XCircle },
      expired: { color: 'neutral', icon: AlertCircle },
    };

    const config = statusConfig[status];
    return (
      <Badge variant={config.color as any}>
        <config.icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage customer subscriptions and assignments
          </p>
        </div>
        <Button onClick={() => setIsAssignModalOpen(true)}>
          Assign Subscription
        </Button>
      </div>

      {/* Status Filter */}
      <Card>
        <div className="flex space-x-4">
          <Button
            variant={statusFilter === '' ? 'primary' : 'outline'}
            onClick={() => setStatusFilter('')}
          >
            All
          </Button>
          <Button
            variant={statusFilter === 'requested' ? 'primary' : 'outline'}
            onClick={() => setStatusFilter('requested')}
          >
            Requested
          </Button>
          <Button
            variant={statusFilter === 'approved' ? 'primary' : 'outline'}
            onClick={() => setStatusFilter('approved')}
          >
            Approved
          </Button>
          <Button
            variant={statusFilter === 'active' ? 'primary' : 'outline'}
            onClick={() => setStatusFilter('active')}
          >
            Active
          </Button>
          <Button
            variant={statusFilter === 'inactive' ? 'primary' : 'outline'}
            onClick={() => setStatusFilter('inactive')}
          >
            Inactive
          </Button>
          <Button
            variant={statusFilter === 'expired' ? 'primary' : 'outline'}
            onClick={() => setStatusFilter('expired')}
          >
            Expired
          </Button>
        </div>
      </Card>

      {/* Subscriptions Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Customer ID</TableHeaderCell>
              <TableHeaderCell>Pack</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Price</TableHeaderCell>
              <TableHeaderCell>Requested</TableHeaderCell>
              <TableHeaderCell>Expires</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.map((subscription) => (
              <TableRow key={subscription.id}>
                <TableCell className="font-medium">{subscription.customer_id}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{subscription.pack_name}</div>
                    <code className="text-xs text-gray-500">{subscription.pack_sku}</code>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                <TableCell>${subscription.price}</TableCell>
                <TableCell>
                  {subscription.requested_at 
                    ? new Date(subscription.requested_at).toLocaleDateString()
                    : '-'
                  }
                </TableCell>
                <TableCell>
                  {subscription.expires_at 
                    ? new Date(subscription.expires_at).toLocaleDateString()
                    : '-'
                  }
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {subscription.status === 'requested' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApproveSubscription(subscription.id)}
                      >
                        Approve
                      </Button>
                    )}
                    {subscription.status === 'active' && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleUnassignSubscription(subscription.customer_id, subscription.id)}
                      >
                        Unassign
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
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
      </Card>

      {/* Assign Subscription Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Assign Subscription"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Customer ID"
            type="number"
            value={selectedCustomerId || ''}
            onChange={(e) => setSelectedCustomerId(parseInt(e.target.value) || null)}
            placeholder="Enter customer ID"
          />
          <Input
            label="Pack ID"
            type="number"
            value={packId}
            onChange={(e) => setPackId(e.target.value)}
            placeholder="Enter pack ID"
          />
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsAssignModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssignSubscription}
              disabled={!selectedCustomerId || !packId}
            >
              Assign Subscription
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SubscriptionsPage;
