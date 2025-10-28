import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Card, Table, TableHeader, TableBody, TableRow, TableCell, TableHeaderCell, Modal, Input, Badge } from '../../components/ui';
import { Customer, CustomerCreateRequest, Pagination } from '../../types';
import apiService from '../../services/api';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const {
    register: registerCreate,
    handleSubmit: handleCreateSubmit,
    reset: resetCreate,
    formState: { errors: createErrors },
  } = useForm<CustomerCreateRequest>();

  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
    formState: { errors: editErrors },
  } = useForm<CustomerCreateRequest>();

  useEffect(() => {
    fetchCustomers();
  }, [pagination.page, searchTerm]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCustomers(pagination.page, pagination.limit, searchTerm);
      setCustomers(response.customers);
      setPagination(response.pagination);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomer = async (data: CustomerCreateRequest) => {
    try {
      await apiService.createCustomer(data);
      toast.success('Customer created successfully');
      setIsCreateModalOpen(false);
      resetCreate();
      fetchCustomers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create customer');
    }
  };

  const handleEditCustomer = async (data: CustomerCreateRequest) => {
    if (!selectedCustomer) return;
    
    try {
      await apiService.updateCustomer(selectedCustomer.id, data);
      toast.success('Customer updated successfully');
      setIsEditModalOpen(false);
      setSelectedCustomer(null);
      resetEdit();
      fetchCustomers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update customer');
    }
  };

  const handleDeleteCustomer = async (customerId: number) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    
    try {
      await apiService.deleteCustomer(customerId);
      toast.success('Customer deleted successfully');
      fetchCustomers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete customer');
    }
  };

  const openEditModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    resetEdit({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
    });
    setIsEditModalOpen(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchCustomers();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage customer accounts and information
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Search */}
      <Card>
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search customers by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button type="submit" variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>
      </Card>

      {/* Customers Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Email</TableHeaderCell>
              <TableHeaderCell>Phone</TableHeaderCell>
              <TableHeaderCell>Created</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>
                  {new Date(customer.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(customer)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteCustomer(customer.id)}
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

      {/* Create Customer Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Customer"
        size="md"
      >
        <form onSubmit={handleCreateSubmit(handleCreateCustomer)} className="space-y-4">
          <Input
            label="Name"
            {...registerCreate('name', { required: 'Name is required' })}
            error={createErrors.name?.message}
          />
          <Input
            label="Email"
            type="email"
            {...registerCreate('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            error={createErrors.email?.message}
          />
          <Input
            label="Phone"
            type="tel"
            {...registerCreate('phone', { required: 'Phone is required' })}
            error={createErrors.phone?.message}
          />
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Customer</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Customer Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Customer"
        size="md"
      >
        <form onSubmit={handleEditSubmit(handleEditCustomer)} className="space-y-4">
          <Input
            label="Name"
            {...registerEdit('name', { required: 'Name is required' })}
            error={editErrors.name?.message}
          />
          <Input
            label="Email"
            type="email"
            disabled
            value={selectedCustomer?.email}
          />
          <Input
            label="Phone"
            type="tel"
            {...registerEdit('phone', { required: 'Phone is required' })}
            error={editErrors.phone?.message}
          />
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Update Customer</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CustomersPage;
