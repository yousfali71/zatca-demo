'use client';

import React from 'react';
import { CreditCard, CheckCircle2 } from 'lucide-react';
import { VatReturnDeclaration } from '../../types/zatcaErp';
import { formatSar } from '../../utils/format';

interface SadadPaymentCardProps {
  vatDec: VatReturnDeclaration;
  paying: boolean;
  payDone: boolean;
  onPay: () => void;
}

export const SadadPaymentCard: React.FC<SadadPaymentCardProps> = ({ vatDec, paying, payDone, onPay }) => {
  return (
    <div
      style={{
        borderRadius: 'var(--radius-card)',
        background: 'linear-gradient(160deg, var(--g-900) 0%, var(--g-700) 100%)',
        padding: '20px 18px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
      }}
    >
      <div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(255,255,255,0.12)', borderRadius: 8,
          padding: '4px 10px', fontSize: 10.5, fontWeight: 700, color: 'rgba(255,255,255,0.80)',
          marginBottom: 14
        }}>
          <CreditCard style={{ width: 12, height: 12 }} />
          سداد ZATCA Q3
        </div>

        <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.55)', marginBottom: 4 }}>
          المبلغ المستحق
        </div>
        <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1 }} suppressHydrationWarning>
          {formatSar(vatDec.netTaxPayableSar)}
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.50)', marginTop: 2 }}>ريال سعودي</div>

        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { label: 'ضريبة المخرجات', val: vatDec.totalOutputVatSar },
            { label: 'خصم المدخلات', val: -vatDec.totalInputVatSar },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
              <span style={{ color: 'rgba(255,255,255,0.55)' }}>{row.label}</span>
              <span style={{ fontWeight: 700, color: row.val < 0 ? 'var(--g-300)' : '#fff' }} suppressHydrationWarning>
                {row.val < 0 ? '-' : ''}{formatSar(Math.abs(row.val))} ر.س
              </span>
            </div>
          ))}
        </div>
      </div>

      {payDone ? (
        <div style={{
          marginTop: 14, display: 'flex', alignItems: 'center', gap: 6,
          justifyContent: 'center', padding: '10px', borderRadius: 10,
          background: 'rgba(45,171,101,0.25)', border: '1px solid rgba(93,198,138,0.30)',
          fontSize: 11.5, fontWeight: 700, color: 'var(--g-200)'
        }}>
          <CheckCircle2 style={{ width: 14, height: 14, color: 'var(--g-300)' }} />
          تم السداد بنجاح
        </div>
      ) : (
        <button
          type="button"
          disabled={paying}
          onClick={onPay}
          style={{
            marginTop: 14, width: '100%', padding: '11px',
            borderRadius: 10, border: 'none', cursor: 'pointer',
            background: 'var(--gold)', color: '#fff',
            fontSize: 12.5, fontWeight: 800, fontFamily: 'inherit',
            boxShadow: '0 4px 14px rgba(200,169,81,0.40)',
            transition: 'transform 0.15s'
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          {paying ? 'جاري المعالجة...' : 'سداد الضريبة الآن'}
        </button>
      )}
    </div>
  );
};
