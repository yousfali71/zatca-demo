'use client';

import React from 'react';
import { MOCK_STOCK_COUNTS } from '../../mock/zatcaData';
import { formatSar } from '../../utils/format';

export const StockCountsTable: React.FC = () => {
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <table className="data-table" style={{ width: '100%', textAlign: 'right' }}>
        <thead>
          <tr>
            <th>رقم التسوية والجرد</th>
            <th>المستودع</th>
            <th>تاريخ الجرد</th>
            <th>عدد الأصناف المتأثرة</th>
            <th>قيمة العجز / الزيادة</th>
            <th>الحالة</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_STOCK_COUNTS.map((sc) => (
            <tr key={sc.id}>
              <td style={{ fontWeight: 800, fontFamily: 'monospace', color: 'var(--text-primary)' }}>{sc.referenceNumber}</td>
              <td style={{ color: 'var(--text-muted)' }}>{sc.warehouseName}</td>
              <td style={{ color: 'var(--text-muted)' }}>{sc.date}</td>
              <td style={{ fontWeight: 800 }}>{sc.discrepancyItemsCount} أصناف</td>
              <td style={{ fontFamily: 'monospace', fontWeight: 800, color: '#E11D48' }} suppressHydrationWarning>{formatSar(sc.totalVarianceValueSar)} ر.س</td>
              <td>
                <span className="badge-green">
                  مكتمل ومرحّل
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
