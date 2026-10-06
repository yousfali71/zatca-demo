'use client';

import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface SalesPosHeaderProps {
  invoiceType: 'STANDARD' | 'SIMPLIFIED';
  onInvoiceTypeChange: (type: 'STANDARD' | 'SIMPLIFIED') => void;
}

export const SalesPosHeader: React.FC<SalesPosHeaderProps> = ({
  invoiceType,
  onInvoiceTypeChange
}) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShoppingCart style={{ width: 22, height: 22, color: 'var(--g-600)' }} />
          <span>نقطة البيع وإصدار الفواتير الضريبية (ZATCA POS Engine)</span>
        </h1>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
          إصدار فواتير B2B الضريبية المعتمدة وفواتير B2C المباشرة مع توليد QR Code اللحظي (بيانات حقيقية من الباك إند)
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', background: '#E2E8F0', padding: 3, borderRadius: 10 }}>
        <button
          type="button"
          onClick={() => onInvoiceTypeChange('STANDARD')}
          style={{
            padding: '6px 14px',
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            backgroundColor: invoiceType === 'STANDARD' ? 'var(--g-600)' : 'transparent',
            color: invoiceType === 'STANDARD' ? '#FFF' : 'var(--text-primary)',
            transition: 'all 0.15s ease'
          }}
        >
          فاتورة ضريبية (B2B Clearance)
        </button>
        <button
          type="button"
          onClick={() => onInvoiceTypeChange('SIMPLIFIED')}
          style={{
            padding: '6px 14px',
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            backgroundColor: invoiceType === 'SIMPLIFIED' ? 'var(--g-600)' : 'transparent',
            color: invoiceType === 'SIMPLIFIED' ? '#FFF' : 'var(--text-primary)',
            transition: 'all 0.15s ease'
          }}
        >
          فاتورة مبسطة (B2C POS)
        </button>
      </div>
    </div>
  );
};
