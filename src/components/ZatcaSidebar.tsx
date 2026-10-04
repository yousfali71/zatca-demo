'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard, ShieldCheck, Calculator,
  ShoppingCart, ShoppingBag, Package,
  Warehouse, Users, RotateCcw, BarChart3, ChevronDown, AlertTriangle, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export type ActiveTab =
  | 'dashboard' | 'zatca_portal' | 'vat_calculator'
  | 'pos_sales' | 'purchases' | 'products'
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
  const { zatca, isZatcaActivated } = useAuth();
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
      <div className="sidebar-logo">
        <div className="sidebar-logo-mark">Z</div>
        <span className="sidebar-logo-text">ZATCA Flow</span>
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
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
        {isZatcaActivated ? (
          <div style={{
            padding: '10px 12px',
            borderRadius: 10,
            background: 'var(--g-50)',
            border: '1px solid var(--g-100)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="live-dot" />
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--g-700)' }}>
                ZATCA متصل
              </span>
            </div>
            <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
              Phase 2 · CSID فعّال
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onTabChange('zatca_portal')}
            style={{
              width: '100%', textAlign: 'right', cursor: 'pointer', fontFamily: 'inherit',
              padding: '10px 12px', borderRadius: 10,
              background: '#FFF8E1', border: '1px solid #F2D27A'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <AlertTriangle style={{ width: 13, height: 13, color: '#8A6100' }} />
              <span style={{ fontSize: 11, fontWeight: 800, color: '#8A6100' }}>
                {notStarted ? 'ZATCA غير مُفعّل' : `ZATCA · ${zatcaBadge.text}`}
              </span>
            </div>
            <p style={{ fontSize: 10, color: '#8A6100', marginTop: 2 }}>
              {notStarted ? 'اضغط لتفعيل الفوترة الإلكترونية ←' : 'اضغط لمتابعة التفعيل ←'}
            </p>
          </button>
        )}
      </div>
    </aside>
    </>
  );
};
