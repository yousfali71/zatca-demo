'use client';

import React from 'react';

interface ProductPricingFieldsProps {
  buyPrice: number;
  setBuyPrice: (v: number) => void;
  sellPrice: number;
  setSellPrice: (v: number) => void;
  stock: number;
  setStock: (v: number) => void;
  isVatExempt: boolean;
  setIsVatExempt: (v: boolean) => void;
}

export const ProductPricingFields: React.FC<ProductPricingFieldsProps> = ({
  buyPrice,
  setBuyPrice,
  sellPrice,
  setSellPrice,
  stock,
  setStock,
  isVatExempt,
  setIsVatExempt
}) => {
  return (
    <>
      {/* Pricing & Stock */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14 }}>
        <div>
          <label className="label">سعر الشراء (تكلفة)</label>
          <input
            type="number"
            step="any"
            value={buyPrice}
            onChange={(e) => setBuyPrice(Number(e.target.value))}
            className="input"
          />
        </div>
        <div>
          <label className="label">سعر البيع (قبل الضريبة)</label>
          <input
            type="number"
            step="any"
            value={sellPrice}
            onChange={(e) => setSellPrice(Number(e.target.value))}
            className="input"
          />
        </div>
        <div>
          <label className="label">الكمية المتوفرة بالمخزون</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            className="input"
          />
        </div>
      </div>

      {/* VAT Exemption Checkbox */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: 12,
          background: '#F8FAFC',
          borderRadius: 10,
          border: '1px solid var(--border)'
        }}
      >
        <input
          type="checkbox"
          id="isVatExempt"
          checked={isVatExempt}
          onChange={(e) => setIsVatExempt(e.target.checked)}
          style={{ width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--g-600)' }}
        />
        <label htmlFor="isVatExempt" style={{ fontSize: 13, fontWeight: 700, cursor: 'pointer', color: 'var(--text-primary)', margin: 0 }}>
          هذا المنتج معفى من ضريبة القيمة المضافة (0% VAT Exempt)
        </label>
      </div>
    </>
  );
};
