'use client';

import React from 'react';
import { CheckCircle2, CreditCard } from 'lucide-react';
import { VatReturnDeclaration } from '../../types/zatcaErp';
import { formatSar } from '../../utils/format';

interface VatActionBoxProps {
  dec: VatReturnDeclaration;
  submitted: boolean;
  onSubmit: () => void;
}

export const VatActionBox: React.FC<VatActionBoxProps> = ({ dec, submitted, onSubmit }) => {
  const handleCopyForZatca = () => {
    alert('تم نسخ القيم. يمكنك الآن لصقها في بوابة ERAD لهيئة الزكاة.');
  };

  return (
    <div className="card" style={{ background: '#0F172A', color: '#FFF', padding: '32px', borderRadius: 20, boxShadow: '0 10px 30px rgba(15, 23, 42, 0.15)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>الرصيد الحي للإقرار الضريبي الحالي</div>
            <button type="button" onClick={handleCopyForZatca} style={{ padding: '4px 10px', fontSize: 11, fontWeight: 800, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.2)', border: 'none', color: '#FFF', cursor: 'pointer', transition: 'all 0.2s' }}>
              نسخ القيم لبوابة ZATCA 📋
            </button>
          </div>
          <h3 style={{ fontSize: 24, fontWeight: 900, color: 'var(--gold)', margin: '4px 0 0 0' }} suppressHydrationWarning>
            الضريبة المستحقة للدفع: {formatSar(dec.netTaxPayableSar)} ر.س
          </h3>
        </div>

        <div>
          {submitted ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', background: 'var(--gold)', color: '#000', borderRadius: 10, fontWeight: 800, fontSize: 13 }}>
              <CheckCircle2 style={{ width: 18, height: 18 }} />
              <span>تم أرشفة الإقرار برقم سداد: 020-998271</span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <input type="text" placeholder="أدخل رقم فاتورة سداد..." style={{ padding: '12px 16px', borderRadius: 8, border: 'none', outline: 'none', fontSize: 13, width: 200 }} />
              <button
                type="button"
                onClick={onSubmit}
                className="btn-primary"
                style={{ backgroundColor: 'var(--gold)', color: '#000', fontSize: 14, padding: '12px 24px' }}
              >
                <CheckCircle2 style={{ width: 18, height: 18 }} />
                <span>أرشفة الإقرار الداخلي</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
