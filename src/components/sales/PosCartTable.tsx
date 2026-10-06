'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';
import { Product } from '../../types/zatcaErp';
import { formatSar } from '../../utils/format';

interface PosCartTableProps {
  cart: { product: Product; qty: number }[];
  onUpdateQty: (productId: string, delta: number) => void;
  onRemoveFromCart: (productId: string) => void;
}

export const PosCartTable: React.FC<PosCartTableProps> = ({
  cart,
  onUpdateQty,
  onRemoveFromCart
}) => {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', maxHeight: 240, overflowY: 'auto' }}>
      <table className="data-table" style={{ width: '100%', textAlign: 'right' }}>
        <thead>
          <tr>
            <th>المنتج</th>
            <th style={{ textAlign: 'center' }}>الكمية</th>
            <th>السعر</th>
            <th style={{ textAlign: 'center' }}>حذف</th>
          </tr>
        </thead>
        <tbody>
          {cart.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>
                السلة فارغة. انقر على المنتجات لإضافتها.
              </td>
            </tr>
          ) : (
            cart.map((item) => (
              <tr key={item.product.id}>
                <td style={{ fontWeight: 700 }}>{item.product.nameAr}</td>
                <td style={{ textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: '1px solid var(--border)', borderRadius: 6, padding: '2px 6px' }}>
                    <button
                      type="button"
                      onClick={() => onUpdateQty(item.product.id, -1)}
                      style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 800 }}
                    >
                      -
                    </button>
                    <span style={{ fontWeight: 800, fontSize: 12 }}>{item.qty}</span>
                    <button
                      type="button"
                      onClick={() => onUpdateQty(item.product.id, 1)}
                      style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 800 }}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td style={{ fontWeight: 800, fontFamily: 'monospace' }} suppressHydrationWarning>
                  {formatSar(item.product.sellPrice * item.qty)} ر.س
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={() => onRemoveFromCart(item.product.id)}
                    style={{ border: 'none', background: 'none', color: '#E11D48', cursor: 'pointer' }}
                  >
                    <Trash2 style={{ width: 14, height: 14 }} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
