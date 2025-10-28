// Base response types
export interface BaseResponse {
  success: boolean;
  message?: string;
}

export interface ErrorResponse {
  success: false;
  message: string;
}

// Authentication types
export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  success: boolean;
  token: string;
  email: string;
  expires_in: number;
}

export interface CustomerLoginRequest {
  email: string;
  password: string;
}

export interface CustomerLoginResponse {
  success: boolean;
  token: string;
  email: string;
  name: string;
  phone: string;
  expires_in: number;
}

export interface CustomerSignupRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface CustomerSignupResponse {
  success: boolean;
  message: string;
  token: string;
  email: string;
  name: string;
  phone: string;
  expires_in: number;
}

// Dashboard types
export interface DashboardData {
  total_customers: number;
  active_subscriptions: number;
  pending_requests: number;
  total_revenue: number;
  recent_activities: RecentActivity[];
}

export interface RecentActivity {
  type: string;
  customer: string;
  pack: string;
  timestamp: string;
}

export interface DashboardResponse {
  success: boolean;
  data: DashboardData;
}

// Customer types
export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerCreateRequest {
  name: string;
  email: string;
  phone: string;
}

export interface CustomerUpdateRequest {
  name?: string;
  phone?: string;
}

export interface CustomersResponse {
  success: boolean;
  customers: Customer[];
  pagination: Pagination;
}

// Subscription Pack types
export interface SubscriptionPack {
  id: number;
  name: string;
  description: string;
  sku: string;
  price: number;
  validity_months: number;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionPackCreateRequest {
  name: string;
  description: string;
  sku: string;
  price: number;
  validity_months: number;
}

export interface SubscriptionPackUpdateRequest {
  name?: string;
  description?: string;
  sku?: string;
  price?: number;
  validity_months?: number;
}

export interface SubscriptionPacksResponse {
  success: boolean;
  packs: SubscriptionPack[];
  pagination: Pagination;
}

// Subscription types
export type SubscriptionStatus = 'requested' | 'approved' | 'active' | 'inactive' | 'expired';

export interface Subscription {
  id: number;
  customer_id: number;
  pack_id: number;
  status: SubscriptionStatus;
  pack_name: string;
  pack_sku: string;
  price: number;
  validity_months: number;
  requested_at?: string;
  approved_at?: string;
  assigned_at?: string;
  expires_at?: string;
  deactivated_at?: string;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionRequest {
  sku: string;
}

export interface SubscriptionCreateResponse {
  success: boolean;
  message: string;
  subscription: {
    id: number;
    status: string;
    requested_at: string;
  };
}

export interface CustomerSubscriptionResponse {
  success: boolean;
  subscription: {
    id: number;
    pack: {
      name: string;
      sku: string;
      price: number;
      validity_months: number;
    };
    status: SubscriptionStatus;
    assigned_at: string;
    expires_at: string;
    is_valid: boolean;
  };
}

export interface SubscriptionHistoryResponse {
  success: boolean;
  history: SubscriptionHistoryItem[];
  pagination: Pagination;
}

export interface SubscriptionHistoryItem {
  id: number;
  pack_name: string;
  status: SubscriptionStatus;
  assigned_at: string;
  expires_at: string;
}

export interface AssignSubscriptionRequest {
  pack_id: number;
}

export interface DeactivateResponse {
  success: boolean;
  message: string;
  deactivated_at: string;
}

export interface SubscriptionsResponse {
  success: boolean;
  subscriptions: Subscription[];
  pagination: Pagination;
}

// SDK types
export interface SDKAuthRequest {
  email: string;
  password: string;
  api_key: string;
}

export interface SDKAuthResponse {
  success: boolean;
  api_key: string;
  token?: string;
  name: string;
  phone: string;
  expires_in: number;
}

// Utility types
export interface Pagination {
  page: number;
  limit: number;
  total: number;
}

export interface SuccessResponse {
  success: boolean;
  message: string;
}

// User context types
export interface User {
  id?: number;
  email: string;
  name?: string;
  phone?: string;
  role: 'admin' | 'customer';
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string, role: 'admin' | 'customer') => Promise<void>;
  signup: (data: CustomerSignupRequest) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}
