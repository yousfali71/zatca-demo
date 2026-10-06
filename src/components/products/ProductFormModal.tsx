'use client';

import React from 'react';
import { Product, Category, Unit } from '../../types/zatcaErp';
import { ProductModalHeader } from './ProductModalHeader';
import { ProductBasicFields } from './ProductBasicFields';
import { ProductCategoryUnitFields } from './ProductCategoryUnitFields';
import { ProductPricingFields } from './ProductPricingFields';
import { ProductModalFooter } from './ProductModalFooter';

export interface ProductFormModalProps {
  editingProduct: Product | null;
  nameAr: string;
  setNameAr: (v: string) => void;
  nameEn: string;
  setNameEn: (v: string) => void;
  sku: string;
  setSku: (v: string) => void;
  barcode: string;
  setBarcode: (v: string) => void;
  buyPrice: number;
  setBuyPrice: (v: number) => void;
  sellPrice: number;
  setSellPrice: (v: number) => void;
  stock: number;
  setStock: (v: number) => void;
  selectedCategoryId: string;
  setSelectedCategoryId: (v: string) => void;
  selectedUnitId: string;
  setSelectedUnitId: (v: string) => void;
  isVatExempt: boolean;
  setIsVatExempt: (v: boolean) => void;
  categories: Category[];
  units: Unit[];
  submitting: boolean;
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  editingProduct,
  nameAr,
  setNameAr,
  nameEn,
  setNameEn,
  sku,
  setSku,
  barcode,
  setBarcode,
  buyPrice,
  setBuyPrice,
  sellPrice,
  setSellPrice,
  stock,
  setStock,
  selectedCategoryId,
  setSelectedCategoryId,
  selectedUnitId,
  setSelectedUnitId,
  isVatExempt,
  setIsVatExempt,
  categories,
  units,
  submitting,
  onClose,
  onSave
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        padding: 16
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: 600,
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          borderRadius: 16
        }}
      >
        <ProductModalHeader editingProduct={editingProduct} onClose={onClose} />

        <form onSubmit={onSave} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 16
            }}
          >
            <ProductBasicFields
              nameAr={nameAr}
              setNameAr={setNameAr}
              nameEn={nameEn}
              setNameEn={setNameEn}
              sku={sku}
              setSku={setSku}
              barcode={barcode}
              setBarcode={setBarcode}
            />

            <ProductCategoryUnitFields
              selectedCategoryId={selectedCategoryId}
              setSelectedCategoryId={setSelectedCategoryId}
              selectedUnitId={selectedUnitId}
              setSelectedUnitId={setSelectedUnitId}
              categories={categories}
              units={units}
            />

            <ProductPricingFields
              buyPrice={buyPrice}
              setBuyPrice={setBuyPrice}
              sellPrice={sellPrice}
              setSellPrice={setSellPrice}
              stock={stock}
              setStock={setStock}
              isVatExempt={isVatExempt}
              setIsVatExempt={setIsVatExempt}
            />
          </div>

          <ProductModalFooter editingProduct={editingProduct} submitting={submitting} onClose={onClose} />
        </form>
      </div>
    </div>
  );
};
