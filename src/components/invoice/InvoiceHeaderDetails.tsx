'use client';

import React from 'react';
import { Invoice } from '../../types/zatcaErp';

interface InvoiceHeaderDetailsProps {
  companyNameAr: string;
  companyNameEn: string;
  crNumber: string;
  vatNumber: string;
  streetName: string;
  city: string;
  invoice: Invoice;
}

export const InvoiceHeaderDetails: React.FC<InvoiceHeaderDetailsProps> = ({
  companyNameAr,
  companyNameEn,
  crNumber,
  vatNumber,
  streetName,
  city,
  invoice
}) => {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderBottom: '2px solid var(--text-primary)', paddingBottom: 16 }}>
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>{companyNameAr}</h1>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0 0', fontWeight: 600 }}>{companyNameEn}</p>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: 6, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div>سجل تجاري (CR): {crNumber}</div>
          <div>الرقم الضريبي (VAT ID): {vatNumber}</div>
          <div>{streetName}، {city}</div>
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
  );
};
