'use client';

import React from 'react';
import { ShieldCheck, ArrowLeft, QrCode } from 'lucide-react';
import { Invoice } from '../../types/zatcaErp';
import { formatSar } from '../../utils/format';

interface InvoicesTableSectionProps {
  invoices: Invoice[];
  onNavigateToTab: (tab: any) => void;
  onSelectInvoiceForPrint?: (inv: Invoice) => void;
}

export const InvoicesTableSection: React.FC<InvoicesTableSectionProps> = ({ invoices, onNavigateToTab, onSelectInvoiceForPrint }) => {
  return (
    <div className="card">
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShieldCheck style={{ width: 15, height: 15, color: 'var(--g-600)' }} />
          <span className="card-title">سجل الفواتير — ZATCA Phase 2</span>
        </div>
        <button
          type="button"
          onClick={() => onNavigateToTab('pos_sales')}
          style={{ fontSize: 11, fontWeight: 700, color: 'var(--g-600)', background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          <span>عرض الكل</span>
          <ArrowLeft style={{ width: 12, height: 12 }} />
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="data-table" style={{ textAlign: 'right' }}>
          <thead>
            <tr>
              <th>رقم الفاتورة</th>
              <th>النوع</th>
              <th>العميل</th>
              <th>التاريخ</th>
              <th>الإجمالي</th>
              <th>الضريبة 15%</th>
              <th>حالة ZATCA</th>
              <th style={{ textAlign: 'center' }}>معاينة</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(inv => (
              <tr key={inv.id}>
                <td><span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 11.5 }}>{inv.invoiceNumber}</span></td>
                <td>
                  <span className={inv.invoiceType === 'STANDARD' ? 'badge-gold' : 'badge-green'}>
                    {inv.invoiceType === 'STANDARD' ? 'B2B ضريبية' : 'B2C مبسطة'}
                  </span>
                </td>
                <td style={{ fontWeight: 600 }}>{inv.customerName}</td>
                <td style={{ color: 'var(--text-muted)' }}>{inv.issueDate}</td>
                <td style={{ fontWeight: 800 }} suppressHydrationWarning>
                  {formatSar(inv.grandTotal)} <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 400 }}>ر.س</span>
                </td>
                <td style={{ fontWeight: 700, color: 'var(--g-600)' }} suppressHydrationWarning>
                  {formatSar(inv.totalVatAmount)} ر.س
                </td>
                <td>
                  <span className={inv.status === 'CLEARED' ? 'badge-green' : 'badge-gold'}>
                    {inv.status === 'CLEARED' ? 'معتمدة' : 'مبلغة'}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={() => onSelectInvoiceForPrint && onSelectInvoiceForPrint(inv)}
                    className="btn-ghost"
                    style={{ padding: '5px 12px', fontSize: 11 }}
                  >
                    <QrCode style={{ width: 12, height: 12 }} />
                    معاينة
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
