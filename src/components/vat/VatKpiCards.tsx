'use client';

import React from 'react';
import { formatSar } from '../../utils/format';

interface VatKpiCardsProps {
  totalOutputVatSar: number;
  totalInputVatSar: number;
  netTaxPayableSar: number;
}

export const VatKpiCards: React.FC<VatKpiCardsProps> = ({
  totalOutputVatSar,
  totalInputVatSar,
  netTaxPayableSar
}) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, backgroundColor: '#F8FAFC', padding: 24, borderRadius: 16, border: '1px solid #E2E8F0', flexWrap: 'wrap', justifyContent: 'center' }}>
      
      {/* Sales VAT */}
      <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: 8, padding: 16, backgroundColor: '#FFFFFF', borderRadius: 12, border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-muted)' }}>ضريبة المخرجات (المبيعات)</div>
        <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--g-600)' }} suppressHydrationWarning>{formatSar(totalOutputVatSar)} ر.س</div>
        <div style={{ fontSize: 11, color: '#94A3B8' }}>ضريبة محصلة من العملاء</div>
      </div>

      <div style={{ fontSize: 28, fontWeight: 900, color: '#94A3B8' }}>-</div>

      {/* Purchases VAT */}
      <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: 8, padding: 16, backgroundColor: '#FFFFFF', borderRadius: 12, border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-muted)' }}>ضريبة المدخلات (المشتريات)</div>
        <div style={{ fontSize: 24, fontWeight: 900, color: '#3B82F6' }} suppressHydrationWarning>{formatSar(totalInputVatSar)} ر.س</div>
        <div style={{ fontSize: 11, color: '#94A3B8' }}>ضريبة مدفوعة للموردين</div>
      </div>

      <div style={{ fontSize: 28, fontWeight: 900, color: '#94A3B8' }}>=</div>

      {/* Net Payable */}
      <div style={{ flex: '1 1 240px', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, backgroundColor: 'var(--g-600)', borderRadius: 12, color: '#FFFFFF', boxShadow: '0 4px 16px rgba(5, 150, 105, 0.25)' }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#D1FAE5' }}>صافي الضريبة المستحقة للدفع</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: '#FFFFFF' }} suppressHydrationWarning>{formatSar(netTaxPayableSar)} ر.س</div>
        <div style={{ fontSize: 12, color: '#A7F3D0' }}>المبلغ النهائي المستحق للزكاة والدخل</div>
      </div>

    </div>
  );
};
