'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole, BusinessProfile } from '../types/zatcaErp';
import { MOCK_USERS, INITIAL_BUSINESS_PROFILE } from '../mock/zatcaData';
import { apiClient, BackendUser, TOKEN_KEY, REFRESH_TOKEN_KEY, ZatcaUnitDto } from '../services/apiClient';

/** Set NEXT_PUBLIC_USE_MOCK_AUTH=true to keep the old offline demo behaviour. */
const USE_MOCK_AUTH = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true';
/** swagger: POST /auth/register requires a roleId (UUID). */
const DEFAULT_ROLE_ID = process.env.NEXT_PUBLIC_DEFAULT_ROLE_ID || '';

const ZATCA_ACTIVATION_KEY = 'zatca_activation';

/** Phase 2 (ZATCA) state — independent from the account (phase 1). */
export type ZatcaActivationStatus = ZatcaUnitDto['status']; // NOT_CONNECTED | COMPLIANCE | CONNECTED | EXPIRED | FAILED
export interface ZatcaActivation {
  unitId: string | null;
  status: ZatcaActivationStatus;
}
const NOT_ACTIVATED: ZatcaActivation = { unitId: null, status: 'NOT_CONNECTED' };

/** Phase 1 payload — exactly the swagger registration fields (+ roleId resolved by the context). */
export interface RegisterAccountPayload {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

interface AuthContextType {
  currentUser: User | null;
  businessProfile: BusinessProfile;
  authReady: boolean;
  switchRole: (role: UserRole) => void;
  login: (email: string, pass: string) => Promise<boolean>;
  loginWithGoogle: (googleToken: string) => Promise<boolean>;
  registerAccount: (payload: RegisterAccountPayload) => Promise<boolean>;
  logout: () => void;
  updateBusinessProfile: (updates: Partial<BusinessProfile>) => void;
  /** ZATCA activation (separate phase) */
  zatca: ZatcaActivation;
  isZatcaActivated: boolean;
  setZatcaActivation: (next: Partial<ZatcaActivation>) => void;
  isOwner: boolean;
  isFinanceManager: boolean;
  isStoreKeeper: boolean;
  isCashier: boolean;
  activeToken: string | null;
  permissions: string[];
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const EMPTY_PROFILE: BusinessProfile = {
  id: '',
  companyNameAr: '',
  companyNameEn: '',
  crNumber: '',
  vatNumber: '',
  streetName: '',
  buildingNumber: '',
  district: '',
  city: '',
  postalCode: '',
  country: 'المملكة العربية السعودية',
  zatcaPhase: 'PHASE_2',
  csidStatus: 'NOT_ACTIVATED'
};

function mapBackendRole(role: BackendUser['role']): { role: UserRole; title: string; permissions: string[] } {
  const name = (typeof role === 'string' ? role : role?.name || '').toLowerCase();
  const permissions = typeof role === 'object' && role?.permissions ? role.permissions : [];
  if (name.includes('admin') || name.includes('owner')) return { role: 'OWNER', title: 'مالك المنشأة', permissions };
  if (name.includes('finance') || name.includes('account')) return { role: 'FINANCE_MANAGER', title: 'مدير مالي', permissions };
  if (name.includes('store') || name.includes('warehouse')) return { role: 'STORE_KEEPER', title: 'أمين مستودع', permissions };
  return { role: 'CASHIER', title: 'كاشير', permissions };
}

function toUser(b: BackendUser, businessProfile: BusinessProfile): { user: User; permissions: string[] } {
  const { role, title, permissions } = mapBackendRole(b.role);
  return {
    permissions,
    user: {
      id: b.id,
      name: b.name,
      email: b.email,
      avatar: '',
      role,
      roleTitle: title,
      phone: b.phone || '',
      businessId: businessProfile.id,
      businessProfile
    }
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(USE_MOCK_AUTH ? MOCK_USERS[0] : null);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(
    USE_MOCK_AUTH ? INITIAL_BUSINESS_PROFILE : EMPTY_PROFILE
  );
  const [activeToken, setActiveToken] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [authReady, setAuthReady] = useState(USE_MOCK_AUTH);
  const [zatca, setZatca] = useState<ZatcaActivation>(
    USE_MOCK_AUTH ? { unitId: 'mock-unit', status: 'CONNECTED' } : NOT_ACTIVATED
  );

  const persistTokens = (token?: string, refreshToken?: string) => {
    if (typeof window === 'undefined') return;
    if (token) localStorage.setItem(TOKEN_KEY, token);
    if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  };

  const clearSession = () => {
    setCurrentUser(null);
    setActiveToken(null);
    setPermissions([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  };

  const applyUser = useCallback((b: BackendUser, zatcaState: ZatcaActivation) => {
    const profile: BusinessProfile = {
      ...EMPTY_PROFILE,
      id: 'biz-' + b.id,
      companyNameAr: b.name,
      companyNameEn: b.name,
      csidStatus: zatcaState.status === 'CONNECTED' ? 'ACTIVE' : 'NOT_ACTIVATED'
    };
    const { user, permissions: perms } = toUser(b, profile);
    setBusinessProfile(profile);
    setCurrentUser(user);
    setPermissions(perms);
  }, []);

  // Restore session (and ZATCA activation state) on load
  useEffect(() => {
    if (USE_MOCK_AUTH || typeof window === 'undefined') return;
    let saved: ZatcaActivation = NOT_ACTIVATED;
    try {
      const raw = localStorage.getItem(ZATCA_ACTIVATION_KEY);
      if (raw) saved = { ...NOT_ACTIVATED, ...JSON.parse(raw) };
    } catch { /* ignore corrupt value */ }
    setZatca(saved);

    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) { setAuthReady(true); return; }

    (async () => {
      try {
        let me: BackendUser;
        try {
          me = await apiClient.getMe();
        } catch {
          const rt = localStorage.getItem(REFRESH_TOKEN_KEY);
          if (!rt) throw new Error('no refresh token');
          const refreshed = await apiClient.refresh(rt);
          persistTokens(refreshed.accessToken || refreshed.token, refreshed.refreshToken);
          me = await apiClient.getMe();
        }
        setActiveToken(localStorage.getItem(TOKEN_KEY));
        applyUser(me, saved);
        // Re-sync ZATCA status from backend when a unit already exists
        if (saved.unitId) {
          apiClient.getZatcaUnitStatus(saved.unitId)
            .then((u) => setZatca((p) => ({ ...p, status: u.status })))
            .catch(() => { /* keep cached status */ });
        }
      } catch {
        clearSession();
      } finally {
        setAuthReady(true);
      }
    })();
  }, [applyUser]);

  // Persist ZATCA activation
  useEffect(() => {
    if (USE_MOCK_AUTH || typeof window === 'undefined' || !authReady) return;
    localStorage.setItem(ZATCA_ACTIVATION_KEY, JSON.stringify(zatca));
  }, [zatca, authReady]);

  const setZatcaActivation = (next: Partial<ZatcaActivation>) => {
    setZatca((prev) => ({ ...prev, ...next }));
    if (next.status) {
      setBusinessProfile((p) => ({ ...p, csidStatus: next.status === 'CONNECTED' ? 'ACTIVE' : 'NOT_ACTIVATED' }));
    }
  };

  const switchRole = (role: UserRole) => {
    if (!USE_MOCK_AUTH) return; // real roles come from the backend
    const targetUser = MOCK_USERS.find((u) => u.role === role);
    if (targetUser) setCurrentUser({ ...targetUser, businessProfile });
  };

  /** Throws ApiError with the backend message on failure (no silent mock fallback). */
  const login = async (email: string, pass: string): Promise<boolean> => {
    if (USE_MOCK_AUTH) {
      const match = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase()) || MOCK_USERS[0];
      setCurrentUser({ ...match, businessProfile });
      return true;
    }
    const res = await apiClient.login({ email, password: pass });
    const token = res.accessToken || res.token;
    persistTokens(token, res.refreshToken);
    setActiveToken(token || null);
    applyUser(res.user, zatca);
    return true;
  };

  const loginWithGoogle = async (googleToken: string): Promise<boolean> => {
    if (USE_MOCK_AUTH) {
      setCurrentUser(MOCK_USERS[0]);
      return true;
    }
    const res = await apiClient.googleLogin(googleToken);
    const token = res.accessToken || res.token;
    persistTokens(token, res.refreshToken);
    setActiveToken(token || null);
    applyUser(res.user, zatca);
    return true;
  };

  /**
   * PHASE 1 — create the account only (swagger fields: name, email, password, phone, roleId).
   * ZATCA is NOT part of registration; the user activates it later from the sidebar.
   */
  const registerAccount = async (payload: RegisterAccountPayload): Promise<boolean> => {
    if (USE_MOCK_AUTH) return login(payload.email, payload.password);
    await apiClient.register({
      name: payload.name,
      email: payload.email,
      password: payload.password,
      ...(payload.phone ? { phone: payload.phone } : {})
    });
    // New account → ZATCA not activated yet
    setZatca(NOT_ACTIVATED);
    if (typeof window !== 'undefined') localStorage.removeItem(ZATCA_ACTIVATION_KEY);
    return login(payload.email, payload.password);
  };

  const logout = () => {
    if (!USE_MOCK_AUTH && typeof window !== 'undefined') {
      apiClient.logout(localStorage.getItem(REFRESH_TOKEN_KEY) || undefined).catch(() => { /* best effort */ });
    }
    clearSession();
  };

  const updateBusinessProfile = (updates: Partial<BusinessProfile>) => {
    setBusinessProfile((prev) => ({ ...prev, ...updates }));
  };

  const hasPermission = (permission: string) =>
    USE_MOCK_AUTH || permissions.includes(permission) || currentUser?.role === 'SUPER_ADMIN';

  const isOwner = currentUser?.role === 'OWNER' || currentUser?.role === 'SUPER_ADMIN';
  const isFinanceManager = currentUser?.role === 'FINANCE_MANAGER';
  const isStoreKeeper = currentUser?.role === 'STORE_KEEPER';
  const isCashier = currentUser?.role === 'CASHIER';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        businessProfile,
        authReady,
        switchRole,
        login,
        loginWithGoogle,
        registerAccount,
        logout,
        updateBusinessProfile,
        zatca,
        isZatcaActivated: zatca.status === 'CONNECTED',
        setZatcaActivation,
        isOwner,
        isFinanceManager,
        isStoreKeeper,
        isCashier,
        activeToken,
        permissions,
        hasPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
