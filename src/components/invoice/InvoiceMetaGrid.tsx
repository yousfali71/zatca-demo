'use client';

import React from 'react';
import { Invoice } from '../../types/zatcaErp';

interface InvoiceMetaGridProps {
  invoice: Invoice;
}

export const InvoiceMetaGrid: React.FC<InvoiceMetaGridProps> = ({ invoice }) => {
  return (
    <div className="rg-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 12, background: 'var(--bg)', padding: 14, borderRadius: 10, border: '1px solid var(--border)' }}>
      <div>
        <span style={{ color: 'var(--text-muted)', display: 'block' }}>نوع الفاتورة:</span>
        <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
          {invoice.invoiceType === 'STANDARD' ? 'فاتورة ضريبية (B2B Tax Invoice)' : 'فاتورة ضريبية مبسطة (B2C Simplified)'}
        </span>
      </div>
      <div>
        <span style={{ color: 'var(--text-muted)', display: 'block' }}>رقم الفاتورة Serial:</span>
        <span style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--text-primary)' }}>{invoice.invoiceNumber}</span>
      </div>
      <div>
        <span style={{ color: 'var(--text-muted)', display: 'block' }}>التاريخ والوقت:</span>
        <span style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>{invoice.issueDate} {invoice.issueTime}</span>
      </div>
      <div>
        <span style={{ color: 'var(--text-muted)', display: 'block' }}>بيانات العميل / المشتري:</span>
        <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{invoice.customerName}</span>
        {invoice.customerVatNumber && (
          <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block', fontFamily: 'monospace' }}>الرقم الضريبي: {invoice.customerVatNumber}</span>
        )}
      </div>
    </div>
  );
};
