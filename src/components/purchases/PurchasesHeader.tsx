'use client';

import React from 'react';
import { ShoppingBag, Plus } from 'lucide-react';

interface PurchasesHeaderProps {
  onOpenAddModal: () => void;
}

export const PurchasesHeader: React.FC<PurchasesHeaderProps> = ({ onOpenAddModal }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShoppingBag style={{ width: 22, height: 22, color: 'var(--g-600)' }} />
          <span>سجل المشتريات والمدخلات الضريبية (Deductible Input VAT)</span>
        </h1>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
          تسجيل فواتير المشتريات والمصروفات من الموردين لاحتساب ضريبة المدخلات الخصمية لـ ZATCA
        </p>
      </div>

      <button
        type="button"
        onClick={onOpenAddModal}
        className="btn-primary"
        style={{ display: 'flex', alignItems: 'center', gap: 6 }}
      >
        <Plus style={{ width: 16, height: 16 }} />
        <span>تسجيل فاتورة شراء جديدة</span>
      </button>
    </div>
  );
};
