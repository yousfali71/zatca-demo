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
import { SignupWizard } from '../components/SignupWizard';
import { Invoice } from '../types/zatcaErp';

export default function Home() {
  const { currentUser, login, loginWithGoogle, authReady } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<Invoice | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  React.useEffect(() => {
    if (!googleClientId || typeof window === 'undefined') return;
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if ((window as any).google?.accounts?.id) {
        (window as any).google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response: any) => {
            if (response.credential) {
              setLoggingIn(true);
              setLoginError(null);
              try {
                await loginWithGoogle(response.credential);
              } catch (err: any) {
                setLoginError(err?.message || 'فشل تسجيل الدخول بواسطة Google');
              } finally {
                setLoggingIn(false);
              }
            }
          }
        });
      }
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [googleClientId, loginWithGoogle]);

  const handleGoogleClick = () => {
    if (!googleClientId) {
      setLoginError('يتطلب تسجيل الدخول بـ Google إعداد NEXT_PUBLIC_GOOGLE_CLIENT_ID في ملف .env.local');
      return;
    }
    if ((window as any).google?.accounts?.id) {
      (window as any).google.accounts.id.prompt();
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoggingIn(true);
    try {
      await login(loginEmail, loginPass);
    } catch (err: any) {
      setLoginError(err?.message || 'تعذّر تسجيل الدخول');
    } finally {
      setLoggingIn(false);
    }
  };

  if (!authReady) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13 }}>جاري التحميل...</div>;
  }

  /* ── Auth Screens ───────────────────────────── */
  if (!currentUser) {
    return (
      <div style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>

        {/* ── Full-screen blurred dashboard background ── */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: 'url(/auth-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(6px) brightness(0.72) saturate(1.1)',
          transform: 'scale(1.05)',
        }} />

        {/* ── Dark green tint overlay ── */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(135deg, rgba(0,26,12,0.62) 0%, rgba(0,66,30,0.50) 50%, rgba(0,108,53,0.38) 100%)',
        }} />

        {/* ── Floating decorative orbs ── */}
        <div style={{
          position: 'absolute', top: '12%', right: '8%', zIndex: 1,
          width: 260, height: 260, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,108,53,0.25) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', left: '6%', zIndex: 1,
          width: 200, height: 200, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,169,81,0.20) 0%, transparent 70%)',
          filter: 'blur(35px)',
        }} />

        {/* ── Form panel ── */}
        <div style={{
          position: 'relative', zIndex: 10,
          width: '100%',
          maxWidth: 420,
          margin: '0 auto',
          padding: '0 16px',
        }}>

          {/* Brand mark */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>

            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#ffffff', margin: '0 0 5px', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
              ZATCA TaxFlow
            </h1>
            <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.65)', fontWeight: 600, margin: 0 }}>
              ربط المنشآت السعودية مع هيئة الزكاة والضريبة والجمارك
            </p>
          </div>

          {/* Glassmorphism card */}
          <div style={{
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(20px) saturate(1.4)',
            WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
            border: '1px solid rgba(255,255,255,0.60)',
            borderRadius: 24,
            padding: 'clamp(22px, 6vw, 32px) clamp(18px, 6vw, 36px)',
            boxShadow: '0 24px 64px rgba(0,26,12,0.28), 0 2px 8px rgba(0,108,53,0.10)',
          }}>
            {authView === 'signup' ? (
              <SignupWizard
                onSuccess={() => setAuthView('login')}
                onSwitchToLogin={() => setAuthView('login')}
              />
            ) : (
              <div style={{ textAlign: 'right' }}>
                {/* Form header */}
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 5px' }}>
                    تسجيل الدخول
                  </h2>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>
                    أدخل بيانات حسابك للدخول إلى لوحة التحكم
                  </p>
                </div>

                {/* Google sign-in */}
                <button
                  type="button"
                  onClick={handleGoogleClick}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    padding: '11px 16px', borderRadius: 12,
                    border: '1.5px solid var(--border)', background: '#fff',
                    fontSize: 13, fontWeight: 700, color: 'var(--text-primary)',
                    cursor: 'pointer', opacity: 1, marginBottom: 18, fontFamily: 'inherit',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--g-600)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                >
                  {/* Google SVG icon */}
                  <svg width="18" height="18" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    <path fill="none" d="M0 0h48v48H0z" />
                  </svg>
                  <span>تسجيل الدخول بـ Google</span>
                </button>

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                  <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>أو بالبريد الإلكتروني</span>
                  <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                </div>

                {/* Email / pass form */}
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {loginError && (
                    <div style={{ padding: '10px 12px', borderRadius: 10, background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', fontSize: 12, fontWeight: 600 }}>
                      {loginError}
                    </div>
                  )}
                  <div>
                    <label className="label">البريد الإلكتروني</label>
                    <input
                      type="email" required value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      placeholder="owner@company.sa"
                      className="input"
                      style={{ direction: 'ltr', textAlign: 'left' }}
                    />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                      <button type="button" style={{ fontSize: 11.5, color: 'var(--g-600)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                        نسيت كلمة المرور؟
                      </button>
                      <label className="label" style={{ marginBottom: 0 }}>كلمة المرور</label>
                    </div>
                    <input
                      type="password" required value={loginPass}
                      onChange={e => setLoginPass(e.target.value)}
                      placeholder="••••••••••"
                      className="input"
                    />
                  </div>

                  <button
                    type="submit" disabled={loggingIn}
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '13px 20px', fontSize: 13.5, borderRadius: 12, marginTop: 2 }}
                  >
                    {loggingIn ? 'جاري الدخول...' : 'دخول لوحة التحكم'}
                  </button>
                </form>

                {/* Sign up link */}
                <div style={{
                  textAlign: 'center', marginTop: 20,
                  paddingTop: 16, borderTop: '1px solid var(--border)',
                  fontSize: 12.5, color: 'var(--text-secondary)'
                }}>
                  ليس لديك حساب؟{' '}
                  <button
                    type="button" onClick={() => setAuthView('signup')}
                    style={{ fontWeight: 800, color: 'var(--g-600)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12.5 }}
                  >
                    أنشئ حسابك الآن
                  </button>
                </div>
              </div>
            )}
          </div>


        </div>
      </div>
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
