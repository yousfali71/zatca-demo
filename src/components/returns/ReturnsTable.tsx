'use client';

import React from 'react';
import { MOCK_RETURNS } from '../../mock/zatcaData';
import { formatSar } from '../../utils/format';

export const ReturnsTable: React.FC = () => {
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <table className="data-table" style={{ width: '100%', textAlign: 'right' }}>
        <thead>
          <tr>
            <th>رقم الإشعار الدائن</th>
            <th>رقم الفاتورة الأصلية</th>
            <th>الطرف المسترجِع</th>
            <th>التاريخ</th>
            <th>الضريبة المرتجعة (15%)</th>
            <th>إجمالي الإرجاع الشامل</th>
            <th>اعتماد ZATCA</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_RETURNS.map((ret) => (
            <tr key={ret.id}>
              <td style={{ fontWeight: 800, fontFamily: 'monospace', color: 'var(--text-primary)' }}>{ret.returnNumber}</td>
              <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{ret.originalReferenceNumber}</td>
              <td style={{ fontWeight: 700 }}>{ret.partyName}</td>
              <td style={{ color: 'var(--text-muted)' }}>{ret.date}</td>
              <td style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--g-600)' }} suppressHydrationWarning>{formatSar(ret.totalVatRefundSar)} ر.س</td>
              <td style={{ fontFamily: 'monospace', fontWeight: 900, color: 'var(--text-primary)' }} suppressHydrationWarning>{formatSar(ret.totalRefundSar)} ر.س</td>
              <td>
                <span className="badge-green">
                  معتمد ZATCA
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
