import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  AdminLoginRequest,
  AdminLoginResponse,
  CustomerLoginRequest,
  CustomerLoginResponse,
  CustomerSignupRequest,
  CustomerSignupResponse,
  DashboardResponse,
  Customer,
  CustomerCreateRequest,
  CustomerUpdateRequest,
  CustomersResponse,
  SubscriptionPack,
  SubscriptionPackCreateRequest,
  SubscriptionPackUpdateRequest,
  SubscriptionPacksResponse,
  Subscription,
  SubscriptionRequest,
  SubscriptionCreateResponse,
  CustomerSubscriptionResponse,
  SubscriptionHistoryResponse,
  AssignSubscriptionRequest,
  DeactivateResponse,
  SubscriptionsResponse,
  SuccessResponse,
  Pagination
} from '../types';

class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication APIs
  async adminLogin(data: AdminLoginRequest): Promise<AdminLoginResponse> {
    const response: AxiosResponse<AdminLoginResponse> = await this.api.post('/api/admin/login', data);
    return response.data;
  }

  async customerLogin(data: CustomerLoginRequest): Promise<CustomerLoginResponse> {
    const response: AxiosResponse<CustomerLoginResponse> = await this.api.post('/api/customer/login', data);
    return response.data;
  }

  async customerSignup(data: CustomerSignupRequest): Promise<CustomerSignupResponse> {
    const response: AxiosResponse<CustomerSignupResponse> = await this.api.post('/api/customer/signup', data);
    return response.data;
  }

  // Dashboard APIs
  async getDashboard(): Promise<DashboardResponse> {
    const response: AxiosResponse<DashboardResponse> = await this.api.get('/api/v1/admin/dashboard');
    return response.data;
  }

  // Customer Management APIs
  async getCustomers(page = 1, limit = 10, search?: string): Promise<CustomersResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (search) params.append('search', search);

    const response: AxiosResponse<CustomersResponse> = await this.api.get(`/api/v1/admin/customers?${params}`);
    return response.data;
  }

  async getCustomer(customerId: number): Promise<{ success: boolean; customer: Customer }> {
    const response = await this.api.get(`/api/v1/admin/customers/${customerId}`);
    return response.data;
  }

  async createCustomer(data: CustomerCreateRequest): Promise<{ success: boolean; customer: Customer }> {
    const response = await this.api.post('/api/v1/admin/customers', data);
    return response.data;
  }

  async updateCustomer(customerId: number, data: CustomerUpdateRequest): Promise<{ success: boolean; customer: Customer }> {
    const response = await this.api.put(`/api/v1/admin/customers/${customerId}`, data);
    return response.data;
  }

  async deleteCustomer(customerId: number): Promise<SuccessResponse> {
    const response: AxiosResponse<SuccessResponse> = await this.api.delete(`/api/v1/admin/customers/${customerId}`);
    return response.data;
  }

  // Subscription Pack Management APIs
  async getSubscriptionPacks(page = 1, limit = 10): Promise<SubscriptionPacksResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response: AxiosResponse<SubscriptionPacksResponse> = await this.api.get(`/api/v1/admin/subscription-packs?${params}`);
    return response.data;
  }

  async createSubscriptionPack(data: SubscriptionPackCreateRequest): Promise<{ success: boolean; pack: SubscriptionPack }> {
    const response = await this.api.post('/api/v1/admin/subscription-packs', data);
    return response.data;
  }

  async updateSubscriptionPack(packId: number, data: SubscriptionPackUpdateRequest): Promise<{ success: boolean; pack: SubscriptionPack }> {
    const response = await this.api.put(`/api/v1/admin/subscription-packs/${packId}`, data);
    return response.data;
  }

  async deleteSubscriptionPack(packId: number): Promise<SuccessResponse> {
    const response: AxiosResponse<SuccessResponse> = await this.api.delete(`/api/v1/admin/subscription-packs/${packId}`);
    return response.data;
  }

  // Subscription Management APIs
  async getSubscriptions(page = 1, limit = 10, status?: string): Promise<SubscriptionsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (status) params.append('status', status);

    const response: AxiosResponse<SubscriptionsResponse> = await this.api.get(`/api/v1/admin/subscriptions?${params}`);
    return response.data;
  }

  async approveSubscription(subscriptionId: number): Promise<SuccessResponse> {
    const response: AxiosResponse<SuccessResponse> = await this.api.post(`/api/v1/admin/subscriptions/${subscriptionId}/approve`);
    return response.data;
  }

  async assignSubscription(customerId: number, data: AssignSubscriptionRequest): Promise<SuccessResponse> {
    const response: AxiosResponse<SuccessResponse> = await this.api.post(`/api/v1/admin/customers/${customerId}/assign-subscription`, data);
    return response.data;
  }

  async unassignSubscription(customerId: number, subscriptionId: number): Promise<SuccessResponse> {
    const response: AxiosResponse<SuccessResponse> = await this.api.delete(`/api/v1/admin/customers/${customerId}/subscription/${subscriptionId}`);
    return response.data;
  }

  // Customer Self-Service APIs
  async getCustomerSubscription(): Promise<CustomerSubscriptionResponse> {
    const response: AxiosResponse<CustomerSubscriptionResponse> = await this.api.get('/api/v1/customer/subscription');
    return response.data;
  }

  async requestSubscription(data: SubscriptionRequest): Promise<SubscriptionCreateResponse> {
    const response: AxiosResponse<SubscriptionCreateResponse> = await this.api.post('/api/v1/customer/subscription', data);
    return response.data;
  }

  async deactivateSubscription(): Promise<DeactivateResponse> {
    const response: AxiosResponse<DeactivateResponse> = await this.api.delete('/api/v1/customer/subscription');
    return response.data;
  }

  async getSubscriptionHistory(page = 1, limit = 10, sort = 'desc'): Promise<SubscriptionHistoryResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sort,
    });

    const response: AxiosResponse<SubscriptionHistoryResponse> = await this.api.get(`/api/v1/customer/subscription-history?${params}`);
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;
