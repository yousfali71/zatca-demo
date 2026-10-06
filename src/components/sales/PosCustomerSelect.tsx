'use client';

import React from 'react';
import { Customer } from '../../types/zatcaErp';

interface PosCustomerSelectProps {
  customers: Customer[];
  selectedCustomer: Customer | null;
  onSelectCustomer: (c: Customer) => void;
}

export const PosCustomerSelect: React.FC<PosCustomerSelectProps> = ({
  customers,
  selectedCustomer,
  onSelectCustomer
}) => {
  return (
    <div>
      <label className="label">العميل / المؤسسة المشتراة *</label>
      {customers.length === 0 ? (
        <input
          type="text"
          disabled
          value="عميل نقدي عام"
          className="input"
        />
      ) : (
        <select
          value={selectedCustomer?.id || ''}
          onChange={(e) => {
            const found = customers.find((c) => c.id === e.target.value);
            if (found) onSelectCustomer(found);
          }}
          className="input"
          style={{ fontWeight: 700 }}
        >
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} {c.vatNumber ? `(ضريبي: ${c.vatNumber})` : ''}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};
