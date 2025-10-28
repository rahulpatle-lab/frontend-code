import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Card, Table, TableHeader, TableBody, TableRow, TableCell, TableHeaderCell, Modal, Input } from '../../components/ui';
import { SubscriptionPack, SubscriptionPackCreateRequest, Pagination } from '../../types';
import apiService from '../../services/api';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const SubscriptionPacksPage: React.FC = () => {
  const [packs, setPacks] = useState<SubscriptionPack[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0 });
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPack, setSelectedPack] = useState<SubscriptionPack | null>(null);

  const {
    register: registerCreate,
    handleSubmit: handleCreateSubmit,
    reset: resetCreate,
    formState: { errors: createErrors },
  } = useForm<SubscriptionPackCreateRequest>();

  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
    formState: { errors: editErrors },
  } = useForm<SubscriptionPackCreateRequest>();

  useEffect(() => {
    fetchPacks();
  }, [pagination.page]);

  const fetchPacks = async () => {
    try {
      setLoading(true);
      const response = await apiService.getSubscriptionPacks(pagination.page, pagination.limit);
      setPacks(response.packs);
      setPagination(response.pagination);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch subscription packs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePack = async (data: SubscriptionPackCreateRequest) => {
    try {
      await apiService.createSubscriptionPack(data);
      toast.success('Subscription pack created successfully');
      setIsCreateModalOpen(false);
      resetCreate();
      fetchPacks();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create subscription pack');
    }
  };

  const handleEditPack = async (data: SubscriptionPackCreateRequest) => {
    if (!selectedPack) return;
    
    try {
      await apiService.updateSubscriptionPack(selectedPack.id, data);
      toast.success('Subscription pack updated successfully');
      setIsEditModalOpen(false);
      setSelectedPack(null);
      resetEdit();
      fetchPacks();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update subscription pack');
    }
  };

  const handleDeletePack = async (packId: number) => {
    if (!window.confirm('Are you sure you want to delete this subscription pack?')) return;
    
    try {
      await apiService.deleteSubscriptionPack(packId);
      toast.success('Subscription pack deleted successfully');
      fetchPacks();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete subscription pack');
    }
  };

  const openEditModal = (pack: SubscriptionPack) => {
    setSelectedPack(pack);
    resetEdit({
      name: pack.name,
      description: pack.description,
      sku: pack.sku,
      price: pack.price,
      validity_months: pack.validity_months,
    });
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscription Packs</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage subscription packages and pricing
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Pack
        </Button>
      </div>

      {/* Subscription Packs Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>SKU</TableHeaderCell>
              <TableHeaderCell>Price</TableHeaderCell>
              <TableHeaderCell>Validity</TableHeaderCell>
              <TableHeaderCell>Created</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packs.map((pack) => (
              <TableRow key={pack.id}>
                <TableCell className="font-medium">{pack.name}</TableCell>
                <TableCell>
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                    {pack.sku}
                  </code>
                </TableCell>
                <TableCell>${pack.price}</TableCell>
                <TableCell>{pack.validity_months} months</TableCell>
                <TableCell>
                  {new Date(pack.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(pack)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeletePack(pack.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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

      {/* Create Pack Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Subscription Pack"
        size="md"
      >
        <form onSubmit={handleCreateSubmit(handleCreatePack)} className="space-y-4">
          <Input
            label="Name"
            {...registerCreate('name', { required: 'Name is required' })}
            error={createErrors.name?.message}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              rows={3}
              {...registerCreate('description', { required: 'Description is required' })}
            />
            {createErrors.description && (
              <p className="text-sm text-red-600 mt-1">{createErrors.description.message}</p>
            )}
          </div>
          <Input
            label="SKU"
            {...registerCreate('sku', { required: 'SKU is required' })}
            error={createErrors.sku?.message}
          />
          <Input
            label="Price"
            type="number"
            step="0.01"
            {...registerCreate('price', { 
              required: 'Price is required',
              min: { value: 0, message: 'Price must be positive' }
            })}
            error={createErrors.price?.message}
          />
          <Input
            label="Validity (months)"
            type="number"
            min="1"
            max="12"
            {...registerCreate('validity_months', { 
              required: 'Validity is required',
              min: { value: 1, message: 'Validity must be at least 1 month' },
              max: { value: 12, message: 'Validity must be at most 12 months' }
            })}
            error={createErrors.validity_months?.message}
          />
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Pack</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Pack Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Subscription Pack"
        size="md"
      >
        <form onSubmit={handleEditSubmit(handleEditPack)} className="space-y-4">
          <Input
            label="Name"
            {...registerEdit('name', { required: 'Name is required' })}
            error={editErrors.name?.message}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              rows={3}
              {...registerEdit('description', { required: 'Description is required' })}
            />
            {editErrors.description && (
              <p className="text-sm text-red-600 mt-1">{editErrors.description.message}</p>
            )}
          </div>
          <Input
            label="SKU"
            {...registerEdit('sku', { required: 'SKU is required' })}
            error={editErrors.sku?.message}
          />
          <Input
            label="Price"
            type="number"
            step="0.01"
            {...registerEdit('price', { 
              required: 'Price is required',
              min: { value: 0, message: 'Price must be positive' }
            })}
            error={editErrors.price?.message}
          />
          <Input
            label="Validity (months)"
            type="number"
            min="1"
            max="12"
            {...registerEdit('validity_months', { 
              required: 'Validity is required',
              min: { value: 1, message: 'Validity must be at least 1 month' },
              max: { value: 12, message: 'Validity must be at most 12 months' }
            })}
            error={editErrors.validity_months?.message}
          />
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Update Pack</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SubscriptionPacksPage;
