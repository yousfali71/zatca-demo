'use client';

import React from 'react';
import { Search, Plus } from 'lucide-react';
import { Product } from '../../types/zatcaErp';
import { formatSar } from '../../utils/format';

interface ProductCatalogGridProps {
  products: Product[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onAddToCart: (p: Product) => void;
}

export const ProductCatalogGrid: React.FC<ProductCatalogGridProps> = ({
  products,
  searchQuery,
  onSearchChange,
  onAddToCart
}) => {
  const filteredProducts = products.filter(
    (p) =>
      p.nameAr.includes(searchQuery) ||
      p.barcode.includes(searchQuery) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Search Bar */}
      <div style={{ position: 'relative' }}>
        <Search style={{ width: 16, height: 16, color: 'var(--text-muted)', position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="ابحث بالاسم، الباركود (Barcode)، أو الـ SKU..."
          className="input"
          style={{ paddingRight: 40 }}
        />
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="card" style={{ padding: 30, textAlign: 'center', color: 'var(--text-muted)' }}>
          لا توجد منتجات مسجلة في الخادم مطابقة للبحث.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => onAddToCart(product)}
              className="card"
              style={{ padding: 14, cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 10, transition: 'transform 0.15s ease, border-color 0.15s ease' }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: '#F1F5F9', color: 'var(--text-muted)' }}>
                    {product.sku}
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--g-600)', fontWeight: 700 }}>
                    المخزون: {product.stockQuantity} {product.unitName}
                  </span>
                </div>
                <h4 style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', margin: '8px 0 0 0' }}>
                  {product.nameAr}
                </h4>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--text-primary)' }} suppressHydrationWarning>
                  {formatSar(product.sellPrice)} <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>ر.س</span>
                </div>
                <button
                  type="button"
                  style={{ border: 'none', background: 'var(--g-50)', color: 'var(--g-600)', padding: 6, borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Plus style={{ width: 14, height: 14 }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
