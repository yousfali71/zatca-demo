'use client';

import React from 'react';
import { Users } from 'lucide-react';

interface StakeholdersHeaderProps {
  view: 'customers' | 'suppliers';
  onViewChange: (v: 'customers' | 'suppliers') => void;
  customersCount: number;
  suppliersCount: number;
}

export const StakeholdersHeader: React.FC<StakeholdersHeaderProps> = ({
  view,
  onViewChange,
  customersCount,
  suppliersCount
}) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Users style={{ width: 22, height: 22, color: 'var(--g-600)' }} />
          <span>إدارة الأطراف الخارجية (العملاء والموردين)</span>
        </h1>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
          سجل العملاء التجاريين (B2B)، الأفراد (B2C)، والموردين المعتمدين ضريبياً لـ ZATCA (مباشرة من الباك إند)
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', background: '#E2E8F0', padding: 3, borderRadius: 10 }}>
        <button
          type="button"
          onClick={() => onViewChange('customers')}
          style={{
            padding: '6px 14px',
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            backgroundColor: view === 'customers' ? 'var(--g-600)' : 'transparent',
            color: view === 'customers' ? '#FFF' : 'var(--text-primary)',
            transition: 'all 0.15s ease'
          }}
        >
          العملاء ({customersCount})
        </button>
        <button
          type="button"
          onClick={() => onViewChange('suppliers')}
          style={{
            padding: '6px 14px',
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            backgroundColor: view === 'suppliers' ? 'var(--g-600)' : 'transparent',
            color: view === 'suppliers' ? '#FFF' : 'var(--text-primary)',
            transition: 'all 0.15s ease'
          }}
        >
          الموردين ({suppliersCount})
        </button>
      </div>
    </div>
  );
};
