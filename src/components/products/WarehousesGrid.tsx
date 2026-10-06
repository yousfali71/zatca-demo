'use client';

import React from 'react';
import { Warehouse } from '../../types/zatcaErp';
import { formatSar } from '../../utils/format';

interface WarehousesGridProps {
  warehouses: Warehouse[];
}

export const WarehousesGrid: React.FC<WarehousesGridProps> = ({ warehouses }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
      {warehouses.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1 / -1' }}>
          لا توجد مستودعات مسجلة في النظام.
        </div>
      ) : (
        warehouses.map((wh) => (
          <div key={wh.id} className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="badge-green">{wh.code}</span>
              {wh.isPrimary && <span className="badge-gold">المستودع الرئيسي</span>}
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>{wh.nameAr}</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>{wh.address} - {wh.city}</p>
            <div style={{ paddingTop: 10, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 800 }}>
              <span style={{ color: 'var(--text-muted)' }}>القيمة التقديرية للمخزون:</span>
              <span style={{ color: 'var(--g-600)', fontFamily: 'monospace' }} suppressHydrationWarning>
                {formatSar(wh.totalStockValueSar || 0)} ر.س
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
