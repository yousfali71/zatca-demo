'use client';

import React from 'react';
import { Plus, Edit3, X } from 'lucide-react';
import { Product } from '../../types/zatcaErp';

interface ProductModalHeaderProps {
  editingProduct: Product | null;
  onClose: () => void;
}

export const ProductModalHeader: React.FC<ProductModalHeaderProps> = ({ editingProduct, onClose }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        borderBottom: '1px solid var(--border)',
        background: '#F8FAFC'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'var(--g-50)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--g-600)'
          }}
        >
          {editingProduct ? <Edit3 style={{ width: 18, height: 18 }} /> : <Plus style={{ width: 18, height: 18 }} />}
        </div>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
            {editingProduct ? 'تعديل تفاصيل المنتج' : 'إضافة منتج جديد'}
          </h3>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
            {editingProduct ? `تعديل بيانات ${editingProduct.nameAr}` : 'أدخل بيانات الصنف للمخزون والفوترة'}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        style={{
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          padding: 6,
          borderRadius: 8,
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <X style={{ width: 20, height: 20 }} />
      </button>
    </div>
  );
};
