import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Card, Badge, Modal, Input } from '../../components/ui';
import { CustomerSubscriptionResponse, SubscriptionRequest, SubscriptionPack } from '../../types';
import apiService from '../../services/api';
import { CreditCard, Calendar, DollarSign, Package, Plus, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CustomerSubscriptionPage: React.FC = () => {
  const [subscription, setSubscription] = useState<CustomerSubscriptionResponse['subscription'] | null>(null);
  const [availablePacks, setAvailablePacks] = useState<SubscriptionPack[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SubscriptionRequest>();
  
  const selectedSku = watch('sku');

  useEffect(() => {
    fetchSubscription();
    fetchAvailablePacks();
  }, []);

  const fetchSubscription = async () => {
    try {
      const response = await apiService.getCustomerSubscription();
      setSubscription(response.subscription);
    } catch (error: any) {
      if (error.response?.status !== 404) {
        toast.error(error.response?.data?.message || 'Failed to fetch subscription');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailablePacks = async () => {
    try {
      const response = await apiService.getSubscriptionPacks(1, 100);
      setAvailablePacks(response.packs);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch available packs');
    }
  };

  const handleRequestSubscription = async (data: SubscriptionRequest) => {
    try {
      await apiService.requestSubscription(data);
      toast.success('Subscription request submitted successfully');
      setIsRequestModalOpen(false);
      fetchSubscription();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to request subscription');
    }
  };

  const handleDeactivateSubscription = async () => {
    if (!window.confirm('Are you sure you want to deactivate your subscription?')) return;
    
    try {
      await apiService.deactivateSubscription();
      toast.success('Subscription deactivated successfully');
      fetchSubscription();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to deactivate subscription');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Subscription</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your subscription and view current status
          </p>
        </div>
        {!subscription && (
          <Button onClick={() => setIsRequestModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Request Subscription
          </Button>
        )}
      </div>

      {subscription ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Current Subscription */}
          <Card title="Current Subscription">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Package className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-500">Package</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{subscription.pack.name}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-500">SKU</span>
                </div>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">{subscription.pack.sku}</code>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-500">Price</span>
                </div>
                <span className="text-sm font-medium text-gray-900">${subscription.pack.price}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-500">Validity</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{subscription.pack.validity_months} months</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Status</span>
                {getStatusBadge(subscription.status)}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Assigned</span>
                <span className="text-sm text-gray-900">
                  {new Date(subscription.assigned_at).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Expires</span>
                <span className="text-sm text-gray-900">
                  {new Date(subscription.expires_at).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Valid</span>
                <Badge variant={subscription.is_valid ? 'success' : 'danger'}>
                  {subscription.is_valid ? 'Yes' : 'No'}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <Card title="Actions">
            <div className="space-y-4">
              {subscription.status === 'active' && (
                <Button
                  variant="danger"
                  onClick={handleDeactivateSubscription}
                  className="w-full"
                >
                  <X className="h-4 w-4 mr-2" />
                  Deactivate Subscription
                </Button>
              )}
              
              {subscription.status === 'requested' && (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">
                    Your subscription request is pending approval.
                  </p>
                </div>
              )}

              {subscription.status === 'expired' && (
                <Button
                  onClick={() => setIsRequestModalOpen(true)}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Request New Subscription
                </Button>
              )}
            </div>
          </Card>
        </div>
      ) : (
        <Card title="No Active Subscription">
          <div className="text-center py-8">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No subscription</h3>
            <p className="mt-1 text-sm text-gray-500">
              You don't have an active subscription. Request one to get started.
            </p>
            <div className="mt-6">
              <Button onClick={() => setIsRequestModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Request Subscription
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Request Subscription Modal */}
      <Modal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        title="Request Subscription"
        size="md"
      >
        <form onSubmit={handleSubmit(handleRequestSubscription)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Package
            </label>
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              {...register('sku', { required: 'Please select a package' })}
            >
              <option value="">Choose a package...</option>
              {availablePacks.map((pack) => (
                <option key={pack.id} value={pack.sku}>
                  {pack.name} - ${pack.price} ({pack.validity_months} months)
                </option>
              ))}
            </select>
            {errors.sku && (
              <p className="text-sm text-red-600 mt-1">{errors.sku.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsRequestModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedSku}>
              Request Subscription
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CustomerSubscriptionPage;
