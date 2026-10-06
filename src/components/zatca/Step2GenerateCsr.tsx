'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface Step2GenerateCsrProps {
  vatNumber: string;
  setVatNumber: (v: string) => void;
  organizationName: string;
  setOrganizationName: (v: string) => void;
  invoiceType: string;
  setInvoiceType: (v: string) => void;
  branchName: string;
  setBranchName: (v: string) => void;
  loadingStep: boolean;
  onBack: () => void;
  onNext: () => void;
}

export const Step2GenerateCsr: React.FC<Step2GenerateCsrProps> = ({
  vatNumber,
  setVatNumber,
  organizationName,
  setOrganizationName,
  invoiceType,
  setInvoiceType,
  branchName,
  setBranchName,
  loadingStep,
  onBack,
  onNext
}) => {
  return (
    <div style={{ padding: '32px 0', display: 'flex', flexDirection: 'column', gap: 32, alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
          الخطوة 2: إعداد التشفير وطلب CSR
        </h3>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '8px 0 0 0', maxWidth: 500, lineHeight: 1.6 }}>
          توليد مفتاح التوقيع الرقمي secp256k1 وتجهيز مواصفات الشهادة (CSR).
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, width: '100%' }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', display: 'block', marginBottom: 8 }}>الرقم الضريبي (15 رقم):</label>
          <input type="text" value={vatNumber} onChange={(e) => setVatNumber(e.target.value)} style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '2px solid #E2E8F0', fontSize: 14, fontWeight: 700, outline: 'none', transition: 'border 0.2s', color: 'var(--text-primary)' }} onFocus={(e) => e.target.style.borderColor = 'var(--g-600)'} onBlur={(e) => e.target.style.borderColor = '#E2E8F0'} />
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', display: 'block', marginBottom: 8 }}>اسم المنشأة المسجلة:</label>
          <input type="text" value={organizationName} onChange={(e) => setOrganizationName(e.target.value)} style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '2px solid #E2E8F0', fontSize: 14, fontWeight: 700, outline: 'none', transition: 'border 0.2s', color: 'var(--text-primary)' }} onFocus={(e) => e.target.style.borderColor = 'var(--g-600)'} onBlur={(e) => e.target.style.borderColor = '#E2E8F0'} />
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', display: 'block', marginBottom: 8 }}>نوع الفواتير المدعوم:</label>
          <select value={invoiceType} onChange={(e) => setInvoiceType(e.target.value)} style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '2px solid #E2E8F0', fontSize: 14, fontWeight: 700, outline: 'none', transition: 'border 0.2s', color: 'var(--text-primary)', backgroundColor: '#FFFFFF', cursor: 'pointer' }} onFocus={(e) => e.target.style.borderColor = 'var(--g-600)'} onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}>
            <option value="1100">1100 — قياسية ومبسطة معاً</option>
            <option value="1000">1000 — قياسية فقط (B2B)</option>
            <option value="0100">0100 — مبسطة فقط (B2C)</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', display: 'block', marginBottom: 8 }}>اسم الفرع:</label>
          <input type="text" value={branchName} onChange={(e) => setBranchName(e.target.value)} style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '2px solid #E2E8F0', fontSize: 14, fontWeight: 700, outline: 'none', transition: 'border 0.2s', color: 'var(--text-primary)' }} onFocus={(e) => e.target.style.borderColor = 'var(--g-600)'} onBlur={(e) => e.target.style.borderColor = '#E2E8F0'} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginTop: 10, width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button type="button" onClick={onBack} style={{ padding: '14px 32px', borderRadius: 12, backgroundColor: '#F1F5F9', color: '#475569', fontWeight: 800, fontSize: 14, border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
          تراجع
        </button>
        <button type="button" disabled={loadingStep} onClick={onNext} style={{ padding: '14px 32px', borderRadius: 12, backgroundColor: 'var(--g-600)', color: '#FFFFFF', fontWeight: 800, fontSize: 15, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)' }}>
          <span>{loadingStep ? 'جاري التوليد...' : 'توليد مفاتيح CSR والتقدم للخطوة 3'}</span>
          <ArrowRight style={{ width: 20, height: 20 }} />
        </button>
      </div>
    </div>
  );
};
