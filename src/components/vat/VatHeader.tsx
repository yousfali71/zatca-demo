'use client';

import React from 'react';
import { ShieldCheck, Printer } from 'lucide-react';

interface VatHeaderProps {
  periodName: string;
}

export const VatHeader: React.FC<VatHeaderProps> = ({ periodName }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 13, fontWeight: 800, color: 'var(--g-600)', marginBottom: 8 }}>
          <ShieldCheck style={{ width: 18, height: 18 }} />
          <span>إقرار ضريبي معتمد (هيئة الزكاة والضريبة والجمارك)</span>
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
          الإقرار الضريبي (VAT Return) - {periodName}
        </h1>
      </div>

      <button type="button" onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 20, backgroundColor: '#F1F5F9', border: 'none', color: '#475569', fontWeight: 800, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s' }}>
        <Printer style={{ width: 16, height: 16 }} />
        <span>طباعة الإقرار للارشيف</span>
      </button>
    </div>
  );
};
