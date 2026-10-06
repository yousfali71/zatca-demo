'use client';

import React from 'react';
import { Supplier, Product, Warehouse } from '../../types/zatcaErp';
import { formatSar } from '../../utils/format';

interface PurchaseFormModalProps {
  supplierId: string;
  setSupplierId: (v: string) => void;
  warehouseId: string;
  setWarehouseId: (v: string) => void;
  productId: string;
  setProductId: (v: string) => void;
  qty: number;
  setQty: (v: number) => void;
  suppliers: Supplier[];
  warehouses: Warehouse[];
  products: Product[];
  subtotal: number;
  vat: number;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const PurchaseFormModal: React.FC<PurchaseFormModalProps> = ({
  supplierId,
  setSupplierId,
  warehouseId,
  setWarehouseId,
  productId,
  setProductId,
  qty,
  setQty,
  suppliers,
  warehouses,
  products,
  subtotal,
  vat,
  onClose,
  onSubmit
}) => {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 99, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: 16 }}>
      <form onSubmit={onSubmit} className="card" style={{ width: '100%', maxWidth: 500, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>إضافة فاتورة شراء ومصروف ضريبي جديد</h3>

        <div>
          <label className="label">المورد</label>
          <select
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
            className="input"
            style={{ fontWeight: 700 }}
          >
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>{s.companyName} ({s.vatNumber})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">المستودع المستلم</label>
          <select
            value={warehouseId}
            onChange={(e) => setWarehouseId(e.target.value)}
            className="input"
            style={{ fontWeight: 700 }}
          >
            {warehouses.map((w) => (
              <option key={w.id} value={w.id}>{w.nameAr}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">المنتج المشتراة</label>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="input"
            style={{ fontWeight: 700 }}
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.nameAr} - ({p.buyPrice} ر.س)</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">الكمية المشتراة</label>
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="input"
            style={{ fontWeight: 700 }}
          />
        </div>

        <div style={{ padding: 12, borderRadius: 8, background: 'var(--bg)', display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span>المبلغ الخاضع للضريبة:</span>
            <span style={{ fontWeight: 700 }} suppressHydrationWarning>{formatSar(subtotal)} ر.س</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--g-600)', fontWeight: 800 }}>
            <span>ضريبة المدخلات القابلة للخصم (15%):</span>
            <span suppressHydrationWarning>{formatSar(vat)} ر.س</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost"
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            حفظ الفاتورة
          </button>
        </div>
      </form>
    </div>
  );
};
