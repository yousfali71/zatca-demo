'use client';

import React from 'react';
import { InvoiceItem } from '../../types/zatcaErp';
import { formatSar } from '../../utils/format';

interface InvoiceItemsTableProps {
  items: InvoiceItem[];
}

export const InvoiceItemsTable: React.FC<InvoiceItemsTableProps> = ({ items }) => {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
      <table className="data-table" style={{ width: '100%', textAlign: 'right' }}>
        <thead>
          <tr>
            <th>الوصف / البند</th>
            <th style={{ textAlign: 'center' }}>الكمية</th>
            <th>سعر الوحدة</th>
            <th>الضريبة (15%)</th>
            <th>الإجمالي شامل الضريبة</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx}>
              <td style={{ fontWeight: 700 }}>{item.productName}</td>
              <td style={{ textAlign: 'center', fontFamily: 'monospace' }}>{item.quantity} {item.unitName}</td>
              <td style={{ fontFamily: 'monospace' }} suppressHydrationWarning>{formatSar(item.unitPrice)} ر.س</td>
              <td style={{ fontFamily: 'monospace', color: 'var(--g-600)', fontWeight: 700 }} suppressHydrationWarning>{formatSar(item.vatAmount)} ر.س</td>
              <td style={{ fontFamily: 'monospace', fontWeight: 800 }} suppressHydrationWarning>{formatSar(item.totalWithVat)} ر.س</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
