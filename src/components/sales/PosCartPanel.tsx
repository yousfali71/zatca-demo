'use client';

import React from 'react';
import { Product, Customer } from '../../types/zatcaErp';
import { PosCustomerSelect } from './PosCustomerSelect';
import { PosCartTable } from './PosCartTable';
import { PosTotalsSummary } from './PosTotalsSummary';

export interface PosCartPanelProps {
  customers: Customer[];
  selectedCustomer: Customer | null;
  onSelectCustomer: (c: Customer) => void;
  cart: { product: Product; qty: number }[];
  onUpdateQty: (productId: string, delta: number) => void;
  onRemoveFromCart: (productId: string) => void;
  subtotalExclVat: number;
  totalVatAmount: number;
  grandTotal: number;
  submitting: boolean;
  onCheckout: () => void;
}

export const PosCartPanel: React.FC<PosCartPanelProps> = ({
  customers,
  selectedCustomer,
  onSelectCustomer,
  cart,
  onUpdateQty,
  onRemoveFromCart,
  subtotalExclVat,
  totalVatAmount,
  grandTotal,
  submitting,
  onCheckout
}) => {
  return (
    <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <PosCustomerSelect
          customers={customers}
          selectedCustomer={selectedCustomer}
          onSelectCustomer={onSelectCustomer}
        />

        <PosCartTable
          cart={cart}
          onUpdateQty={onUpdateQty}
          onRemoveFromCart={onRemoveFromCart}
        />
      </div>

      <PosTotalsSummary
        subtotalExclVat={subtotalExclVat}
        totalVatAmount={totalVatAmount}
        grandTotal={grandTotal}
        disabled={cart.length === 0}
        submitting={submitting}
        onCheckout={onCheckout}
      />
    </div>
  );
};
