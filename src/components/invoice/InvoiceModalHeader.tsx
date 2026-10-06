'use client';

import React from 'react';
import { ShieldCheck, Printer, X } from 'lucide-react';

interface InvoiceModalHeaderProps {
  onPrint: () => void;
  onClose: () => void;
}

export const InvoiceModalHeader: React.FC<InvoiceModalHeaderProps> = ({ onPrint, onClose }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: 'var(--g-600)' }}>
        <ShieldCheck style={{ width: 16, height: 16 }} />
        <span>معاينة الفاتورة الضريبية ZATCA Phase 2</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          type="button"
          onClick={onPrint}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <Printer style={{ width: 15, height: 15 }} />
          <span>طباعة الفاتورة</span>
        </button>
        <button
          type="button"
          onClick={onClose}
          style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}
        >
          <X style={{ width: 20, height: 20 }} />
        </button>
      </div>
    </div>
  );
};
