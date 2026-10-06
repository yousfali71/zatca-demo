'use client';

import React from 'react';

interface VatInfoCardProps {
  companyNameAr: string;
  vatNumber: string;
  periodQuarter: string;
  periodYear: number;
}

export const VatInfoCard: React.FC<VatInfoCardProps> = ({
  companyNameAr,
  vatNumber,
  periodQuarter,
  periodYear
}) => {
  return (
    <div style={{ backgroundColor: '#F8FAFC', border: '1px dashed #CBD5E1', borderRadius: 12, padding: '16px 24px', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 32, textAlign: 'center' }}>
      <div>
        <span style={{ fontSize: 12, color: '#64748B', display: 'block', fontWeight: 700, marginBottom: 4 }}>اسم المنشأة المكلفة</span>
        <span style={{ fontSize: 15, fontWeight: 900, color: 'var(--text-primary)' }}>{companyNameAr}</span>
      </div>
      <div>
        <span style={{ fontSize: 12, color: '#64748B', display: 'block', fontWeight: 700, marginBottom: 4 }}>الرقم الضريبي (VAT ID)</span>
        <span style={{ fontSize: 15, fontWeight: 900, fontFamily: 'monospace', color: 'var(--text-primary)' }}>{vatNumber}</span>
      </div>
      <div>
        <span style={{ fontSize: 12, color: '#64748B', display: 'block', fontWeight: 700, marginBottom: 4 }}>الفترة الضريبية</span>
        <span style={{ fontSize: 15, fontWeight: 900, color: 'var(--g-600)' }}>{periodQuarter} {periodYear}</span>
      </div>
    </div>
  );
};
