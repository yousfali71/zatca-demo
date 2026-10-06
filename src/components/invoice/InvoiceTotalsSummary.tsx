'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { formatSar } from '../../utils/format';

interface InvoiceTotalsSummaryProps {
  subtotalExclVat: number;
  totalVatAmount: number;
  grandTotal: number;
  uuid: string;
}

export const InvoiceTotalsSummary: React.FC<InvoiceTotalsSummaryProps> = ({
  subtotalExclVat,
  totalVatAmount,
  grandTotal,
  uuid
}) => {
  return (
    <>
      {/* Invoice Summary Totals */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 8 }}>
        <div style={{ width: '100%', maxWidth: 260, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span>المجموع غير شامل الضريبة:</span>
            <span style={{ fontFamily: 'monospace', fontWeight: 700 }} suppressHydrationWarning>{formatSar(subtotalExclVat)} ر.س</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--g-600)', fontWeight: 700 }}>
            <span>ضريبة القيمة المضافة (15%):</span>
            <span style={{ fontFamily: 'monospace', fontWeight: 800 }} suppressHydrationWarning>{formatSar(totalVatAmount)} ر.س</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 900, color: 'var(--text-primary)', paddingTop: 8, borderTop: '2px solid var(--text-primary)' }}>
            <span>المبلغ الإجمالي المستحق:</span>
            <span style={{ fontFamily: 'monospace', color: 'var(--g-600)' }} suppressHydrationWarning>{formatSar(grandTotal)} ر.س</span>
          </div>
        </div>
      </div>

      {/* ZATCA Verification Stamp */}
      <div style={{ paddingTop: 12, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--g-600)', fontWeight: 800 }}>
          <CheckCircle2 style={{ width: 14, height: 14 }} />
          <span>فاتورة إلكترونية موثوقة ومسجلة في هيئة الزكاة والضريبة والجمارك (ZATCA Cleared)</span>
        </div>
        <span style={{ fontFamily: 'monospace', fontSize: 10 }}>UUID: {uuid}</span>
      </div>
    </>
  );
};
