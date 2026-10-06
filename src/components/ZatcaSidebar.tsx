'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard, ShieldCheck, Calculator,
  ShoppingCart, ShoppingBag, Package,
  Warehouse, Users, RotateCcw, BarChart3, ChevronDown, AlertTriangle, X, LogOut, MoreVertical, User, FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export type ActiveTab =
  | 'dashboard' | 'zatca_portal' | 'vat_calculator'
  | 'pos_sales' | 'purchases' | 'products' | 'invoices'
  | 'inventory' | 'stakeholders' | 'returns' | 'reports';

const NAV = [
  {
    label: 'القائمة الرئيسية',
    items: [
      { id: 'dashboard'      as ActiveTab, label: 'لوحة القيادة', icon: LayoutDashboard },
      { id: 'zatca_portal'   as ActiveTab, label: 'ربط ZATCA',    icon: ShieldCheck,  badge: 'Phase 2' },
      { id: 'vat_calculator' as ActiveTab, label: 'الإقرار الضريبي', icon: Calculator, badge: 'Q3' },
    ]
  },
  {
    label: 'العمليات',
    items: [
      { id: 'pos_sales'    as ActiveTab, label: 'المبيعات',   icon: ShoppingCart },
      { id: 'invoices'     as ActiveTab, label: 'الفواتير',   icon: FileText },
      { id: 'purchases'    as ActiveTab, label: 'المشتريات',  icon: ShoppingBag },
      { id: 'returns'      as ActiveTab, label: 'المرتجعات',  icon: RotateCcw },
    ]
  },
  {
    label: 'المنتجات والعلاقات',
    items: [
      { id: 'products'     as ActiveTab, label: 'المنتجات',  icon: Package },
      { id: 'inventory'    as ActiveTab, label: 'المستودعات', icon: Warehouse },
      { id: 'stakeholders' as ActiveTab, label: 'العملاء والموردون', icon: Users },
      { id: 'reports'      as ActiveTab, label: 'التقارير',  icon: BarChart3 },
    ]
  }
];

interface Props {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  /** Mobile/tablet drawer state (ignored on desktop where the sidebar is static) */
  open?: boolean;
  onClose?: () => void;
}

export const ZatcaSidebar: React.FC<Props> = ({ activeTab, onTabChange: rawTabChange, open = false, onClose }) => {
  const onTabChange = (tab: ActiveTab) => { rawTabChange(tab); onClose?.(); };
  const { zatca, isZatcaActivated, currentUser, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notStarted = zatca.status === 'NOT_CONNECTED';
  const zatcaBadge = (() => {
    switch (zatca.status) {
      case 'CONNECTED': return { text: 'Phase 2', tone: 'ok' as const };
      case 'COMPLIANCE': return { text: 'غير مكتمل', tone: 'warn' as const };
      case 'EXPIRED': return { text: 'منتهي', tone: 'err' as const };
      case 'FAILED': return { text: 'فشل', tone: 'err' as const };
      default: return { text: 'يحتاج تفعيل', tone: 'warn' as const };
    }
  })();
  const badgeStyle: React.CSSProperties =
    zatcaBadge.tone === 'ok' ? {} :
    zatcaBadge.tone === 'warn'
      ? { background: '#FFF4D6', color: '#8A6100', border: '1px solid #F2D27A' }
      : { background: '#FEE8E8', color: '#B91C1C', border: '1px solid #FECACA' };
  return (
    <>
    <div className={`sidebar-backdrop ${open ? 'open' : ''}`} onClick={onClose} aria-hidden="true" />
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo" dir="ltr">
        <img src="/green-zakPocket.png" alt="zakPocket Logo" className="sidebar-logo-img" />
        <span className="sidebar-logo-text">
          zak<span className="highlight">Pocket</span>
        </span>
        <button type="button" className="sidebar-close-btn" onClick={onClose} aria-label="إغلاق القائمة">
          <X style={{ width: 16, height: 16 }} />
        </button>
      </div>

      {/* Nav */}
      <nav className="py-3 flex-1">
        {NAV.map(group => (
          <div key={group.label}>
            <div className="sidebar-section-label">{group.label}</div>
            {group.items.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`nav-item w-full text-right ${isActive ? 'active' : ''}`}
                >
                  <Icon style={{ width: 15, height: 15, flexShrink: 0 }} />
                  <span>{item.label}</span>
                  {item.id === 'zatca_portal' ? (
                    <span className="nav-badge" style={badgeStyle}>{zatcaBadge.text}</span>
                  ) : ('badge' in item && item.badge && (
                    <span className="nav-badge">{item.badge}</span>
                  ))}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      {/* Footer / User Profile */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', background: 'var(--white)', marginTop: 'auto', position: 'relative' }}>
        
        {showProfileMenu && (
          <div className="dropdown fade-up" style={{
            position: 'absolute', bottom: 'calc(100% - 10px)', left: 20, right: 20, zIndex: 60,
            padding: '6px', display: 'flex', flexDirection: 'column', gap: 2
          }}>
            <button
              onClick={() => setShowProfileMenu(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                borderRadius: 8, border: 'none', background: 'transparent',
                cursor: 'pointer', fontFamily: 'inherit', color: 'var(--text-primary)',
                fontSize: 12.5, fontWeight: 700, transition: 'background 0.15s'
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--g-50)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <User style={{ width: 15, height: 15, color: 'var(--g-600)' }} />
              الملف الشخصي
            </button>
            <button
              onClick={() => { setShowProfileMenu(false); logout(); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                borderRadius: 8, border: 'none', background: 'transparent',
                cursor: 'pointer', fontFamily: 'inherit', color: '#DC2626',
                fontSize: 12.5, fontWeight: 700, transition: 'background 0.15s'
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#FEF2F2')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <LogOut style={{ width: 15, height: 15 }} />
              تسجيل الخروج
            </button>
          </div>
        )}

        <div 
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
            padding: '8px', borderRadius: 12, border: '1px solid var(--border)',
            background: 'var(--g-50)', cursor: 'pointer', transition: 'all 0.2s',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                style={{ width: 36, height: 36, borderRadius: 10, objectFit: 'cover' }}
              />
            ) : (
              <div
                aria-hidden="true"
                style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: 'linear-gradient(135deg, var(--g-600) 0%, var(--g-900) 100%)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 15, fontWeight: 900
                }}
              >
                {(currentUser?.name?.trim()?.[0] ?? 'م').toUpperCase()}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser?.name || 'مدير النظام'}
              </span>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>
                {currentUser?.email || 'admin@zakpocket.com'}
              </span>
            </div>
          </div>
          
          <button 
            type="button" 
            title="خيارات الحساب"
            style={{ 
              width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', flexShrink: 0,
              transition: 'background 0.2s, color 0.2s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--white)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
          >
            <MoreVertical style={{ width: 18, height: 18 }} />
          </button>
        </div>
      </div>
    </aside>
    </>
  );
};
