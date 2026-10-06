'use client';

import React from 'react';
import { Invoice } from '../types/zatcaErp';
import { useAuth } from '../context/AuthContext';
import { X, Printer, ShieldCheck } from 'lucide-react';

import { InvoiceHeaderDetails } from './invoice/InvoiceHeaderDetails';
import { InvoiceMetaGrid } from './invoice/InvoiceMetaGrid';
import { InvoiceItemsTable } from './invoice/InvoiceItemsTable';
import { InvoiceTotalsSummary } from './invoice/InvoiceTotalsSummary';

interface PrintableInvoiceModalProps {
  invoice: Invoice | null;
  onClose: () => void;
}

export const PrintableInvoiceModal: React.FC<PrintableInvoiceModalProps> = ({ invoice, onClose }) => {
  const { businessProfile } = useAuth();
  if (!invoice) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 99, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', padding: 16, overflowY: 'auto' }} className="fade-up">
      <div className="card" style={{ width: '100%', maxWidth: 680, padding: 'clamp(16px, 5vw, 32px)', display: 'flex', flexDirection: 'column', gap: 24, textAlign: 'right', margin: 'auto', background: '#FFF' }}>
        {/* Modal Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: 'var(--g-600)' }}>
            <ShieldCheck style={{ width: 16, height: 16 }} />
            <span>معاينة الفاتورة الضريبية ZATCA Phase 2</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              type="button"
              onClick={() => window.print()}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Printer style={{ width: 15, height: 15 }} />
              <span>طباعة الفاتورة</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}
            >
              <X style={{ width: 20, height: 20 }} />
            </button>
          </div>
        </div>

        {/* PRINTABLE INVOICE CONTENT */}
        <div id="printable-invoice" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <InvoiceHeaderDetails
            companyNameAr={businessProfile.companyNameAr}
            companyNameEn={businessProfile.companyNameEn}
            crNumber={businessProfile.crNumber}
            vatNumber={businessProfile.vatNumber}
            streetName={businessProfile.streetName}
            city={businessProfile.city}
            invoice={invoice}
          />

          <InvoiceMetaGrid invoice={invoice} />

          <InvoiceItemsTable items={invoice.items} />

          <InvoiceTotalsSummary
            subtotalExclVat={invoice.subtotalExclVat}
            totalVatAmount={invoice.totalVatAmount}
            grandTotal={invoice.grandTotal}
            uuid={invoice.uuid}
          />
        </div>
      </div>
    </div>
  );
};
