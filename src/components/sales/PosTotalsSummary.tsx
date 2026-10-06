'use client';

import React from 'react';
import { QrCode } from 'lucide-react';
import { formatSar } from '../../utils/format';

interface PosTotalsSummaryProps {
  subtotalExclVat: number;
  totalVatAmount: number;
  grandTotal: number;
  disabled: boolean;
  submitting: boolean;
  onCheckout: () => void;
}

export const PosTotalsSummary: React.FC<PosTotalsSummaryProps> = ({
  subtotalExclVat,
  totalVatAmount,
  grandTotal,
  disabled,
  submitting,
  onCheckout
}) => {
  return (
    <div style={{ paddingTop: 16, borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
          <span>المجموع الخاضع للضريبة:</span>
          <span style={{ fontWeight: 800, color: 'var(--text-primary)' }} suppressHydrationWarning>{formatSar(subtotalExclVat)} ر.س</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--g-600)', fontWeight: 700 }}>
          <span>ضريبة القيمة المضافة (15% VAT):</span>
          <span suppressHydrationWarning>{formatSar(totalVatAmount)} ر.س</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 900, color: 'var(--text-primary)', paddingTop: 8, borderTop: '1px solid var(--border)' }}>
          <span>الإجمالي النهائي (شامل الضريبة):</span>
          <span style={{ color: 'var(--g-600)' }} suppressHydrationWarning>{formatSar(grandTotal)} ر.س</span>
        </div>
      </div>

      <button
        type="button"
        disabled={disabled || submitting}
        onClick={onCheckout}
        className="btn-primary"
        style={{ width: '100%', padding: '12px 16px', fontSize: 13, justifyContent: 'center' }}
      >
        <QrCode style={{ width: 16, height: 16, color: 'var(--gold)' }} />
        <span>{submitting ? 'جاري الاعتماد...' : 'إصدار الفاتورة الضريبية واعتماد ZATCA'}</span>
      </button>
    </div>
  );
};
