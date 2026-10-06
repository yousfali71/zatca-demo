'use client';

import React, { useState } from 'react';
import { MOCK_PURCHASES, MOCK_SUPPLIERS, MOCK_PRODUCTS, MOCK_WAREHOUSES } from '../../mock/zatcaData';
import { Purchase } from '../../types/zatcaErp';

import { PurchasesHeader } from './PurchasesHeader';
import { PurchasesTable } from './PurchasesTable';
import { PurchaseFormModal } from './PurchaseFormModal';

export const PurchasesPortal: React.FC = () => {
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
      <PurchasesHeader onOpenAddModal={() => setShowAddModal(true)} />

      <PurchasesTable purchases={purchases} />

      {showAddModal && (
        <PurchaseFormModal
          supplierId={supplierId}
          setSupplierId={setSupplierId}
          warehouseId={warehouseId}
          setWarehouseId={setWarehouseId}
          productId={productId}
          setProductId={setProductId}
          qty={qty}
          setQty={setQty}
          suppliers={MOCK_SUPPLIERS}
          warehouses={MOCK_WAREHOUSES}
          products={MOCK_PRODUCTS}
          subtotal={subtotal}
          vat={vat}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleCreatePurchase}
        />
      )}
    </div>
  );
};
