'use client';

import React from 'react';
import { Calculator } from 'lucide-react';
import { VatReturnDeclaration } from '../../types/zatcaErp';
import { formatSar } from '../../utils/format';

interface VatSalesSectionProps {
  dec: VatReturnDeclaration;
  onInputChange: (field: keyof VatReturnDeclaration, val: number) => void;
}

export const VatSalesSection: React.FC<VatSalesSectionProps> = ({ dec, onInputChange }) => {
  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, border: '1px solid #E2E8F0', padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid #F1F5F9' }}>
        <div style={{ padding: 12, backgroundColor: '#ECFDF5', borderRadius: 12 }}>
          <Calculator style={{ width: 24, height: 24, color: 'var(--g-600)' }} />
        </div>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>أولاً: المبيعات والمخرجات</h2>
          <span style={{ fontSize: 13, color: '#64748B' }}>المبالغ بالريال السعودي (Sales & Output VAT)</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, alignItems: 'end', paddingBottom: 24, borderBottom: '1px dashed #E2E8F0' }}>
          <div>
            <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>1. المبيعات الخاضعة للنسبة الأساسية (15%)</span>
            <span style={{ fontSize: 12, color: '#64748B' }}>الفواتير الإلكترونية المعتمدة من ZATCA</span>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#64748B', display: 'block', marginBottom: 8 }}>المبلغ الإجمالي (بدون الضريبة)</label>
            <input
              type="number"
              value={dec.standardRatedSalesSar}
              onChange={(e) => onInputChange('standardRatedSalesSar', Number(e.target.value))}
              style={{ width: '100%', padding: '16px', borderRadius: 12, border: '2px solid #E2E8F0', fontSize: 16, fontFamily: 'monospace', fontWeight: 800, outline: 'none', transition: 'border-color 0.2s', backgroundColor: '#F8FAFC' }}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#64748B', display: 'block', marginBottom: 8 }}>مبلغ الضريبة المحصلة (15%)</label>
            <div style={{ padding: '16px', background: '#ECFDF5', border: '2px solid #A7F3D0', borderRadius: 12, fontFamily: 'monospace', fontWeight: 900, color: '#047857', fontSize: 16 }} suppressHydrationWarning>
              {formatSar(dec.standardRatedSalesVatSar)} ر.س
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, alignItems: 'end' }}>
          <div>
            <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>2. المبيعات الخاضعة لنسبة الصفر (0%)</span>
            <span style={{ fontSize: 12, color: '#64748B' }}>الصادرات والسلع المعفاة</span>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#64748B', display: 'block', marginBottom: 8 }}>المبلغ الإجمالي</label>
            <input
              type="number"
              value={dec.zeroRatedSalesSar}
              onChange={(e) => onInputChange('zeroRatedSalesSar', Number(e.target.value))}
              style={{ width: '100%', padding: '16px', borderRadius: 12, border: '2px solid #E2E8F0', fontSize: 16, fontFamily: 'monospace', fontWeight: 800, outline: 'none', transition: 'border-color 0.2s', backgroundColor: '#F8FAFC' }}
            />
          </div>
          <div>
             <label style={{ fontSize: 12, fontWeight: 700, color: '#64748B', display: 'block', marginBottom: 8 }}>الضريبة</label>
             <div style={{ padding: '16px', background: '#F1F5F9', border: '2px solid #E2E8F0', borderRadius: 12, fontFamily: 'monospace', color: '#64748B', fontWeight: 800, fontSize: 16 }}>0.00 ر.س</div>
          </div>
        </div>
      </div>
    </div>
  );
};
