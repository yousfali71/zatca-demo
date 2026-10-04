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

    const initGoogle = () => {
      if ((window as any).google?.accounts?.id) {
        try {
          (window as any).google.accounts.id.initialize({
            client_id: googleClientId,
            auto_select: false,
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
        } catch (e) {
          // ignore duplicate initialization warnings in dev mode
        }
      }
    };

    if ((window as any).google?.accounts?.id) {
      initGoogle();
      return;
    }

    const scriptId = 'google-gsi-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initGoogle;
      document.body.appendChild(script);
    } else {
      script.addEventListener('load', initGoogle);
    }
  }, [googleClientId, loginWithGoogle]);

  const handleGoogleClick = () => {
    if (!googleClientId) {
      setLoginError('يتطلب تسجيل الدخول بـ Google إعداد NEXT_PUBLIC_GOOGLE_CLIENT_ID في ملف .env.local');
      return;
    }
    if ((window as any).google?.accounts?.id) {
      try {
        (window as any).google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed && notification.isNotDisplayed()) {
            const reason = notification.getNotDisplayedReason ? notification.getNotDisplayedReason() : '';
            console.warn('Google Prompt not displayed reason:', reason);
            if (reason === 'opt_out_or_no_session' || reason === 'suppressed_by_user') {
              setLoginError('يرجى التأكد من سماح المتصفح بالنوافذ المنبثقة وإضافة http://localhost:3000 في Google Cloud Console');
            }
          }
        });
      } catch (err: any) {
        setLoginError('تعذّر فتح نافذة Google. يرجى التأكد من إضافة http://localhost:3000 في Authorised JavaScript origins');
      }
    } else {
      setLoginError('جاري تحميل خدمة Google، يرجى المحاولة مرة أخرى...');
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
      <div style={{ minHeight: '100vh', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>

        {/* ── Full-screen blurred dashboard background ── */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: 'url(/auth-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(6px) brightness(0.68) saturate(1.1)',
          transform: 'scale(1.05)',
        }} />

        {/* ── Dark green tint overlay ── */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(135deg, rgba(0,26,12,0.72) 0%, rgba(0,55,25,0.60) 50%, rgba(0,95,45,0.48) 100%)',
        }} />

        {/* ── Floating decorative orbs ── */}
        <div style={{
          position: 'absolute', top: '15%', right: '10%', zIndex: 1,
          width: 280, height: 280, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,108,53,0.30) 0%, transparent 70%)',
          filter: 'blur(45px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '12%', left: '8%', zIndex: 1,
          width: 240, height: 240, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,169,81,0.22) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />

        {/* ── Top Header Bar for Desktop (Large screens) ── */}
        <header
          dir="ltr"
          className="w-full absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 sm:px-12 py-6"
        >
          {/* Top Left: Logo + zakPocket text */}
          <div className="flex items-center gap-3.5">
            <img
              src="/white-zakPocket.png"
              alt="zakPocket Logo"
              className="h-9 md:h-11 w-auto object-contain drop-shadow-md"
            />
            <span className="text-2xl md:text-3xl font-black tracking-tight text-white font-sans drop-shadow-md">
              zak<span className="text-emerald-400">Pocket</span>
            </span>
          </div>

          {/* Top Right: Tagline line (No background box) */}
          <div dir="rtl" className="hidden sm:block text-right">
            <span className="text-white text-xs md:text-sm font-bold tracking-wide drop-shadow-md">
              ربط المنشآت السعودية مع هيئة الزكاة والضريبة والجمارك
            </span>
          </div>
        </header>

        {/* Mobile secondary subtitle above card */}
        <div className="sm:hidden relative z-10 mb-4 text-center px-4 pt-16">
          <p className="text-xs font-semibold text-white drop-shadow inline-block">
            ربط المنشآت السعودية مع هيئة الزكاة والضريبة والجمارك
          </p>
        </div>

        {/* ── Form panel with PREMIUM SHARP CORNERS ── */}
        <div style={{
          position: 'relative', zIndex: 10,
          width: '100%',
          maxWidth: 440,
          margin: '0 auto',
          padding: '0 16px',
        }}>

          {/* Glassmorphism sharp card */}
          <div style={{
            background: 'rgba(255,255,255,0.96)',
            backdropFilter: 'blur(24px) saturate(1.4)',
            WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
            border: '1px solid rgba(255,255,255,0.90)',
            borderTop: '4px solid #006C35',
            borderRadius: 0,
            padding: 'clamp(24px, 6vw, 36px) clamp(20px, 6vw, 36px)',
            boxShadow: '0 24px 64px rgba(0,20,10,0.35), 0 2px 8px rgba(0,0,0,0.10)',
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
                  <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
                    تسجيل الدخول
                  </h2>
                  <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: 0, fontWeight: 600 }}>
                    أدخل بيانات حسابك للدخول إلى لوحة التحكم
                  </p>
                </div>

                {/* Google sign-in */}
                <button
                  type="button"
                  onClick={handleGoogleClick}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    padding: '11px 16px', borderRadius: 0,
                    border: '1.5px solid #CBD5E1', background: '#fff',
                    fontSize: 13, fontWeight: 700, color: 'var(--text-primary)',
                    cursor: 'pointer', opacity: 1, marginBottom: 18, fontFamily: 'inherit',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--g-600)'; e.currentTarget.style.background = '#F8FAFC'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#CBD5E1'; e.currentTarget.style.background = '#fff'; }}
                >
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
                  <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>أو بالبريد الإلكتروني</span>
                  <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
                </div>

                {/* Email / pass form */}
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {loginError && (
                    <div style={{ padding: '10px 12px', borderRadius: 0, background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', fontSize: 12, fontWeight: 600 }}>
                      {loginError}
                    </div>
                  )}
                  <div>
                    <label className="label">البريد الإلكتروني *</label>
                    <input
                      type="email" required value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      placeholder="owner@company.sa"
                      className="input"
                      style={{ direction: 'ltr', textAlign: 'left', borderRadius: 0 }}
                    />
                  </div>
                  <div>
                    <label className="label">كلمة المرور *</label>
                    <input
                      type="password" required value={loginPass}
                      onChange={e => setLoginPass(e.target.value)}
                      placeholder="••••••••••"
                      className="input"
                      style={{ borderRadius: 0 }}
                    />
                  </div>

                  <button
                    type="submit" disabled={loggingIn}
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '13px 20px', fontSize: 13.5, borderRadius: 0, marginTop: 4 }}
                  >
                    {loggingIn ? 'جاري الدخول...' : 'دخول لوحة التحكم'}
                  </button>
                </form>

                {/* Sign up link */}
                <div style={{
                  textAlign: 'center', marginTop: 20,
                  paddingTop: 16, borderTop: '1px solid #E2E8F0',
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

        {/* ── Footer sticking to bottom of view screen ── */}
        <footer
          dir="ltr"
          style={{
            position: 'absolute',
            bottom: 16,
            left: 0,
            right: 0,
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
          className="text-sm md:text-base font-semibold text-white/90 drop-shadow-md tracking-wide"
        >
          <span>made by</span>
          <img
            src="/whiteLogo.png"
            alt="Orqeva Logo"
            className="h-6 md:h-7 w-auto object-contain drop-shadow"
          />
          <span className="font-extrabold text-white tracking-wider">Orqeva</span>
          <span className="text-white/80 font-medium">2026</span>
        </footer>
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
