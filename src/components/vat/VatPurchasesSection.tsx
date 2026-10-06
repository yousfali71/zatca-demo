'use client';

import React from 'react';
import { Calculator } from 'lucide-react';
import { VatReturnDeclaration } from '../../types/zatcaErp';
import { formatSar } from '../../utils/format';

interface VatPurchasesSectionProps {
  dec: VatReturnDeclaration;
  onInputChange: (field: keyof VatReturnDeclaration, val: number) => void;
}

export const VatPurchasesSection: React.FC<VatPurchasesSectionProps> = ({ dec, onInputChange }) => {
  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, border: '1px solid #E2E8F0', padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid #F1F5F9' }}>
        <div style={{ padding: 12, backgroundColor: '#EFF6FF', borderRadius: 12 }}>
          <Calculator style={{ width: 24, height: 24, color: '#2563EB' }} />
        </div>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>ثانياً: المشتريات والمدخلات</h2>
          <span style={{ fontSize: 13, color: '#64748B' }}>المبالغ بالريال السعودي (Purchases & Input VAT)</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, alignItems: 'end' }}>
          <div>
            <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>1. المشتريات الخاضعة للنسبة الأساسية (15%)</span>
            <span style={{ fontSize: 12, color: '#64748B' }}>فواتير المشتريات ذات الرقم الضريبي</span>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#64748B', display: 'block', marginBottom: 8 }}>المبلغ الإجمالي (بدون الضريبة)</label>
            <input
              type="number"
              value={dec.standardRatedPurchasesSar}
              onChange={(e) => onInputChange('standardRatedPurchasesSar', Number(e.target.value))}
              style={{ width: '100%', padding: '16px', borderRadius: 12, border: '2px solid #E2E8F0', fontSize: 16, fontFamily: 'monospace', fontWeight: 800, outline: 'none', transition: 'border-color 0.2s', backgroundColor: '#F8FAFC' }}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#64748B', display: 'block', marginBottom: 8 }}>مبلغ الضريبة المستردة (15%)</label>
            <div style={{ padding: '16px', background: '#EFF6FF', border: '2px solid #BFDBFE', borderRadius: 12, fontFamily: 'monospace', fontWeight: 900, color: '#1D4ED8', fontSize: 16 }} suppressHydrationWarning>
              {formatSar(dec.standardRatedPurchasesVatSar)} ر.س
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
