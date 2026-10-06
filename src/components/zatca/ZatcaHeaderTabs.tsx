'use client';

import React from 'react';

interface ZatcaHeaderTabsProps {
  isZatcaActivated: boolean;
  activeTab: 'stepper' | 'status' | 'xml' | 'qr';
  onTabChange: (tab: 'stepper' | 'status' | 'xml' | 'qr') => void;
}

export const ZatcaHeaderTabs: React.FC<ZatcaHeaderTabsProps> = ({
  isZatcaActivated,
  activeTab,
  onTabChange
}) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: 16, flexWrap: 'wrap', gap: 16 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
            الربط مع الفوترة الإلكترونية (ZATCA Phase 2)
          </h1>
          <span style={{
            fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 6,
            backgroundColor: isZatcaActivated ? '#ECFDF5' : '#FEF3C7',
            color: isZatcaActivated ? '#047857' : '#D97706',
            border: `1px solid ${isZatcaActivated ? '#A7F3D0' : '#FDE68A'}`
          }}>
            {isZatcaActivated ? 'مفعل — CONNECTED' : 'غير مكتمل التفعيل'}
          </span>
        </div>
        <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0 0' }}>
          تفعيل شهادات CSID، الربط مع منصة فاتورة، وإصدار الفواتير الموقعة لحظياً
        </p>
      </div>

      <div style={{ display: 'flex', gap: 20 }}>
        {[
          { key: 'stepper', label: 'مسار التفعيل' },
          { key: 'status', label: 'حالة الربط والإحصائيات' },
          { key: 'xml', label: 'محلل UBL 2.1 XML' },
          { key: 'qr', label: 'فك ترميز TLV QR' }
        ].map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => onTabChange(t.key as any)}
            style={{
              background: 'none', border: 'none', padding: '8px 0', fontSize: 13, fontWeight: activeTab === t.key ? 800 : 600,
              color: activeTab === t.key ? '#0F172A' : '#64748B', cursor: 'pointer', position: 'relative'
            }}
          >
            {t.label}
            {activeTab === t.key && (
              <span style={{ position: 'absolute', bottom: -17, right: 0, left: 0, height: 2, backgroundColor: '#0F172A', borderRadius: 1 }} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
