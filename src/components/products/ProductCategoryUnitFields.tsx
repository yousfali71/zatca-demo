'use client';

import React from 'react';
import { Category, Unit } from '../../types/zatcaErp';

interface ProductCategoryUnitFieldsProps {
  selectedCategoryId: string;
  setSelectedCategoryId: (v: string) => void;
  selectedUnitId: string;
  setSelectedUnitId: (v: string) => void;
  categories: Category[];
  units: Unit[];
}

export const ProductCategoryUnitFields: React.FC<ProductCategoryUnitFieldsProps> = ({
  selectedCategoryId,
  setSelectedCategoryId,
  selectedUnitId,
  setSelectedUnitId,
  categories,
  units
}) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
      {categories.length > 0 && (
        <div>
          <label className="label">التصنيف (Category)</label>
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="input"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nameAr || (c as any).name}
              </option>
            ))}
          </select>
        </div>
      )}
      {units.length > 0 && (
        <div>
          <label className="label">الوحدة (Unit)</label>
          <select
            value={selectedUnitId}
            onChange={(e) => setSelectedUnitId(e.target.value)}
            className="input"
          >
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nameAr || (u as any).name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};
