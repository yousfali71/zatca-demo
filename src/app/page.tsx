'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Menu } from 'lucide-react';
import {
  ZatcaSidebar,
  ZatcaTaxDashboard,
  ZatcaOnboardingPortal,
  VatReturnCalculator,
  SalesPosPortal,
  PurchasesPortal,
  ProductsInventoryPortal,
  StakeholdersPortal,
  ReturnsStockCountPortal,
  ReportsAnalyticsPortal,
  InvoicesPortal,
  PrintableInvoiceModal,
  RoleSwitcherModal,
  AuthLayout,
  LoginForm,
  SignupWizard
} from '../components';
import { ActiveTab } from '../components/ZatcaSidebar';
import { Invoice } from '../types/zatcaErp';

export default function Home() {
  const { currentUser, authReady } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<Invoice | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!authReady) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13 }}>جاري التحميل...</div>;
  }

  /* ── Auth Screens ───────────────────────────── */
  if (!currentUser) {
    return (
      <AuthLayout>
        {authView === 'signup' ? (
          <SignupWizard
            onSuccess={() => setAuthView('login')}
            onSwitchToLogin={() => setAuthView('login')}
          />
        ) : (
          <LoginForm
            onSwitchToSignup={() => setAuthView('signup')}
          />
        )}
      </AuthLayout>
    );
  }

  /* ── Main App Layout ────────────────────────── */
  return (
    <div className="app-layout">
      <ZatcaSidebar activeTab={activeTab} onTabChange={setActiveTab} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main-col">
        {!sidebarOpen && (
          <button
            type="button"
            className="topbar-icon-btn topbar-menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="فتح القائمة"
            style={{ position: 'absolute', top: 12, left: 12, zIndex: 40 }}
          >
            <Menu style={{ width: 18, height: 18 }} />
          </button>
        )}


        <main className="page-content">
          {activeTab === 'dashboard' && <ZatcaTaxDashboard onNavigateToTab={setActiveTab} onSelectInvoiceForPrint={setSelectedInvoiceForPrint} />}
          {activeTab === 'zatca_portal' && <ZatcaOnboardingPortal />}
          {activeTab === 'vat_calculator' && <VatReturnCalculator />}
          {activeTab === 'pos_sales' && <SalesPosPortal onSelectInvoiceForPrint={setSelectedInvoiceForPrint} />}
          {activeTab === 'invoices' && <InvoicesPortal onSelectInvoiceForPrint={setSelectedInvoiceForPrint} />}
          {activeTab === 'purchases' && <PurchasesPortal />}
          {activeTab === 'products' && <ProductsInventoryPortal />}
          {activeTab === 'inventory' && <ProductsInventoryPortal />}
          {activeTab === 'stakeholders' && <StakeholdersPortal />}
          {activeTab === 'returns' && <ReturnsStockCountPortal />}
          {activeTab === 'reports' && <ReportsAnalyticsPortal />}
        </main>
      </div>

      <PrintableInvoiceModal invoice={selectedInvoiceForPrint} onClose={() => setSelectedInvoiceForPrint(null)} />
      <RoleSwitcherModal isOpen={isRoleModalOpen} onClose={() => setIsRoleModalOpen(false)} />
    </div>
  );
}
