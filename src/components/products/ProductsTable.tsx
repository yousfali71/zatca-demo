'use client';

import React from 'react';
import { Search, Edit3, Trash2, Loader2 } from 'lucide-react';
import { Product } from '../../types/zatcaErp';
import { formatSar } from '../../utils/format';

interface ProductsTableProps {
  products: Product[];
  search: string;
  onSearchChange: (val: string) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string, name: string) => void;
  deletingId: string | null;
}

export const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  search,
  onSearchChange,
  onEdit,
  onDelete,
  deletingId
}) => {
  const filteredProducts = products.filter(
    (p) =>
      p.nameAr.includes(search) ||
      (p.nameEn && p.nameEn.toLowerCase().includes(search.toLowerCase())) ||
      p.barcode.includes(search) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ position: 'relative', maxWidth: 400 }}>
        <Search style={{ width: 16, height: 16, color: 'var(--text-muted)', position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="ابحث باسم المنتج، الباركود، أو الـ SKU..."
          className="input"
          style={{ paddingRight: 40 }}
        />
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {filteredProducts.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
            لا توجد منتجات مسجلة حالياً. استخدم زر "إضافة منتج جديد" أعلاه.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ width: '100%', textAlign: 'right' }}>
              <thead>
                <tr>
                  <th>اسم المنتج</th>
                  <th>الباركود & SKU</th>
                  <th>التصنيف</th>
                  <th>سعر الشراء</th>
                  <th>سعر البيع (قبل الضريبة)</th>
                  <th>ضريبة ZATCA</th>
                  <th>المخزون المتوفر</th>
                  <th style={{ textAlign: 'center' }}>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                      <div>{p.nameAr}</div>
                      {p.nameEn && <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{p.nameEn}</div>}
                    </td>
                    <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                      {p.barcode} <span style={{ fontSize: 10 }}>({p.sku})</span>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{p.categoryName}</td>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700 }} suppressHydrationWarning>
                      {formatSar(p.buyPrice)} ر.س
                    </td>
                    <td style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--text-primary)' }} suppressHydrationWarning>
                      {formatSar(p.sellPrice)} ر.س
                    </td>
                    <td>
                      <span className={p.taxType === 'EXEMPT' ? 'badge-grey' : 'badge-green'}>
                        {p.taxType === 'EXEMPT' ? 'معفى 0%' : '15% القياسية'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 800 }}>
                      {p.stockQuantity} {p.unitName}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <button
                          type="button"
                          onClick={() => onEdit(p)}
                          title="تعديل المنتج"
                          style={{
                            padding: '6px 10px',
                            borderRadius: 6,
                            border: '1px solid var(--border)',
                            background: '#F8FAFC',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: 11,
                            fontWeight: 700
                          }}
                        >
                          <Edit3 style={{ width: 13, height: 13, color: 'var(--g-600)' }} />
                          <span>تعديل</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete(p.id, p.nameAr)}
                          disabled={deletingId === p.id}
                          title="حذف المنتج"
                          style={{
                            padding: '6px 10px',
                            borderRadius: 6,
                            border: '1px solid #FECACA',
                            background: '#FEF2F2',
                            color: '#DC2626',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: 11,
                            fontWeight: 700
                          }}
                        >
                          {deletingId === p.id ? (
                            <Loader2 style={{ width: 13, height: 13, animation: 'spin 1s linear infinite' }} />
                          ) : (
                            <Trash2 style={{ width: 13, height: 13 }} />
                          )}
                          <span>حذف</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
