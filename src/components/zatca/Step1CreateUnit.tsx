'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface Step1CreateUnitProps {
  unitName: string;
  setUnitName: (v: string) => void;
  targetEnv: string;
  loadingStep: boolean;
  onNext: () => void;
}

export const Step1CreateUnit: React.FC<Step1CreateUnitProps> = ({
  unitName,
  setUnitName,
  targetEnv,
  loadingStep,
  onNext
}) => {
  return (
    <div style={{ padding: '32px 0', display: 'flex', flexDirection: 'column', gap: 32, alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
          الخطوة 1: إنشاء وحدة ZATCA
        </h3>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '8px 0 0 0', maxWidth: 500, lineHeight: 1.6 }}>
          تسجيل الفرع أو الجهاز إلكترونياً في قاعدة بيانات النظام وتجهيز بيئة الاتصال.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, width: '100%' }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', display: 'block', marginBottom: 8 }}>اسم الوحدة أو الفرع:</label>
          <input
            type="text"
            value={unitName}
            onChange={(e) => setUnitName(e.target.value)}
            style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '2px solid #E2E8F0', fontSize: 14, fontWeight: 700, outline: 'none', transition: 'border 0.2s', color: 'var(--text-primary)' }}
            onFocus={(e) => e.target.style.borderColor = 'var(--g-600)'}
            onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
          />
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', display: 'block', marginBottom: 8 }}>بيئة الربط المحددة:</label>
          <input
            type="text"
            disabled
            value={targetEnv.toUpperCase()}
            style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '2px solid #E2E8F0', background: '#F8FAFC', fontSize: 14, fontWeight: 800, color: '#475569', outline: 'none' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10, width: '100%' }}>
        <button
          type="button"
          disabled={loadingStep}
          onClick={onNext}
          style={{
            padding: '14px 32px', borderRadius: 12, backgroundColor: 'var(--g-600)', color: '#FFFFFF',
            fontWeight: 800, fontSize: 15, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
            transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)'
          }}
        >
          <span>{loadingStep ? 'جاري الإنشاء...' : 'إنشاء الوحدة والانتقال للخطوة 2'}</span>
          <ArrowRight style={{ width: 20, height: 20 }} />
        </button>
      </div>
    </div>
  );
};
