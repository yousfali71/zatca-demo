'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { Product } from '../../types/zatcaErp';

interface ProductModalFooterProps {
  editingProduct: Product | null;
  submitting: boolean;
  onClose: () => void;
}

export const ProductModalFooter: React.FC<ProductModalFooterProps> = ({ editingProduct, submitting, onClose }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 10,
        padding: '16px 20px',
        borderTop: '1px solid var(--border)',
        background: '#F8FAFC'
      }}
    >
      <button
        type="button"
        onClick={onClose}
        className="btn-ghost"
        disabled={submitting}
      >
        إلغاء
      </button>
      <button
        type="submit"
        className="btn-primary"
        disabled={submitting}
        style={{ display: 'flex', alignItems: 'center', gap: 6 }}
      >
        {submitting && <Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} />}
        <span>{editingProduct ? 'تحديث المنتج' : 'حفظ المنتج'}</span>
      </button>
    </div>
  );
};
