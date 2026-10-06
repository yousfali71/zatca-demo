'use client';

import React from 'react';
import { Invoice } from '../../types/zatcaErp';
import { formatSar } from '../../utils/format';

interface RecentExpensesListProps {
  invoices: Invoice[];
  onPrint: (inv: Invoice) => void;
}

export const RecentExpensesList: React.FC<RecentExpensesListProps> = ({ invoices, onPrint }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {invoices.slice(0, 5).map(inv => (
        <div
          key={inv.id}
          onClick={() => onPrint(inv)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '9px 14px', borderRadius: 10, cursor: 'pointer',
            transition: 'background 0.15s'
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--g-50)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{inv.customerName}</div>
            <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 1 }}>{inv.issueDate}</div>
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--text-primary)' }} suppressHydrationWarning>
              {formatSar(inv.grandTotal)} <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 400 }}>ر.س</span>
            </div>
            <div style={{
              fontSize: 10, fontWeight: 700, color: inv.status === 'CLEARED' ? 'var(--g-600)' : 'var(--gold)',
              textAlign: 'left', marginTop: 1
            }}>
              {inv.status === 'CLEARED' ? '✓ معتمدة' : '⊙ مبلغة'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
