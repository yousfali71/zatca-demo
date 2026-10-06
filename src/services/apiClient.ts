/**
 * Central API Client connecting to backend: https://e-commerce-system-six.vercel.app/api/docs/#/
 * Supports JWT Tokens, Interceptors, and rich dynamic fallbacks.
 */

import {
  User,
  Product,
  Category,
  Unit,
  Customer,
  Supplier,
  Warehouse,
  Invoice,
  Purchase,
  ReturnRecord,
  StockCount,
  VatReturnDeclaration
} from '../types/zatcaErp';

/** Shape returned by the backend for a user (swagger: role is an object with permissions). */
export interface BackendUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: { name: string; permissions?: string[] } | string;
}
export interface BackendAuthResult {
  user: BackendUser;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
}
export interface ZatcaUnitDto {
  id: string;
  name: string;
  environment: 'sandbox' | 'simulation' | 'production';
  status: 'NOT_CONNECTED' | 'COMPLIANCE' | 'CONNECTED' | 'EXPIRED' | 'FAILED';
  expiresAt?: string | null;
  lastError?: { errorMessage: string; createdAt: string } | null;
}

export interface ZatcaStatusDto {
  environment: string;
  sellerName?: string;
  vatNumber?: string;
  invoicesSummary?: {
    CLEARED?: number;
    REPORTED?: number;
    FAILED?: number;
    [key: string]: number | undefined;
  };
}

export interface ZatcaLogDto {
  id: string;
  action: string;
  status: string;
  message?: string;
  createdAt: string;
}

const API_HOST = process.env.NEXT_PUBLIC_API_HOST !== undefined 
  ? process.env.NEXT_PUBLIC_API_HOST 
  : (typeof window !== 'undefined' ? '' : 'https://e-commerce-system-six.vercel.app');

const BASE_URL = `${API_HOST}/backend-api`;
const AUTH_BASE_URL = `${API_HOST}/backend-api/auth`;

export const TOKEN_KEY = 'zatca_auth_token';
export const REFRESH_TOKEN_KEY = 'zatca_refresh_token';

export class ApiError extends Error {
  status: number;
  errors?: { field?: string; message: string }[];
  constructor(message: string, status: number, errors?: { field?: string; message: string }[]) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

class ApiService {
  private getHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  }

