'use client';

import React, { useState } from 'react';
import { MOCK_INVOICES } from '../../mock/zatcaData';
import { Invoice } from '../../types/zatcaErp';
import { InvoicesTableSection } from '../dashboard/InvoicesTableSection';

interface InvoicesPortalProps {
  onSelectInvoiceForPrint?: (inv: Invoice) => void;
}

export const InvoicesPortal: React.FC<InvoicesPortalProps> = ({ onSelectInvoiceForPrint }) => {
  const [invoices] = useState<Invoice[]>(MOCK_INVOICES);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="fade-up">
      <div className="card-header" style={{ padding: '0 0 10px 0' }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>سجل الفواتير الشامل</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            عرض جميع الفواتير الصادرة للعملاء (B2B و B2C) مع حالات الربط مع هيئة الزكاة
          </p>
        </div>
      </div>

      <InvoicesTableSection 
        invoices={invoices} 
        onNavigateToTab={() => {}} // Not needed here since we are already viewing all invoices
        onSelectInvoiceForPrint={onSelectInvoiceForPrint} 
      />
    </div>
  );
};
