'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Bell, ChevronDown, LogOut, CalendarDays, CheckCircle2, Menu } from 'lucide-react';

interface Props {
  onOpenFilingModal?: () => void;
  onOpenRoleModal?: () => void;
  onOpenMenu?: () => void;
}

export const ZatcaHeader: React.FC<Props> = ({ onOpenFilingModal, onOpenRoleModal, onOpenMenu }) => {
  const { currentUser, businessProfile, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  return (
    <header className="topbar">
      {/* Mobile menu */}
      <button type="button" className="topbar-icon-btn topbar-menu-btn" onClick={onOpenMenu} aria-label="فتح القائمة">
        <Menu style={{ width: 17, height: 17 }} />
      </button>

      {/* Right: Brand + date filter */}
      <div className="topbar-brand" style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <span className="brand-label" style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, lineHeight: 1 }}>
            لوحة التحكم
          </span>
          <span style={{ fontSize: 13, fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.3 }}>
            {businessProfile.companyNameAr || currentUser?.name}
          </span>
        </div>
      </div>

      {/* Center spacer */}
      <div style={{ flex: 1 }} />

      {/* Date filter */}
      <button className="date-filter-btn" type="button">
        <CalendarDays style={{ width: 14, height: 14 }} />
        <span>آخر 30 يوماً</span>
        <ChevronDown style={{ width: 12, height: 12, color: 'var(--text-muted)' }} />
      </button>

      {/* Search */}
      <div className="topbar-search" style={{ minWidth: 160 }}>
        <Search style={{ width: 14, height: 14, flexShrink: 0 }} />
        <span style={{ fontSize: 12 }}>بحث...</span>
      </div>

      {/* Notification */}
      <div style={{ position: 'relative' }}>
        <button
          type="button"
          className="topbar-icon-btn"
          onClick={() => { setShowNotif(!showNotif); setShowProfile(false); }}
        >
          <Bell style={{ width: 15, height: 15 }} />
          <span style={{
            position: 'absolute', top: 7, left: 7,
            width: 7, height: 7, borderRadius: '50%',
            background: 'var(--gold)', border: '1.5px solid #fff'
          }} />
        </button>

        {showNotif && (
          <div className="dropdown fade-up" style={{
            position: 'absolute', left: 0, top: 44, width: 280, maxWidth: 'calc(100vw - 20px)', padding: '12px 0', zIndex: 50
          }}>
            <div style={{ padding: '0 14px 10px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 10.5, color: 'var(--g-500)', fontWeight: 700 }}>2 جديد</span>
              <span style={{ fontSize: 12.5, fontWeight: 900, color: 'var(--text-primary)' }}>التنبيهات</span>
            </div>
            <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ padding: '9px 12px', borderRadius: 10, background: 'var(--g-50)', border: '1px solid var(--g-100)', fontSize: 11.5 }}>
                <p style={{ fontWeight: 700, color: 'var(--g-700)', marginBottom: 2 }}>تم اعتماد 12 فاتورة B2B</p>
                <p style={{ color: 'var(--text-muted)' }}>الختم الرقمي CSID ساري</p>
              </div>
              <div style={{ padding: '9px 12px', borderRadius: 10, background: '#FFF8E6', border: '1px solid #F0DB9E', fontSize: 11.5 }}>
                <p style={{ fontWeight: 700, color: '#7A5600', marginBottom: 2 }}>موعد إقرار Q3 — 14 يوم</p>
                <p style={{ color: '#A07C22' }}>الموعد النهائي: 31 أكتوبر 2026</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Profile */}
      <div style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => { setShowProfile(!showProfile); setShowNotif(false); }}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '5px 10px 5px 5px',
            borderRadius: 10, border: '1px solid var(--border)',
            background: 'var(--white)', cursor: 'pointer'
          }}
        >
          {currentUser?.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              style={{ width: 28, height: 28, borderRadius: 8, objectFit: 'cover' }}
            />
          ) : (
            <span
              aria-hidden="true"
              style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                background: 'var(--g-600)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 800
              }}
            >
              {(currentUser?.name?.trim()?.[0] ?? '?').toUpperCase()}
            </span>
          )}
          <span className="topbar-user-name" style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {currentUser?.name?.split(' ')[0]}
          </span>
          <ChevronDown style={{ width: 12, height: 12, color: 'var(--text-muted)' }} />
        </button>

        {showProfile && (
          <div className="dropdown fade-up" style={{
            position: 'absolute', left: 0, top: 44, width: 200, padding: '8px 0', zIndex: 50
          }}>
            <div style={{ padding: '8px 14px 10px', borderBottom: '1px solid var(--border)' }}>
              <p style={{ fontSize: 12, fontWeight: 900, color: 'var(--text-primary)' }}>{currentUser?.name}</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{currentUser?.email}</p>
            </div>
            <div style={{ padding: '6px 8px' }}>
              <button
                onClick={() => { setShowProfile(false); logout(); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '8px 10px', borderRadius: 8, border: 'none', background: 'transparent',
                  fontSize: 12, fontWeight: 600, color: '#DC2626', cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#FEF2F2')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <LogOut style={{ width: 14, height: 14 }} />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
