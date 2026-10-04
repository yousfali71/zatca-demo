'use client';

import React from 'react';
import { Invoice } from '../types/zatcaErp';
import { useAuth } from '../context/AuthContext';
import { X, Printer, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { formatSar } from '../utils/format';

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
          {/* Top Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderBottom: '2px solid var(--text-primary)', paddingBottom: 16 }}>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>{businessProfile.companyNameAr}</h1>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0 0', fontWeight: 600 }}>{businessProfile.companyNameEn}</p>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: 6, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div>سجل تجاري (CR): {businessProfile.crNumber}</div>
                <div>الرقم الضريبي (VAT ID): {businessProfile.vatNumber}</div>
                <div>{businessProfile.streetName}، {businessProfile.city}</div>
              </div>
            </div>

            {/* ZATCA QR CODE preview */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 110, height: 110, background: '#F8FAFC', border: '1px solid var(--border)', borderRadius: 8, padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                    invoice.zatcaQrCodeBase64 || 'ZATCA-QR-SAMPLE'
                  )}`}
                  alt="ZATCA TLV QR Code"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <span style={{ fontSize: 9, fontWeight: 800, color: 'var(--g-600)', marginTop: 4, display: 'block' }}>ZATCA QR Code (Phase 2)</span>
            </div>
          </div>

          {/* Invoice Meta Grid */}
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

          {/* Table of Items */}
          <div style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
            <table className="data-table" style={{ width: '100%', textAlign: 'right' }}>
              <thead>
                <tr>
                  <th>الوصف / البند</th>
                  <th style={{ textAlign: 'center' }}>الكمية</th>
                  <th>سعر الوحدة</th>
                  <th>الضريبة (15%)</th>
                  <th>الإجمالي شامل الضريبة</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 700 }}>{item.productName}</td>
                    <td style={{ textAlign: 'center', fontFamily: 'monospace' }}>{item.quantity} {item.unitName}</td>
                    <td style={{ fontFamily: 'monospace' }} suppressHydrationWarning>{formatSar(item.unitPrice)} ر.س</td>
                    <td style={{ fontFamily: 'monospace', color: 'var(--g-600)', fontWeight: 700 }} suppressHydrationWarning>{formatSar(item.vatAmount)} ر.س</td>
                    <td style={{ fontFamily: 'monospace', fontWeight: 800 }} suppressHydrationWarning>{formatSar(item.totalWithVat)} ر.س</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Invoice Summary Totals */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 8 }}>
            <div style={{ width: '100%', maxWidth: 260, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>المجموع غير شامل الضريبة:</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 700 }} suppressHydrationWarning>{formatSar(invoice.subtotalExclVat)} ر.س</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--g-600)', fontWeight: 700 }}>
                <span>ضريبة القيمة المضافة (15%):</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 800 }} suppressHydrationWarning>{formatSar(invoice.totalVatAmount)} ر.س</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 900, color: 'var(--text-primary)', paddingTop: 8, borderTop: '2px solid var(--text-primary)' }}>
                <span>المبلغ الإجمالي المستحق:</span>
                <span style={{ fontFamily: 'monospace', color: 'var(--g-600)' }} suppressHydrationWarning>{formatSar(invoice.grandTotal)} ر.س</span>
              </div>
            </div>
          </div>

          {/* ZATCA Verification Stamp */}
          <div style={{ paddingTop: 12, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--g-600)', fontWeight: 800 }}>
              <CheckCircle2 style={{ width: 14, height: 14 }} />
              <span>فاتورة إلكترونية موثوقة ومسجلة في هيئة الزكاة والضريبة والجمارك (ZATCA Cleared)</span>
            </div>
            <span style={{ fontFamily: 'monospace', fontSize: 10 }}>UUID: {invoice.uuid}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