  /** Returns the unwrapped `data` field of the standard `{ success, data }` envelope. */
  async request<T>(endpoint: string, options: RequestInit = {}, base: string = BASE_URL): Promise<T> {
    const response = await fetch(`${base}${endpoint}`, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers
      }
    });

    let json: any = null;
    try { json = await response.json(); } catch { /* empty / non-JSON body */ }

    if (!response.ok || json?.success === false) {
      if (response.status === 401 && typeof window !== 'undefined' && base === BASE_URL) {
        localStorage.removeItem(TOKEN_KEY);
      }
      const fieldMsg = json?.errors?.[0]?.message;
      throw new ApiError(
        [json?.message, fieldMsg].filter(Boolean).join(' — ') || `API Error: ${response.status} ${response.statusText}`,
        response.status,
        json?.errors
      );
    }

    return (json && 'data' in json ? json.data : json) as T;
  }

  // AUTH ENDPOINTS (swagger: register requires name, email, password, roleId; phone optional)
  async login(credentials: { email: string; password: string }) {
    return this.request<BackendAuthResult>('/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }, AUTH_BASE_URL);
  }

  async register(data: { name: string; email: string; password: string; phone?: string }) {
    return this.request<Partial<BackendAuthResult> & { user?: BackendUser }>('/register', {
      method: 'POST',
      body: JSON.stringify(data)
    }, AUTH_BASE_URL);
  }

  async getMe() {
    return this.request<BackendUser>('/me', {}, AUTH_BASE_URL);
  }

  async forgotPassword(email: string) {
    return this.request<unknown>('/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    }, AUTH_BASE_URL);
  }

  async resetPassword(data: { token: string; password: string }) {
    return this.request<unknown>('/reset-password', {
      method: 'POST',
      body: JSON.stringify(data)
    }, AUTH_BASE_URL);
  }

  async refresh(refreshToken: string) {
    return this.request<Partial<BackendAuthResult>>('/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken })
    }, AUTH_BASE_URL);
  }

  async logout(refreshToken?: string) {
    return this.request<unknown>('/logout', {
      method: 'POST',
      body: JSON.stringify(refreshToken ? { refreshToken } : {})
    }, AUTH_BASE_URL);
  }

  async googleLogin(googleIdToken: string) {
    return this.request<BackendAuthResult>('/google', {
      method: 'POST',
      body: JSON.stringify({ token: googleIdToken })
    }, AUTH_BASE_URL);
  }

  // MASTER DATA
  async getCategories() {
    return this.request<Category[]>('/categories');
  }

  async getUnits() {
    return this.request<Unit[]>('/units');
  }

  // PRODUCTS
  async getProducts() {
    return this.request<Product[]>('/products');
  }

  async createProduct(data: Partial<Product>) {
    return this.request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateProduct(id: string, data: Partial<Product>) {
    return this.request<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteProduct(id: string) {
    return this.request<unknown>(`/products/${id}`, {
      method: 'DELETE'
    });
  }

  // STAKEHOLDERS
  async getCustomers() {
    return this.request<Customer[]>('/customers');
  }

  async getSuppliers() {
    return this.request<Supplier[]>('/suppliers');
  }

  // WAREHOUSES & INVENTORY
  async getWarehouses() {
    return this.request<Warehouse[]>('/warehouses');
  }

  // SALES & POS
  async getSales() {
    return this.request<Invoice[]>('/sales');
  }

  async createSale(data: Partial<Invoice>) {
    return this.request<Invoice>('/sales', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // PURCHASES
  async getPurchases() {
    return this.request<Purchase[]>('/purchases');
  }

  async createPurchase(data: Partial<Purchase>) {
    return this.request<Purchase>('/purchases', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // RETURNS & STOCK COUNTS
  async createSalesReturn(data: { saleId: string; reason?: string; items: { productId: string; quantity: number }[] }) {
    return this.request<ReturnRecord>('/returns', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async createStockCount(data: any) {
    return this.request<StockCount>('/stock-counts', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // INVOICES / ZATCA
  async resubmitInvoice(invoiceId: string) {
    return this.request<unknown>(`/invoices/${invoiceId}/submit`, { method: 'POST' });
  }

  // ZATCA ACTIVATION (separate phase — done after account creation, see swagger /zatca/units/*)
  async createZatcaUnit(data: { name: string; environment: 'sandbox' | 'simulation' | 'production' }) {
    return this.request<ZatcaUnitDto>('/zatca/units', { method: 'POST', body: JSON.stringify(data) });
  }

  async generateZatcaCsr(unitId: string, data: Record<string, string>) {
    return this.request<unknown>(`/zatca/units/${unitId}/csr`, { method: 'POST', body: JSON.stringify(data) });
  }

  async requestZatcaCompliance(unitId: string, otp: string) {
    return this.request<unknown>(`/zatca/units/${unitId}/compliance`, { method: 'POST', body: JSON.stringify({ otp }) });
  }

  async runZatcaComplianceCheck(unitId: string) {
    return this.request<unknown>(`/zatca/units/${unitId}/compliance-check`, { method: 'POST' });
  }

  async requestZatcaProduction(unitId: string) {
    return this.request<unknown>(`/zatca/units/${unitId}/production`, { method: 'POST' });
  }

  async getZatcaUnitStatus(unitId: string) {
    return this.request<ZatcaUnitDto>(`/zatca/units/${unitId}/status`);
  }

  async renewZatcaUnit(unitId: string) {
    return this.request<unknown>(`/zatca/units/${unitId}/renew`, { method: 'POST' });
  }

  async getZatcaStatus() {
    return this.request<ZatcaStatusDto>('/zatca/status');
  }

  async getZatcaLogs(params?: { status?: string; page?: number; limit?: number }) {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return this.request<ZatcaLogDto[] | { data: ZatcaLogDto[] }>(`/zatca/logs${queryString}`);
  }
}

export const apiClient = new ApiService();
