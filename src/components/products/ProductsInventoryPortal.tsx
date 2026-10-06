'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { useProductsInventory } from '../../hooks/useProductsInventory';

import { ProductsHeader } from './ProductsHeader';
import { ProductsTable } from './ProductsTable';
import { WarehousesGrid } from './WarehousesGrid';
import { ProductFormModal } from './ProductFormModal';

export const ProductsInventoryPortal: React.FC = () => {
  const {
    products,
    warehouses,
    categories,
    units,
    loading,
    error,
    activeTab,
    setActiveTab,
    search,
    setSearch,
    showModal,
    setShowModal,
    editingProduct,
    submitting,
    deletingId,
    formState,
    openCreateModal,
    openEditModal,
    handleSaveProduct,
    handleDeleteProduct
  } = useProductsInventory();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="fade-up">
      <ProductsHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        productsCount={products.length}
        warehousesCount={warehouses.length}
        onOpenCreateModal={openCreateModal}
      />

      {loading ? (
        <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
          <Loader2 style={{ width: 24, height: 24, animation: 'spin 1s linear infinite' }} />
          <span>جاري تحميل البيانات...</span>
        </div>
      ) : error ? (
        <div className="card" style={{ padding: 20, color: '#DC2626', background: '#FEF2F2', borderColor: '#FECACA' }}>
          <strong>خطأ في الـ API: </strong> {error}
        </div>
      ) : activeTab === 'products' ? (
        <ProductsTable
          products={products}
          search={search}
          onSearchChange={setSearch}
          onEdit={openEditModal}
          onDelete={handleDeleteProduct}
          deletingId={deletingId}
        />
      ) : (
        <WarehousesGrid warehouses={warehouses} />
      )}

      {showModal && (
        <ProductFormModal
          editingProduct={editingProduct}
          nameAr={formState.nameAr}
          setNameAr={formState.setNameAr}
          nameEn={formState.nameEn}
          setNameEn={formState.setNameEn}
          sku={formState.sku}
          setSku={formState.setSku}
          barcode={formState.barcode}
          setBarcode={formState.setBarcode}
          buyPrice={formState.buyPrice}
          setBuyPrice={formState.setBuyPrice}
          sellPrice={formState.sellPrice}
          setSellPrice={formState.setSellPrice}
          stock={formState.stock}
          setStock={formState.setStock}
          selectedCategoryId={formState.selectedCategoryId}
          setSelectedCategoryId={formState.setSelectedCategoryId}
          selectedUnitId={formState.selectedUnitId}
          setSelectedUnitId={formState.setSelectedUnitId}
          isVatExempt={formState.isVatExempt}
          setIsVatExempt={formState.setIsVatExempt}
          categories={categories}
          units={units}
          submitting={submitting}
          onClose={() => setShowModal(false)}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
};
