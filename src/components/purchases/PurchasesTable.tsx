'use client';

import React from 'react';
import { Purchase } from '../../types/zatcaErp';
import { formatSar } from '../../utils/format';

interface PurchasesTableProps {
  purchases: Purchase[];
}

export const PurchasesTable: React.FC<PurchasesTableProps> = ({ purchases }) => {
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <table className="data-table" style={{ width: '100%', textAlign: 'right' }}>
        <thead>
          <tr>
            <th>رقم فاتورة الشراء</th>
            <th>المورد</th>
            <th>الرقم الضريبي للمورد</th>
            <th>المستودع المستلم</th>
            <th>التاريخ</th>
            <th>المبلغ بدون ضريبة</th>
            <th>ضريبة المدخلات (15%)</th>
            <th>الإجمالي النهائي</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map((p) => (
            <tr key={p.id}>
              <td style={{ fontWeight: 800, fontFamily: 'monospace', color: 'var(--text-primary)' }}>{p.purchaseNumber}</td>
              <td style={{ fontWeight: 700 }}>{p.supplierName}</td>
              <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{p.supplierVatNumber}</td>
              <td style={{ color: 'var(--text-muted)' }}>{p.warehouseName}</td>
              <td style={{ color: 'var(--text-muted)' }}>{p.purchaseDate}</td>
              <td style={{ fontFamily: 'monospace', fontWeight: 700 }} suppressHydrationWarning>{formatSar(p.subtotalExclVat)} ر.س</td>
              <td style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--g-600)' }} suppressHydrationWarning>{formatSar(p.totalVatAmount)} ر.س</td>
              <td style={{ fontFamily: 'monospace', fontWeight: 900, color: 'var(--text-primary)' }} suppressHydrationWarning>{formatSar(p.grandTotal)} ر.س</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
