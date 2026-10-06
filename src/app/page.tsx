'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ZatcaHeader } from '../components/ZatcaHeader';
import { ZatcaSidebar, ActiveTab } from '../components/ZatcaSidebar';
import { ZatcaTaxDashboard } from '../components/ZatcaTaxDashboard';
import { ZatcaOnboardingPortal } from '../components/ZatcaOnboardingPortal';
import { VatReturnCalculator } from '../components/VatReturnCalculator';
import { SalesPosPortal } from '../components/SalesPosPortal';
import { PurchasesPortal } from '../components/PurchasesPortal';
import { ProductsInventoryPortal } from '../components/ProductsInventoryPortal';
import { StakeholdersPortal } from '../components/StakeholdersPortal';
import { ReturnsStockCountPortal } from '../components/ReturnsStockCountPortal';
import { ReportsAnalyticsPortal } from '../components/ReportsAnalyticsPortal';
import { PrintableInvoiceModal } from '../components/PrintableInvoiceModal';
import { RoleSwitcherModal } from '../components/RoleSwitcherModal';
import { AuthLayout, LoginForm, SignupWizard } from '../components/auth';
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
        <ZatcaHeader
          onOpenMenu={() => setSidebarOpen(true)}
          onOpenFilingModal={() => setActiveTab('vat_calculator')}
          onOpenRoleModal={() => setIsRoleModalOpen(true)}
        />

        <main className="page-content">
          {activeTab === 'dashboard' && <ZatcaTaxDashboard onNavigateToTab={setActiveTab} onSelectInvoiceForPrint={setSelectedInvoiceForPrint} />}
          {activeTab === 'zatca_portal' && <ZatcaOnboardingPortal />}
          {activeTab === 'vat_calculator' && <VatReturnCalculator />}
          {activeTab === 'pos_sales' && <SalesPosPortal onSelectInvoiceForPrint={setSelectedInvoiceForPrint} />}
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
