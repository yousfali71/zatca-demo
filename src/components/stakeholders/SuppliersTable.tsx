'use client';

import React from 'react';
import { Supplier } from '../../types/zatcaErp';
import { formatSar } from '../../utils/format';

interface SuppliersTableProps {
  suppliers: Supplier[];
}

export const SuppliersTable: React.FC<SuppliersTableProps> = ({ suppliers }) => {
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      {suppliers.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
          لا يوجد موردين مسجلين حالياً في الباك إند.
        </div>
      ) : (
        <table className="data-table" style={{ width: '100%', textAlign: 'right' }}>
          <thead>
            <tr>
              <th>اسم المورد</th>
              <th>الرقم الضريبي (15 رقم)</th>
              <th>رقم السجل التجاري</th>
              <th>التواصل والبريد</th>
              <th>الرصيد المستحق</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s) => (
              <tr key={s.id}>
                <td style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{s.companyName}</td>
                <td style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--g-600)' }}>{s.vatNumber || '-'}</td>
                <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{s.crNumber || '-'}</td>
                <td style={{ color: 'var(--text-muted)' }}>{s.phone} • {s.email}</td>
                <td style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--text-primary)' }} suppressHydrationWarning>{formatSar(s.balanceDueSar)} ر.س</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
