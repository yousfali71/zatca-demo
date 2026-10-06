'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { Invoice } from '../../types/zatcaErp';
import { useSalesPos } from '../../hooks/useSalesPos';

import { SalesPosHeader } from './SalesPosHeader';
import { ProductCatalogGrid } from './ProductCatalogGrid';
import { PosCartPanel } from './PosCartPanel';

interface SalesPosPortalProps {
  onSelectInvoiceForPrint?: (inv: Invoice) => void;
}

export const SalesPosPortal: React.FC<SalesPosPortalProps> = ({ onSelectInvoiceForPrint }) => {
  const {
    products,
    customers,
    selectedCustomer,
    setSelectedCustomer,
    loading,
    submitting,
    searchQuery,
    setSearchQuery,
    invoiceType,
    setInvoiceType,
    cart,
    addToCart,
    updateQty,
    removeFromCart,
    subtotalExclVat,
    totalVatAmount,
    grandTotal,
    handleCheckout
  } = useSalesPos({ onSelectInvoiceForPrint });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="fade-up">
      <SalesPosHeader
        invoiceType={invoiceType}
        onInvoiceTypeChange={setInvoiceType}
      />

      {loading ? (
        <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
          <Loader2 className="animate-spin" style={{ width: 24, height: 24 }} />
          <span>جاري تحميل المنتجات والعملاء من الخادم...</span>
        </div>
      ) : (
        <div className="rg-split" style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: 20 }}>
          <ProductCatalogGrid
            products={products}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onAddToCart={addToCart}
          />

          <PosCartPanel
            customers={customers}
            selectedCustomer={selectedCustomer}
            onSelectCustomer={setSelectedCustomer}
            cart={cart}
            onUpdateQty={updateQty}
            onRemoveFromCart={removeFromCart}
            subtotalExclVat={subtotalExclVat}
            totalVatAmount={totalVatAmount}
            grandTotal={grandTotal}
            submitting={submitting}
            onCheckout={handleCheckout}
          />
        </div>
      )}
    </div>
  );
};
