'use client';

import React from 'react';
import { Customer } from '../../types/zatcaErp';
import { formatSar } from '../../utils/format';

interface CustomersTableProps {
  customers: Customer[];
}

export const CustomersTable: React.FC<CustomersTableProps> = ({ customers }) => {
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      {customers.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
          لا يوجد عملاء مسجلين حالياً في الباك إند.
        </div>
      ) : (
        <table className="data-table" style={{ width: '100%', textAlign: 'right' }}>
          <thead>
            <tr>
              <th>اسم العميل / المؤسسة</th>
              <th>النوع</th>
              <th>الرقم الضريبي VAT ID</th>
              <th>رقم السجل التجاري CR</th>
              <th>الجوال والمدينة</th>
              <th>إجمالي المبيعات</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id}>
                <td style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{c.name}</td>
                <td>
                  <span className={c.customerType === 'B2B' ? 'badge-green' : 'badge-grey'}>
                    {c.customerType === 'B2B' ? 'تجاري B2B' : 'تجزئة B2C'}
                  </span>
                </td>
                <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{c.vatNumber || '-'}</td>
                <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{c.crNumber || '-'}</td>
                <td style={{ color: 'var(--text-muted)' }}>{c.phone} ({c.city})</td>
                <td style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--g-600)' }} suppressHydrationWarning>{formatSar(c.totalPurchasesSar)} ر.س</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
