'use client';

import React from 'react';

interface ProductBasicFieldsProps {
  nameAr: string;
  setNameAr: (v: string) => void;
  nameEn: string;
  setNameEn: (v: string) => void;
  sku: string;
  setSku: (v: string) => void;
  barcode: string;
  setBarcode: (v: string) => void;
}

export const ProductBasicFields: React.FC<ProductBasicFieldsProps> = ({
  nameAr,
  setNameAr,
  nameEn,
  setNameEn,
  sku,
  setSku,
  barcode,
  setBarcode
}) => {
  return (
    <>
      {/* Names grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
        <div>
          <label className="label">اسم المنتج بالعربية *</label>
          <input
            type="text"
            required
            value={nameAr}
            onChange={(e) => setNameAr(e.target.value)}
            placeholder="مثال: آيفون 15 برومكس"
            className="input"
          />
        </div>
        <div>
          <label className="label">اسم المنتج بالإنجليزية (Name)</label>
          <input
            type="text"
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            placeholder="e.g. iPhone 15 Pro Max"
            className="input"
            style={{ direction: 'ltr' }}
          />
        </div>
      </div>

      {/* SKU & Barcode */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
        <div>
          <label className="label">رمز SKU</label>
          <input
            type="text"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder="PRD-001"
            className="input"
            style={{ direction: 'ltr' }}
          />
        </div>
        <div>
          <label className="label">الباركود (Barcode)</label>
          <input
            type="text"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder="628100..."
            className="input"
            style={{ direction: 'ltr' }}
          />
        </div>
      </div>
    </>
  );
};
