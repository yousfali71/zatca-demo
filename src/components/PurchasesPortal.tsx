'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Plus } from 'lucide-react';
import { MOCK_PURCHASES, MOCK_SUPPLIERS, MOCK_PRODUCTS, MOCK_WAREHOUSES } from '../mock/zatcaData';
import { Purchase } from '../types/zatcaErp';
import { formatSar } from '../utils/format';

export const PurchasesPortal: React.FC = () => {
  const { businessProfile } = useAuth();
  const [purchases, setPurchases] = useState<Purchase[]>(MOCK_PURCHASES);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Purchase Form state
  const [supplierId, setSupplierId] = useState(MOCK_SUPPLIERS[0].id);
  const [warehouseId, setWarehouseId] = useState(MOCK_WAREHOUSES[0].id);
  const [productId, setProductId] = useState(MOCK_PRODUCTS[0].id);
  const [qty, setQty] = useState(10);

  const selectedProd = MOCK_PRODUCTS.find((p) => p.id === productId) || MOCK_PRODUCTS[0];
  const selectedSupp = MOCK_SUPPLIERS.find((s) => s.id === supplierId) || MOCK_SUPPLIERS[0];
  const selectedWh = MOCK_WAREHOUSES.find((w) => w.id === warehouseId) || MOCK_WAREHOUSES[0];

  const subtotal = selectedProd.buyPrice * qty;
  const vat = subtotal * 0.15;
  const grandTotal = subtotal + vat;

  const handleCreatePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    const newPur: Purchase = {
      id: 'pur-' + Date.now(),
      purchaseNumber: 'PO-2026-00' + Math.floor(102 + Math.random() * 100),
      supplierId: selectedSupp.id,
      supplierName: selectedSupp.companyName,
      supplierVatNumber: selectedSupp.vatNumber,
      warehouseId: selectedWh.id,
      warehouseName: selectedWh.nameAr,
      purchaseDate: new Date().toISOString().split('T')[0],
      items: [
        {
          productId: selectedProd.id,
          productName: selectedProd.nameAr,
          quantity: qty,
          unitCost: selectedProd.buyPrice,
          vatRate: 0.15,
          vatAmount: vat,
          totalWithVat: grandTotal
        }
      ],
      subtotalExclVat: subtotal,
      totalVatAmount: vat,
      grandTotal,
      paymentStatus: 'PAID'
    };

    setPurchases([newPur, ...purchases]);
    setShowAddModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="fade-up">
      {/* Top Banner */}
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
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <Plus style={{ width: 16, height: 16 }} />
          <span>تسجيل فاتورة شراء جديدة</span>
        </button>
      </div>

      {/* Purchases Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="data-table" style={{ width: '100%', textAlign: 'right' }}>
          <thead>
            <tr>
              <th>رقم فاتورة الشراء</th>
              <th>المورد</th>
              <th>الرقم الضريبي للمورد</th>
              <th>المستودع المستلم</th>
              <th>التاريخ</th>
              <th>المبلغ بدون ضريبة</th>
              <th>ضريبة المدخلات (15%)</th>
              <th>الإجمالي النهائي</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((p) => (
              <tr key={p.id}>
                <td style={{ fontWeight: 800, fontFamily: 'monospace', color: 'var(--text-primary)' }}>{p.purchaseNumber}</td>
                <td style={{ fontWeight: 700 }}>{p.supplierName}</td>
                <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{p.supplierVatNumber}</td>
                <td style={{ color: 'var(--text-muted)' }}>{p.warehouseName}</td>
                <td style={{ color: 'var(--text-muted)' }}>{p.purchaseDate}</td>
                <td style={{ fontFamily: 'monospace', fontWeight: 700 }} suppressHydrationWarning>{formatSar(p.subtotalExclVat)} ر.س</td>
                <td style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--g-600)' }} suppressHydrationWarning>{formatSar(p.totalVatAmount)} ر.س</td>
                <td style={{ fontFamily: 'monospace', fontWeight: 900, color: 'var(--text-primary)' }} suppressHydrationWarning>{formatSar(p.grandTotal)} ر.س</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Add Purchase */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: 16 }}>
          <form onSubmit={handleCreatePurchase} className="card" style={{ width: '100%', maxWidth: 500, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>إضافة فاتورة شراء ومصروف ضريبي جديد</h3>

            <div>
              <label className="label">المورد</label>
              <select
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                className="input"
                style={{ fontWeight: 700 }}
              >
                {MOCK_SUPPLIERS.map((s) => (
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
                {MOCK_WAREHOUSES.map((w) => (
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
                {MOCK_PRODUCTS.map((p) => (
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
                onClick={() => setShowAddModal(false)}
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
      )}
    </div>
  );
};

