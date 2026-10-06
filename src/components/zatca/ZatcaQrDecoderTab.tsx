'use client';

import React from 'react';
import { MOCK_INVOICES } from '../../mock/zatcaData';

interface ZatcaQrDecoderTabProps {
  companyNameAr: string;
  vatNumber: string;
}

export const ZatcaQrDecoderTab: React.FC<ZatcaQrDecoderTabProps> = ({
  companyNameAr,
  vatNumber
}) => {
  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0F172A', margin: 0 }}>محتويات Tag-Length-Value (TLV) لـ ZATCA QR Code</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ padding: 16, borderRadius: 6, background: '#F8FAFC', border: '1px solid #E2E8F0', fontFamily: 'monospace', fontSize: 11, wordBreak: 'break-all' }}>
          <span style={{ fontWeight: 800, color: '#0F172A', display: 'block', marginBottom: 6 }}>Base64 Encoded TLV String:</span>
          {MOCK_INVOICES[0].zatcaQrCodeBase64}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
          <div style={{ padding: '8px 12px', borderRadius: 6, background: '#F1F5F9', display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
            <span>Tag 1 (اسم المنشأة):</span>
            <span>{companyNameAr}</span>
          </div>
          <div style={{ padding: '8px 12px', borderRadius: 6, background: '#F8FAFC', display: 'flex', justifyContent: 'space-between' }}>
            <span>Tag 2 (الرقم الضريبي):</span>
            <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{vatNumber}</span>
          </div>
          <div style={{ padding: '8px 12px', borderRadius: 6, background: '#F8FAFC', display: 'flex', justifyContent: 'space-between' }}>
            <span>Tag 3 (تاريخ ووقت الفاتورة):</span>
            <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>2026-09-29T14:15:00Z</span>
          </div>
          <div style={{ padding: '8px 12px', borderRadius: 6, background: '#F8FAFC', display: 'flex', justifyContent: 'space-between' }}>
            <span>Tag 4 (إجمالي الفاتورة مع الضريبة):</span>
            <span style={{ fontWeight: 800, color: '#059669' }}>5,635.00 ر.س</span>
          </div>
          <div style={{ padding: '8px 12px', borderRadius: 6, background: '#F8FAFC', display: 'flex', justifyContent: 'space-between' }}>
            <span>Tag 5 (مبلغ ضريبة القيمة المضافة 15%):</span>
            <span style={{ fontWeight: 800, color: '#D97706' }}>735.00 ر.س</span>
          </div>
        </div>
      </div>
    </div>
  );
};
