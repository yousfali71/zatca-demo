'use client';

import React from 'react';
import { Package, Plus } from 'lucide-react';

interface ProductsHeaderProps {
  activeTab: 'products' | 'warehouses';
  onTabChange: (tab: 'products' | 'warehouses') => void;
  productsCount: number;
  warehousesCount: number;
  onOpenCreateModal: () => void;
}

export const ProductsHeader: React.FC<ProductsHeaderProps> = ({
  activeTab,
  onTabChange,
  productsCount,
  warehousesCount,
  onOpenCreateModal
}) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Package style={{ width: 22, height: 22, color: 'var(--g-600)' }} />
          <span>إدارة المنتجات والمستودعات</span>
        </h1>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
          كتالوج المنتجات، الأرصدة المخزنية، التصنيفات، وتعديل بيانات الأصناف
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', background: '#E2E8F0', padding: 3, borderRadius: 10 }}>
          <button
            type="button"
            onClick={() => onTabChange('products')}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === 'products' ? 'var(--g-600)' : 'transparent',
              color: activeTab === 'products' ? '#FFF' : 'var(--text-primary)',
              transition: 'all 0.15s ease'
            }}
          >
            المنتجات ({productsCount})
          </button>
          <button
            type="button"
            onClick={() => onTabChange('warehouses')}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === 'warehouses' ? 'var(--g-600)' : 'transparent',
              color: activeTab === 'warehouses' ? '#FFF' : 'var(--text-primary)',
              transition: 'all 0.15s ease'
            }}
          >
            المستودعات ({warehousesCount})
          </button>
        </div>

        <button
          type="button"
          onClick={onOpenCreateModal}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <Plus style={{ width: 16, height: 16 }} />
          <span>إضافة منتج جديد</span>
        </button>
      </div>
    </div>
  );
};
